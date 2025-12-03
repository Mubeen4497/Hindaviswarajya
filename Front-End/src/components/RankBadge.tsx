import { RANK_SYSTEM, UserRank } from './AppContext';

interface RankBadgeProps {
  rank: UserRank;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export default function RankBadge({ rank, size = 'md', showLabel = false, className = '' }: RankBadgeProps) {
  const rankInfo = RANK_SYSTEM.find(r => r.name === rank);
  
  // Fallback to Sevak if rank not found
  const config = rankInfo || RANK_SYSTEM[0];

  const sizeClasses = {
    sm: 'text-sm px-2 py-0.5',
    md: 'text-base px-3 py-1',
    lg: 'text-lg px-4 py-1.5',
  };

  const iconSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  if (showLabel) {
    return (
      <div 
        className={`inline-flex items-center gap-1.5 rounded-full font-medium ${sizeClasses[size]} ${className}`}
        style={{ 
          backgroundColor: `${config.color}20`,
          color: config.color,
          border: `1.5px solid ${config.color}40`
        }}
      >
        <span className={iconSizes[size]}>{config.icon}</span>
        <span>{config.name}</span>
      </div>
    );
  }

  return (
    <div 
      className={`inline-flex items-center justify-center rounded-full ${className}`}
      title={config.name}
      style={{ 
        backgroundColor: `${config.color}20`,
        color: config.color,
        border: `1.5px solid ${config.color}40`,
        padding: size === 'sm' ? '0.25rem' : size === 'lg' ? '0.5rem' : '0.375rem'
      }}
    >
      <span className={iconSizes[size]}>{config.icon}</span>
    </div>
  );
}
