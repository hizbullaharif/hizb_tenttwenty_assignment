import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { mmkvStorage } from '../services/storage/mmkv';
import type { BookingState, BookingStep, Seat } from '../types/booking';
import type { MovieDetail } from '../types/movie';

interface BookingStoreState extends BookingState {
  // Actions
  setCurrentMovie: (movie: MovieDetail | null) => void;
  setBookingStep: (step: BookingStep) => void;
  selectSeat: (seat: Seat) => void;
  deselectSeat: (seatId: string) => void;
  clearSelectedSeats: () => void;
  calculateTotalPrice: () => void;
  resetBooking: () => void;
  
  // Computed values
  selectedSeatCount: number;
  canProceedToPayment: boolean;
}

export const useBookingStore = create<BookingStoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      selectedSeats: [],
      currentMovie: null,
      bookingStep: 'movie-selection',
      totalPrice: 0,
      selectedSeatCount: 0,
      canProceedToPayment: false,
      
      // Actions
      setCurrentMovie: (movie: MovieDetail | null) => {
        set({ currentMovie: movie });
      },
      
      setBookingStep: (step: BookingStep) => {
        set({ bookingStep: step });
      },
      
      selectSeat: (seat: Seat) => {
        const { selectedSeats } = get();
        const isAlreadySelected = selectedSeats.find(s => s.id === seat.id);
        
        if (!isAlreadySelected && seat.status === 'available') {
          const updatedSeat = { ...seat, status: 'selected' as const };
          const newSelectedSeats = [...selectedSeats, updatedSeat];
          
          set({ 
            selectedSeats: newSelectedSeats,
            selectedSeatCount: newSelectedSeats.length,
            totalPrice: newSelectedSeats.reduce((total, s) => total + s.price, 0),
            canProceedToPayment: newSelectedSeats.length > 0,
          });
        }
      },
      
      deselectSeat: (seatId: string) => {
        const { selectedSeats } = get();
        const newSelectedSeats = selectedSeats.filter(seat => seat.id !== seatId);
        
        set({ 
          selectedSeats: newSelectedSeats,
          selectedSeatCount: newSelectedSeats.length,
          totalPrice: newSelectedSeats.reduce((total, s) => total + s.price, 0),
          canProceedToPayment: newSelectedSeats.length > 0,
        });
      },
      
      clearSelectedSeats: () => {
        set({ 
          selectedSeats: [],
          selectedSeatCount: 0,
          totalPrice: 0,
          canProceedToPayment: false,
        });
      },
      
      calculateTotalPrice: () => {
        const { selectedSeats } = get();
        const totalPrice = selectedSeats.reduce((total, seat) => total + seat.price, 0);
        set({ totalPrice });
      },
      
      resetBooking: () => {
        set({
          selectedSeats: [],
          currentMovie: null,
          bookingStep: 'movie-selection',
          totalPrice: 0,
          selectedSeatCount: 0,
          canProceedToPayment: false,
        });
      },
    }),
    {
      name: 'booking-storage',
      storage: createJSONStorage(() => mmkvStorage),
      // Only persist essential booking data, not computed values
      partialize: (state) => ({
        selectedSeats: state.selectedSeats,
        currentMovie: state.currentMovie,
        bookingStep: state.bookingStep,
        totalPrice: state.totalPrice,
      }),
    }
  )
);