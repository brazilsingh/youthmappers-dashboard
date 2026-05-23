export type TaskingManagerSource = 'HOT' | 'TeachOSM';

export type ProjectStatus = 'Active' | 'Almost Completed' | 'Needs Validation' | 'Fully Validated';

export interface Project {
  id: string;
  projectId: string; // The original ID from the manager (e.g. HOT #12040)
  title: string;
  description: string;
  source: TaskingManagerSource;
  status: ProjectStatus;
  percentMapped: number;
  percentValidated: number;
  totalTasks: number;
  mappedTasks: number;
  validatedTasks: number;
  campaign: string;
  url: string;
  lastUpdated: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  country: string;
}

export type UserRole = 'Admin' | 'Validator' | 'Mapper' | 'Guest';

export interface UserProfile {
  name: string;
  email: string;
  role: UserRole;
  isApproved: boolean;
  avatarUrl?: string;
  chapter?: string;
  encryptionPublicKey?: string; // Shows on-screen details for compliance with E2E safety representation
}

export interface ContributorRanking {
  rank: number;
  name: string;
  chapter: string;
  mappedCount: number;
  validatedCount: number;
  score: number; // calculated engagement score
  badges: string[];
}

export interface ActivityChange {
  id: string;
  projectId: string;
  projectTitle: string;
  user: string;
  action: 'Mapped' | 'Validated' | 'Reverted' | 'Approved Role' | 'System Sync';
  count: number;
  timestamp: string;
  source: TaskingManagerSource;
}

export interface SystemAlert {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'success' | 'alert';
  unread: boolean;
}

export interface APIDocEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  headers?: Record<string, string>;
  requestBody?: string;
  responseBody: string;
}
