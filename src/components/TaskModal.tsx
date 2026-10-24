import React, { useState, useEffect } from 'react';
import {
  X,
  CheckSquare,
  Square,
  Plus,
  Trash2,
  Calendar,
  MapPin,
  Tag,
  AlertCircle,
  User,
  Shield,
  Layers,
} from 'lucide-react';
import { Task, TaskStatus, TaskPriority, TaskPillar, AfricanOwlSpecies, SmallCatSpecies, Subtask } from '../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onSave: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  defaultStatus?: TaskStatus;
}

const PILLARS: { id: TaskPillar; label: string; color: string }[] = [
  { id: 'research', label: 'Scientific Field Research', color: 'bg-[#1D241B] text-[#C6A56A] border border-[#C6A56A]/40' },
  { id: 'habitat', label: 'Habitat & Cavity Monitoring', color: 'bg-emerald-950/80 text-emerald-300' },
  { id: 'acoustics', label: 'Bioacoustics & Vocal Mapping', color: 'bg-amber-950/80 text-amber-300' },
  { id: 'sightings', label: 'Nocturnal Sightings & Traps', color: 'bg-indigo-950/80 text-indigo-300' },
  { id: 'community', label: 'Community & Ranger Outreach', color: 'bg-rose-950/80 text-rose-300' },
  { id: 'census', label: 'Raptor Census & GIS Registry', color: 'bg-stone-800 text-stone-200' },
];

const PRESET_ASSIGNEES = [
  { name: 'Dr. Joseph Kimaro', role: 'Lead Ornithologist', avatarColor: '#526649' },
  { name: 'Elena Vance, Ph.D.', role: 'Sensory Biologist', avatarColor: '#8C7B5D' },
  { name: 'Samwel Ndosi', role: 'Bioacoustics Specialist', avatarColor: '#C6A56A' },
  { name: 'Prof. Amara Osei', role: 'Ecologist & Outreach Lead', avatarColor: '#4A5B45' },
  { name: 'Serengeti Field Ranger', role: 'Nocturnal Patrol', avatarColor: '#34392F' },
];

