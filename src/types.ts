export type TaskStatus = 'backlog' | 'todo' | 'in-progress' | 'review' | 'done';
export type TaskPriority = 'critical' | 'high' | 'medium' | 'low';
export type TaskPillar = 'research' | 'habitat' | 'acoustics' | 'sightings' | 'community' | 'census';
export type AfricanOwlSpecies =
  | 'African Scops Owl'
  | 'Spotted Eagle-Owl'
  | 'Verreaux’s Eagle-Owl'
  | 'Pearl-Spotted Owlet'
  | 'African Barn Owl'
  | 'Chestnut-backed Owlet'
  | 'Sri Lanka Bay Owl'
  | 'Indian Scops Owl'
  | 'Brown Fish Owl'
  | 'Serendib Scops Owl'
  | 'Nile Monitor'
  | 'Mwanza Rock Agama'
  | 'All Species'
  | (string & {});

// Keep legacy alias for backward compatibility with existing components
export type SmallCatSpecies = AfricanOwlSpecies;

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Assignee {
  name: string;
  role: string;
  avatarColor: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  pillar: TaskPillar;
  species?: AfricanOwlSpecies;
  location?: string;
  assignee?: Assignee;
  dueDate?: string; // YYYY-MM-DD
  subtasks: Subtask[];
  tags: string[];
  createdAt: number;
  updatedAt: number;
  lastUpdatedByDevice?: string;
}

export interface DevicePresence {
  id: string;
  name: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  joinedAt: number;
  lastSeen: number;
  isCurrent: boolean;
}

export type SyncStatus = 'connected' | 'syncing' | 'offline' | 'reconnecting';

export interface SyncMessage {
  id: string;
  type: 'SYNC_ALL' | 'TASK_UPSERT' | 'TASK_DELETE' | 'DEVICE_PING' | 'ROOM_REQUEST';
  senderId: string;
  senderDeviceName: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  roomId: string;
  timestamp: number;
  payload: any;
}

export type ViewMode = 'webpage' | 'board' | 'list' | 'timeline' | 'sync-center';

export interface OwlSpeciesData {
  id: string;
  commonName: string;
  scientificName: string;
  swahiliName?: string;
  sinhalaName?: string;
  family: string;
  size: string;
  wingspan: string;
  image: string;
  diet: string;
  habitat: string;
  identification: string;
  behavior: string;
  vocalizations: string;
  conservationStatus: string;
  isEndemicToAfrica?: boolean;
  isEndemicToSriLanka?: boolean;
  serengetiPresence?: string;
  distribution?: string;
  keyAdaptation: string;
  doi?: string | null;
}

export interface HabitatData {
  id: string;
  name: string;
  swahiliName?: string;
  description: string;
  serengetiLocation: string;
  roostingOpportunities: string;
  ecologicalContext: string;
  residentSpecies: string[];
  characteristicFlora: string;
}

export interface FieldArticle {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  image: string;
  excerpt: string;
  content: string[];
  keyTakeaways: string[];
  scientificRef?: string;
}
