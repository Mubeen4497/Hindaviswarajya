/**
 * Utility functions for formatting data in the application
 */

/**
 * Format a number with localized thousands separators
 * @example formatNumber(1234) => "1,234"
 */
export function formatNumber(num: number): string {
  return num.toLocaleString();
}

/**
 * Format large numbers with K/M suffix
 * @example formatCompactNumber(1234) => "1.2K"
 */
export function formatCompactNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
}

/**
 * Calculate time ago from a timestamp
 * @example getTimeAgo("2024-12-01") => "1 day ago"
 */
export function getTimeAgo(timestamp: string): string {
  // For demo purposes, return the timestamp as-is since we're using relative strings
  // In production, this would calculate actual time differences
  return timestamp;
}

/**
 * Format a date to a readable string
 * @example formatDate("2024-01-15") => "January 15, 2024"
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

/**
 * Truncate text to a maximum length with ellipsis
 * @example truncateText("Long text...", 10) => "Long text..."
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Extract hashtags from text
 * @example extractHashtags("This is #amazing #seva") => ["amazing", "seva"]
 */
export function extractHashtags(text: string): string[] {
  const hashtagRegex = /#(\w+)/g;
  const matches = text.matchAll(hashtagRegex);
  return Array.from(matches, m => m[1]);
}

/**
 * Calculate percentage
 * @example calculatePercentage(50, 200) => 25
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

/**
 * Get rank color based on rank name
 */
export function getRankColor(rank: string): string {
  const colors: Record<string, string> = {
    Sevak: '#6B7280',
    Karyakarta: '#3B82F6',
    Nayak: '#10B981',
    Sardar: '#8B5CF6',
    Senapati: '#FF6F00',
  };
  return colors[rank] || colors.Sevak;
}

/**
 * Generate a random avatar color based on name
 */
export function getAvatarColor(name: string): string {
  const colors = [
    '#FF6F00', '#F57C00', '#E65100',
    '#3B82F6', '#2563EB', '#1D4ED8',
    '#10B981', '#059669', '#047857',
    '#8B5CF6', '#7C3AED', '#6D28D9',
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Generate share text for a post
 */
export function generateShareText(userName: string, content: string, helpedPeople: number): string {
  return `Check out this amazing seva by ${userName}!\n\n"${truncateText(content, 100)}"\n\n${helpedPeople} people helped 🙏\n\nJoin HindaviSwarajya to share your seva too!`;
}

/**
 * Calculate seva points from people helped
 */
export function calculateSevaPoints(peopleHelped: number): number {
  return peopleHelped * 5;
}

/**
 * Get rank from seva points
 */
export function getRankFromPoints(points: number): string {
  if (points >= 2000) return 'Senapati';
  if (points >= 1500) return 'Sardar';
  if (points >= 1000) return 'Nayak';
  if (points >= 500) return 'Karyakarta';
  return 'Sevak';
}

/**
 * Get points needed for next rank
 */
export function getPointsToNextRank(currentPoints: number): number {
  if (currentPoints >= 2000) return 0; // Already at max rank
  if (currentPoints >= 1500) return 2000 - currentPoints;
  if (currentPoints >= 1000) return 1500 - currentPoints;
  if (currentPoints >= 500) return 1000 - currentPoints;
  return 500 - currentPoints;
}

/**
 * Format category name for display
 */
export function formatCategory(category: string): string {
  return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
}
