import type { Movie } from '../../types/movie';
import { storage } from './mmkv';

const FAVORITES_KEY = 'favorites';

export const favoritesStorage = {
  // Get all favorites
  getFavorites: (): Movie[] => {
    try {
      const favoritesJson = storage.getString(FAVORITES_KEY);
      return favoritesJson ? JSON.parse(favoritesJson) : [];
    } catch (error) {
      console.error('Error getting favorites from storage:', error);
      return [];
    }
  },

  // Save favorites
  saveFavorites: (favorites: Movie[]): void => {
    try {
      storage.set(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites to storage:', error);
    }
  },

  // Add a movie to favorites
  addFavorite: (movie: Movie): void => {
    try {
      const favorites = favoritesStorage.getFavorites();
      const isAlreadyFavorite = favorites.some(fav => fav.id === movie.id);
      
      if (!isAlreadyFavorite) {
        const updatedFavorites = [...favorites, movie];
        favoritesStorage.saveFavorites(updatedFavorites);
      }
    } catch (error) {
      console.error('Error adding favorite:', error);
    }
  },

  // Remove a movie from favorites
  removeFavorite: (movieId: number): void => {
    try {
      const favorites = favoritesStorage.getFavorites();
      const updatedFavorites = favorites.filter(fav => fav.id !== movieId);
      favoritesStorage.saveFavorites(updatedFavorites);
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  },

  // Check if a movie is in favorites
  isFavorite: (movieId: number): boolean => {
    try {
      const favorites = favoritesStorage.getFavorites();
      return favorites.some(fav => fav.id === movieId);
    } catch (error) {
      console.error('Error checking favorite status:', error);
      return false;
    }
  },

  // Clear all favorites
  clearFavorites: (): void => {
    try {
      storage.delete(FAVORITES_KEY);
    } catch (error) {
      console.error('Error clearing favorites:', error);
    }
  },
};