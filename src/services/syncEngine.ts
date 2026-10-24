import mqtt, { MqttClient } from 'mqtt';
import { SyncMessage, DevicePresence, Task, SyncStatus } from '../types';

// Helper to generate a unique device ID and random friendly device name
export function getOrCreateDeviceId(): { id: string; name: string; type: 'desktop' | 'mobile' | 'tablet' } {
  const STORAGE_KEY = 'braca_device_info_v1';
  try {
    const existing = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('scar_device_info_v1');
    if (existing) {
      return JSON.parse(existing);
    }
  } catch {
    // Ignore error
  }

  const id = 'dev_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36);
  
  // Detect device type
  const ua = navigator.userAgent.toLowerCase();
  let type: 'desktop' | 'mobile' | 'tablet' = 'desktop';
  let deviceName = 'Desktop Workstation';

  if (/ipad|tablet|(android(?!.*mobile))/i.test(ua)) {
    type = 'tablet';
    deviceName = 'Field Tablet';
  } else if (/mobile|iphone|ipod|android/i.test(ua)) {
    type = 'mobile';
    deviceName = /iphone/i.test(ua) ? 'iPhone Field Unit' : 'Mobile Field Device';
  } else if (/macintosh|mac os x/i.test(ua)) {
    deviceName = 'MacBook Pro';
  } else if (/windows/i.test(ua)) {
    deviceName = 'Windows Laptop';
  } else if (/linux/i.test(ua)) {
    deviceName = 'Linux Workstation';
  }

  const info = { id, name: deviceName, type };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(info));
  } catch {
    // Ignore error
  }
  return info;
}

export type SyncCallback = (message: SyncMessage) => void;
export type StatusCallback = (status: SyncStatus, pingMs?: number) => void;
export type PresenceCallback = (devices: DevicePresence[]) => void;

class RealtimeSyncManager {
  private client: MqttClient | null = null;
  private broadcastChannel: BroadcastChannel | null = null;
  private currentRoomId: string = 'BRACA-FIELD-OPS';
  private deviceInfo = getOrCreateDeviceId();
  private onMessageCallbacks: Set<SyncCallback> = new Set();
  private onStatusCallbacks: Set<StatusCallback> = new Set();
  private onPresenceCallbacks: Set<PresenceCallback> = new Set();
  private devicesMap: Map<string, DevicePresence> = new Map();
  private pingInterval: any = null;
  private cleanupInterval: any = null;
  private syncStatus: SyncStatus = 'offline';
  private lastPingTime = 0;
  private pingMs = 35;

