import { useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { toPng } from 'html-to-image';
import { useTranslation } from 'react-i18next';
import {
  ArrowDownTrayIcon,
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

/**
 * Breakpoint-dependent classes. The page uses the responsive set; the downloadable image
 * always uses the wide set so it looks the same whatever device it is saved from.
 * Class strings stay literal so Tailwind can see them.
 */
const LAYOUTS = {
  responsive: {
    rowCols:
      'grid-cols-[4.5rem_minmax(0,1fr)] sm:grid-cols-[6.5rem_minmax(0,1fr)] md:grid-cols-[7rem_minmax(0,1fr)]',
    timePad: 'pl-4 sm:pl-6',
    sessionPad: 'pr-4 sm:pr-6',
    headingPad: 'px-4 sm:px-6',
    roomHeader: 'hidden lg:grid',
    parallel:
      'lg:grid lg:grid-cols-[calc(7rem_+_(100%_-_7rem)_/_2)_minmax(0,1fr)]',
    room2Column: 'lg:border-l lg:border-t',
    // Below lg the Room 2 row is an ordinary row; side by side it drops its own time column.
    room2Row:
      'grid grid-cols-[4.5rem_minmax(0,1fr)] sm:grid-cols-[6.5rem_minmax(0,1fr)] md:grid-cols-[7rem_minmax(0,1fr)] lg:block lg:border-t-0 lg:[&>div:first-child]:hidden',
    roomLabel: 'lg:hidden',
  },
  wide: {
    rowCols: 'grid-cols-[7rem_minmax(0,1fr)]',
    timePad: 'pl-6',
    sessionPad: 'pr-6',
    headingPad: 'px-6',
    roomHeader: 'grid',
    parallel: 'grid grid-cols-[calc(7rem_+_(100%_-_7rem)_/_2)_minmax(0,1fr)]',
    room2Column: 'border-l border-t',
    room2Row: 'block border-t-0 [&>div:first-child]:hidden',
    roomLabel: 'hidden',
  },
};

type Layout = (typeof LAYOUTS)['responsive'];

/** Content width of the schedule at the widest page layout; the image is rendered at it. */
const EXPORT_WIDTH = 1152;

const TimeLabel = ({ slot, layout }: { slot: Slot; layout: Layout }) => (
  <div className={`py-4 tabular-nums ${layout.timePad}`}>
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
  layout,
  roomLabel,
  interactive,
  isOpen,
  onToggle,
}: {
  slot: Slot;
  session: Session;
  layout: Layout;
  roomLabel?: string;
  interactive: boolean;
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
            <span
              className={`text-xs font-medium text-gray-500 ${layout.roomLabel}`}
            >
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
    return (
      <div className={`min-w-0 py-4 pl-3 ${layout.sessionPad}`}>{summary}</div>
    );
  }

  if (!interactive) {
    // Keep the toggle's footprint so titles wrap exactly as on the page.
    return (
      <div className={`flex min-w-0 gap-3 py-4 pl-3 ${layout.sessionPad}`}>
        {summary}
        <span aria-hidden="true" className="h-5 w-5 shrink-0" />
      </div>
    );
  }

  return (
    <div className="min-w-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className={`group flex w-full gap-3 py-4 pl-3 text-left transition-colors hover:bg-slate-50/80 focus-visible:bg-slate-50/80 ${layout.sessionPad}`}
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

const ScheduleTable = ({
  layout,
  interactive,
  openIds,
  onToggle,
}: {
  layout: Layout;
  interactive: boolean;
  openIds: Set<string>;
  onToggle?: (id: string) => void;
}) => {
  const { t } = useTranslation('magpieMeetup');

  /** One schedule row: time on the left, session on the right. */
  const renderRow = (
    slot: Slot,
    roomLabel?: string,
    rowClass = `grid ${layout.rowCols}`
  ) => {
    const isOpen = openIds.has(slot.id);
    const background =
      slot.kind === 'break' ? 'bg-gray-50' : isOpen ? 'bg-slate-50/70' : '';
    return (
      <div
        key={slot.id}
        className={`border-t border-gray-200 ${background} ${rowClass}`}
      >
        <TimeLabel slot={slot} layout={layout} />
        <SessionBody
          slot={slot}
          session={t(`sessions.${slot.id}`, { returnObjects: true }) as Session}
          layout={layout}
          roomLabel={roomLabel}
          interactive={interactive}
          isOpen={isOpen}
          onToggle={() => onToggle?.(slot.id)}
        />
      </div>
    );
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      <div
        className={`${layout.roomHeader} grid-cols-[7rem_minmax(0,1fr)_minmax(0,1fr)] text-xs font-semibold text-gray-500`}
      >
        <div className="px-6 py-3">{t('timeLabel')}</div>
        <div className="py-3 pl-3">{t('rooms.room1')}</div>
        <div className="border-l border-gray-200 py-3 pl-3">
          {t('rooms.room2')}
        </div>
      </div>

      {SCHEDULE.map(period => (
        <div key={period.id}>
          <h3
            className={`border-t border-gray-200 bg-gray-50 py-2.5 text-sm font-bold text-gray-900 ${layout.headingPad}`}
          >
            {t(`periods.${period.id}`)}
          </h3>
          {period.parallel ? (
            // Room 2 is its own column so opening either side never stretches the other.
            <div className={layout.parallel}>
              <div>
                {period.slots.map(slot => renderRow(slot, t('rooms.room1')))}
              </div>
              <div
                className={`border-gray-200 bg-cyan-50/40 ${layout.room2Column}`}
              >
                {renderRow(period.parallel, t('rooms.room2'), layout.room2Row)}
              </div>
            </div>
          ) : (
            period.slots.map(slot => renderRow(slot))
          )}
        </div>
      ))}
    </div>
  );
};

const NO_OPEN_SESSIONS = new Set<string>();

const AirflowMagpieMeetup = () => {
  const { t, i18n } = useTranslation('magpieMeetup');
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  const exportRef = useRef<HTMLDivElement>(null);
  const [exportState, setExportState] = useState<'idle' | 'saving' | 'error'>(
    'idle'
  );

  const toggle = (id: string) =>
    setOpenIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const downloadSchedule = async () => {
    // Mount the off-screen wide copy, capture it, then unmount it.
    flushSync(() => setExportState('saving'));
    const node = exportRef.current;
    if (!node) return;
    try {
      await document.fonts.ready;
      const dataUrl = await toPng(node, {
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      });
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `airflow-magpie-asia-meetup-2026-schedule-${i18n.language}.png`;
      link.click();
      setExportState('idle');
    } catch (error) {
      console.error('Failed to export schedule image', error);
      setExportState('error');
    }
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
        <div className="mb-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
            {t('scheduleTitle')}
          </h2>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="text-sm text-gray-500">{t('scheduleHint')}</p>
            <button
              type="button"
              onClick={downloadSchedule}
              disabled={exportState === 'saving'}
              className="inline-flex items-center gap-2 rounded-lg border border-solid border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm transition-colors hover:border-primary-blue hover:text-primary-blue disabled:cursor-wait disabled:opacity-60"
            >
              <ArrowDownTrayIcon aria-hidden="true" className="h-4 w-4" />
              {exportState === 'saving'
                ? t('download.saving')
                : t('download.button')}
            </button>
            {exportState === 'error' && (
              <p role="alert" className="w-full text-sm text-red-700">
                {t('download.error')}
              </p>
            )}
          </div>
        </div>

        <ScheduleTable
          layout={LAYOUTS.responsive}
          interactive
          openIds={openIds}
          onToggle={toggle}
        />
      </section>

      {exportState === 'saving' && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed left-[-10000px] top-0"
        >
          <div
            ref={exportRef}
            style={{ width: EXPORT_WIDTH }}
            className="break-keep bg-white px-6 py-14"
          >
            <h2 className="mb-8 text-3xl font-bold tracking-tight text-gray-900">
              {t('scheduleTitle')}
            </h2>
            <ScheduleTable
              layout={LAYOUTS.wide}
              interactive={false}
              openIds={NO_OPEN_SESSIONS}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AirflowMagpieMeetup;
