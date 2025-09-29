import { useState, useMemo, useEffect } from 'react';
import { useOrganizers } from '../hooks/useData';
import type { Organizer } from '../types';
import { useTranslation } from 'react-i18next';
import {
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const OrganizerCard = ({ organizer }: { organizer: Organizer }) => {
  const { t } = useTranslation('organizers');

  // GitHub 아이디로 자동 avatar URL 생성
  const avatarUrl =
    organizer.avatar_url ||
    (organizer.github ? `https://github.com/${organizer.github}.png` : null);

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 overflow-hidden">
      <div className="p-6 text-center">
        {/* 프로필 이미지 */}
        <div className="w-24 h-24 mx-auto mb-4">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={`${organizer.name} 프로필`}
              className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
              onError={e => {
                // 이미지 로드 실패 시 기본 아바타로 대체
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
          ) : null}
          {/* 기본 아바타 (이미지가 없거나 로드 실패 시) */}
          <div
            className={`w-full h-full bg-gradient-to-br from-airflow-blue to-airflow-navy rounded-full flex items-center justify-center text-white text-2xl font-bold ${avatarUrl ? 'hidden' : 'flex'}`}
          >
            {organizer.name.charAt(0)}
          </div>
        </div>

        {/* 기본 정보 */}
        <h3 className="text-xl font-bold mb-2 text-gray-800">
          {organizer.name}
        </h3>
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-gray-600">{organizer.role}</span>
        </div>

        {/* 연락처 링크 */}
        <div className="flex justify-center gap-3">
          {organizer.email && (
            <a
              href={`mailto:${organizer.email}`}
              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200"
              title={t('common.email')}
            >
              <FaEnvelope className="h-5 w-5 text-gray-600" />
            </a>
          )}
          {organizer.github && (
            <a
              href={`https://github.com/${organizer.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200"
              title={t('common.github')}
            >
              <FaGithub className="h-5 w-5 text-gray-600" />
            </a>
          )}
          {organizer.linkedIn && (
            <a
              href={`https://linkedin.com/in/${organizer.linkedIn}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200"
              title={t('common.linkedin')}
            >
              <FaLinkedin className="h-5 w-5 text-gray-600" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const Organizers = () => {
  const { organizers, recruitment, loading, error } = useOrganizers();
  const { t } = useTranslation('organizers');

  // 기수별로 분류하고 정렬
  const generationsList = useMemo(() => {
    const generations = [...new Set(organizers.map(org => org.generation))];
    return generations.sort((a, b) => b - a);
  }, [organizers]);

  const [selectedGeneration, setSelectedGeneration] = useState<number>(1);

  useEffect(() => {
    if (generationsList.length > 0) {
      setSelectedGeneration(generationsList[0]);
    }
  }, [generationsList]);

  const filteredOrganizers = useMemo(() => {
    return organizers.filter(org => org.generation === selectedGeneration);
  }, [organizers, selectedGeneration]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-airflow-blue mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  // recruitment 정보에 따라 링크 결정
  const recruitmentHref = recruitment?.is_recruiting
    ? recruitment.application_url
    : `mailto:${recruitment?.contact_email}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {error && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
          <p>{error}</p>
        </div>
      )}

      {/* 페이지 헤더 */}
      <section className="airflow-gradient text-white section-padding">
        <div className="container-max text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('title')}</h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* 운영진 소개 */}
      <section className="section-padding">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">
              {t('intro.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              {t('intro.description')}
            </p>

            {/* 기수 필터 버튼 */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
              <div className="flex items-center gap-2">
                <FunnelIcon className="h-5 w-5 text-gray-600" />
                <span className="text-gray-600 font-medium">기수별 보기:</span>
              </div>
              {generationsList.map(gen => (
                <button
                  key={gen}
                  onClick={() => setSelectedGeneration(gen)}
                  className={`px-4 py-2 rounded-full font-medium transition-colors duration-200 ${
                    selectedGeneration === gen
                      ? 'bg-airflow-blue text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {gen}기
                </button>
              ))}
            </div>
          </div>

          {/* 필터링 결과 수 표시 */}
          <div className="text-center mb-8">
            <p className="text-gray-600">
              {selectedGeneration}기에 {filteredOrganizers.length}명의 운영진이
              활동했습니다.
            </p>
          </div>

          {/* 운영진 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredOrganizers.map((organizer: Organizer) => (
              <OrganizerCard key={organizer.id} organizer={organizer} />
            ))}
          </div>
        </div>
      </section>

      {/* 운영진이 하는 일 */}
      <section className="bg-white section-padding">
        <div className="container-max">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            {t('roles.title')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-airflow-blue rounded-full mx-auto mb-4 flex items-center justify-center text-white">
                <CalendarIcon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">
                {t('roles.event.title')}
              </h3>
              <p className="text-gray-600">{t('roles.event.description')}</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-airflow-green rounded-full mx-auto mb-4 flex items-center justify-center text-white">
                <ChatBubbleLeftRightIcon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">
                {t('roles.community.title')}
              </h3>
              <p className="text-gray-600">
                {t('roles.community.description')}
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-airflow-orange rounded-full mx-auto mb-4 flex items-center justify-center text-white">
                <UserGroupIcon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">
                {t('roles.content.title')}
              </h3>
              <p className="text-gray-600">{t('roles.content.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 운영진 모집 */}
      <section className="bg-airflow-navy text-white section-padding">
        <div className="container-max text-center">
          <h2 className="text-3xl font-bold mb-6">{t('recruitment.title')}</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {t('recruitment.description')}
          </p>
          <a
            href={recruitmentHref}
            className="bg-airflow-orange hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold transition-colors duration-200"
          >
            {t('recruitment.button')}
          </a>
        </div>
      </section>
    </div>
  );
};

export default Organizers;
