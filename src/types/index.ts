// 이벤트 관련 타입
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  type: 'meetup' | 'seminar' | 'workshop' | 'study' | 'online';
  registrationUrl?: string;
  presentationUrl?: string;
  videoUrl?: string;
}

// 운영진 관련 타입
export interface Organizer {
  id: string;
  name: string;
  role: string;
  generation: number;
  avatar_url?: string;
  linkedIn?: string;
  github?: string;
  email?: string;
}

// 운영진 모집 관련 타입
export interface Recruitment {
  is_recruiting: boolean;
  application_url: string;
  contact_email: string;
}

// 기여자 관련 타입
export interface Contributor {
  id: string;
  name: string;
  githubUsername: string;
  contributions: string[];
  githubUrl: string;
  avatarUrl?: string;
  prCount?: number;
  lastUpdated?: string;
}

// 커뮤니티 채널 관련 타입
export interface CommunityChannel {
  id: string;
  name: string;
  platform: string;
  type: 'forum' | 'chat' | 'social' | 'video';
  url: string;
  description: string;
  memberCount?: number;
}

// 커뮤니티 통계 관련 타입
export interface CommunityStats {
  MeetupMembers: number;
  openChatMembers: number;
  EventCounts: number;
  contributors: number;
  studyGroups: number;
} 