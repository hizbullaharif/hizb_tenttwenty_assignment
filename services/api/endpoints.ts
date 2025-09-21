export const API_ENDPOINTS = {
  // Movies
  UPCOMING_MOVIES: 'movie/upcoming',
  MOVIE_DETAILS: (id: number) => `/movie/${id}`,
  MOVIE_VIDEOS: (id: number) => `/movie/${id}/videos`,
  MOVIE_IMAGES: (id: number) => `/movie/${id}/images`,
  
  // Search
  SEARCH_MOVIES: '/search/multi',
  // Genres
  GENRES: '/genre/movie/list',
} as const;