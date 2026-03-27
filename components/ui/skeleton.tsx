export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-lg bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-[length:200%_100%] animate-shimmer ${className}`}>
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export function SignalCardSkeleton() {
  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-6 w-20" />
      </div>
      <Skeleton className="h-10 w-40" />
      <Skeleton className="h-8 w-28" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <Skeleton className="h-3 w-full rounded-full" />
    </div>
  );
}
