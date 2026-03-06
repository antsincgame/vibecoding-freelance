interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`bg-gradient-to-r from-[#0f0f24] via-[#16163a] to-[#0f0f24] bg-[length:200%_100%] animate-shimmer rounded ${className}`}
    />
  );
}
