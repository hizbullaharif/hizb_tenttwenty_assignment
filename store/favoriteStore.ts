import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { mmkvStorage } from '../services/storage/mmkv';
import type { Movie } from '../types/movie';

interface FavoriteState {
  favorites: Movie[];
  addFavorite: (movie: Movie) => void;
  removeFavorite: (movieId: number) => void;
  isFavorite: (movieId: number) => boolean;
  clearFavorites: () => void;
}

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favorites: [],
      
      addFavorite: (movie: Movie) => {
        const { favorites } = get();
        if (!favorites.find(fav => fav.id === movie.id)) {
          set({ favorites: [...favorites, movie] });
        }
      },
      
      removeFavorite: (movieId: number) => {
        const { favorites } = get();
        set({ favorites: favorites.filter(fav => fav.id !== movieId) });
      },
      
      isFavorite: (movieId: number) => {
        const { favorites } = get();
        return favorites.some(fav => fav.id === movieId);
      },
      
      clearFavorites: () => {
        set({ favorites: [] });
      },
    }),
    {
      name: 'favorite-storage',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);