  constructor() {
    // Setup local cross-tab BroadcastChannel
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.broadcastChannel = new BroadcastChannel(`braca_task_sync_${this.currentRoomId}`);
        this.broadcastChannel.onmessage = (event) => {
          if (event.data && event.data.roomId === this.currentRoomId) {
            this.handleIncomingMessage(event.data);
          }
        };
      } catch (err) {
        console.warn('BroadcastChannel not available:', err);
      }
    }
  }

  public init(roomId?: string) {
    if (roomId && roomId !== this.currentRoomId) {
      this.currentRoomId = roomId.toUpperCase().trim();
      // Reset BroadcastChannel for new room
      if (this.broadcastChannel) {
        this.broadcastChannel.close();
      }
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        this.broadcastChannel = new BroadcastChannel(`braca_task_sync_${this.currentRoomId}`);
        this.broadcastChannel.onmessage = (event) => {
          if (event.data && event.data.roomId === this.currentRoomId) {
            this.handleIncomingMessage(event.data);
          }
        };
      }
    }

    this.connect();
    this.startPresenceHeartbeat();
  }

  public getRoomId(): string {
    return this.currentRoomId;
  }

  public getDeviceInfo() {
    return this.deviceInfo;
  }

  public setDeviceName(newName: string) {
    this.deviceInfo.name = newName;
    try {
      localStorage.setItem('braca_device_info_v1', JSON.stringify(this.deviceInfo));
    } catch {
      // Ignore
    }
    this.sendPing();
  }

  public getStatus(): SyncStatus {
    return this.syncStatus;
  }

  public getPing(): number {
    return this.pingMs;
  }

  public getConnectedDevices(): DevicePresence[] {
    const list = Array.from(this.devicesMap.values());
    // Ensure current device is included
    const hasCurrent = list.some((d) => d.id === this.deviceInfo.id);
    if (!hasCurrent) {
      list.unshift({
        id: this.deviceInfo.id,
        name: this.deviceInfo.name,
        deviceType: this.deviceInfo.type,
        joinedAt: Date.now(),
        lastSeen: Date.now(),
        isCurrent: true,
      });
    }
    return list;
  }

  public subscribe(cb: SyncCallback): () => void {
    this.onMessageCallbacks.add(cb);
    return () => this.onMessageCallbacks.delete(cb);
  }

  public onStatusChange(cb: StatusCallback): () => void {
    this.onStatusCallbacks.add(cb);
    cb(this.syncStatus, this.pingMs);
    return () => this.onStatusCallbacks.delete(cb);
  }

  public onPresenceChange(cb: PresenceCallback): () => void {
    this.onPresenceCallbacks.add(cb);
    cb(this.getConnectedDevices());
    return () => this.onPresenceCallbacks.delete(cb);
  }

  private updateStatus(status: SyncStatus, ping?: number) {
    this.syncStatus = status;
    if (ping !== undefined) this.pingMs = ping;
    this.onStatusCallbacks.forEach((cb) => cb(status, this.pingMs));
  }

  private connect() {
    if (this.client) {
      try {
        this.client.end(true);
      } catch {
        // Ignore
      }
      this.client = null;
    }

    this.updateStatus('syncing');

    // Reliable public WebSocket brokers for MQTT
    // EMQX and HiveMQ public brokers provide global low-latency pub/sub
    const brokerUrl = 'wss://broker.emqx.io:8084/mqtt';
    const fallbackUrl = 'wss://broker.hivemq.com:8884/mqtt';

    const clientId = `braca_web_${this.deviceInfo.id}_${Math.random().toString(16).slice(2, 8)}`;
    const topic = `braca_tasks/v1/${this.currentRoomId}`;

    try {
      this.lastPingTime = Date.now();
      this.client = mqtt.connect(brokerUrl, {
        clientId,
        clean: true,
        connectTimeout: 7000,
        reconnectPeriod: 4000,
        keepalive: 30,
      });

      this.client.on('connect', () => {
        this.pingMs = Math.max(18, Date.now() - this.lastPingTime);
        this.updateStatus('connected', this.pingMs);

        this.client?.subscribe(topic, { qos: 0 }, (err) => {
          if (!err) {
            // Request existing tasks from any active peer in the room
            this.broadcast({
              id: 'req_' + Date.now(),
              type: 'ROOM_REQUEST',
              senderId: this.deviceInfo.id,
              senderDeviceName: this.deviceInfo.name,
              deviceType: this.deviceInfo.type,
              roomId: this.currentRoomId,
              timestamp: Date.now(),
              payload: {},
            });
            this.sendPing();
          }
        });
      });

      this.client.on('message', (_topic, messageBuffer) => {
        try {
          const str = messageBuffer.toString();
          const message: SyncMessage = JSON.parse(str);
          if (message && message.roomId === this.currentRoomId) {
            // Ignore own messages from the cloud broker
            if (message.senderId !== this.deviceInfo.id) {
              this.handleIncomingMessage(message);
            }
          }
        } catch (e) {
          console.warn('Error parsing sync message:', e);
        }
      });

      this.client.on('error', (err) => {
        console.warn('MQTT Connection Error:', err);
        this.updateStatus('reconnecting');
      });

      this.client.on('offline', () => {
        this.updateStatus('offline');
      });

      this.client.on('reconnect', () => {
        this.updateStatus('syncing');
      });
    } catch (e) {
      console.warn('Failed to initialize MQTT broker connection:', e);
      this.updateStatus('offline');
    }
  }

  private handleIncomingMessage(message: SyncMessage) {
    // Record device presence
    if (message.senderId) {
      this.devicesMap.set(message.senderId, {
        id: message.senderId,
        name: message.senderDeviceName || 'Remote Device',
        deviceType: message.deviceType || 'desktop',
        joinedAt: this.devicesMap.get(message.senderId)?.joinedAt || message.timestamp,
        lastSeen: Date.now(),
        isCurrent: message.senderId === this.deviceInfo.id,
      });
      this.notifyPresence();
    }

    // Pass to subscribers
    this.onMessageCallbacks.forEach((cb) => cb(message));
  }

  private notifyPresence() {
    const list = this.getConnectedDevices();
    this.onPresenceCallbacks.forEach((cb) => cb(list));
  }

  public broadcast(message: SyncMessage) {
    const payloadStr = JSON.stringify(message);

    // 1. Broadcast locally across browser tabs
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(message);
      } catch (e) {
        console.warn('BroadcastChannel error:', e);
      }
    }

    // 2. Broadcast to global real-time cloud broker for other devices
    if (this.client && this.client.connected) {
      const topic = `braca_tasks/v1/${this.currentRoomId}`;
      this.client.publish(topic, payloadStr, { qos: 0 });
    }
  }

  public broadcastTaskUpsert(task: Task) {
    this.broadcast({
      id: 'msg_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      type: 'TASK_UPSERT',
      senderId: this.deviceInfo.id,
      senderDeviceName: this.deviceInfo.name,
      deviceType: this.deviceInfo.type,
      roomId: this.currentRoomId,
      timestamp: Date.now(),
      payload: task,
    });
  }

  public broadcastTaskDelete(taskId: string) {
    this.broadcast({
      id: 'msg_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      type: 'TASK_DELETE',
      senderId: this.deviceInfo.id,
      senderDeviceName: this.deviceInfo.name,
      deviceType: this.deviceInfo.type,
      roomId: this.currentRoomId,
      timestamp: Date.now(),
      payload: { taskId },
    });
  }

  public broadcastAllTasks(tasks: Task[]) {
    this.broadcast({
      id: 'msg_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      type: 'SYNC_ALL',
      senderId: this.deviceInfo.id,
      senderDeviceName: this.deviceInfo.name,
      deviceType: this.deviceInfo.type,
      roomId: this.currentRoomId,
      timestamp: Date.now(),
      payload: { tasks },
    });
  }

  private sendPing() {
    this.broadcast({
      id: 'ping_' + Date.now(),
      type: 'DEVICE_PING',
      senderId: this.deviceInfo.id,
      senderDeviceName: this.deviceInfo.name,
      deviceType: this.deviceInfo.type,
      roomId: this.currentRoomId,
      timestamp: Date.now(),
      payload: {},
    });
  }

  private startPresenceHeartbeat() {
    if (this.pingInterval) clearInterval(this.pingInterval);
    if (this.cleanupInterval) clearInterval(this.cleanupInterval);

    // Send presence ping every 12 seconds
    this.pingInterval = setInterval(() => {
      this.sendPing();
    }, 12000);

    // Prune devices that haven't pinged in 35 seconds
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      let changed = false;
      for (const [id, dev] of this.devicesMap.entries()) {
        if (id !== this.deviceInfo.id && now - dev.lastSeen > 35000) {
          this.devicesMap.delete(id);
          changed = true;
        }
      }
      if (changed) {
        this.notifyPresence();
      }
    }, 15000);
  }

  public disconnect() {
    if (this.pingInterval) clearInterval(this.pingInterval);
    if (this.cleanupInterval) clearInterval(this.cleanupInterval);
    if (this.client) {
      try {
        this.client.end(true);
      } catch {
        // Ignore
      }
      this.client = null;
    }
    if (this.broadcastChannel) {
      this.broadcastChannel.close();
      this.broadcastChannel = null;
    }
  }
}

export const syncManager = new RealtimeSyncManager();
