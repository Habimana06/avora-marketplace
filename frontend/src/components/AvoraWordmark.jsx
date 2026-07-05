export default function AvoraWordmark({ className = '', color = 'currentColor' }) {
  return (
    <span
      className={`font-heading font-bold uppercase leading-none ${className}`}
      style={{ color }}
      aria-label="AVORA"
    >
      AVORA
    </span>
  );
}
