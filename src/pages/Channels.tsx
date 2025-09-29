import { FaBullseye, FaSeedling, FaHandshake, FaBook } from 'react-icons/fa';
import { useChannels } from '../hooks/useData';
import type { CommunityChannel } from '../types';
import { useTranslation } from 'react-i18next';
import {
  FaDiscourse,
  FaComments,
  FaMeetup,
  FaSlack,
  FaLinkedin,
  FaYoutube,
} from 'react-icons/fa';

const ChannelCard = ({ channel }: { channel: CommunityChannel }) => {
  const { t } = useTranslation('channels');

  const getIconComponent = (channelPlatform: string) => {
    // Discourse
    if (channelPlatform.toLowerCase().includes('discourse')) {
      return <FaDiscourse className="h-12 w-12" />;
    }
    // YouTube 채널
    if (channelPlatform.toLowerCase().includes('youtube')) {
      return <FaYoutube className="h-12 w-12" />;
    }
    // Slack 워크스페이스
    if (channelPlatform.toLowerCase().includes('slack')) {
      return <FaSlack className="h-12 w-12" />;
    }
    // LinkedIn 그룹
    if (channelPlatform.toLowerCase().includes('linkedin')) {
      return <FaLinkedin className="h-12 w-12" />;
    }
    // KakakTalk
    if (channelPlatform.toLowerCase().includes('kakaotalk')) {
      return <FaComments className="h-12 w-12" />;
    }
    // Meetups
    if (channelPlatform.toLowerCase().includes('meetups')) {
      return <FaMeetup className="h-12 w-12" />;
    }
  };

  const getChannelTypeStyle = (type: CommunityChannel['type']) => {
    switch (type) {
      case 'forum':
        return 'bg-gradient-to-br from-blue-500 to-blue-700';
      case 'chat':
        return 'bg-gradient-to-br from-green-500 to-green-700';
      case 'social':
        return 'bg-gradient-to-br from-purple-500 to-purple-700';
      case 'video':
        return 'bg-gradient-to-br from-red-500 to-red-700';
      default:
        return 'bg-gradient-to-br from-gray-500 to-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 overflow-hidden">
      <div
        className={`${getChannelTypeStyle(channel.type)} p-6 text-white text-center`}
      >
        <div className="mb-3 flex justify-center">
          {getIconComponent(channel.platform)}
        </div>
        <h3 className="text-xl font-bold">{channel.name}</h3>
        {channel.memberCount && (
          <div className="text-sm opacity-90 mt-2">
            {t('memberCount', { count: channel.memberCount })}
          </div>
        )}
      </div>

      <div className="p-6">
        <p className="text-gray-600 mb-6 leading-relaxed">
          {channel.description}
        </p>

        <a
          href={channel.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-airflow-blue hover:bg-blue-600 text-white text-center py-3 rounded-lg font-semibold transition-colors duration-200"
        >
          {t('joinButton')}
        </a>
      </div>
    </div>
  );
};

const Channels = () => {
  const { channels: communityChannels, loading, error } = useChannels();
  const { t } = useTranslation('channels');

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

  const forumChannels = communityChannels.filter(
    (channel: CommunityChannel) => channel.type === 'forum'
  );
  const chatChannels = communityChannels.filter(
    (channel: CommunityChannel) => channel.type === 'chat'
  );
  const socialChannels = communityChannels.filter(
    (channel: CommunityChannel) => channel.type === 'social'
  );
  const videoChannels = communityChannels.filter(
    (channel: CommunityChannel) => channel.type === 'video'
  );

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

      {/* 채널 소개 */}
      <section className="section-padding">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">
              {t('intro.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('intro.description')}
            </p>
          </div>

          {/* 모든 채널 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {communityChannels.map((channel: CommunityChannel) => (
              <ChannelCard key={channel.id} channel={channel} />
            ))}
          </div>
        </div>
      </section>

      {/* 채널별 상세 안내 */}
      <section className="bg-white section-padding">
        <div className="container-max">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            {t('channelGuide')}
          </h2>

          <div className="space-y-12">
            {/* 포럼 */}
            {forumChannels.length > 0 && (
              <div className="bg-blue-50 p-8 rounded-xl">
                <h3 className="text-2xl font-bold mb-4 text-blue-800 flex items-center">
                  {t('channels.forum.title')}
                </h3>
                <p className="text-gray-700 mb-6">
                  {t('channels.forum.description')}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white p-4 rounded-lg">
                    <strong className="text-blue-600">
                      {t('channels.forum.recommended')}
                    </strong>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      {(
                        t('channels.forum.pros', {
                          returnObjects: true,
                        }) as string[]
                      ).map((item, index) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <strong className="text-blue-600">
                      {t('channels.forum.responseTime')}
                    </strong>
                    <p className="mt-2 text-gray-600">
                      {t('channels.forum.responseTimeValue')}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <strong className="text-blue-600">
                      {t('channels.forum.participants')}
                    </strong>
                    <p className="mt-2 text-gray-600">
                      {t('channels.forum.participantsValue')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 채팅 */}
            {chatChannels.length > 0 && (
              <div className="bg-green-50 p-8 rounded-xl">
                <h3 className="text-2xl font-bold mb-4 text-green-800 flex items-center">
                  {t('channels.chat.title')}
                </h3>
                <p className="text-gray-700 mb-6">
                  {t('channels.chat.description')}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white p-4 rounded-lg">
                    <strong className="text-green-600">
                      {t('channels.forum.recommended')}
                    </strong>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      {(
                        t('channels.chat.pros', {
                          returnObjects: true,
                        }) as string[]
                      ).map((item, index) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <strong className="text-green-600">
                      {t('channels.forum.responseTime')}
                    </strong>
                    <p className="mt-2 text-gray-600">
                      {t('channels.chat.responseTimeValue')}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <strong className="text-green-600">
                      {t('channels.forum.participants')}
                    </strong>
                    <p className="mt-2 text-gray-600">
                      {t('channels.chat.participantsValue')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 소셜 네트워크 */}
            {socialChannels.length > 0 && (
              <div className="bg-purple-50 p-8 rounded-xl">
                <h3 className="text-2xl font-bold mb-4 text-purple-800 flex items-center">
                  {t('channels.social.title')}
                </h3>
                <p className="text-gray-700 mb-6">
                  {t('channels.social.description')}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white p-4 rounded-lg">
                    <strong className="text-purple-600">
                      {t('channels.forum.recommended')}
                    </strong>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      {(
                        t('channels.social.pros', {
                          returnObjects: true,
                        }) as string[]
                      ).map((item, index) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <strong className="text-purple-600">
                      {t('responseTime')}
                    </strong>
                    <p className="mt-2 text-gray-600">
                      {t('channels.social.responseTimeValue')}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <strong className="text-purple-600">
                      {t('channels.forum.participants')}
                    </strong>
                    <p className="mt-2 text-gray-600">
                      {t('channels.social.participantsValue')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 동영상 */}
            {videoChannels.length > 0 && (
              <div className="bg-red-50 p-8 rounded-xl">
                <h3 className="text-2xl font-bold mb-4 text-red-800 flex items-center">
                  {t('channels.video.title')}
                </h3>
                <p className="text-gray-700 mb-6">
                  {t('channels.video.description')}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white p-4 rounded-lg">
                    <strong className="text-red-600">
                      {t('channels.forum.recommended')}
                    </strong>
                    <ul className="mt-2 space-y-1 text-gray-600">
                      {(
                        t('channels.video.pros', {
                          returnObjects: true,
                        }) as string[]
                      ).map((item, index) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <strong className="text-red-600">
                      {t('responseTime')}
                    </strong>
                    <p className="mt-2 text-gray-600">
                      {t('channels.video.responseTimeValue')}
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <strong className="text-red-600">
                      {t('channels.forum.participants')}
                    </strong>
                    <p className="mt-2 text-gray-600">
                      {t('channels.video.participantsValue')}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 참여 가이드라인 */}
      <section className="bg-gray-100 section-padding">
        <div className="container-max">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            {t('guidelines.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto text-center mb-12">
            {t('guidelines.description')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(
              t('guidelines.rules', { returnObjects: true }) as Array<{
                title: string;
                description: string;
              }>
            ).map((rule, index) => {
              const getIconForIndex = (idx: number) => {
                const icons = [
                  <FaHandshake className="text-blue-600" />,
                  <FaBook className="text-green-600" />,
                  <FaBullseye className="text-yellow-600" />,
                  <FaSeedling className="text-purple-600" />,
                ];
                return icons[idx] || icons[0];
              };

              return (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl text-center"
                >
                  <div className="text-4xl mb-4 flex justify-center">
                    {getIconForIndex(index)}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{rule.title}</h3>
                  <p className="text-gray-600 text-sm">{rule.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-airflow-navy text-white section-padding">
        <div className="container-max text-center">
          <h2 className="text-3xl font-bold mb-6">{t('cta.title')}</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            {t('cta.description')}
          </p>
          <div className="text-lg">
            {(() => {
              if (communityChannels.length === 0) return null;
              const maxCount = Math.max(
                ...communityChannels.map(channel => channel.memberCount || 0)
              );
              return `${maxCount.toLocaleString()}+ ${t('membersParticipating')}`;
            })()}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Channels;
