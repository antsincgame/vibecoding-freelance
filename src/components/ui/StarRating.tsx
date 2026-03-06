import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  count?: number;
  size?: number;
  showCount?: boolean;
}

export default function StarRating({ rating, count, size = 14, showCount = true }: StarRatingProps) {
  return (
    <div className="inline-flex items-center gap-1">
      <Star size={size} className="fill-[#00f5ff] text-[#00f5ff]" />
      <span className="text-sm font-medium text-white font-mono">{rating.toFixed(1)}</span>
      {showCount && count !== undefined && (
        <span className="text-sm text-[rgba(255,255,255,0.4)]">({count})</span>
      )}
    </div>
  );
}
