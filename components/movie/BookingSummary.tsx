import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useMovieTheme } from '../../hooks/useMovieTheme';
import type { Seat } from '../../types/booking';
import type { MovieDetail } from '../../types/movie';
import { formatCurrency } from '../../utils/formatters';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Text } from '../ui/Text';

interface BookingSummaryProps {
  movie: MovieDetail;
  selectedSeats: Seat[];
  totalPrice: number;
  onContinue: () => void;
  onCancel?: () => void;
  loading?: boolean;
  showMovieInfo?: boolean;
}

export const BookingSummary: React.FC<BookingSummaryProps> = ({
  movie,
  selectedSeats,
  totalPrice,
  onContinue,
  onCancel,
  loading = false,
  showMovieInfo = true,
}) => {
  const theme = useMovieTheme();

  const selectedSeatCount = selectedSeats.length;
  const canContinue = selectedSeatCount > 0;

  const renderMovieInfo = () => {
    if (!showMovieInfo) return null;

    return (
      <View style={styles.movieInfo}>
        <Text variant="movieTitle" weight="semibold" numberOfLines={1}>
          {movie.title}
        </Text>
        <Text variant="movieMeta" color="icon">
          {movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : ''}
          {movie.genres && movie.genres.length > 0 && ` • ${movie.genres[0].name}`}
        </Text>
      </View>
    );
  };

  const renderSeatDetails = () => {
    if (selectedSeats.length === 0) {
      return (
        <View style={styles.noSeatsContainer}>
          <Text variant="body" color="icon" align="center">
            No seats selected
          </Text>
          <Text variant="caption" color="icon" align="center">
            Please select seats to continue
          </Text>
        </View>
      );
    }

    // Group seats by type for better display
    const seatsByType = selectedSeats.reduce((acc, seat) => {
      if (!acc[seat.type]) {
        acc[seat.type] = [];
      }
      acc[seat.type].push(seat);
      return acc;
    }, {} as Record<string, Seat[]>);

    return (
      <View style={styles.seatDetails}>
        <Text variant="h4" weight="semibold" style={styles.sectionTitle}>
          Selected Seats ({selectedSeatCount})
        </Text>
        
        {Object.entries(seatsByType).map(([type, seats]) => (
          <View key={type} style={styles.seatTypeGroup}>
            <View style={styles.seatTypeHeader}>
              <Text variant="movieMeta" weight="medium" style={styles.seatTypeTitle}>
                {type.charAt(0).toUpperCase() + type.slice(1)} ({seats.length})
              </Text>
              <Text variant="movieMeta" color="icon">
                {formatCurrency(seats[0].price)} each
              </Text>
            </View>
            
            <View style={styles.seatList}>
              {seats.map((seat, index) => (
                <View key={seat.id} style={styles.seatItem}>
                  <Text variant="caption" color="icon">
                    {seat.row}{seat.number}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderPriceBreakdown = () => {
    if (selectedSeats.length === 0) return null;

    // Calculate subtotal by seat type
    const breakdown = selectedSeats.reduce((acc, seat) => {
      const key = seat.type;
      if (!acc[key]) {
        acc[key] = { count: 0, price: seat.price, total: 0 };
      }
      acc[key].count += 1;
      acc[key].total += seat.price;
      return acc;
    }, {} as Record<string, { count: number; price: number; total: number }>);

    const subtotal = totalPrice;
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    return (
      <View style={styles.priceBreakdown}>
        <Text variant="h4" weight="semibold" style={styles.sectionTitle}>
          Price Breakdown
        </Text>
        
        {Object.entries(breakdown).map(([type, info]) => (
          <View key={type} style={styles.priceRow}>
            <Text variant="body">
              {info.count}x {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
            <Text variant="body">
              {formatCurrency(info.total)}
            </Text>
          </View>
        ))}
        
        <View style={[styles.priceRow, styles.subtotalRow]}>
          <Text variant="movieMeta" weight="medium">
            Subtotal
          </Text>
          <Text variant="movieMeta" weight="medium">
            {formatCurrency(subtotal)}
          </Text>
        </View>
        
        <View style={styles.priceRow}>
          <Text variant="movieMeta" color="icon">
            Tax (10%)
          </Text>
          <Text variant="movieMeta" color="icon">
            {formatCurrency(tax)}
          </Text>
        </View>
        
        <View style={[styles.priceRow, styles.totalRow]}>
          <Text variant="h4" weight="bold">
            Total
          </Text>
          <Text variant="h4" weight="bold" color="tint">
            {formatCurrency(total)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <Card variant="elevated" style={styles.container}>
      {renderMovieInfo()}
      {renderSeatDetails()}
      {renderPriceBreakdown()}
      
      <View style={styles.actions}>
        {onCancel && (
          <Button
            title="Cancel"
            onPress={onCancel}
            variant="outline"
            style={styles.cancelButton}
          />
        )}
        <Button
          title={`Continue • ${formatCurrency(totalPrice + (totalPrice * 0.1))}`}
          onPress={onContinue}
          disabled={!canContinue}
          loading={loading}
          style={styles.continueButton}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
  },
  movieInfo: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  noSeatsContainer: {
    paddingVertical: 20,
  },
  seatDetails: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  seatTypeGroup: {
    marginBottom: 12,
  },
  seatTypeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  seatTypeTitle: {
    flex: 1,
  },
  seatList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  seatItem: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  priceBreakdown: {
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e0e0e0',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subtotalRow: {
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e0e0e0',
  },
  totalRow: {
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: '#000000',
    marginTop: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
  continueButton: {
    flex: 2,
  },
});