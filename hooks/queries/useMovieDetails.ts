import { useQuery, useQueryClient } from '@tanstack/react-query';
import { tmdbService } from '../../services/api/tmdb';
import { isRetryableError, isValidMovieId } from '../../utils/helpers';
import { queryKeys } from '../../utils/query-keys';

// Hook for fetching detailed movie information
export const useMovieDetails = (movieId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.movies.detail(movieId),
    queryFn: () => tmdbService.getMovieDetails(movieId),
    enabled: enabled && isValidMovieId(movieId),
    staleTime: 15 * 60 * 1000, // 15 minutes - movie details don't change often
    cacheTime: 30 * 60 * 1000, // 30 minutes
    retry: (failureCount, error) => {
      if (failureCount >= 3) return false;
      return isRetryableError(error);
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Hook for fetching movie images
export const useMovieImages = (movieId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.movies.images(movieId),
    queryFn: () => tmdbService.getMovieImages(movieId),
    enabled: enabled && isValidMovieId(movieId),
    staleTime: 30 * 60 * 1000, // 30 minutes - images rarely change
    cacheTime: 60 * 60 * 1000, // 1 hour
    retry: (failureCount, error) => {
      if (failureCount >= 2) return false; // Fewer retries for images
      return isRetryableError(error);
    },
  });
};

// Hook for prefetching movie details
export const usePrefetchMovieDetails = () => {
  const queryClient = useQueryClient();
  
  return (movieId: number) => {
    if (!isValidMovieId(movieId)) return;
    
    queryClient.prefetchQuery({
      queryKey: queryKeys.movies.detail(movieId),
      queryFn: () => tmdbService.getMovieDetails(movieId),
      staleTime: 15 * 60 * 1000,
    });
  };
};