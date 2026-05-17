import * as yaml from 'js-yaml';
import type {
  Organizer,
  OBSupporter,
  Contributor,
  CommunityChannel,
  CommunityStats,
  Recruitment,
} from '../types';

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

// 현재 YYYY-MM 문자열 반환 (OB 만료 비교용)
function currentYearMonth(): string {
  return new Date().toISOString().slice(0, 7);
}

// 운영진 데이터 로드
export async function loadOrganizersData(): Promise<{
  organizers: Organizer[];
  obSupporters: OBSupporter[];
  recruitment: Recruitment;
}> {
  const data = await loadYamlFile('/data/organizers.yaml');
  const organizers: Organizer[] = [];

  const organizersData = data.organizers as Record<
    string,
    Record<string, unknown>[]
  >;

  Object.keys(organizersData).forEach(generationKey => {
    if (generationKey.startsWith('generation_')) {
      const generationOrganizers = organizersData[generationKey].map(org => ({
        ...org,
        generation: Number(org.generation), // string을 number로 변환
      })) as Organizer[];
      organizers.push(...generationOrganizers);
    }
  });

  // OB 서포터: term_end가 지난 경우 자동 숨김 (YYYY-MM 문자열 비교)
  // YAML 파서가 'YYYY-MM' 값을 다른 타입으로 해석할 수 있어 명시적으로 문자열 변환
  const today = currentYearMonth();
  const rawOB = (data.ob_supporters as OBSupporter[] | undefined) ?? [];
  const obSupporters = rawOB
    .map(ob => ({
      ...ob,
      term_start: String(ob.term_start),
      term_end: String(ob.term_end),
    }))
    .filter(ob => ob.term_end >= today);

  // recruitment 정보 추출
  const recruitment = data.recruitment as Recruitment;

  return { organizers, obSupporters, recruitment };
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
  return (
    (data.stats as CommunityStats) || {
      MeetupMembers: 0,
      openChatMembers: 0,
      EventCounts: 0,
      contributors: 0,
    }
  );
}

// 데이터를 모두 로드
export async function loadAllData() {
  try {
    const [organizerData, contributors, channels, stats] = await Promise.all([
      loadOrganizersData(),
      loadContributorsData(),
      loadChannelsData(),
      loadStatsData(),
    ]);

    return {
      organizers: organizerData.organizers,
      obSupporters: organizerData.obSupporters,
      recruitment: organizerData.recruitment,
      contributors,
      channels,
      stats,
    };
  } catch (error) {
    console.error('Error loading data:', error);
    throw error;
  }
}
