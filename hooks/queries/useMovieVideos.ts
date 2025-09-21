import { useQuery } from '@tanstack/react-query';
import { tmdbService } from '../../services/api/tmdb';
import { isRetryableError, isValidMovieId } from '../../utils/helpers';
import { queryKeys } from '../../utils/query-keys';

// Hook for fetching movie videos/trailers
export const useMovieVideos = (movieId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.movies.videos(movieId),
    queryFn: () => tmdbService.getMovieVideos(movieId),
    enabled: enabled && isValidMovieId(movieId),
    staleTime: 30 * 60 * 1000, // 30 minutes
    cacheTime: 60 * 60 * 1000, // 1 hour
    retry: (failureCount, error) => {
      if (failureCount >= 2) return false;
      return isRetryableError(error);
    },
  });
};

// Hook for getting the first available trailer key
export const useMovieTrailer = (movieId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: [...queryKeys.movies.videos(movieId), 'trailer'],
    queryFn: () => tmdbService.getMovieTrailer(movieId),
    enabled: enabled && isValidMovieId(movieId),
    staleTime: 30 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
    retry: (failureCount, error) => {
      if (failureCount >= 2) return false;
      return isRetryableError(error);
    },
    // Return null instead of throwing error if no trailer found
    useErrorBoundary: false,
  });
};