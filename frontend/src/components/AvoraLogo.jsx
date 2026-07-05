import { Link } from 'react-router-dom';

export default function AvoraLogo({ to = '/', size = 'md', subtitle, className = '' }) {
  const sizes = {
    sm: { mark: 'w-7 h-7 text-sm', word: 'text-lg', sub: 'text-[10px]' },
    md: { mark: 'w-9 h-9 text-base', word: 'text-2xl', sub: 'text-xs' },
    lg: { mark: 'w-12 h-12 text-xl', word: 'text-4xl', sub: 'text-sm' },
    hero: { mark: 'w-16 h-16 text-2xl', word: 'text-6xl md:text-8xl', sub: 'text-sm' },
  };

  const s = sizes[size] || sizes.md;

  const content = (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div
        className={`${s.mark} bg-primary text-white flex items-center justify-center font-heading font-bold tracking-tighter shrink-0`}
        aria-hidden="true"
      >
        A
      </div>
      <div className="flex flex-col leading-none">
        <span className={`font-heading font-bold tracking-[0.18em] uppercase ${s.word}`}>
          AVORA
        </span>
        {subtitle && (
          <span className={`${s.sub} tracking-[0.25em] uppercase text-gray-500 mt-1`}>
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="inline-block hover:opacity-90 transition-opacity" aria-label="AVORA home">
        {content}
      </Link>
    );
  }

  return content;
}
