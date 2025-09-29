import { useContributors } from '../hooks/useData';
import type { Contributor } from '../types';
import { useTranslation } from 'react-i18next';

const ContributorCard = ({ contributor }: { contributor: Contributor }) => {
  const { t } = useTranslation('contributors');

  // GitHub 아이디로 자동 avatar URL 생성
  const avatarUrl =
    contributor.avatarUrl ||
    (contributor.githubUsername
      ? `https://github.com/${contributor.githubUsername}.png`
      : null);

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="w-16 h-16 mr-4">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={`${contributor.name} 프로필`}
                className="w-full h-full rounded-full object-cover border-2 border-gray-200"
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
              className={`w-full h-full bg-gradient-to-br from-airflow-blue to-airflow-navy rounded-full flex items-center justify-center text-white text-xl font-bold ${avatarUrl ? 'hidden' : 'flex'}`}
            >
              {contributor.name.charAt(0)}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              {contributor.name}
            </h3>
            <p className="text-gray-600">@{contributor.githubUsername}</p>
            {contributor.prCount && (
              <p className="text-sm text-airflow-blue font-medium">
                {contributor.prCount} PRs
              </p>
            )}
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            {t('contributionLabel')}
          </h4>
          <ul className="space-y-1">
            {contributor.contributions.map((contribution, index) => (
              <li
                key={index}
                className="text-sm text-gray-600 flex items-start"
              >
                <span className="text-airflow-blue mr-2 mt-1">•</span>
                {contribution}
              </li>
            ))}
          </ul>
        </div>

        <a
          href={contributor.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-gray-800 hover:bg-gray-900 text-white text-center py-3 rounded-lg font-semibold transition-colors duration-200"
        >
          {t('profileButton')}
        </a>
      </div>
    </div>
  );
};

const Contributors = () => {
  const { contributors, loading, error } = useContributors();
  const { t } = useTranslation('contributors');

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

      <section className="airflow-gradient text-white section-padding">
        <div className="container-max text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('title')}</h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-8 text-gray-800">
              {t('intro.title')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="text-4xl font-bold text-airflow-blue mb-2">
                  {contributors.length}+
                </div>
                <div className="text-gray-600">{t('stats.contributors')}</div>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg">
                <div className="text-4xl font-bold text-airflow-green mb-2">
                  {contributors.reduce(
                    (sum: number, c: Contributor) => sum + (c.prCount || 0),
                    0
                  )}
                  +
                </div>
                <div className="text-gray-600">{t('stats.contributions')}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {contributors.map((contributor: Contributor) => (
              <ContributorCard key={contributor.id} contributor={contributor} />
            ))}
          </div>
        </div>
      </section>

      {/* 심플한 CTA 섹션 */}
      <section className="bg-gray-900 text-white min-h-[400px] flex items-center">
        <div className="container-max w-full py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t('hallOfFame.title')}
            </h2>

            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              {t('hallOfFame.description')}
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://github.com/apache/airflow"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-airflow-blue hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                {t('hallOfFame.button')}
              </a>

              <a
                href="https://github.com/apache/airflow/blob/main/CONTRIBUTING.md"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                {t('hallOfFame.registerButton')}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contributors;