const SPECIES_OPTIONS: AfricanOwlSpecies[] = [
  'Chestnut-backed Owlet',
  'Sri Lanka Bay Owl',
  'Indian Scops Owl',
  'Brown Fish Owl',
  'Serendib Scops Owl',
  'African Scops Owl',
  'Spotted Eagle-Owl',
  'Verreaux’s Eagle-Owl',
  'Pearl-Spotted Owlet',
  'African Barn Owl',
  'Nile Monitor',
  'Mwanza Rock Agama',
  'All Species',
];

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  task,
  onSave,
  onDelete,
  defaultStatus = 'todo',
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>(defaultStatus);
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [pillar, setPillar] = useState<TaskPillar>('research');
  const [species, setSpecies] = useState<AfricanOwlSpecies>('African Scops Owl');
  const [location, setLocation] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assigneeName, setAssigneeName] = useState('Dr. Joseph Kimaro');
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
      setPriority(task.priority);
      setPillar(task.pillar);
      setSpecies(task.species || 'African Scops Owl');
      setLocation(task.location || '');
      setDueDate(task.dueDate || '');
      setAssigneeName(task.assignee?.name || 'Dr. Joseph Kimaro');
      setSubtasks(task.subtasks || []);
      setTags(task.tags || []);
      setTagInput('');
    } else {
      setTitle('');
      setDescription('');
      setStatus(defaultStatus);
      setPriority('medium');
      setPillar('research');
      setSpecies('African Scops Owl');
      setLocation('Seronera River Corridor, Serengeti');
      setDueDate(new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10));
      setAssigneeName('Dr. Joseph Kimaro');
      setSubtasks([
        { id: 'st-' + Date.now() + '-1', title: 'Prepare equipment & check battery levels', completed: false },
      ]);
      setTags(['Field Work', 'Monitoring']);
      setTagInput('');
    }
  }, [task, defaultStatus, isOpen]);

  if (!isOpen) return null;

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    setSubtasks([
      ...subtasks,
      {
        id: 'st-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
        title: newSubtaskTitle.trim(),
        completed: false,
      },
    ]);
    setNewSubtaskTitle('');
  };

  const handleToggleSubtask = (id: string) => {
    setSubtasks(
      subtasks.map((st) => (st.id === id ? { ...st, completed: !st.completed } : st))
    );
  };

  const handleDeleteSubtask = (id: string) => {
    setSubtasks(subtasks.filter((st) => st.id !== id));
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = tagInput.trim().replace(/^,|,$/g, '');
      if (val && !tags.includes(val)) {
        setTags([...tags, val]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const matchedAssignee = PRESET_ASSIGNEES.find((a) => a.name === assigneeName) || {
      name: assigneeName,
      role: 'Team Member',
      avatarColor: '#4f46e5',
    };

    const updatedTask: Task = {
      id: task?.id || 'task-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      pillar,
      species,
      location: location.trim(),
      dueDate: dueDate || undefined,
      assignee: matchedAssignee,
      subtasks,
      tags,
      createdAt: task?.createdAt || Date.now(),
      updatedAt: Date.now(),
    };

    onSave(updatedTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-[#1c1a17] text-stone-100 rounded-2xl border border-stone-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#141311] border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className="text-[#e6f0cd] font-serif text-lg font-semibold">
              {task ? 'Edit Conservation Task' : 'New BRACA Task'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* Title */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-1">
              Task Title <span className="text-rose-400">*</span>
            </label>
            <input
              id="task-title-input"
              type="text"
              required
              placeholder="e.g. Inspect Station 08 Camera Trap footage"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#e6f0cd] focus:ring-1 focus:ring-[#e6f0cd]/30"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-1">
              Description & Field Notes
            </label>
            <textarea
              id="task-description-input"
              rows={3}
              placeholder="Add field coordinates, gear required, or sighting background..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-[#e6f0cd] focus:ring-1 focus:ring-[#e6f0cd]/30"
            />
          </div>

          {/* 3-Column Meta: Status, Priority, Pillar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Status */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-1">
                Status
              </label>
              <select
                id="task-status-select"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-stone-200 focus:outline-none focus:border-[#e6f0cd]"
              >
                <option value="backlog">Backlog / Ideas</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="review">In Review / Verification</option>
                <option value="done">Completed</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-1">
                Priority
              </label>
              <select
                id="task-priority-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-stone-200 focus:outline-none focus:border-[#e6f0cd]"
              >
                <option value="critical">🚨 Critical / Emergency</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {/* Pillar */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-1">
                Conservation Pillar
              </label>
              <select
                id="task-pillar-select"
                value={pillar}
                onChange={(e) => setPillar(e.target.value as TaskPillar)}
                className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-stone-200 focus:outline-none focus:border-[#e6f0cd]"
              >
                {PILLARS.map((p) => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 3-Column Meta: Species, Location, Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Species */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-1">
                Target Wildlife / Raptor Species
              </label>
              <select
                id="task-species-select"
                value={species}
                onChange={(e) => setSpecies(e.target.value as SmallCatSpecies)}
                className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-stone-200 focus:outline-none focus:border-[#C6A56A]"
              >
                {SPECIES_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-1">
                Habitat / Location
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Diyawanna Reeds, Colombo"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg pl-8 pr-3 py-2 text-stone-200 focus:outline-none focus:border-[#e6f0cd]"
                />
                <MapPin className="w-3.5 h-3.5 text-stone-500 absolute left-2.5 top-2.5" />
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-1">
                Due Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 rounded-lg pl-8 pr-3 py-2 text-stone-200 focus:outline-none focus:border-[#e6f0cd]"
                />
                <Calendar className="w-3.5 h-3.5 text-stone-500 absolute left-2.5 top-2.5" />
              </div>
            </div>
          </div>

          {/* Assignee Selection */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
              Team Member / Assignee
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PRESET_ASSIGNEES.map((assignee) => {
                const isSelected = assigneeName === assignee.name;
                return (
                  <button
                    key={assignee.name}
                    type="button"
                    onClick={() => setAssigneeName(assignee.name)}
                    className={`flex items-center space-x-2 p-2 rounded-lg border text-left transition-colors ${
                      isSelected
                        ? 'bg-[#163319]/40 border-[#e6f0cd]/70 text-white shadow-sm ring-1 ring-[#e6f0cd]/50'
                        : 'bg-stone-900 border-stone-800 text-stone-300 hover:border-stone-700'
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0 shadow-sm"
                      style={{ backgroundColor: assignee.avatarColor }}
                    >
                      {assignee.name[0]}
                    </div>
                    <div className="truncate">
                      <div className="font-medium truncate">{assignee.name}</div>
                      <div className="text-[10px] text-stone-400 truncate">{assignee.role}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subtasks / Checklist */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                Action Checklist ({subtasks.filter((s) => s.completed).length}/{subtasks.length})
              </label>
            </div>

            {/* List */}
            <div className="space-y-1.5 mb-2.5">
              {subtasks.map((st) => (
                <div
                  key={st.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-stone-900/90 border border-stone-800/80 group"
                >
                  <div
                    onClick={() => handleToggleSubtask(st.id)}
                    className="flex items-center space-x-2.5 cursor-pointer flex-1"
                  >
                    {st.completed ? (
                      <CheckSquare className="w-4 h-4 text-[#e6f0cd] flex-shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-stone-500 flex-shrink-0" />
                    )}
                    <span className={`text-xs ${st.completed ? 'line-through text-stone-500' : 'text-stone-200'}`}>
                      {st.title}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteSubtask(st.id)}
                    className="text-stone-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add subtask input */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Add subtask and press Enter..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddSubtask(e);
                  }
                }}
                className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-1.5 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-[#e6f0cd]"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="p-1.5 bg-stone-800 hover:bg-[#163319] text-stone-300 hover:text-[#e6f0cd] rounded-lg border border-stone-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
              Tags & Classifications
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.map((t) => (
                <span
                  key={t}
                  className="bg-stone-800 text-stone-300 px-2 py-0.5 rounded text-[11px] flex items-center space-x-1 border border-stone-700"
                >
                  <span>#{t}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    className="hover:text-rose-400 ml-1 text-stone-500"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Type tag and press Enter or comma..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-1.5 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-[#e6f0cd]"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-stone-800 flex items-center justify-between">
            {task && onDelete ? (
              <button
                id="delete-task-btn"
                type="button"
                onClick={() => {
                  if (confirm('Delete this task? All synced devices will reflect this change immediately.')) {
                    onDelete(task.id);
                    onClose();
                  }
                }}
                className="flex items-center space-x-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 px-3 py-2 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Task</span>
              </button>
            ) : (
              <div></div>
            )}

            <div className="flex items-center space-x-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-xs font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                id="save-task-submit-btn"
                type="submit"
                className="px-5 py-2 bg-[#C6A56A] hover:bg-[#d8b87d] text-[#101510] font-bold rounded-lg text-xs transition-all shadow-sm active:scale-95"
              >
                {task ? 'Save Changes' : 'Create & Broadcast'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
