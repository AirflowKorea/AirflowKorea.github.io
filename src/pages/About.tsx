import { useStats } from '../hooks/useData';
import { FaCalendar, FaUsers, FaTrophy, FaHandshake, FaBookOpen, FaStar, FaGlobe } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { stats, loading, error } = useStats();
  const { t } = useTranslation('about');

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
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {t('title')}
          </h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* 미션 & 비전 */}
      <section className="section-padding">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h2 className="text-3xl font-bold mb-6 text-airflow-navy">{t('mission.title')}</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                {t('mission.description')}
              </p>
              <ul className="space-y-3 text-gray-600">
                {(t('mission.items', { returnObjects: true }) as string[]).map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-airflow-blue mr-2">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h2 className="text-3xl font-bold mb-6 text-airflow-navy">{t('vision.title')}</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                {t('vision.description')}
              </p>
              <ul className="space-y-3 text-gray-600">
                {(t('vision.items', { returnObjects: true }) as string[]).map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-airflow-green mr-2">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 주요 활동 상세 */}
      <section className="bg-white section-padding">
        <div className="container-max">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            {t('activities.title')}
          </h2>
          
          <div className="space-y-12">
            {/* 정기 밋업 */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2">
                <h3 className="text-2xl font-bold mb-4 text-airflow-navy">{t('activities.meetup.title')}</h3>
                <p className="text-gray-700 mb-4">
                  {t('activities.meetup.description')}
                </p>
                <ul className="space-y-2 text-gray-600">
                  {(t('activities.meetup.items', { returnObjects: true }) as string[]).map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
              </div>
              <div className="md:w-1/2 bg-gray-100 p-8 rounded-xl">
                <div className="text-6xl text-center mb-4 flex justify-center text-blue-600"><FaCalendar /></div>
                <div className="text-center text-gray-600">
                  {t('activities.meetup.stats', { count: stats.EventCounts })}
                </div>
              </div>
            </div>

            {/* 스터디 그룹 */}
            <div className="flex flex-col md:flex-row-reverse items-center gap-8">
              <div className="md:w-1/2">
                <h3 className="text-2xl font-bold mb-4 text-airflow-navy">{t('activities.study.title')}</h3>
                <p className="text-gray-700 mb-4">
                  {t('activities.study.description')}
                </p>
                <ul className="space-y-2 text-gray-600">
                  {(t('activities.study.items', { returnObjects: true }) as string[]).map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
              </div>
              <div className="md:w-1/2 bg-gray-100 p-8 rounded-xl">
                <div className="text-6xl text-center mb-4 flex justify-center text-green-600"><FaUsers /></div>
                <div className="text-center text-gray-600">
                  {t('activities.study.stats', { count: stats.studyGroups })}
                </div>
              </div>
            </div>

            {/* 오픈소스 기여 */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2">
                <h3 className="text-2xl font-bold mb-4 text-airflow-navy">{t('activities.opensource.title')}</h3>
                <p className="text-gray-700 mb-4">
                  {t('activities.opensource.description')}
                </p>
                <ul className="space-y-2 text-gray-600">
                  {(t('activities.opensource.items', { returnObjects: true }) as string[]).map((item, index) => (
                    <li key={index}>• {item}</li>
                  ))}
                </ul>
              </div>
              <div className="md:w-1/2 bg-gray-100 p-8 rounded-xl">
                <div className="text-6xl text-center mb-4 flex justify-center text-yellow-600"><FaTrophy /></div>
                <div className="text-center text-gray-600">
                  {t('activities.opensource.stats', { count: stats.contributors })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 커뮤니티 가치 */}
      <section className="bg-gray-100 section-padding">
        <div className="container-max">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
            {t('values.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="text-4xl mb-4 flex justify-center text-blue-600"><FaHandshake /></div>
              <h3 className="text-lg font-bold mb-2">{t('values.cooperation.title')}</h3>
              <p className="text-gray-600 text-sm">{t('values.cooperation.description')}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="text-4xl mb-4 flex justify-center text-green-600"><FaBookOpen /></div>
              <h3 className="text-lg font-bold mb-2">{t('values.learning.title')}</h3>
              <p className="text-gray-600 text-sm">{t('values.learning.description')}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="text-4xl mb-4 flex justify-center text-yellow-600"><FaStar /></div>
              <h3 className="text-lg font-bold mb-2">{t('values.innovation.title')}</h3>
              <p className="text-gray-600 text-sm">{t('values.innovation.description')}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="text-4xl mb-4 flex justify-center text-purple-600"><FaGlobe /></div>
              <h3 className="text-lg font-bold mb-2">{t('values.openness.title')}</h3>
              <p className="text-gray-600 text-sm">{t('values.openness.description')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About; 