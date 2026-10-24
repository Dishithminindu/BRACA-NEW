import React from 'react';
import {
  CheckCircle2,
  Circle,
  Calendar,
  MapPin,
  AlertCircle,
  CheckSquare,
  Square,
  ArrowRight,
  ArrowLeft,
  Flame,
  Clock,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Task, TaskStatus, TaskPillar, TaskPriority } from '../types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onToggleSubtask?: (taskId: string, subtaskId: string) => void;
}

const STATUS_ORDER: TaskStatus[] = ['backlog', 'todo', 'in-progress', 'review', 'done'];

const PILLAR_STYLES: Record<TaskPillar, { label: string; text: string }> = {
  research: { label: 'Research', text: 'text-[#C6A56A]' },
  habitat: { label: 'Habitat', text: 'text-emerald-400' },
  acoustics: { label: 'Bioacoustics', text: 'text-amber-300' },
  sightings: { label: 'Sightings', text: 'text-indigo-300' },
  community: { label: 'Outreach', text: 'text-rose-300' },
  census: { label: 'Census', text: 'text-[#A6AA9A]' },
};

const PRIORITY_BADGES: Record<TaskPriority, { label: string; color: string }> = {
  critical: { label: 'CRITICAL', color: 'text-rose-400 font-semibold' },
  high: { label: 'HIGH', color: 'text-amber-400' },
  medium: { label: 'MED', color: 'text-stone-400' },
  low: { label: 'LOW', color: 'text-stone-500' },
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onStatusChange }) => {
  const currentIdx = STATUS_ORDER.indexOf(task.status);
  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;
  const totalSubtasks = task.subtasks.length;
  const isDone = task.status === 'done';

  const isOverdue = task.dueDate && !isDone && new Date(task.dueDate).getTime() < Date.now() - 86400000;

  const handleToggleDone = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isDone) {
      // Trigger confetti celebration
      try {
        confetti({
          particleCount: 45,
          spread: 55,
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

  const handleMoveLeft = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIdx > 0) {
      onStatusChange(task.id, STATUS_ORDER[currentIdx - 1]);
    }
  };

  const handleMoveRight = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIdx < STATUS_ORDER.length - 1) {
      const nextStatus = STATUS_ORDER[currentIdx + 1];
      if (nextStatus === 'done') {
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
      }
      onStatusChange(task.id, nextStatus);
    }
  };

  const pillarStyle = PILLAR_STYLES[task.pillar] || PILLAR_STYLES.research;
  const priorityStyle = PRIORITY_BADGES[task.priority] || PRIORITY_BADGES.medium;

  return (
    <div
      onClick={() => onEdit(task)}
      className={`group relative bg-[#181816] hover:bg-[#1f1e1b] rounded-lg p-3.5 border transition-all duration-150 cursor-pointer shadow-xs hover:shadow-md ${
        isDone
          ? 'border-stone-850 opacity-70'
          : task.priority === 'critical'
          ? 'border-rose-950/80 hover:border-rose-800'
          : 'border-stone-800/80 hover:border-stone-700'
      }`}
    >
      {/* Top row: Pillar & Priority with typographic elegance */}
      <div className="flex items-center justify-between gap-2 mb-2 font-mono text-[10px]">
        <div className="flex items-center gap-1.5 truncate">
          <span className={`uppercase font-semibold tracking-wider ${pillarStyle.text}`}>
            {pillarStyle.label}
          </span>

          {task.species && (
            <>
              <span aria-hidden="true" className="text-stone-700">·</span>
              <span className="text-stone-400 italic truncate max-w-[110px]">{task.species}</span>
            </>
          )}
        </div>

        <span className={`tracking-wider flex items-center gap-1 ${priorityStyle.color}`}>
          {task.priority === 'critical' && <Flame className="w-2.5 h-2.5 text-rose-400" />}
          <span>{priorityStyle.label}</span>
        </span>
      </div>

      {/* Title & Quick Done Toggle */}
      <div className="flex items-start space-x-2.5 mb-2">
        <button
          type="button"
          onClick={handleToggleDone}
          className="mt-0.5 text-stone-500 hover:text-[#C6A56A] flex-shrink-0 transition-colors"
          title={isDone ? 'Mark as incomplete' : 'Mark as completed'}
        >
          {isDone ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <Circle className="w-4 h-4 hover:scale-110 transition-transform" />
          )}
        </button>

        <h4 className={`text-xs font-medium text-stone-100 leading-snug line-clamp-2 ${isDone ? 'line-through text-stone-400' : ''}`}>
          {task.title}
        </h4>
      </div>

      {/* Description Snippet */}
      {task.description && (
        <p className="text-[11px] text-stone-400 line-clamp-2 mb-2.5 leading-relaxed pl-6.5">
          {task.description}
        </p>
      )}

      {/* Subtasks Progress Bar */}
      {totalSubtasks > 0 && (
        <div className="mb-2.5 pl-6.5">
          <div className="flex items-center justify-between text-[10px] text-stone-400 mb-1">
            <span className="flex items-center space-x-1">
              <CheckSquare className="w-3 h-3 text-stone-400" />
              <span>Checklist</span>
            </span>
            <span className="font-mono">{completedSubtasks}/{totalSubtasks}</span>
          </div>
          <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                completedSubtasks === totalSubtasks ? 'bg-emerald-400' : 'bg-[#C6A56A]'
              }`}
              style={{ width: `${(completedSubtasks / totalSubtasks) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Bottom Metadata: Due Date, Location, Assignee */}
      <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between text-[11px] text-stone-400">
        <div className="flex items-center space-x-2 truncate">
          {task.dueDate && (
            <span className={`flex items-center space-x-1 font-mono text-[10px] ${isOverdue ? 'text-rose-400 font-semibold' : 'text-stone-400'}`}>
              <Calendar className="w-3 h-3" />
              <span>{task.dueDate.slice(5)}</span>
            </span>
          )}

          {task.location && (
            <span className="hidden sm:flex items-center space-x-1 text-stone-400 truncate max-w-[100px]" title={task.location}>
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{task.location}</span>
            </span>
          )}
        </div>

        {/* Assignee Avatar */}
        {task.assignee && (
          <div className="flex items-center space-x-1.5 flex-shrink-0" title={`${task.assignee.name} (${task.assignee.role})`}>
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm"
              style={{ backgroundColor: task.assignee.avatarColor || '#3b82f6' }}
            >
              {task.assignee.name[0]}
            </div>
            <span className="text-[10px] text-stone-300 hidden md:inline truncate max-w-[70px]">
              {task.assignee.name.split(' ')[0]}
            </span>
          </div>
        )}
      </div>

      {/* Quick Status Shift Controls (Visible on hover) */}
      <div className="absolute top-2 right-2 hidden group-hover:flex items-center space-x-1 bg-stone-900/95 border border-stone-700 p-0.5 rounded-lg shadow-md z-10">
        {currentIdx > 0 && (
          <button
            type="button"
            onClick={handleMoveLeft}
            className="p-1 hover:bg-stone-800 text-stone-300 hover:text-white rounded"
            title={`Move to ${STATUS_ORDER[currentIdx - 1]}`}
          >
            <ArrowLeft className="w-3 h-3" />
          </button>
        )}
        {currentIdx < STATUS_ORDER.length - 1 && (
          <button
            type="button"
            onClick={handleMoveRight}
            className="p-1 hover:bg-stone-800 text-stone-300 hover:text-white rounded"
            title={`Move to ${STATUS_ORDER[currentIdx + 1]}`}
          >
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};
