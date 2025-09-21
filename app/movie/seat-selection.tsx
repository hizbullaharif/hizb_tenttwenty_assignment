import { Stack, router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BookingSummary } from '../../components/movie/BookingSummary';
import { SeatMap } from '../../components/movie/SeatMap';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Text } from '../../components/ui/Text';
import { useMovieDetails } from '../../hooks/queries/useMovieDetails';
import { useMovieTheme } from '../../hooks/useMovieTheme';
import { useBookingStore } from '../../store/bookingStore';
import type { Seat } from '../../types/booking';
import { formatErrorMessage } from '../../utils/helpers';

// Mock seat data - in a real app, this would come from an API
const generateMockSeats = (): Seat[] => {
  const seats: Seat[] = [];
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const seatsPerRow = 10;
  
  rows.forEach((row, rowIndex) => {
    for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
      const isOccupied = Math.random() < 0.3; // 30% chance of being occupied
      const seatType = rowIndex < 2 ? 'vip' : rowIndex < 5 ? 'premium' : 'regular';
      const price = seatType === 'vip' ? 25 : seatType === 'premium' ? 20 : 15;
      
      seats.push({
        id: `${row}${seatNum}`,
        row,
        number: seatNum,
        status: isOccupied ? 'occupied' : 'available',
        type: seatType,
        price,
      });
    }
  });
  
  return seats;
};

export default function SeatSelectionScreen() {
  const theme = useMovieTheme();
  const insets = useSafeAreaInsets();
  const { movieId } = useLocalSearchParams<{ movieId: string }>();
  const movieIdNum = parseInt(movieId || '0', 10);
  
  const [seats] = useState<Seat[]>(generateMockSeats());
  const [isBooking, setIsBooking] = useState(false);
  const [isBookingComplete, setIsBookingComplete] = useState(false);
  
  const { data: movie, isLoading, error } = useMovieDetails(movieIdNum);
  const { selectedSeats, selectSeat, deselectSeat, totalPrice, setCurrentMovie } = useBookingStore();

  // Set current movie in booking store
  React.useEffect(() => {
    if (movie) {
      setCurrentMovie(movie);
    }
  }, [movie, setCurrentMovie]);

  const containerStyle = {
    flex: 1,
    backgroundColor: theme.colors.background,
  };

  if (isLoading) {
    return (
      <View style={containerStyle}>
        <Stack.Screen options={{ title: 'Loading...' }} />
        <LoadingSpinner message="Loading movie details..." />
      </View>
    );
  }

  if (error || !movie) {
    return (
      <View style={containerStyle}>
        <Stack.Screen options={{ title: 'Error' }} />
        <ErrorMessage
          message={formatErrorMessage(error) || 'Failed to load movie details'}
          onRetry={() => router.back()}
          retryText="Go Back"
        />
      </View>
    );
  }

  const handleSeatPress = (seat: Seat) => {
    const isSelected = selectedSeats.some(s => s.id === seat.id);
    
    if (isSelected) {
      deselectSeat(seat.id);
    } else if (seat.status === 'available') {
      selectSeat(seat);
    }
  };

  const handleContinue = async () => {
    setIsBooking(true);
    
    // Simulate booking process
    setTimeout(() => {
      setIsBooking(false);
      setIsBookingComplete(true);
      console.log('Booking completed with seats:', selectedSeats);
    }, 2000);
  };

  const handleBookingDone = () => {
    // Reset booking state and navigate back to movies
    setIsBookingComplete(false);
    router.push('/(tabs)/');
  };

  const handleBookAnother = () => {
    // Reset current booking and navigate back to movies
    setIsBookingComplete(false);
    router.push('/(tabs)/');
  };

  const handleCancel = () => {
    router.back();
  };

  // Show booking confirmation if booking is complete
  if (isBookingComplete) {
    return (
      <View style={containerStyle}>
        <Stack.Screen 
          options={{ 
            title: 'Booking Confirmed',
            headerBackTitle: 'Back',
            headerLeft: () => null, // Disable back button on confirmation
          }} 
        />
        
        <View style={[styles.confirmationContainer, { paddingBottom: insets.bottom }]}>
          <BookingConfirmation
            movie={movie}
            selectedSeats={selectedSeats}
            totalPrice={totalPrice}
            onDone={handleBookingDone}
            onBookAnother={handleBookAnother}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      <Stack.Screen 
        options={{ 
          title: `${movie.title} - Select Seats`,
          headerBackTitle: 'Back',
        }} 
      />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text variant="h3" weight="semibold" align="center">
            Choose Your Seats
          </Text>
          <Text variant="body" color="icon" align="center">
            Tap on available seats to select them
          </Text>
        </View>

        <View style={styles.seatMapContainer}>
          <SeatMap
            seats={seats}
            onSeatPress={handleSeatPress}
            selectedSeats={selectedSeats}
          />
        </View>
      </View>

      <View style={[styles.bottomContainer, { paddingBottom: insets.bottom }]}>
        <BookingSummary
          movie={movie}
          selectedSeats={selectedSeats}
          totalPrice={totalPrice}
          onContinue={handleContinue}
          onCancel={handleCancel}
          loading={isBooking}
          showMovieInfo={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  seatMapContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  bottomContainer: {
    backgroundColor: 'transparent',
  },
  confirmationContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});