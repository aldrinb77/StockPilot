export function PulseDot({ color = 'green' }: { color?: 'green' | 'red' | 'amber' | 'blue' }) {
  const colors = {
    green: 'bg-[#00e676]',
    red: 'bg-[#ff1744]',
    amber: 'bg-[#ffab00]',
    blue: 'bg-[#2979ff]',
  };
  return (
    <span className="relative flex h-2.5 w-2.5 shrink-0">
      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${colors[color]}`} />
      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${colors[color]}`} />
    </span>
  );
}
