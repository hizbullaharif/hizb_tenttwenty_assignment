export const TMDB_IMAGE_BASE_URL = process.env.EXPO_PUBLIC_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p/w500';

export const IMAGE_SIZES = {
  POSTER: {
    SMALL: 'w185',
    MEDIUM: 'w342',
    LARGE: 'w500',
    ORIGINAL: 'original',
  },
  BACKDROP: {
    SMALL: 'w300',
    MEDIUM: 'w780',
    LARGE: 'w1280',
    ORIGINAL: 'original',
  },
} as const;

export const SEAT_TYPES = {
  REGULAR: 'regular',
  PREMIUM: 'premium',
  VIP: 'vip',
} as const;

export const SEAT_STATUS = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
  SELECTED: 'selected',
} as const;

export const BOOKING_STEPS = {
  MOVIE_SELECTION: 'movie-selection',
  SEAT_SELECTION: 'seat-selection',
  PAYMENT: 'payment',
  CONFIRMATION: 'confirmation',
} as const;