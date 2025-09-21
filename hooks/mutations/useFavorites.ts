import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useFavoriteStore } from '../../store/favoriteStore';
import type { Movie } from '../../types/movie';

// Hook for adding a movie to favorites
export const useAddToFavorites = () => {
  const queryClient = useQueryClient();
  const addFavorite = useFavoriteStore(state => state.addFavorite);
  
  return useMutation({
    mutationFn: async (movie: Movie) => {
      // Simulate async operation (could be API call in the future)
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          addFavorite(movie);
          resolve();
        }, 100);
      });
    },
    onSuccess: () => {
      // Invalidate any queries that might be affected
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
    onError: (error) => {
      console.error('Error adding to favorites:', error);
    },
  });
};

// Hook for removing a movie from favorites
export const useRemoveFromFavorites = () => {
  const queryClient = useQueryClient();
  const removeFavorite = useFavoriteStore(state => state.removeFavorite);
  
  return useMutation({
    mutationFn: async (movieId: number) => {
      // Simulate async operation
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          removeFavorite(movieId);
          resolve();
        }, 100);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
    onError: (error) => {
      console.error('Error removing from favorites:', error);
    },
  });
};

// Hook for toggling favorite status
export const useToggleFavorite = () => {
  const isFavorite = useFavoriteStore(state => state.isFavorite);
  const addToFavorites = useAddToFavorites();
  const removeFromFavorites = useRemoveFromFavorites();
  
  return {
    toggleFavorite: (movie: Movie) => {
      if (isFavorite(movie.id)) {
        removeFromFavorites.mutate(movie.id);
      } else {
        addToFavorites.mutate(movie);
      }
    },
    isLoading: addToFavorites.isLoading || removeFromFavorites.isLoading,
    error: addToFavorites.error || removeFromFavorites.error,
  };
};