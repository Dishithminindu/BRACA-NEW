import React, { useState, useEffect } from 'react';
import {
  X,
  QrCode,
  Smartphone,
  Laptop,
  Tablet,
  Copy,
  Check,
  RefreshCw,
  Wifi,
  Download,
  Upload,
  Globe,
  Github,
  Cloud,
  CheckCircle2,
  Terminal,
  ShieldCheck,
  Edit3,
} from 'lucide-react';
import { DevicePresence, SyncStatus, Task } from '../types';
import { generateQrDataUrl } from '../utils/qrCode';
import { syncManager } from '../services/syncEngine';

interface SyncCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
  onRoomChange: (newRoom: string) => void;
  syncStatus: SyncStatus;
  pingMs: number;
  connectedDevices: DevicePresence[];
  tasks: Task[];
  onImportTasks: (tasks: Task[]) => void;
  onResetDefaults: () => void;
}

export const SyncCenterModal: React.FC<SyncCenterModalProps> = ({
  isOpen,
  onClose,
  roomId,
  onRoomChange,
  syncStatus,
  pingMs,
  connectedDevices,
  tasks,
  onImportTasks,
  onResetDefaults,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [inputRoom, setInputRoom] = useState(roomId);
  const [isEditingDeviceName, setIsEditingDeviceName] = useState(false);
  const [deviceName, setDeviceName] = useState(syncManager.getDeviceInfo().name);
  const [activeTab, setActiveTab] = useState<'sync' | 'devices' | 'deploy' | 'backup'>('sync');
  const [importMessage, setImportMessage] = useState<string | null>(null);

  // Generate share URL
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?room=${encodeURIComponent(roomId)}`
    : `https://braca.lk/tasks?room=${encodeURIComponent(roomId)}`;

  useEffect(() => {
    if (isOpen) {
      setInputRoom(roomId);
      generateQrDataUrl(shareUrl).then((url) => setQrDataUrl(url));
    }
  }, [isOpen, roomId, shareUrl]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomId);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSaveRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputRoom.trim()) {
      onRoomChange(inputRoom.trim().toUpperCase());
    }
  };

  const handleSaveDeviceName = (e: React.FormEvent) => {
    e.preventDefault();
    if (deviceName.trim()) {
      syncManager.setDeviceName(deviceName.trim());
      setIsEditingDeviceName(false);
    }
  };

  const handleExportJson = () => {
    const dataStr = JSON.stringify(tasks, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `braca_tasks_${roomId}_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          onImportTasks(parsed);
          setImportMessage(`Successfully imported ${parsed.length} tasks!`);
          setTimeout(() => setImportMessage(null), 4000);
        }
      } catch {
        setImportMessage('Invalid JSON file format.');
        setTimeout(() => setImportMessage(null), 4000);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#1c1917] text-stone-100 rounded-2xl border border-stone-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#151413] border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-[#163319] border border-[#C6A56A]/40 flex items-center justify-center text-[#C6A56A]">
              <Wifi className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold font-serif tracking-wide text-white">Real-Time Device Sync</h3>
              <p className="text-xs text-stone-400">Synchronize tasks instantaneously across phones, tablets & laptops</p>
            </div>
          </div>
          <button
            id="close-sync-modal-btn"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-800 bg-[#171615] px-6 text-xs font-medium overflow-x-auto">
          <button
            onClick={() => setActiveTab('sync')}
            className={`py-3 px-3 border-b-2 font-medium transition-colors flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'sync'
                ? 'border-[#C6A56A] text-[#C6A56A] font-bold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>Connect & QR Code</span>
          </button>

          <button
            onClick={() => setActiveTab('devices')}
            className={`py-3 px-3 border-b-2 font-medium transition-colors flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'devices'
                ? 'border-[#C6A56A] text-[#C6A56A] font-bold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Connected Devices ({connectedDevices.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('deploy')}
            className={`py-3 px-3 border-b-2 font-medium transition-colors flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'deploy'
                ? 'border-[#C6A56A] text-[#C6A56A] font-bold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Cloud className="w-4 h-4" />
            <span>GitHub & Cloudflare Guide</span>
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`py-3 px-3 border-b-2 font-medium transition-colors flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'backup'
                ? 'border-[#C6A56A] text-[#C6A56A] font-bold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Backup & Data</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-stone-300 text-sm">
          {/* TAB 1: CONNECT & QR CODE */}
          {activeTab === 'sync' && (
            <div className="space-y-6">
              {/* Status Header Pill */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-stone-900/90 border border-stone-800">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    {syncStatus === 'connected' ? (
                      <div className="w-3 h-3 rounded-full bg-[#C6A56A] shadow-sm">
                        <div className="w-3 h-3 rounded-full bg-[#C6A56A] animate-ping opacity-75"></div>
                      </div>
                    ) : (
                      <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-white uppercase tracking-wider block">
                      {syncStatus === 'connected'
                        ? 'Real-Time Sync Active'
                        : syncStatus === 'syncing'
                        ? 'Connecting to Global Broker...'
                        : 'Offline Mode (Local Cache Active)'}
                    </span>
                    <span className="text-[11px] text-stone-400">
                      WebSocket pub/sub latency: <strong className="text-[#C6A56A] font-mono">{pingMs} ms</strong> • Last sync: Just now
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-stone-400 block">Room</span>
                  <span className="font-mono text-xs font-bold text-[#C6A56A]">{roomId}</span>
                </div>
              </div>

              {/* QR Code and Quick Connect Block */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-[#131211] p-5 rounded-2xl border border-stone-800/80">
                {/* QR Code */}
                <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl shadow-md w-full max-w-[220px] mx-auto">
                  {qrDataUrl ? (
                    <img src={qrDataUrl} alt="Scan QR Code to Sync" className="w-44 h-44 rounded" />
                  ) : (
                    <div className="w-44 h-44 flex items-center justify-center text-stone-500">
                      <RefreshCw className="w-6 h-6 animate-spin" />
                    </div>
                  )}
                  <span className="text-[10px] text-stone-700 font-mono mt-2 font-medium">Scan with camera to sync</span>
                </div>

                {/* Instructions & Link */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-white flex items-center space-x-1.5">
                      <Smartphone className="w-4 h-4 text-[#C6A56A]" />
                      <span>Sync Phone or Second Laptop</span>
                    </h4>
                    <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                      Scan the QR code with your mobile camera or copy the sync link below. Both devices will join this room and reflect changes instantaneously.
                    </p>
                  </div>

                  {/* Copy Link Button */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold">Direct Room URL</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        readOnly
                        value={shareUrl}
                        className="w-full text-xs font-mono bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-stone-300 focus:outline-none"
                      />
                      <button
                        id="copy-sync-url-btn"
                        onClick={handleCopyLink}
                        className="p-2 bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white rounded-lg border border-stone-600 transition-colors flex-shrink-0"
                        title="Copy link"
                      >
                        {copiedLink ? <Check className="w-4 h-4 text-[#C6A56A]" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Room ID quick copy */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-stone-400">Sync Code:</span>
                    <button
                      onClick={handleCopyCode}
                      className="font-mono bg-stone-800 hover:bg-stone-700 text-[#C6A56A] px-2.5 py-1 rounded border border-stone-700 transition-colors flex items-center space-x-1"
                    >
                      <span>{roomId}</span>
                      {copiedCode ? <Check className="w-3 h-3 text-[#C6A56A]" /> : <Copy className="w-3 h-3 text-stone-400" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Change or Switch Room */}
              <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800">
                <form onSubmit={handleSaveRoom} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <label htmlFor="room-input-field" className="text-xs font-semibold text-white block">Switch or Create Sync Room</label>
                    <span className="text-[11px] text-stone-400">Join a team workspace room (e.g. BRACA-COLOMBO, FIELD-RESEARCH-02)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      id="room-input-field"
                      type="text"
                      value={inputRoom}
                      onChange={(e) => setInputRoom(e.target.value.toUpperCase())}
                      placeholder="ENTER ROOM CODE"
                      className="font-mono uppercase text-xs bg-stone-950 border border-stone-700 rounded-lg px-3 py-2 text-[#C6A56A] w-40 focus:outline-none focus:border-[#C6A56A]"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-2 bg-[#C6A56A] hover:bg-[#d6e4b4] text-[#163319] font-bold text-xs rounded-lg transition-all border border-[#C6A56A]/60 shadow-sm active:scale-95"
                    >
                      Join Room
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 2: CONNECTED DEVICES */}
          {activeTab === 'devices' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-white">Active Devices in Room "{roomId}"</h4>
                  <p className="text-xs text-stone-400">Heartbeats are refreshed automatically every 12 seconds</p>
                </div>

                {/* Edit device name */}
                {!isEditingDeviceName ? (
                  <button
                    onClick={() => setIsEditingDeviceName(true)}
                    className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Rename this device</span>
                  </button>
                ) : (
                  <form onSubmit={handleSaveDeviceName} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={deviceName}
                      onChange={(e) => setDeviceName(e.target.value)}
                      className="text-xs bg-stone-900 border border-stone-700 px-2 py-1 rounded text-white"
                      autoFocus
                    />
                    <button type="submit" className="text-xs bg-[#1e5631] hover:bg-[#164627] text-white px-2 py-1 rounded font-medium border border-emerald-600/30">Save</button>
                    <button type="button" onClick={() => setIsEditingDeviceName(false)} className="text-xs text-stone-400">Cancel</button>
                  </form>
                )}
              </div>

              <div className="space-y-2.5">
                {connectedDevices.map((device) => {
                  const isCurrent = device.isCurrent || device.id === syncManager.getDeviceInfo().id;
                  const Icon = device.deviceType === 'mobile' ? Smartphone : device.deviceType === 'tablet' ? Tablet : Laptop;

                  return (
                    <div
                      key={device.id}
                      className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                        isCurrent
                          ? 'bg-[#163319]/40 border-[#C6A56A]/50 text-stone-200'
                          : 'bg-stone-900/70 border-stone-800 text-stone-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${isCurrent ? 'bg-[#C6A56A]/20 text-[#C6A56A]' : 'bg-stone-800 text-stone-400'}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-semibold text-white">
                              {device.name}
                            </span>
                            {isCurrent && (
                              <span className="text-[10px] bg-[#C6A56A]/20 text-[#C6A56A] border border-[#C6A56A]/40 px-2 py-0.5 rounded-full font-mono font-medium">
                                This Device
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-stone-500 font-mono">ID: {device.id.slice(0, 14)}...</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-[#C6A56A] animate-pulse"></span>
                        <span className="text-[11px] text-[#C6A56A] font-medium">Online</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 bg-stone-900/50 rounded-lg border border-stone-800 text-xs text-stone-400 leading-relaxed">
                💡 <strong>Multi-Device Tip:</strong> When Dr. Anya updates a task on her laptop in the Colombo lab, Ashan on his field smartphone in Kandy sees the card move immediately without refreshing the page!
              </div>
            </div>
          )}

          {/* TAB 3: GITHUB & CLOUDFLARE PAGES GUIDE */}
          {activeTab === 'deploy' && (
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-stone-900 to-stone-900/80 rounded-xl border border-stone-800 space-y-2">
                <div className="flex items-center space-x-2 text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                  <h4 className="text-sm font-semibold text-white">100% Compatible with GitHub & Cloudflare Pages</h4>
                </div>
                <p className="text-xs text-stone-400 leading-relaxed">
                  This application uses a standard React + Vite architecture with client-side WebSocket synchronization. It compiles into pure static HTML/CSS/JS that runs lightning-fast on Cloudflare Pages and GitHub Pages without requiring any monthly server fees!
                </p>
              </div>

              <div className="space-y-3">
                <h5 className="text-xs font-semibold text-stone-200 uppercase tracking-wider flex items-center space-x-1.5">
                  <Github className="w-4 h-4 text-stone-400" />
                  <span>Step 1: Push to GitHub</span>
                </h5>
                <div className="p-3 bg-black/90 rounded-lg border border-stone-800 text-xs font-mono text-stone-300 space-y-1">
                  <div className="text-stone-500"># In your project root terminal:</div>
                  <div>git init</div>
                  <div>git add .</div>
                  <div>git commit -m "BRACA Real-Time Task Manager with Cloudflare Pages readiness"</div>
                  <div>git branch -M main</div>
                  <div>git remote add origin https://github.com/your-username/braca-tasks.git</div>
                  <div>git push -u origin main</div>
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="text-xs font-semibold text-stone-200 uppercase tracking-wider flex items-center space-x-1.5">
                  <Cloud className="w-4 h-4 text-emerald-400" />
                  <span>Step 2: Deploy to Cloudflare Pages</span>
                </h5>
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-stone-900 rounded-lg border border-stone-800 space-y-2">
                    <div className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>Log into <strong>dash.cloudflare.com</strong> &gt; <strong>Workers & Pages</strong> &gt; <strong>Create application</strong> &gt; <strong>Pages</strong>.</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>Select <strong>Connect to Git</strong> and choose your repository.</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>Set <strong>Framework preset:</strong> <code className="bg-stone-800 px-1 py-0.5 rounded text-emerald-300">Vite</code></span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>Set <strong>Build command:</strong> <code className="bg-stone-800 px-1 py-0.5 rounded text-emerald-300">npm run build</code></span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>Set <strong>Build output directory:</strong> <code className="bg-stone-800 px-1 py-0.5 rounded text-emerald-300">dist</code></span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-stone-900/70 border border-stone-800 rounded-lg text-xs text-stone-400">
                🚀 <strong>Routing included:</strong> We also include a <code className="text-emerald-300 font-mono">public/_redirects</code> file so SPA deep-linking and browser refreshes on Cloudflare Pages route cleanly to <code className="text-emerald-300 font-mono">/index.html</code>!
              </div>
            </div>
          )}

          {/* TAB 4: BACKUP & DATA */}
          {activeTab === 'backup' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-white">Data Export, Import & Reset</h4>
                <p className="text-xs text-stone-400">Manage your local storage snapshot and export conservation records</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Export */}
                <div className="p-4 bg-stone-900/80 rounded-xl border border-stone-800 space-y-3">
                  <div className="flex items-center space-x-2 text-stone-200">
                    <Download className="w-4 h-4 text-amber-400" />
                    <span className="font-semibold text-xs">Export Tasks (JSON)</span>
                  </div>
                  <p className="text-xs text-stone-400">
                    Download a full JSON backup of all {tasks.length} tasks, subtasks, and metadata.
                  </p>
                  <button
                    id="export-json-btn"
                    onClick={handleExportJson}
                    className="w-full py-2 px-3 bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white rounded-lg text-xs font-medium border border-stone-700 transition-colors"
                  >
                    Download JSON Backup
                  </button>
                </div>

                {/* Import */}
                <div className="p-4 bg-stone-900/80 rounded-xl border border-stone-800 space-y-3">
                  <div className="flex items-center space-x-2 text-stone-200">
                    <Upload className="w-4 h-4 text-emerald-400" />
                    <span className="font-semibold text-xs">Import Tasks (JSON)</span>
                  </div>
                  <p className="text-xs text-stone-400">
                    Restore previously exported tasks from a JSON file into this room.
                  </p>
                  {importMessage && (
                    <div className="p-2.5 bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs rounded-lg font-mono">
                      {importMessage}
                    </div>
                  )}
                  <label className="block">
                    <span className="sr-only">Choose backup file</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportFile}
                      className="block w-full text-xs text-stone-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-stone-800 file:text-stone-300 hover:file:bg-stone-700 cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              {/* Reset to Default */}
              <div className="p-4 bg-rose-950/20 rounded-xl border border-rose-900/30 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-rose-300 block">Reset to Sample BRACA Tasks</span>
                  <span className="text-[11px] text-stone-400">Restore the initial Biodiversity Research & Conservation Alliance tasks</span>
                </div>
                <button
                  id="reset-tasks-btn"
                  onClick={() => {
                    if (confirm('Are you sure you want to reset tasks to the default BRACA dataset?')) {
                      onResetDefaults();
                    }
                  }}
                  className="px-3 py-1.5 bg-rose-900/60 hover:bg-rose-800 text-rose-200 rounded-lg text-xs font-medium transition-colors"
                >
                  Reset Defaults
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-[#141312] border-t border-stone-800 flex items-center justify-between text-xs text-stone-500">
          <span>Room Code: <strong className="text-stone-300 font-mono">{roomId}</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
