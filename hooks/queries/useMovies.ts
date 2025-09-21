import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { tmdbService } from "../../services/api/tmdb";
import type { MovieListResponse } from "../../services/api/types";
import { isRetryableError } from "../../utils/helpers";
import { queryKeys } from "../../utils/query-keys";

// Hook for fetching upcoming movies with pagination
export const useUpcomingMovies = (
  page: number = 1,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: queryKeys.movies.upcoming(page),
    queryFn: () => tmdbService.getUpcomingMovies(page),
    enabled: enabled && page > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    keepPreviousData: true,
    retry: (failureCount, error) => {
      if (failureCount >= 3) return false;
      return isRetryableError(error);
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Hook for infinite scrolling upcoming movies
export const useInfiniteUpcomingMovies = () => {
  return useInfiniteQuery({
    queryKey: [...queryKeys.movies.upcoming(1), "infinite"],
    queryFn: ({ pageParam = 1 }) => tmdbService.getUpcomingMovies(pageParam),
    getNextPageParam: (lastPage: MovieListResponse) => {
      if (
        lastPage.page &&
        lastPage.total_pages &&
        lastPage.page < lastPage.total_pages
      ) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: (failureCount, error) => {
      if (failureCount >= 3) return false;
      return isRetryableError(error);
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Hook for prefetching upcoming movies
export const usePrefetchUpcomingMovies = () => {
  const queryClient = useQueryClient();

  return (page: number) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.movies.upcoming(page),
      queryFn: () => tmdbService.getUpcomingMovies(page),
      staleTime: 5 * 60 * 1000,
    });
  };
};
