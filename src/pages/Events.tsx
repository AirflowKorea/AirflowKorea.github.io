import { useTranslation } from 'react-i18next';
import {
  CalendarIcon,
  UserGroupIcon,
  MapPinIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

const Events = () => {
  const { t } = useTranslation('events');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 페이지 헤더 */}
      <section className="airflow-gradient text-white section-padding">
        <div className="container-max text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('title')}</h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Meetup 메인 섹션 */}
      <section className="section-padding">
        <div className="container-max">
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-airflow-blue rounded-full mx-auto mb-6 flex items-center justify-center">
              <UserGroupIcon className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-gray-800">
              {t('meetup.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              {t('meetup.description')}
            </p>

            <a
              href="https://www.meetup.com/korea-apache-airflow-user-group/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-airflow-blue hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              {t('meetup.button')} →
            </a>
          </div>

          {/* 이벤트 정보 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="w-12 h-12 bg-airflow-blue rounded-full mx-auto mb-4 flex items-center justify-center">
                <CalendarIcon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold mb-2">
                {t('features.regularMeetup.title')}
              </h3>
              <p className="text-gray-600 text-sm">
                {t('features.regularMeetup.description')}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="w-12 h-12 bg-airflow-green rounded-full mx-auto mb-4 flex items-center justify-center">
                <MapPinIcon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold mb-2">
                {t('features.offlineMeeting.title')}
              </h3>
              <p className="text-gray-600 text-sm">
                {t('features.offlineMeeting.description')}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="w-12 h-12 bg-airflow-orange rounded-full mx-auto mb-4 flex items-center justify-center">
                <UserGroupIcon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold mb-2">
                {t('features.networking.title')}
              </h3>
              <p className="text-gray-600 text-sm">
                {t('features.networking.description')}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <ClockIcon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-bold mb-2">
                {t('features.notifications.title')}
              </h3>
              <p className="text-gray-600 text-sm">
                {t('features.notifications.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 이벤트 참여 방법 */}
      <section className="bg-gray-100 section-padding">
        <div className="container-max">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            {t('participation.title')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(
              t('participation.steps', { returnObjects: true }) as Array<{
                icon: string;
                title: string;
                description: string;
              }>
            ).map((step, index) => (
              <div key={index} className="bg-white p-6 rounded-xl text-center">
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 발표자 모집 섹션 */}
      <section className="bg-airflow-navy text-white section-padding">
        <div className="container-max text-center">
          <h2 className="text-3xl font-bold mb-6">{t('speakers.title')}</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {t('speakers.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://forms.gle/GLwpKSqgNxsShdH49"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-airflow-orange hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold transition-colors duration-200"
            >
              {t('speakers.proposalButton')}
            </a>
            <a
              href="mailto:contact@airflow-kr.org"
              className="bg-transparent border-2 border-white hover:bg-white hover:text-airflow-navy text-white px-8 py-4 rounded-lg font-semibold transition-all duration-200"
            >
              {t('speakers.contactButton')}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Events;
