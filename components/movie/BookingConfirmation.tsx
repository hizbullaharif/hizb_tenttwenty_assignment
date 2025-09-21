import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useMovieTheme } from '../../hooks/useMovieTheme';
import type { Seat } from '../../types/booking';
import type { MovieDetail } from '../../types/movie';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Text } from '../ui/Text';

interface BookingConfirmationProps {
  movie: MovieDetail;
  selectedSeats: Seat[];
  totalPrice: number;
  bookingId?: string;
  onDone: () => void;
  onBookAnother?: () => void;
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  movie,
  selectedSeats,
  totalPrice,
  bookingId = 'BK' + Date.now().toString().slice(-6),
  onDone,
  onBookAnother,
}) => {
  const theme = useMovieTheme();

  const tax = totalPrice * 0.1;
  const finalTotal = totalPrice + tax;

  const renderBookingDetails = () => (
    <View style={styles.bookingDetails}>
      <View style={styles.successIcon}>
        <Text variant="h1">✅</Text>
      </View>
      
      <Text variant="h3" weight="bold" align="center" style={styles.successTitle}>
        Booking Confirmed!
      </Text>
      
      <Text variant="body" color="icon" align="center" style={styles.successMessage}>
        Your tickets have been successfully booked
      </Text>

      <View style={styles.bookingIdContainer}>
        <Text variant="movieMeta" color="icon">Booking ID</Text>
        <Text variant="h4" weight="bold" color="tint">{bookingId}</Text>
      </View>
    </View>
  );

  const renderMovieInfo = () => (
    <View style={styles.movieInfo}>
      <Text variant="h4" weight="semibold" style={styles.sectionTitle}>
        Movie Details
      </Text>
      
      <View style={styles.movieRow}>
        <Text variant="body" weight="medium">{movie.title}</Text>
      </View>
      
      <View style={styles.movieRow}>
        <Text variant="movieMeta" color="icon">Release Date</Text>
        <Text variant="movieMeta">{formatDate(movie.release_date)}</Text>
      </View>
      
      {movie.runtime && (
        <View style={styles.movieRow}>
          <Text variant="movieMeta" color="icon">Duration</Text>
          <Text variant="movieMeta">
            {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
          </Text>
        </View>
      )}
      
      {movie.genres && movie.genres.length > 0 && (
        <View style={styles.movieRow}>
          <Text variant="movieMeta" color="icon">Genre</Text>
          <Text variant="movieMeta">{movie.genres[0].name}</Text>
        </View>
      )}
    </View>
  );

  const renderSeatInfo = () => (
    <View style={styles.seatInfo}>
      <Text variant="h4" weight="semibold" style={styles.sectionTitle}>
        Seat Information
      </Text>
      
      <View style={styles.seatRow}>
        <Text variant="movieMeta" color="icon">Selected Seats</Text>
        <Text variant="movieMeta" weight="medium">
          {selectedSeats.map(seat => `${seat.row}${seat.number}`).join(', ')}
        </Text>
      </View>
      
      <View style={styles.seatRow}>
        <Text variant="movieMeta" color="icon">Number of Seats</Text>
        <Text variant="movieMeta" weight="medium">{selectedSeats.length}</Text>
      </View>
      
      {/* Group seats by type */}
      {Object.entries(
        selectedSeats.reduce((acc, seat) => {
          if (!acc[seat.type]) acc[seat.type] = 0;
          acc[seat.type]++;
          return acc;
        }, {} as Record<string, number>)
      ).map(([type, count]) => (
        <View key={type} style={styles.seatRow}>
          <Text variant="movieMeta" color="icon">
            {type.charAt(0).toUpperCase() + type.slice(1)} Seats
          </Text>
          <Text variant="movieMeta" weight="medium">{count}</Text>
        </View>
      ))}
    </View>
  );

  const renderPriceInfo = () => (
    <View style={styles.priceInfo}>
      <Text variant="h4" weight="semibold" style={styles.sectionTitle}>
        Payment Summary
      </Text>
      
      <View style={styles.priceRow}>
        <Text variant="body">Subtotal</Text>
        <Text variant="body">{formatCurrency(totalPrice)}</Text>
      </View>
      
      <View style={styles.priceRow}>
        <Text variant="movieMeta" color="icon">Tax (10%)</Text>
        <Text variant="movieMeta" color="icon">{formatCurrency(tax)}</Text>
      </View>
      
      <View style={[styles.priceRow, styles.totalRow]}>
        <Text variant="h4" weight="bold">Total Paid</Text>
        <Text variant="h4" weight="bold" color="tint">
          {formatCurrency(finalTotal)}
        </Text>
      </View>
    </View>
  );

  return (
    <Card variant="elevated" style={styles.container}>
      {renderBookingDetails()}
      {renderMovieInfo()}
      {renderSeatInfo()}
      {renderPriceInfo()}
      
      <View style={styles.actions}>
        <Button
          title="Done"
          onPress={onDone}
          variant="primary"
          style={styles.doneButton}
        />
        
        {onBookAnother && (
          <Button
            title="Book Another Movie"
            onPress={onBookAnother}
            variant="outline"
            style={styles.bookAnotherButton}
          />
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
  },
  bookingDetails: {
    alignItems: 'center',
    marginBottom: 24,
  },
  successIcon: {
    marginBottom: 16,
  },
  successTitle: {
    marginBottom: 8,
  },
  successMessage: {
    marginBottom: 16,
  },
  bookingIdContainer: {
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 4,
  },
  movieInfo: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  seatInfo: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  priceInfo: {
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  movieRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  seatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalRow: {
    paddingTop: 12,
    borderTopWidth: 2,
    borderTopColor: '#000000',
    marginTop: 8,
  },
  actions: {
    gap: 12,
  },
  doneButton: {
    flex: 1,
  },
  bookAnotherButton: {
    flex: 1,
  },
});