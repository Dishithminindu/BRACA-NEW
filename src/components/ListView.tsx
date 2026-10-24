import React, { useState } from 'react';
import {
  Search,
  ArrowUpDown,
  CheckCircle2,
  Circle,
  Calendar,
  MapPin,
  Flame,
  Plus,
  Filter,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Task, TaskStatus, TaskPillar, TaskPriority } from '../types';

interface ListViewProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onNewTaskClick: () => void;
}

type SortField = 'dueDate' | 'priority' | 'title' | 'status' | 'pillar';

export const ListView: React.FC<ListViewProps> = ({
  tasks,
  onEditTask,
  onStatusChange,
  onNewTaskClick,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [pillarFilter, setPillarFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('dueDate');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  const priorityWeights: Record<TaskPriority, number> = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1,
  };

  const handleToggleDone = (e: React.MouseEvent, task: Task) => {
    e.stopPropagation();
    if (task.status !== 'done') {
      try {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.7 },
          colors: ['#C6A56A', '#F2EFE5', '#101510', '#34D399'],
        });
      } catch {
        // Ignore
      }
      onStatusChange(task.id, 'done');
    } else {
      onStatusChange(task.id, 'todo');
    }
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // Filter tasks
  const filtered = tasks.filter((t) => {
    const matchesSearch =
      !searchQuery ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.location?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesPillar = pillarFilter === 'all' || t.pillar === pillarFilter;

    return matchesSearch && matchesStatus && matchesPillar;
  });

  // Sort tasks
  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    if (sortField === 'title') {
      cmp = a.title.localeCompare(b.title);
    } else if (sortField === 'priority') {
      cmp = priorityWeights[b.priority] - priorityWeights[a.priority];
    } else if (sortField === 'dueDate') {
      const d1 = a.dueDate ? new Date(a.dueDate).getTime() : 9999999999999;
      const d2 = b.dueDate ? new Date(b.dueDate).getTime() : 9999999999999;
      cmp = d1 - d2;
    } else if (sortField === 'status') {
      cmp = a.status.localeCompare(b.status);
    } else if (sortField === 'pillar') {
      cmp = a.pillar.localeCompare(b.pillar);
    }
    return sortAsc ? cmp : -cmp;
  });

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="bg-[#171614] border border-stone-800 rounded-xl p-3 shadow-sm flex flex-wrap items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search tasks, descriptions, field sites..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-900 border border-stone-700/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-[#C6A56A]"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-2 text-xs">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-stone-900 border border-stone-700/80 text-stone-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#C6A56A]"
          >
            <option value="all">All Statuses</option>
            <option value="backlog">Backlog</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="review">In Review</option>
            <option value="done">Completed</option>
          </select>

          <select
            value={pillarFilter}
            onChange={(e) => setPillarFilter(e.target.value)}
            className="bg-stone-900 border border-stone-700/80 text-stone-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#C6A56A]"
          >
            <option value="all">All Pillars</option>
            <option value="research">Field Research</option>
            <option value="habitat">Habitat & Cavity</option>
            <option value="acoustics">Bioacoustics</option>
            <option value="sightings">Nocturnal Sightings</option>
            <option value="community">Community Outreach</option>
            <option value="census">Raptor Census</option>
          </select>

          <button
            onClick={onNewTaskClick}
            className="flex items-center space-x-1 bg-[#C6A56A] hover:bg-[#d8b87d] text-[#101510] font-bold px-3 py-1.5 rounded-lg transition-all shadow-sm active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Action</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-[#141311] border border-stone-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#1a1916] border-b border-stone-800 text-stone-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 w-10"></th>
                <th
                  onClick={() => toggleSort('title')}
                  className="py-3 px-4 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center space-x-1">
                    <span>Task Name</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('pillar')}
                  className="py-3 px-4 cursor-pointer hover:text-white hidden md:table-cell"
                >
                  <div className="flex items-center space-x-1">
                    <span>Pillar</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('status')}
                  className="py-3 px-4 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center space-x-1">
                    <span>Status</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('priority')}
                  className="py-3 px-4 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center space-x-1">
                    <span>Priority</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('dueDate')}
                  className="py-3 px-4 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center space-x-1">
                    <span>Due Date</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 hidden lg:table-cell">Assignee</th>
                <th className="py-3 px-4 hidden sm:table-cell">Species / Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60">
              {sorted.length > 0 ? (
                sorted.map((t) => {
                  const isDone = t.status === 'done';
                  const isOverdue = t.dueDate && !isDone && new Date(t.dueDate).getTime() < Date.now() - 86400000;
                  const completedSubtasks = t.subtasks.filter((s) => s.completed).length;

                  return (
                    <tr
                      key={t.id}
                      onClick={() => onEditTask(t)}
                      className="hover:bg-[#1f1d19] transition-colors cursor-pointer group"
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={(e) => handleToggleDone(e, t)}
                          className="text-stone-500 hover:text-[#C6A56A] transition-colors"
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Circle className="w-4 h-4 hover:scale-110 transition-transform" />
                          )}
                        </button>
                      </td>

                      {/* Title */}
                      <td className="py-3 px-4">
                        <div className="font-medium text-stone-200 group-hover:text-white transition-colors">
                          <span className={isDone ? 'line-through text-stone-400' : ''}>{t.title}</span>
                        </div>
                        {t.subtasks.length > 0 && (
                          <div className="text-[10px] text-stone-400 mt-0.5 font-mono">
                            Checklist: {completedSubtasks}/{t.subtasks.length} items
                          </div>
                        )}
                      </td>

                      {/* Pillar */}
                      <td className="py-3 px-4 hidden md:table-cell">
                        <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded border border-stone-700 bg-stone-900 text-stone-300">
                          {t.pillar}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <span className="capitalize text-stone-300 font-medium">
                          {t.status.replace('-', ' ')}
                        </span>
                      </td>

                      {/* Priority */}
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                            t.priority === 'critical'
                              ? 'bg-rose-950/40 border-rose-600/50 text-rose-300'
                              : t.priority === 'high'
                              ? 'bg-amber-950/40 border-amber-600/50 text-amber-300'
                              : 'bg-stone-800 border-stone-700 text-stone-400'
                          }`}
                        >
                          {t.priority}
                        </span>
                      </td>

                      {/* Due Date */}
                      <td className="py-3 px-4 font-mono text-[11px]">
                        {t.dueDate ? (
                          <span className={isOverdue ? 'text-rose-400 font-bold' : 'text-stone-300'}>
                            {t.dueDate}
                          </span>
                        ) : (
                          <span className="text-stone-600">—</span>
                        )}
                      </td>

                      {/* Assignee */}
                      <td className="py-3 px-4 hidden lg:table-cell">
                        {t.assignee ? (
                          <div className="flex items-center space-x-1.5">
                            <div
                              className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm"
                              style={{ backgroundColor: t.assignee.avatarColor }}
                            >
                              {t.assignee.name[0]}
                            </div>
                            <span className="text-stone-300 truncate">{t.assignee.name}</span>
                          </div>
                        ) : (
                          <span className="text-stone-600">—</span>
                        )}
                      </td>

                      {/* Species / Location */}
                      <td className="py-3 px-4 hidden sm:table-cell text-stone-400">
                        <div className="truncate max-w-[160px] text-[11px]">
                          {t.species && <span className="text-[#e6f0cd] mr-1">🐾 {t.species}</span>}
                          {t.location && <span>({t.location})</span>}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-stone-500 text-xs">
                    No tasks found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
