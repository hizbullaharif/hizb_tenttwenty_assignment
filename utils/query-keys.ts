export const queryKeys = {
  // Movies
  movies: {
    all: ['movies'] as const,
    upcoming: (page: number) => [...queryKeys.movies.all, 'upcoming', page] as const,
    detail: (id: number) => [...queryKeys.movies.all, 'detail', id] as const,
    videos: (id: number) => [...queryKeys.movies.all, 'videos', id] as const,
    images: (id: number) => [...queryKeys.movies.all, 'images', id] as const,
  },
  
  // Search
  search: {
    all: ['search'] as const,
    movies: (query: string, page: number) => [...queryKeys.search.all, 'movies', query, page] as const,
  },
  
  // Genres
  genres: {
    all: ['genres'] as const,
    movies: () => [...queryKeys.genres.all, 'movies'] as const,
  },
} as const;