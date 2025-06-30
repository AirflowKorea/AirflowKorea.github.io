import * as yaml from 'js-yaml';
import type { Event, Organizer, Contributor, CommunityChannel, CommunityStats } from '../types';

// YAML 파일 로드
async function loadYamlFile(path: string): Promise<Record<string, unknown>> {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to load ${path}: ${response.statusText}`);
    }
    const text = await response.text();
    const result = yaml.load(text);
    return result as Record<string, unknown>;
  } catch (error) {
    console.error(`Error loading YAML file ${path}:`, error);
    throw error;
  }
}

// 이벤트 데이터 로드
export async function loadEventsData(): Promise<{ upcoming: Event[]; past: Event[] }> {
  const data = await loadYamlFile('/data/events.yaml');
  return {
    upcoming: (data.upcoming_events as Event[]) || [],
    past: (data.past_events as Event[]) || []
  };
}

// 운영진 데이터 로드
export async function loadOrganizersData(): Promise<Organizer[]> {
  const data = await loadYamlFile('/data/organizers.yaml');
  const organizers: Organizer[] = [];
  
  const organizersData = data.organizers as Record<string, Record<string, unknown>[]>;
  
  Object.keys(organizersData).forEach(generationKey => {
    if (generationKey.startsWith('generation_')) {
      const generationOrganizers = organizersData[generationKey].map(org => ({
        ...org,
        generation: Number(org.generation) // string을 number로 변환
      })) as Organizer[];
      organizers.push(...generationOrganizers);
    }
  });
  
  return organizers;
}

// 기여자 데이터 로드
export async function loadContributorsData(): Promise<Contributor[]> {
  const data = await loadYamlFile('/data/contributors.yaml');
  return (data.contributors as Contributor[]) || [];
}

// 커뮤니티 채널 데이터 로드
export async function loadChannelsData(): Promise<CommunityChannel[]> {
  const data = await loadYamlFile('/data/channels.yaml');
  return (data.channels as CommunityChannel[]) || [];
}

// 커뮤니티 통계 데이터 로드
export async function loadStatsData(): Promise<CommunityStats> {
  const data = await loadYamlFile('/data/stats.yaml');
  return (data.stats as CommunityStats) || {
    MeetupMembers: 0,
    openChatMembers: 0,
    EventCounts: 0,
    contributors: 0
  };
}

// 데이터를 모두 로드
export async function loadAllData() {
  try {
    const [events, organizers, contributors, channels, stats] = await Promise.all([
      loadEventsData(),
      loadOrganizersData(),
      loadContributorsData(),
      loadChannelsData(),
      loadStatsData()
    ]);

    return {
      events,
      organizers,
      contributors,
      channels,
      stats
    };
  } catch (error) {
    console.error('Error loading data:', error);
    throw error;
  }
} 