import { useEvents } from '../hooks/useData';
import type { Event } from '../types';
import { useTranslation } from 'react-i18next';
import { MapPinIcon, CalendarIcon } from '@heroicons/react/24/outline';

const EventCard = ({ event }: { event: Event }) => {
  const { t } = useTranslation('events');
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const getEventTypeStyle = (type: Event['type']) => {
    switch (type) {
      case 'meetup':
        return 'bg-airflow-blue text-white';
      case 'seminar':
        return 'bg-airflow-green text-white';
	  case 'workshop':
        return 'bg-airflow-orange text-white';
      case 'study':
        return 'bg-airflow-orange text-white';
      case 'online':
        return 'bg-purple-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getEventTypeLabel = (type: Event['type']) => {
    return t(`types.${type}`) || type;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getEventTypeStyle(event.type)}`}>
            {getEventTypeLabel(event.type)}
          </span>
          <span className="text-gray-500 text-sm">{formatDate(event.date)}</span>
        </div>
        
        <h3 className="text-xl font-bold mb-3 text-gray-800">{event.title}</h3>
        <p className="text-gray-600 mb-4 leading-relaxed">{event.description}</p>
        
        <div className="flex items-center text-gray-500 mb-4">
                      <MapPinIcon className="h-4 w-4 mr-2" />
          <span>{event.location}</span>
        </div>
        
        <div className="flex gap-3">
          {event.registrationUrl && (
            <a
              href={event.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-airflow-blue hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              {t('common.register')}
            </a>
          )}
          {event.presentationUrl && (
            <a
              href={event.presentationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              {t('common.presentation')}
            </a>
          )}
          {event.videoUrl && (
            <a
              href={event.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              {t('common.video')}
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const Events = () => {
  const { upcoming: upcomingEvents, past: pastEvents, loading, error } = useEvents();
  const { t } = useTranslation('events');

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

      {/* 예정된 이벤트 */}
      <section className="section-padding">
        <div className="container-max">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800">{t('upcoming.title')}</h2>
            <span className="text-airflow-blue font-semibold">
              {t('upcoming.count', { count: upcomingEvents.length })}
            </span>
          </div>
          
          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event: Event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-xl text-center">
              <div className="mb-4 flex justify-center">
            <CalendarIcon className="h-16 w-16 text-gray-600" />
          </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">{t('upcoming.empty.title')}</h3>
              <p className="text-gray-600">
                {t('upcoming.empty.description')}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 지난 이벤트 아카이브 */}
      <section className="bg-white section-padding">
        <div className="container-max">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800">{t('past.title')}</h2>
            <span className="text-gray-600">
              {t('past.count', { count: pastEvents.length })}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastEvents.map((event: Event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>

      {/* 이벤트 참여 안내 */}
      <section className="bg-gray-100 section-padding">
        <div className="container-max">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            {t('participation.title')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(t('participation.steps', { returnObjects: true }) as Array<{icon: string, title: string, description: string}>).map((step, index) => (
              <div key={index} className="bg-white p-6 rounded-xl text-center">
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 발표자 모집 */}
      <section className="bg-airflow-navy text-white section-padding">
        <div className="container-max text-center">
          <h2 className="text-3xl font-bold mb-6">{t('speakers.title')}</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {t('speakers.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:speakers@airflowkrug.org" 
              className="bg-airflow-orange hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold transition-colors duration-200"
            >
              {t('speakers.proposalButton')}
            </a>
            <a 
              href="/channels" 
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