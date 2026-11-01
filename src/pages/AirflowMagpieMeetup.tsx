import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ArrowUpRightIcon,
  CalendarDaysIcon,
  ChevronDownIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';

const TICKET_URL = 'https://event-us.kr/airflowkrug/event/136699';

type SessionKind = 'session' | 'break' | 'keynote' | 'sprint';

interface Slot {
  id: string;
  start: string;
  end: string;
  kind: SessionKind;
}

interface Period {
  id: 'morning' | 'afternoon' | 'closing' | 'evening';
  /** Room 1 slots, one grid row each. */
  slots: Slot[];
  /** Room 2 session running alongside every Room 1 slot of the period. */
  parallel?: Slot;
}

type Block =
  { type: 'p' | 'h' | 'sub'; text: string } | { type: 'ul'; items: string[] };

interface SessionDetail {
  format: string;
  track?: string;
  audience?: string;
  language?: string;
  blocks: Block[];
}

interface Session {
  title: string;
  subtitle?: string;
  speaker?: string;
  detail?: SessionDetail;
}

const SCHEDULE: Period[] = [
  {
    id: 'morning',
    slots: [
      { id: 'checkin', start: '10:00', end: '10:30', kind: 'break' },
      { id: 'opening', start: '10:30', end: '10:50', kind: 'session' },
      { id: 'keynote', start: '10:50', end: '11:40', kind: 'keynote' },
      { id: 'airflow101', start: '11:40', end: '12:05', kind: 'session' },
      { id: 'sprintIntro', start: '12:05', end: '12:20', kind: 'session' },
      { id: 'lunch', start: '12:20', end: '13:20', kind: 'break' },
    ],
  },
  {
    id: 'afternoon',
    slots: [
      { id: 'soloDev', start: '13:20', end: '13:55', kind: 'session' },
      { id: 'pyconTw', start: '13:55', end: '14:30', kind: 'session' },
      { id: 'migration', start: '14:30', end: '15:05', kind: 'session' },
      { id: 'break', start: '15:05', end: '15:20', kind: 'break' },
      { id: 'cdcMerge', start: '15:20', end: '15:55', kind: 'session' },
      { id: 'llm', start: '15:55', end: '16:30', kind: 'session' },
    ],
    parallel: { id: 'sprint', start: '13:20', end: '16:30', kind: 'sprint' },
  },
  {
    id: 'closing',
    slots: [{ id: 'closing', start: '16:30', end: '17:00', kind: 'session' }],
  },
  {
    id: 'evening',
    slots: [{ id: 'dinner', start: '18:00', end: '21:30', kind: 'session' }],
  },
];

