import { useState } from 'react';

interface AvatarProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isOnline?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-24 h-24',
};

const textSizes = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-2xl',
};

export default function Avatar({ src, alt, size = 'md', isOnline, className = '' }: AvatarProps) {
  const [broken, setBroken] = useState(false);
  const initials = (alt || '?').slice(0, 1).toUpperCase();

  return (
    <div className={`relative inline-flex flex-shrink-0 ${className}`}>
      {src && !broken ? (
        <img
          src={src}
          alt={alt}
          className={`${sizeClasses[size]} rounded-full object-cover ${isOnline ? 'ring-2 ring-[#00ff88] shadow-[0_0_8px_rgba(0,255,136,0.4)]' : ''}`}
          loading="lazy"
          onError={() => setBroken(true)}
        />
      ) : (
        <div className={`${sizeClasses[size]} rounded-full bg-[#0f0f24] flex items-center justify-center ${textSizes[size]} font-bold text-[#00f5ff] border border-[rgba(0,245,255,0.2)] ${isOnline ? 'ring-2 ring-[#00ff88] shadow-[0_0_8px_rgba(0,255,136,0.4)]' : ''}`}>
          {initials}
        </div>
      )}
      {isOnline && (
        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#00ff88] rounded-full border-2 border-[#050510] shadow-[0_0_6px_rgba(0,255,136,0.6)]" />
      )}
    </div>
  );
}
