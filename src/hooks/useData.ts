import { useState, useEffect } from 'react';
import type { Event, Organizer, Contributor, CommunityChannel, CommunityStats } from '../types';
import { loadAllData } from '../utils/dataLoader';

interface DataState {
  events: {
    upcoming: Event[];
    past: Event[];
  };
  organizers: Organizer[];
  contributors: Contributor[];
  channels: CommunityChannel[];
  stats: CommunityStats;
  loading: boolean;
  error: string | null;
}

export function useData(): DataState {
  const [state, setState] = useState<DataState>({
    events: {
      upcoming: [],
      past: []
    },
    organizers: [],
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
            events: data.events,
            organizers: data.organizers,
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
export function useEvents() {
  const { events, loading, error } = useData();
  return { ...events, loading, error };
}

export function useOrganizers() {
  const { organizers, loading, error } = useData();
  return { organizers, loading, error };
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