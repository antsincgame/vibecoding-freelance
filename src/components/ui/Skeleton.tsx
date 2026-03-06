interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`bg-gradient-to-r from-[#12121f] via-[#1a1a2e] to-[#12121f] bg-[length:200%_100%] animate-shimmer rounded ${className}`}
    />
  );
}
