import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { mmkvStorage } from '../services/storage/mmkv';

interface AppState {
  // UI state
  searchHistory: string[];
  theme: 'light' | 'dark' | 'system';
  
  // Actions
  addToSearchHistory: (query: string) => void;
  removeFromSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      searchHistory: [],
      theme: 'system',
      
      // Actions
      addToSearchHistory: (query: string) => {
        const { searchHistory } = get();
        const trimmedQuery = query.trim();
        
        if (trimmedQuery && !searchHistory.includes(trimmedQuery)) {
          // Add to beginning and limit to 10 items
          const newHistory = [trimmedQuery, ...searchHistory].slice(0, 10);
          set({ searchHistory: newHistory });
        }
      },
      
      removeFromSearchHistory: (query: string) => {
        const { searchHistory } = get();
        set({ searchHistory: searchHistory.filter(item => item !== query) });
      },
      
      clearSearchHistory: () => {
        set({ searchHistory: [] });
      },
      
      setTheme: (theme: 'light' | 'dark' | 'system') => {
        set({ theme });
      },
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);