import { useQuery } from '@tanstack/react-query';
import { tmdbService } from '../../services/api/tmdb';
import { queryKeys } from '../../utils/query-keys';

// Hook for fetching movie genres
export const useGenres = () => {
  return useQuery({
    queryKey: queryKeys.genres.movies(),
    queryFn: () => tmdbService.getGenres(),
    staleTime: 60 * 60 * 1000, // 1 hour - genres rarely change
    cacheTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};