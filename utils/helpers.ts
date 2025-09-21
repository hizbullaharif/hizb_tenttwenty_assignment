import { tmdbService } from '../services/api/tmdb';

/**
 * Validates if a movie ID is valid
 */
export const isValidMovieId = (id: number | string): boolean => {
  const numId = typeof id === 'string' ? parseInt(id, 10) : id;
  return !isNaN(numId) && numId > 0;
};

/**
 * Safely gets the image URL with fallback
 */
export const getMovieImageUrl = (
  path: string | null, 
  size: string = 'w780',
  fallback: string = ''
): string => {
  if (!path) return fallback;
  return tmdbService.getImageUrl(path, size);
};

/**
 * Gets the primary trailer from a list of videos
 */
export const getPrimaryTrailer = (videos: any[]): string | null => {
  if (!videos || videos.length === 0) return null;
  
  // Find official trailer first
  const officialTrailer = videos.find(
    video => 
      video.site === 'YouTube' && 
      video.type === 'Trailer' && 
      video.official === true
  );
  
  if (officialTrailer) return officialTrailer.key;
  
  // Fallback to any trailer
  const anyTrailer = videos.find(
    video => video.site === 'YouTube' && video.type === 'Trailer'
  );
  
  return anyTrailer ? anyTrailer.key : null;
};

/**
 * Debounce function for search
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Validates search query
 */
export const isValidSearchQuery = (query: string): boolean => {
  return query.trim().length >= 2;
};

/**
 * Sanitizes search query
 */
export const sanitizeSearchQuery = (query: string): string => {
  return query.trim().replace(/[^\w\s-]/gi, '');
};

/**
 * Generates a unique key for React Query cache
 */
export const generateCacheKey = (prefix: string, ...args: (string | number)[]): string[] => {
  return [prefix, ...args.map(arg => String(arg))];
};

/**
 * Checks if an error is retryable
 */
export const isRetryableError = (error: any): boolean => {
  if (!error?.response) return true; // Network errors are retryable
  
  const status = error.response.status;
  // Don't retry client errors (4xx) except 429 (rate limit)
  if (status >= 400 && status < 500 && status !== 429) {
    return false;
  }
  
  return true; // Retry server errors (5xx) and rate limits
};

/**
 * Formats error message for user display
 */
export const formatErrorMessage = (error: any): string => {
  if (error?.type) {
    switch (error.type) {
      case 'NETWORK_ERROR':
        return 'Please check your internet connection and try again.';
      case 'TIMEOUT_ERROR':
        return 'Request timed out. Please try again.';
      case 'UNAUTHORIZED':
        return 'API key is invalid. Please check configuration.';
      case 'NOT_FOUND':
        return 'The requested content was not found.';
      case 'RATE_LIMITED':
        return 'Too many requests. Please wait a moment and try again.';
      case 'SERVER_ERROR':
        return 'Server error. Please try again later.';
      default:
        return error.message || 'An unexpected error occurred.';
    }
  }
  
  return error?.message || 'Something went wrong. Please try again.';
};