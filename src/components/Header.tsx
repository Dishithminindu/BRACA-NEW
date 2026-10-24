import React, { useState, useEffect } from 'react';
import {
  RefreshCw,
  Plus,
  WifiOff,
  Volume2,
  VolumeX,
  Heart,
} from 'lucide-react';
import { ViewMode, SyncStatus, DevicePresence } from '../types';
import { bioacoustics } from '../utils/bioacousticsAudio';

interface HeaderProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  syncStatus: SyncStatus;
  pingMs: number;
  roomId: string;
  connectedDevices: DevicePresence[];
  onOpenSyncModal: () => void;
  onNewTaskClick: () => void;
  onDonationClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  syncStatus,
  roomId,
  connectedDevices,
  onOpenSyncModal,
  onNewTaskClick,
  onDonationClick,
}) => {
  const [isNightAudioActive, setIsNightAudioActive] = useState(false);

  useEffect(() => {
    const unsub = bioacoustics.subscribe((_species, isAmbience) => {
      setIsNightAudioActive(isAmbience);
    });
    return unsub;
  }, []);

  const handleToggleNightAudio = () => {
    const active = bioacoustics.toggleAmbience();
    setIsNightAudioActive(active);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#101510]/95 text-[#F2EFE5] border-b border-[#34392F] shadow-sm backdrop-blur-md">
      {/* 3-Zone Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 lg:gap-8 h-16">
          {/* Zone 1: Plain brand wordmark without square */}
          <a
            href="#explore"
            onClick={(e) => {
              e.preventDefault();
              onViewChange('webpage');
            }}
            className="flex items-center gap-3 group text-[#F2EFE5] hover:text-[#C6A56A] transition-all whitespace-nowrap shrink-0 py-1"
          >
            <div className="flex flex-col text-left">
              <span className="text-xl sm:text-2xl font-serif font-bold tracking-[0.24em] text-[#F2EFE5] group-hover:text-[#C6A56A] transition-colors leading-tight">
                BRACA
              </span>
              <span className="hidden md:inline-block text-[10px] tracking-[0.1em] uppercase text-[#A6AA9A] font-sans group-hover:text-[#F2EFE5] transition-colors leading-none mt-0.5">
                Biodiversity Research &amp; Conservation Alliance
              </span>
            </div>
          </a>

          {/* Zone 2: 4–5 single-line navigation links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs font-mono tracking-wider uppercase text-[#A6AA9A]">
            <button
              onClick={() => onViewChange('webpage')}
              className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentView === 'webpage'
                  ? 'text-[#C6A56A] font-semibold border-b-2 border-[#C6A56A] pb-0.5'
                  : 'hover:text-[#F2EFE5]'
              }`}
            >
              Wildlife Experience
            </button>

            <button
              onClick={() => onViewChange('board')}
              className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentView === 'board'
                  ? 'text-[#C6A56A] font-semibold border-b-2 border-[#C6A56A] pb-0.5'
                  : 'hover:text-[#F2EFE5]'
              }`}
            >
              Field Operations
            </button>

            <button
              onClick={() => onViewChange('list')}
              className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentView === 'list'
                  ? 'text-[#C6A56A] font-semibold border-b-2 border-[#C6A56A] pb-0.5'
                  : 'hover:text-[#F2EFE5]'
              }`}
            >
              Observations Register
            </button>

            <button
              onClick={() => onViewChange('timeline')}
              className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentView === 'timeline'
                  ? 'text-[#C6A56A] font-semibold border-b-2 border-[#C6A56A] pb-0.5'
                  : 'hover:text-[#F2EFE5]'
              }`}
            >
              Research Pillars
            </button>
          </nav>

          {/* Zone 3: Primary Actions Area */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Ambient Soundscape Toggle */}
            <button
              onClick={handleToggleNightAudio}
              title={isNightAudioActive ? 'Mute Night Soundscape' : 'Listen to Atmospheric Night Soundscape'}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-mono border transition-all cursor-pointer ${
                isNightAudioActive
                  ? 'bg-[#1D241B] border-[#C6A56A] text-[#C6A56A] shadow-xs'
                  : 'bg-[#141A13] hover:bg-[#1D241B] border-[#34392F] text-[#A6AA9A] hover:text-[#F2EFE5]'
              }`}
            >
              {isNightAudioActive ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#C6A56A] animate-pulse" />
                  <span className="hidden xl:inline text-[11px]">Night Audio</span>
                  <span className="flex gap-0.5 items-end h-3 w-3">
                    <span className="w-0.5 h-1.5 bg-[#C6A56A] animate-pulse" />
                    <span className="w-0.5 h-3 bg-[#C6A56A] animate-pulse" style={{ animationDelay: '150ms' }} />
                    <span className="w-0.5 h-2 bg-[#C6A56A] animate-pulse" style={{ animationDelay: '300ms' }} />
                  </span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-[#A6AA9A]" />
                  <span className="hidden xl:inline text-[11px]">Audio</span>
                </>
              )}
            </button>

            {/* Sync Status Button */}
            <button
              onClick={onOpenSyncModal}
              title={`Live Sync Station: ${roomId} (${connectedDevices.length} connected)`}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#141A13] hover:bg-[#1D241B] border border-[#34392F] hover:border-[#C6A56A]/60 rounded text-xs font-mono transition-colors text-[#A6AA9A] cursor-pointer"
            >
              {syncStatus === 'connected' ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="hidden sm:inline text-emerald-400 text-[11px]">Live Sync</span>
                </>
              ) : syncStatus === 'syncing' ? (
                <RefreshCw className="w-3 h-3 text-[#C6A56A] animate-spin" />
              ) : (
                <WifiOff className="w-3 h-3 text-stone-500" />
              )}
              <span className="text-[11px] font-mono text-stone-300">
                {connectedDevices.length}
              </span>
            </button>

            {/* Support / Donate button */}
            <button
              onClick={onDonationClick}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-transparent hover:bg-[#1D241B] border border-[#C6A56A]/60 hover:border-[#C6A56A] text-[#C6A56A] text-xs font-mono font-medium rounded transition-colors whitespace-nowrap cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Support</span>
            </button>

            {/* Log Field Action / Observation */}
            <button
              onClick={onNewTaskClick}
              className="px-3.5 py-1.5 bg-[#C6A56A] hover:bg-[#d8b87d] text-[#101510] text-xs font-mono font-bold tracking-wider uppercase rounded transition-all active:scale-95 whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Log Action</span>
              <span className="sm:hidden">Log</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Quick View Mode Toolbar */}
      <div className="lg:hidden border-t border-[#34392F] bg-[#141A13] px-3 py-2">
        <div className="flex items-center justify-between gap-1.5 overflow-x-auto scrollbar-none text-xs font-mono">
          <button
            onClick={() => onViewChange('webpage')}
            className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap cursor-pointer ${
              currentView === 'webpage'
                ? 'bg-[#1D241B] text-[#C6A56A] border border-[#C6A56A]/60 font-semibold'
                : 'text-[#A6AA9A]'
            }`}
          >
            Wildlife Experience
          </button>
          <button
            onClick={() => onViewChange('board')}
            className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap cursor-pointer ${
              currentView === 'board'
                ? 'bg-[#1D241B] text-[#C6A56A] border border-[#C6A56A]/60 font-semibold'
                : 'text-[#A6AA9A]'
            }`}
          >
            Field Board
          </button>
          <button
            onClick={() => onViewChange('list')}
            className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap cursor-pointer ${
              currentView === 'list'
                ? 'bg-[#1D241B] text-[#C6A56A] border border-[#C6A56A]/60 font-semibold'
                : 'text-[#A6AA9A]'
            }`}
          >
            Register
          </button>
          <button
            onClick={() => onViewChange('timeline')}
            className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap cursor-pointer ${
              currentView === 'timeline'
                ? 'bg-[#1D241B] text-[#C6A56A] border border-[#C6A56A]/60 font-semibold'
                : 'text-[#A6AA9A]'
            }`}
          >
            Pillars
          </button>
          <button
            onClick={onDonationClick}
            className="sm:hidden px-2.5 py-1.5 rounded bg-transparent text-[#C6A56A] border border-[#C6A56A]/40 whitespace-nowrap cursor-pointer ml-auto flex items-center gap-1"
          >
            <Heart className="w-3 h-3" />
            <span>Support</span>
          </button>
        </div>
      </div>
    </header>
  );
};
