import { Link } from 'react-router-dom';
import AvoraMark from './AvoraMark';
import AvoraWordmark from './AvoraWordmark';

const BRAND_TAGLINE = 'PROUDLY MADE IN RWANDA';

const sizes = {
  sm: {
    mark: 'w-9 h-10',
    word: 'text-lg tracking-[0.28em]',
    tagline: 'text-[8px] tracking-[0.28em]',
    gap: 'gap-3',
    stack: 'gap-2',
    line: 'w-10',
  },
  md: {
    mark: 'w-11 h-12',
    word: 'text-xl md:text-2xl tracking-[0.24em]',
    tagline: 'text-[9px] md:text-[10px] tracking-[0.32em]',
    gap: 'gap-3.5',
    stack: 'gap-2.5',
    line: 'w-12',
  },
  lg: {
    mark: 'w-14 h-[3.85rem]',
    word: 'text-3xl tracking-[0.2em]',
    tagline: 'text-[10px] tracking-[0.34em]',
    gap: 'gap-4',
    stack: 'gap-3',
    line: 'w-14',
  },
  hero: {
    mark: 'w-[5.5rem] h-[6rem] md:w-28 md:h-[7.75rem]',
    word: 'text-4xl md:text-5xl tracking-[0.18em]',
    tagline: 'text-[10px] md:text-xs tracking-[0.38em]',
    gap: 'gap-5 md:gap-6',
    stack: 'gap-3 md:gap-4',
    line: 'w-16 md:w-20',
  },
};

function GoldLine({ widthClass }) {
  return <span className={`block h-[2px] bg-gold ${widthClass}`} aria-hidden="true" />;
}

export default function AvoraLogo({
  to = '/',
  size = 'md',
  variant = 'auto',
  wordSide = 'right',
  tagline = BRAND_TAGLINE,
  showTagline = true,
  portalLabel,
  className = '',
  dark = false,
}) {
  const s = sizes[size] || sizes.md;
  const resolvedVariant = variant === 'auto'
    ? (size === 'hero' || size === 'lg' ? 'stacked' : 'inline')
    : variant;

  const markColor = dark ? '#F7F5F2' : '#0D0D0D';
  const wordColor = dark ? '#F7F5F2' : '#0D0D0D';
  const taglineColor = dark ? 'text-white/55' : 'text-gray-500';
  const displayTagline = portalLabel || (showTagline ? tagline : null);

  const textBlock = (align) => (
    <div className={`flex flex-col ${align === 'left' ? 'items-start' : 'items-center'}`}>
      <AvoraWordmark className={s.word} color={wordColor} />
      <GoldLine widthClass={`${s.line} mt-2`} />
      {displayTagline && (
        <span className={`font-body font-medium uppercase ${s.tagline} ${taglineColor} mt-2 ${align === 'left' ? 'text-left' : 'text-center'}`}>
          {displayTagline}
        </span>
      )}
    </div>
  );

  const stacked = (
    <div className={`inline-flex flex-col items-center text-center ${s.stack} ${className}`}>
      <AvoraMark className={s.mark} color={markColor} />
      {textBlock('center')}
    </div>
  );

  const inline = (
    <div
      className={`inline-flex items-center ${s.gap} ${
        wordSide === 'left' ? 'flex-row-reverse' : 'flex-row'
      } ${className}`}
    >
      <AvoraMark className={`${s.mark} shrink-0`} color={markColor} />
      {textBlock('left')}
    </div>
  );

  const content = resolvedVariant === 'stacked' ? stacked : inline;

  if (to) {
    return (
      <Link
        to={to}
        className="inline-block hover:opacity-85 transition-opacity duration-300"
        aria-label="AVORA home"
      >
        {content}
      </Link>
    );
  }

  return content;
}

export { BRAND_TAGLINE };
