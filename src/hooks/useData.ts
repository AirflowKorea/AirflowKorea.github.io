import { useState, useEffect } from 'react';
import type { Organizer, Contributor, CommunityChannel, CommunityStats, Recruitment } from '../types';
import { loadAllData } from '../utils/dataLoader';

interface DataState {
  organizers: Organizer[];
  recruitment: Recruitment;
  contributors: Contributor[];
  channels: CommunityChannel[];
  stats: CommunityStats;
  loading: boolean;
  error: string | null;
}

export function useData(): DataState {
  const [state, setState] = useState<DataState>({
    organizers: [],
    recruitment: {
      is_recruiting: false,
      application_url: '',
      contact_email: ''
    },
    contributors: [],
    channels: [],
    stats: {
      MeetupMembers: 0,
      openChatMembers: 0,
      EventCounts: 0,
      contributors: 0,
      studyGroups: 0
    },
    loading: true,
    error: null
  });

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        const data = await loadAllData();
        
        if (mounted) {
          setState({
            organizers: data.organizers,
            recruitment: data.recruitment,
            contributors: data.contributors,
            channels: data.channels,
            stats: data.stats,
            loading: false,
            error: null
          });
        }
      } catch (error) {
        console.error('YAML 데이터 로드 실패:', error);
        
        if (mounted) {
          setState(prev => ({
            ...prev,
            loading: false,
            error: 'YAML 데이터 로드에 실패했습니다.'
          }));
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  return state;
}

// 개별 데이터 타입별 Hook들
export function useOrganizers() {
  const { organizers, recruitment, loading, error } = useData();
  return { organizers, recruitment, loading, error };
}

export function useContributors() {
  const { contributors, loading, error } = useData();
  return { contributors, loading, error };
}

export function useChannels() {
  const { channels, loading, error } = useData();
  return { channels, loading, error };
}

export function useStats() {
  const { stats, loading, error } = useData();
  return { stats, loading, error };
} 