const DetailBlocks = ({ blocks }: { blocks: Block[] }) => (
  <div className="space-y-3 text-[15px] leading-7 text-gray-700">
    {blocks.map((block, index) => {
      switch (block.type) {
        case 'h':
          return (
            <h4
              key={index}
              className="pt-5 text-base font-bold text-gray-900 first:pt-0"
            >
              {block.text}
            </h4>
          );
        case 'sub':
          return (
            <h5 key={index} className="pt-2 font-semibold text-gray-900">
              {block.text}
            </h5>
          );
        case 'ul':
          return (
            <ul
              key={index}
              className="list-disc space-y-1.5 pl-5 marker:text-primary-cyan"
            >
              {block.items.map(item => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          );
        default:
          return <p key={index}>{block.text}</p>;
      }
    })}
  </div>
);

/** Time column width, shared by the header and every row so columns line up. */
const TIME_COLS =
  'grid-cols-[4.5rem_minmax(0,1fr)] sm:grid-cols-[6.5rem_minmax(0,1fr)] md:grid-cols-[7rem_minmax(0,1fr)]';

const TimeLabel = ({ slot }: { slot: Slot }) => (
  <div className="py-4 pl-4 tabular-nums sm:pl-6">
    <span
      className={`block text-sm font-semibold ${slot.kind === 'break' ? 'text-gray-500' : 'text-gray-900'}`}
    >
      {slot.start}
    </span>
    <span className="block text-sm text-gray-500">– {slot.end}</span>
  </div>
);

const DetailPanel = ({ id, detail }: { id: string; detail: SessionDetail }) => {
  const { t } = useTranslation('magpieMeetup');
  const meta = [
    { label: t('labels.format'), value: detail.format },
    { label: t('labels.track'), value: detail.track },
    { label: t('labels.audience'), value: detail.audience },
    { label: t('labels.language'), value: detail.language },
  ].filter((item): item is { label: string; value: string } => !!item.value);

  return (
    <div id={id} className="min-w-0 pb-6 pl-3 pr-4 sm:pr-10">
      <dl className="mb-5 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 border-y border-gray-200 py-3 text-sm">
        {meta.map(item => (
          <div key={item.label} className="contents">
            <dt className="font-medium text-gray-500">{item.label}</dt>
            <dd className="text-gray-800">{item.value}</dd>
          </div>
        ))}
      </dl>
      <div className="max-w-[68ch]">
        <DetailBlocks blocks={detail.blocks} />
      </div>
    </div>
  );
};

const SessionBody = ({
  slot,
  session,
  roomLabel,
  isOpen,
  onToggle,
}: {
  slot: Slot;
  session: Session;
  roomLabel?: string;
  isOpen: boolean;
  onToggle: () => void;
}) => {
  const { t } = useTranslation('magpieMeetup');
  const detail = session.detail;
  const isBreak = slot.kind === 'break';
  const tag =
    slot.kind === 'keynote' || slot.kind === 'sprint'
      ? t(`tags.${slot.kind}`)
      : null;
  const panelId = `session-${slot.id}`;

  const summary = (
    <div className="min-w-0 flex-1">
      {(tag || roomLabel) && (
        <div className="mb-1.5 flex flex-wrap items-center gap-2">
          {tag && (
            <span className="inline-block rounded-full bg-cyan-50 px-2.5 py-0.5 text-xs font-semibold text-cyan-800 ring-1 ring-inset ring-cyan-100">
              {tag}
            </span>
          )}
          {roomLabel && (
            <span className="text-xs font-medium text-gray-500 lg:hidden">
              {roomLabel}
            </span>
          )}
        </div>
      )}
      <p
        className={`text-balance ${
          isBreak
            ? 'text-gray-500'
            : 'text-[17px] font-semibold leading-snug text-gray-900'
        }`}
      >
        {session.title}
      </p>
      {session.subtitle && (
        <p className="mt-0.5 text-[15px] leading-snug text-gray-600">
          {session.subtitle}
        </p>
      )}
      {session.speaker && (
        <p className="mt-1.5 text-sm text-gray-500">{session.speaker}</p>
      )}
    </div>
  );

  if (!detail) {
    return <div className="min-w-0 py-4 pl-3 pr-4 sm:pr-6">{summary}</div>;
  }

  return (
    <div className="min-w-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="group flex w-full gap-3 py-4 pl-3 pr-4 text-left transition-colors hover:bg-slate-50/80 focus-visible:bg-slate-50/80 sm:pr-6"
      >
        {summary}
        <ChevronDownIcon
          aria-hidden="true"
          className={`mt-1 h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200 group-hover:text-primary-blue ${
            isOpen ? 'rotate-180 text-primary-blue' : ''
          }`}
        />
      </button>
      {isOpen && <DetailPanel id={panelId} detail={detail} />}
    </div>
  );
};

const AirflowMagpieMeetup = () => {
  const { t } = useTranslation('magpieMeetup');
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setOpenIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  /** One schedule row: time on the left, session on the right. */
  const renderRow = (slot: Slot, roomLabel?: string, className = '') => {
    const isOpen = openIds.has(slot.id);
    const background =
      slot.kind === 'break' ? 'bg-gray-50' : isOpen ? 'bg-slate-50/70' : '';
    return (
      <div
        key={slot.id}
        className={`grid ${TIME_COLS} border-t border-gray-200 ${background} ${className}`}
      >
        <TimeLabel slot={slot} />
        <SessionBody
          slot={slot}
          session={t(`sessions.${slot.id}`, { returnObjects: true }) as Session}
          roomLabel={roomLabel}
          isOpen={isOpen}
          onToggle={() => toggle(slot.id)}
        />
      </div>
    );
  };

  return (
    <div className="bg-white break-keep">
      <section className="border-b border-gray-200 bg-gradient-to-b from-cyan-50/60 to-white">
        <div className="mx-auto max-w-6xl px-5 pb-12 pt-16 sm:px-6 md:pb-16 md:pt-24">
          <h1 className="text-balance text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            {t('title')}
          </h1>

          <dl className="mt-8 space-y-3 text-gray-700">
            <div className="flex items-start gap-3">
              <CalendarDaysIcon
                aria-hidden="true"
                className="mt-0.5 h-5 w-5 shrink-0 text-primary-blue"
              />
              <dt className="sr-only">{t('dateLabel')}</dt>
              <dd>{t('date')}</dd>
            </div>
            <div className="flex items-start gap-3">
              <MapPinIcon
                aria-hidden="true"
                className="mt-0.5 h-5 w-5 shrink-0 text-primary-blue"
              />
              <dt className="sr-only">{t('venueLabel')}</dt>
              <dd>{t('venue')}</dd>
            </div>
          </dl>

          <a
            href={TICKET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-9 inline-flex items-center gap-2 rounded-lg bg-primary-blue px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 hover:text-white"
          >
            {t('ticket')}
            <ArrowUpRightIcon aria-hidden="true" className="h-4 w-4" />
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-6 md:py-20">
        <div className="mb-8 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
            {t('scheduleTitle')}
          </h2>
          <p className="text-sm text-gray-500">{t('scheduleHint')}</p>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200">
          <div className="hidden grid-cols-[7rem_minmax(0,1fr)_minmax(0,1fr)] text-xs font-semibold text-gray-500 lg:grid">
            <div className="px-6 py-3">{t('timeLabel')}</div>
            <div className="py-3 pl-3">{t('rooms.room1')}</div>
            <div className="border-l border-gray-200 py-3 pl-3">
              {t('rooms.room2')}
            </div>
          </div>

          {SCHEDULE.map(period => (
            <div key={period.id}>
              <h3 className="border-t border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-bold text-gray-900 sm:px-6">
                {t(`periods.${period.id}`)}
              </h3>
              {period.parallel ? (
                // Room 2 is its own column so opening either side never stretches the other.
                <div className="lg:grid lg:grid-cols-[calc(7rem_+_(100%_-_7rem)_/_2)_minmax(0,1fr)]">
                  <div>
                    {period.slots.map(slot =>
                      renderRow(slot, t('rooms.room1'))
                    )}
                  </div>
                  <div className="border-gray-200 bg-cyan-50/40 lg:border-l lg:border-t">
                    {renderRow(
                      period.parallel,
                      t('rooms.room2'),
                      'lg:block lg:border-t-0 lg:[&>div:first-child]:hidden'
                    )}
                  </div>
                </div>
              ) : (
                period.slots.map(slot => renderRow(slot))
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AirflowMagpieMeetup;
