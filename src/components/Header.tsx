import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UserIcon, TrophyIcon } from '@heroicons/react/24/outline';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation('common');

  const isActive = (path: string) => location.pathname === path;

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const menuItems = [
    { path: '/', label: t('nav.home') },
    { path: '/about', label: t('nav.about') },
    { path: '/events', label: t('nav.events') },
    { path: '/channels', label: t('nav.channels') },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container-max">
        <div className="flex justify-between items-center py-4 px-6">
          {/* 로고 */}
          <Link to="/" className="flex items-center group focus:outline-none">
            <img 
              src={i18n.language === 'ko' ? '/images/airflow_krug_kr.png' : '/images/airflow_krug_en.png'}
              alt={i18n.language === 'ko' ? 'Apache Airflow 한국사용자모임' : 'Apache Airflow Korea User Group'}
              className="h-12 w-auto group-hover:scale-105 transition-transform duration-200"
            />
          </Link>
          
          {/* 데스크톱 네비게이션 */}
          <div className="hidden md:flex items-center space-x-3">
            <nav className="flex items-center space-x-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-primary-cyan text-white'
                      : 'text-gray-600 hover:text-primary-cyan hover:bg-cyan-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* 추가 메뉴 드롭다운 */}
              <div className="relative group">
                <button className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-primary-cyan hover:bg-cyan-50 transition-all duration-200 flex items-center space-x-1">
                  <span>{t('nav.more')}</span>
                  <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* 드롭다운 메뉴 */}
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    <Link
                      to="/organizers"
                      className="block px-4 py-2 text-sm text-gray-600 hover:text-primary-cyan hover:bg-cyan-50 transition-colors"
                    >
                      <span className="flex items-center gap-1">
                        <UserIcon className="h-4 w-4" />
                        {t('nav.organizers')}
                      </span>
                    </Link>
                    <Link
                      to="/contributors"
                      className="block px-4 py-2 text-sm text-gray-600 hover:text-primary-cyan hover:bg-cyan-50 transition-colors"
                    >
                      <span className="flex items-center gap-1">
                        <TrophyIcon className="h-4 w-4" />
                        {t('nav.contributors')}
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </nav>
            
            {/* 언어 변경 버튼 */}
            <div className="flex items-center space-x-1 border-l border-gray-200 pl-3">
              <button
                onClick={() => changeLanguage('ko')}
                className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                  i18n.language === 'ko' ? 'bg-primary-cyan text-white' : 'text-gray-600 hover:text-primary-cyan'
                }`}
              >
                한국어
              </button>
              <button
                onClick={() => changeLanguage('en')}
                className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                  i18n.language === 'en' ? 'bg-primary-cyan text-white' : 'text-gray-600 hover:text-primary-cyan'
                }`}
              >
                English
              </button>
            </div>
          </div>
          
          {/* 모바일 메뉴 버튼 */}
          <button 
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg 
              className={`w-6 h-6 transition-transform duration-200 ${isMobileMenuOpen ? 'rotate-90' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        
        {/* 모바일 메뉴 */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <nav className="py-4 px-6 space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary-cyan text-white'
                      : 'text-gray-600 hover:text-primary-cyan hover:bg-cyan-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              <div className="border-t border-gray-200 pt-2 mt-2">
                <Link
                  to="/organizers"
                  className="block px-4 py-3 rounded-lg text-sm text-gray-600 hover:text-primary-cyan hover:bg-cyan-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4" />
                    {t('nav.organizers')}
                  </span>
                </Link>
                <Link
                  to="/contributors"
                  className="block px-4 py-3 rounded-lg text-sm text-gray-600 hover:text-primary-cyan hover:bg-cyan-50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="flex items-center gap-2">
                    <TrophyIcon className="h-4 w-4" />
                    {t('nav.contributors')}
                  </span>
                </Link>
                
                {/* 모바일 언어 변경 */}
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Language
                  </div>
                  <div className="flex space-x-2 px-4">
                    <button
                      onClick={() => changeLanguage('ko')}
                      className={`flex-1 py-2 text-xs font-medium rounded transition-colors ${
                        i18n.language === 'ko' ? 'bg-primary-cyan text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      한국어
                    </button>
                    <button
                      onClick={() => changeLanguage('en')}
                      className={`flex-1 py-2 text-xs font-medium rounded transition-colors ${
                        i18n.language === 'en' ? 'bg-primary-cyan text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      English
                    </button>
                  </div>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 