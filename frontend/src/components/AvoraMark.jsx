export default function AvoraMark({ className = 'w-10 h-10', color = 'currentColor' }) {
  return (
    <svg
      viewBox="0 0 80 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Left leg of A */}
      <path
        d="M40 6L14 82"
        stroke={color}
        strokeWidth="6.5"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      {/* Right leg of A */}
      <path
        d="M40 6L66 82"
        stroke={color}
        strokeWidth="6.5"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      {/* Two mountains: tall left, short right — dam ridge connects them; ends touch legs */}
      <path
        fill={color}
        d="M21 72L29 38L36 71L44 71L52 57L59 72Z"
      />
    </svg>
  );
}
