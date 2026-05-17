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

// OB 서포터 관련 타입
// - from_generations: 출신 기수 목록 (e.g. [1, 2])
// - term_start / term_end: OB 활동 기간 (YYYY-MM)
export interface OBSupporter {
  id: string;
  name: string;
  from_generations: number[];
  term_start: string;
  term_end: string;
  avatar_url?: string;
  linkedIn?: string;
  github?: string;
  email?: string;
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
