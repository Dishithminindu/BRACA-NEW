import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  Inbox,
  Clock,
  PlayCircle,
  Eye,
  CheckCircle,
  X,
  Sparkles,
} from 'lucide-react';
import { Task, TaskStatus, TaskPillar, SmallCatSpecies, TaskPriority } from '../types';
import { TaskCard } from './TaskCard';

interface KanbanBoardProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onAddTaskToStatus: (status: TaskStatus) => void;
}

interface ColumnConfig {
  id: TaskStatus;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const COLUMNS: ColumnConfig[] = [
  { id: 'backlog', title: 'Backlog / Field Prep', icon: Inbox, color: 'text-stone-400' },
  { id: 'todo', title: 'To Do', icon: Clock, color: 'text-[#C6A56A]' },
  { id: 'in-progress', title: 'Active In Progress', icon: PlayCircle, color: 'text-sky-400' },
  { id: 'review', title: 'In Review / Verification', icon: Eye, color: 'text-amber-400' },
  { id: 'done', title: 'Completed', icon: CheckCircle, color: 'text-emerald-400' },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onEditTask,
  onStatusChange,
  onAddTaskToStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPillar, setSelectedPillar] = useState<string>('all');
  const [selectedSpecies, setSelectedSpecies] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      !searchQuery ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPillar = selectedPillar === 'all' || t.pillar === selectedPillar;
    const matchesSpecies = selectedSpecies === 'all' || t.species === selectedSpecies;
    const matchesPriority = selectedPriority === 'all' || t.priority === selectedPriority;

    return matchesSearch && matchesPillar && matchesSpecies && matchesPriority;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedPillar('all');
    setSelectedSpecies('all');
    setSelectedPriority('all');
  };

  const hasActiveFilters =
    searchQuery || selectedPillar !== 'all' || selectedSpecies !== 'all' || selectedPriority !== 'all';

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="bg-[#181816] border border-stone-800/90 rounded-lg p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search records, scientific tags, locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-900/90 border border-stone-800 rounded-md pl-9 pr-3 py-1.5 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-[#C6A56A]"
          />
        </div>

        {/* Filter dropdowns */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Pillar filter */}
          <select
            value={selectedPillar}
            onChange={(e) => setSelectedPillar(e.target.value)}
            className="bg-stone-900/90 border border-stone-800 text-stone-300 rounded-md px-2.5 py-1.5 focus:outline-none focus:border-[#C6A56A]"
          >
            <option value="all">All Research Pillars</option>
            <option value="research">Field Biology</option>
            <option value="habitat">Habitat & Cavity</option>
            <option value="acoustics">Bioacoustics</option>
            <option value="sightings">Nocturnal Sightings</option>
            <option value="community">Ranger Outreach</option>
            <option value="census">Raptor Census</option>
          </select>

          {/* Species filter */}
          <select
            value={selectedSpecies}
            onChange={(e) => setSelectedSpecies(e.target.value)}
            className="bg-stone-900/90 border border-stone-800 text-stone-300 rounded-md px-2.5 py-1.5 focus:outline-none focus:border-[#C6A56A]"
          >
            <option value="all">All Owl Taxa</option>
            <option value="African Scops Owl">African Scops Owl (Otus senegalensis)</option>
            <option value="Spotted Eagle-Owl">Spotted Eagle-Owl (Bubo africanus)</option>
            <option value="Verreaux’s Eagle-Owl">Verreaux’s Eagle-Owl (Bubo lacteus)</option>
            <option value="Pearl-Spotted Owlet">Pearl-Spotted Owlet (Glaucidium perlatum)</option>
            <option value="African Barn Owl">African Barn Owl (Tyto alba affinis)</option>
          </select>

          {/* Priority filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="bg-stone-900/90 border border-stone-800 text-stone-300 rounded-md px-2.5 py-1.5 focus:outline-none focus:border-[#e6f0cd]"
          >
            <option value="all">All Urgencies</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center space-x-1 text-xs text-[#e6f0cd] hover:text-[#d6e4b4] px-2.5 py-1 bg-stone-800 rounded-md border border-stone-700 transition-colors"
            >
              <X className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Kanban Board Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5 items-start">
        {COLUMNS.map((column) => {
          const colTasks = filteredTasks.filter((t) => t.status === column.id);
          const Icon = column.icon;

          return (
            <div
              key={column.id}
              className="bg-[#141412] border border-stone-800/80 rounded-xl p-3 flex flex-col min-h-[500px] shadow-xs"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-stone-800/80">
                <div className="flex items-center space-x-2">
                  <Icon className={`w-3.5 h-3.5 ${column.color}`} />
                  <h3 className="text-xs font-medium text-stone-200 uppercase tracking-wider font-mono">
                    {column.title}
                  </h3>
                  <span className="text-[10px] font-mono text-stone-400">
                    ({colTasks.length})
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => onAddTaskToStatus(column.id)}
                  title={`Add task to ${column.title}`}
                  className="p-1 hover:bg-stone-800 text-stone-400 hover:text-[#e6f0cd] rounded transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Tasks List */}
              <div className="space-y-2.5 flex-1 overflow-y-auto pr-0.5">
                {colTasks.length > 0 ? (
                  colTasks.map((t) => (
                    <TaskCard
                      key={t.id}
                      task={t}
                      onEdit={onEditTask}
                      onStatusChange={onStatusChange}
                    />
                  ))
                ) : (
                  <div className="h-40 border border-dashed border-stone-800/60 rounded-lg flex flex-col items-center justify-center p-4 text-center text-stone-500">
                    <span className="text-xs font-light">No records in state</span>
                    <button
                      onClick={() => onAddTaskToStatus(column.id)}
                      className="mt-2 text-[11px] text-[#e6f0cd] hover:text-[#d6e4b4] flex items-center space-x-1 font-medium"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Log new action</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
