import { 
  FaComments, 
  FaSlack,
  FaGithub,
  FaDiscourse,
  FaMeetup,
  FaLinkedin 
} from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation('common');
  return (
    <footer className="bg-airflow-navy text-white">
      <div className="container-max section-padding">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 모임 정보 */}
          <div>
            <h3 className="text-xl font-bold mb-4">{t('footer.title')}</h3>
            <p className="text-gray-300 mb-6">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://open.kakao.com/o/gM4hR8Pg" 
                className="text-gray-300 hover:text-white transition-colors flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaComments className="h-4 w-4" />
              </a>
              <a 
                href="https://discourse.airflow-kr.org" 
                className="text-gray-300 hover:text-white transition-colors flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaDiscourse className="h-4 w-4" />
              </a>
              <a 
                href="https://www.meetup.com/korea-apache-airflow-user-group" 
                className="text-gray-300 hover:text-white transition-colors flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaMeetup className="h-4 w-4" />
              </a>
              <a 
                href="https://join.slack.com/t/apache-airflow/shared_invite/zt-2i1a0xp1i-nIy8Y6Iisa6pp3QhVKR9pA" 
                className="text-gray-300 hover:text-white transition-colors flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaSlack className="h-4 w-4" />
              </a>
              <a 
                href="https://www.linkedin.com/company/100898775" 
                className="text-gray-300 hover:text-white transition-colors flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin className="h-4 w-4" />
              </a>
              <a 
                href="https://github.com/AirflowKorea" 
                className="text-gray-300 hover:text-white transition-colors flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub className="h-4 w-4" />
              </a>
            </div>
          </div>
          
          {/* 빠른 링크 */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-3">
              <li>
                <a href="/about" className="text-gray-300 hover:text-white transition-colors block">
                  {t('nav.about')}
                </a>
              </li>
              <li>
                <a href="/events" className="text-gray-300 hover:text-white transition-colors block">
                  {t('nav.events')}
                </a>
              </li>
              <li>
                <a href="/organizers" className="text-gray-300 hover:text-white transition-colors block">
                  {t('nav.organizers')}
                </a>
              </li>
              <li>
                <a href="/channels" className="text-gray-300 hover:text-white transition-colors block">
                  {t('nav.channels')}
                </a>
              </li>
            </ul>
          </div>

          {/* 연락처 정보 */}
          <div>
            <h4 className="text-lg font-semibold mb-4">연락처</h4>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-400 mb-1">이메일</p>
                <a 
                  href="mailto:contact@airflow-kr.org" 
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  contact@airflow-kr.org
                </a>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">커뮤니티</p>
                <p className="text-gray-300 text-sm">
                  Airflow 한국 사용자 모임
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            {t('footer.copyright')}
          </p>
          <p className="text-gray-500 text-sm mt-2">
            {t('footer.trademark')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 