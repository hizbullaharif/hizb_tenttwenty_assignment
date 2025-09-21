export interface Seat {
  id: string;
  row: string;
  number: number;
  status: 'available' | 'occupied' | 'selected';
  type: 'regular' | 'premium' | 'vip';
  price: number;
}

export interface BookingState {
  selectedSeats: Seat[];
  currentMovie: MovieDetail | null;
  bookingStep: BookingStep;
  totalPrice: number;
}

export type BookingStep = 
  | 'movie-selection' 
  | 'seat-selection' 
  | 'payment' 
  | 'confirmation';

import type { MovieDetail } from './movie';
