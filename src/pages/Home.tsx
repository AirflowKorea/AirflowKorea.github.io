import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaArrowRight } from 'react-icons/fa';
import { useStats } from '../hooks/useData';

const Home = () => {
  const { t } = useTranslation(['home', 'common']);
  const { stats, loading, error } = useStats();
  
  const displayStats = stats || {
    MeetupMembers: 0,
    openChatMembers: 0,
    EventCounts: 0,
    contributors: 0
  };
  return (
    <div className="min-h-screen">
      {/* 히어로 섹션 */}
      <section className="airflow-gradient text-white">
        <div className="container-max section-padding">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              {t('heroTitle', { ns: 'home' })}
            </h1>
            <h2 className="text-2xl md:text-3xl mb-8 opacity-90">
              {t('heroSubtitle', { ns: 'home' })}
            </h2>
            <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed">
              {t('heroDescription', { ns: 'home' })}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/channels" 
                className="bg-airflow-orange hover:bg-orange-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors duration-200"
              >
                {t('joinButton', { ns: 'home' })}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 주요 활동 섹션 */}
      <section className="bg-gray-50 section-padding">
        <div className="container-max">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            {t('mainActivities', { ns: 'home' })}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200">
              <h3 className="text-xl font-bold mb-4 text-gray-800">{t('regularMeetups', { ns: 'home' })}</h3>
              <p className="text-gray-600">
                {t('regularMeetupsDesc', { ns: 'home' })}
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200">
              <h3 className="text-xl font-bold mb-4 text-gray-800">{t('knowledgeSharing', { ns: 'home' })}</h3>
              <p className="text-gray-600">
                {t('knowledgeSharingDesc', { ns: 'home' })}
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200">
              <h3 className="text-xl font-bold mb-4 text-gray-800">{t('opensource', { ns: 'home' })}</h3>
              <p className="text-gray-600">
                {t('opensourceDesc', { ns: 'home' })}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 커뮤니티 현황 섹션 */}
      <section className="section-padding">
        <div className="container-max">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            {t('communityStats', { ns: 'home' })}
          </h2>
          {error && (
            <div className="text-center mb-8 text-red-600">
              통계 데이터를 불러올 수 없습니다.
            </div>
          )}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="bg-gradient-to-br from-airflow-blue to-airflow-navy p-6 rounded-xl text-white">
              <div className="text-3xl font-bold mb-2">
                {loading ? '...' : `${displayStats.MeetupMembers.toLocaleString()}+`}
              </div>
              <div className="text-sm opacity-90">{t('MeetupMembers', { ns: 'home' })}</div>
            </div>
            <div className="bg-gradient-to-br from-airflow-green to-green-600 p-6 rounded-xl text-white">
              <div className="text-3xl font-bold mb-2">
                {loading ? '...' : `${displayStats.openChatMembers.toLocaleString()}+`}
              </div>
              <div className="text-sm opacity-90">{t('openKakaoMembers', { ns: 'home' })}</div>
            </div>
            <div className="bg-gradient-to-br from-airflow-orange to-red-500 p-6 rounded-xl text-white">
              <div className="text-3xl font-bold mb-2">
                {loading ? '...' : `${displayStats.EventCounts.toLocaleString()}+`}
              </div>
              <div className="text-sm opacity-90">{t('EventCounts', { ns: 'home' })}</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-6 rounded-xl text-white">
              <div className="text-3xl font-bold mb-2">
                {loading ? '...' : `${displayStats.contributors.toLocaleString()}+`}
              </div>
              <div className="text-sm opacity-90">{t('contributors', { ns: 'home' })}</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="bg-gray-800 text-white section-padding">
        <div className="container-max text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {t('getStarted', { ns: 'home' })}
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {t('getStartedDesc', { ns: 'home' })}
          </p>
          <Link 
            to="/channels" 
            className="inline-flex items-center gap-2 bg-airflow-blue hover:bg-blue-600 text-white px-10 py-4 rounded-lg text-lg font-semibold transition-colors duration-200"
          >
            {t('common.joinUs', { ns: 'common' })} <FaArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home; 