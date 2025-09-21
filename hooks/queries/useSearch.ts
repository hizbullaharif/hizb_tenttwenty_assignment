import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { tmdbService } from '../../services/api/tmdb';
import type { SearchResponse } from '../../services/api/types';
import { isRetryableError, isValidSearchQuery, sanitizeSearchQuery } from '../../utils/helpers';
import { queryKeys } from '../../utils/query-keys';

// Hook for searching movies with debouncing
export const useMovieSearch = (query: string, page: number = 1, enabled: boolean = true) => {
  const sanitizedQuery = sanitizeSearchQuery(query);
  const isValidQuery = isValidSearchQuery(sanitizedQuery);
  
  return useQuery({
    queryKey: queryKeys.search.movies(sanitizedQuery, page),
    queryFn: () => tmdbService.searchMovies(sanitizedQuery, page),
    enabled: enabled && isValidQuery,
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 15 * 60 * 1000, // 15 minutes
    keepPreviousData: true,
    retry: (failureCount, error) => {
      if (failureCount >= 2) return false; // Fewer retries for search
      return isRetryableError(error);
    },
    retryDelay: (attemptIndex) => Math.min(500 * 2 ** attemptIndex, 5000), // Faster retry for search
  });
};

// Hook for infinite scrolling search results
export const useInfiniteMovieSearch = (query: string, enabled: boolean = true) => {
  const sanitizedQuery = sanitizeSearchQuery(query);
  const isValidQuery = isValidSearchQuery(sanitizedQuery);
  
  return useInfiniteQuery({
    queryKey: [...queryKeys.search.movies(sanitizedQuery, 1), 'infinite'],
    queryFn: ({ pageParam = 1 }) => tmdbService.searchMovies(sanitizedQuery, pageParam),
    getNextPageParam: (lastPage: SearchResponse) => {
      if (lastPage.page && lastPage.total_pages && lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    enabled: enabled && isValidQuery,
    staleTime: 10 * 60 * 1000,
    cacheTime: 15 * 60 * 1000,
    retry: (failureCount, error) => {
      if (failureCount >= 2) return false;
      return isRetryableError(error);
    },
  });
};

// Hook for search suggestions (could be enhanced with popular searches)
export const useSearchSuggestions = (query: string) => {
  const sanitizedQuery = sanitizeSearchQuery(query);
  
  return useQuery({
    queryKey: ['search', 'suggestions', sanitizedQuery],
    queryFn: async () => {
      // For now, return empty suggestions
      // In a real app, this could fetch popular searches or autocomplete suggestions
      return [];
    },
    enabled: sanitizedQuery.length > 0 && sanitizedQuery.length < 3,
    staleTime: 30 * 60 * 1000, // 30 minutes
    cacheTime: 60 * 60 * 1000, // 1 hour
  });
};