import React, { useState, useEffect, useCallback } from 'react';
import { Task, TaskStatus, ViewMode, SyncStatus, DevicePresence, TaskPillar } from './types';
import { INITIAL_TASKS } from './data/initialTasks';
import { syncManager } from './services/syncEngine';
import { Header } from './components/Header';
import { KanbanBoard } from './components/KanbanBoard';
import { ListView } from './components/ListView';
import { PillarsOverview } from './components/PillarsOverview';
import { OwlSerengetiView } from './components/OwlSerengetiView';
import { TaskModal } from './components/TaskModal';
import { SyncCenterModal } from './components/SyncCenterModal';
import { DonationModal } from './components/DonationModal';
import { Radio, X } from 'lucide-react';

const STORAGE_TASKS_KEY = 'owl_serengeti_tasks_v1';
const STORAGE_ROOM_KEY = 'owl_serengeti_room_v1';

export default function App() {
  // Read room from URL query parameter ?room=... or localStorage
  const [roomId, setRoomId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlRoom = params.get('room');
      if (urlRoom && urlRoom.trim()) {
        return urlRoom.trim().toUpperCase();
      }
      const savedRoom = localStorage.getItem(STORAGE_ROOM_KEY);
      if (savedRoom && savedRoom.trim()) {
        return savedRoom.trim().toUpperCase();
      }
    }
    return 'BRACA-SERENGETI';
  });

  // Tasks state
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(`${STORAGE_TASKS_KEY}_${roomId}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch {
        // Fallback to initial
      }
    }
    return INITIAL_TASKS;
  });

  // Default to the flagship living wildlife observation experience
  const [currentView, setCurrentView] = useState<ViewMode>('webpage');
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('offline');
  const [pingMs, setPingMs] = useState<number>(32);
  const [connectedDevices, setConnectedDevices] = useState<DevicePresence[]>([]);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [selectedTaskForEdit, setSelectedTaskForEdit] = useState<Task | null>(null);
  const [newTaskDefaultStatus, setNewTaskDefaultStatus] = useState<TaskStatus>('todo');
  const [remoteNotification, setRemoteNotification] = useState<string | null>(null);

  // Save tasks to local storage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_TASKS_KEY}_${roomId}`, JSON.stringify(tasks));
    } catch {
      // Ignore
    }
  }, [tasks, roomId]);

  // Handle incoming real-time sync messages
  const handleSyncMessage = useCallback(
    (message: any) => {
      if (message.type === 'TASK_UPSERT' && message.payload) {
        const incomingTask: Task = message.payload;
        setTasks((prev) => {
          const existingIdx = prev.findIndex((t) => t.id === incomingTask.id);
          if (existingIdx >= 0) {
            // Last-Write-Wins: only update if incoming is newer or equal
            if ((incomingTask.updatedAt || 0) >= (prev[existingIdx].updatedAt || 0)) {
              const copy = [...prev];
              copy[existingIdx] = incomingTask;
              return copy;
            }
            return prev;
          } else {
            return [incomingTask, ...prev];
          }
        });

        // Show non-intrusive toast notification
        const deviceName = message.senderDeviceName || 'Field Device';
        setRemoteNotification(`Live sync from ${deviceName}: "${incomingTask.title.slice(0, 32)}..."`);
      } else if (message.type === 'TASK_DELETE' && message.payload?.taskId) {
        const { taskId } = message.payload;
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
        const deviceName = message.senderDeviceName || 'Field Device';
        setRemoteNotification(`Observation deleted by ${deviceName}`);
      } else if (message.type === 'SYNC_ALL' && message.payload?.tasks) {
        const incomingTasks: Task[] = message.payload.tasks;
        if (Array.isArray(incomingTasks) && incomingTasks.length > 0) {
          setTasks(incomingTasks);
          setRemoteNotification(`Synchronized entire field board from ${message.senderDeviceName || 'peer'}`);
        }
      } else if (message.type === 'ROOM_REQUEST') {
        syncManager.broadcastAllTasks(tasks);
      }
    },
    [tasks]
  );

  // Initialize sync manager on room change or mount
  useEffect(() => {
    syncManager.init(roomId);
    try {
      localStorage.setItem(STORAGE_ROOM_KEY, roomId);
    } catch {
      // Ignore
    }

    const unsubMsg = syncManager.subscribe(handleSyncMessage);
    const unsubStatus = syncManager.onStatusChange((status, ping) => {
      setSyncStatus(status);
      if (ping) setPingMs(ping);
    });
    const unsubPresence = syncManager.onPresenceChange((devs) => {
      setConnectedDevices(devs);
    });

    return () => {
      unsubMsg();
      unsubStatus();
      unsubPresence();
    };
  }, [roomId, handleSyncMessage]);

  // Auto-dismiss remote notification after 4 seconds
  useEffect(() => {
    if (remoteNotification) {
      const timer = setTimeout(() => setRemoteNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [remoteNotification]);

  // Change room handler
  const handleRoomChange = (newRoom: string) => {
    const formatted = newRoom.trim().toUpperCase();
    if (!formatted || formatted === roomId) return;
    setRoomId(formatted);

    // Update browser URL query param without reload
    if (typeof window !== 'undefined' && window.history?.replaceState) {
      const url = new URL(window.location.href);
      url.searchParams.set('room', formatted);
      window.history.replaceState({}, '', url.toString());
    }

    // Try loading saved tasks for this room
    try {
      const saved = localStorage.getItem(`${STORAGE_TASKS_KEY}_${formatted}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTasks(parsed);
        }
      }
    } catch {
      // Keep
    }
  };

  // Upsert task
  const handleSaveTask = (savedTask: Task) => {
    setTasks((prev) => {
      const existingIdx = prev.findIndex((t) => t.id === savedTask.id);
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = savedTask;
        return copy;
      }
      return [savedTask, ...prev];
    });

    syncManager.broadcastTaskUpsert(savedTask);
  };

  // Delete task
  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    syncManager.broadcastTaskDelete(taskId);
  };

  // Status shift
  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) => {
      const updated = prev.map((t) => {
        if (t.id === taskId) {
          const newTask: Task = {
            ...t,
            status: newStatus,
            updatedAt: Date.now(),
            lastUpdatedByDevice: syncManager.getDeviceInfo().name,
          };
          syncManager.broadcastTaskUpsert(newTask);
          return newTask;
        }
        return t;
      });
      return updated;
    });
  };

  // Open modal to add new task
  const handleOpenNewTask = (status: TaskStatus = 'todo') => {
    setSelectedTaskForEdit(null);
    setNewTaskDefaultStatus(status);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditTask = (task: Task) => {
    setSelectedTaskForEdit(task);
    setIsTaskModalOpen(true);
  };

  const handleOpenNewTaskWithPillar = (pillar: TaskPillar) => {
    setSelectedTaskForEdit(null);
    setNewTaskDefaultStatus('todo');
    setIsTaskModalOpen(true);
  };

  const handleImportTasks = (importedTasks: Task[]) => {
    setTasks(importedTasks);
    syncManager.broadcastAllTasks(importedTasks);
  };

  const handleResetDefaults = () => {
    setTasks(INITIAL_TASKS);
    syncManager.broadcastAllTasks(INITIAL_TASKS);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#101510] text-[#F2EFE5] selection:bg-[#C6A56A] selection:text-[#101510]">
      {/* 1. PRIMARY HEADER & NAVIGATION */}
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        syncStatus={syncStatus}
        pingMs={pingMs}
        roomId={roomId}
        connectedDevices={connectedDevices}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
        onNewTaskClick={() => handleOpenNewTask('todo')}
        onDonationClick={() => setIsDonationModalOpen(true)}
      />

      {/* 2. REAL-TIME REMOTE ACTIVITY TOAST */}
      {remoteNotification && (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-3 duration-200">
          <div className="bg-[#141A13]/95 border border-[#C6A56A]/60 text-[#F2EFE5] text-xs py-2.5 px-4 rounded-lg shadow-xl flex items-center space-x-2.5 backdrop-blur-sm max-w-sm">
            <Radio className="w-4 h-4 text-[#C6A56A] animate-pulse shrink-0" />
            <span className="truncate">{remoteNotification}</span>
            <button
              onClick={() => setRemoteNotification(null)}
              className="p-1 text-[#A6AA9A] hover:text-white ml-auto"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 3. MAIN WORKSPACE / DOCUMENTARY VIEW */}
      <main className="flex-1">
        {currentView === 'webpage' ? (
          <OwlSerengetiView
            tasks={tasks}
            onOpenFieldOps={() => setCurrentView('board')}
            onNewObservationTask={() => handleOpenNewTask('todo')}
            onDonationClick={() => setIsDonationModalOpen(true)}
          />
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            {/* Context Heading */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#34392F]">
              <div className="space-y-1">
                <div className="text-xs font-mono uppercase tracking-[0.2em] text-[#C6A56A]">
                  BRACA · SERENGETI RESEARCH OPERATIONS
                </div>
                <h1 className="text-2xl sm:text-3xl font-serif text-[#F2EFE5] font-normal tracking-wide">
                  {currentView === 'board' && 'Nocturnal Field Operations Board'}
                  {currentView === 'list' && 'Serengeti Strigiformes Observation Register'}
                  {currentView === 'timeline' && 'Ecological Research Pillars & Framework'}
                </h1>
                <p className="text-xs text-[#A6AA9A] font-light">
                  Real-time multi-device synchronization active in station{' '}
                  <strong className="text-[#C6A56A] font-mono">{roomId}</strong>. Changes broadcast immediately to field personnel.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsSyncModalOpen(true)}
                  className="px-3 py-1.5 bg-[#141A13] hover:bg-[#1D241B] text-[#A6AA9A] hover:text-[#F2EFE5] rounded text-xs font-mono border border-[#34392F] flex items-center space-x-2 transition-colors"
                >
                  <Radio className="w-3.5 h-3.5 text-[#C6A56A]" />
                  <span>Sync ({connectedDevices.length} online)</span>
                </button>
                <button
                  onClick={() => setCurrentView('webpage')}
                  className="px-3.5 py-1.5 bg-[#C6A56A] hover:bg-[#d8b87d] text-[#101510] rounded text-xs font-mono font-semibold uppercase tracking-wider transition-colors"
                >
                  View Documentary
                </button>
              </div>
            </div>

            {/* Board View */}
            {currentView === 'board' && (
              <KanbanBoard
                tasks={tasks}
                onEditTask={handleOpenEditTask}
                onStatusChange={handleStatusChange}
                onAddTaskToStatus={(status) => handleOpenNewTask(status)}
              />
            )}

            {/* List View */}
            {currentView === 'list' && (
              <ListView
                tasks={tasks}
                onEditTask={handleOpenEditTask}
                onStatusChange={handleStatusChange}
                onNewTaskClick={() => handleOpenNewTask('todo')}
              />
            )}

            {/* Pillars Overview */}
            {currentView === 'timeline' && (
              <PillarsOverview
                tasks={tasks}
                onSelectPillarTasks={(pillar) => {
                  setCurrentView('board');
                }}
                onNewTaskWithPillar={handleOpenNewTaskWithPillar}
              />
            )}
          </div>
        )}
      </main>

      {/* 4. MODALS */}
      {/* Create / Edit Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setSelectedTaskForEdit(null);
        }}
        task={selectedTaskForEdit}
        defaultStatus={newTaskDefaultStatus}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
      />

      {/* Real-time Sync Center Modal */}
      <SyncCenterModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        roomId={roomId}
        onRoomChange={handleRoomChange}
        syncStatus={syncStatus}
        pingMs={pingMs}
        connectedDevices={connectedDevices}
        tasks={tasks}
        onImportTasks={handleImportTasks}
        onResetDefaults={handleResetDefaults}
      />

      {/* Support / Donation Modal */}
      <DonationModal
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
      />
    </div>
  );
}
