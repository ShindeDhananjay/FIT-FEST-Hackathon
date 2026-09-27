// Fit Fest Types & Models
export interface UserProfile {
  id: string;
  name: string;
  avatarUrl?: string;
  streakDays?: number;
  points?: number;
}

export interface HackathonMetadata {
  projectName: string;
  description: string;
  version: string;
}
