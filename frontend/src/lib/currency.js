export function formatRWF(amount) {
  const value = Number(amount);
  if (Number.isNaN(value)) return 'RWF 0';

  return `RWF ${value.toLocaleString('en-RW', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

export function formatRWFCompact(amount) {
  const value = Number(amount);
  if (Number.isNaN(value)) return 'RWF 0';

  if (value >= 1_000_000) {
    return `RWF ${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  }

  if (value >= 1_000) {
    return `RWF ${(value / 1_000).toFixed(0)}K`;
  }

  return formatRWF(value);
}
