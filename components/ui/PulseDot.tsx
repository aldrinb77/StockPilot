export function PulseDot({ color = 'green' }: { color?: 'green' | 'red' | 'amber' }) {
  const colors = {
    green: 'bg-green-400',
    red: 'bg-red-400',
    amber: 'bg-amber-400',
  };
  return (
    <span className="relative flex h-2.5 w-2.5 shrink-0">
      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${colors[color]}`} />
      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${colors[color]}`} />
    </span>
  );
}
