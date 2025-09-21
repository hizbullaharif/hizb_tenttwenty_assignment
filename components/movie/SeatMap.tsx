import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { useMovieTheme } from '../../hooks/useMovieTheme';
import type { Seat } from '../../types/booking';
import { Text } from '../ui/Text';

interface SeatMapProps {
  seats: Seat[];
  onSeatPress: (seat: Seat) => void;
  selectedSeats: Seat[];
  rows?: number;
  seatsPerRow?: number;
}

export const SeatMap: React.FC<SeatMapProps> = ({
  seats,
  onSeatPress,
  selectedSeats,
  rows = 8,
  seatsPerRow = 10,
}) => {
  const theme = useMovieTheme();

  const getSeatStyle = (seat: Seat) => {
    const isSelected = selectedSeats.some(s => s.id === seat.id);
    
    let backgroundColor = theme.colors.seatAvailable;
    let borderColor = 'transparent';
    
    if (seat.status === 'occupied') {
      backgroundColor = theme.colors.seatOccupied;
    } else if (isSelected) {
      backgroundColor = theme.colors.seatSelected;
      borderColor = theme.colors.tint;
    } else if (seat.type === 'premium') {
      backgroundColor = theme.colors.warning;
    } else if (seat.type === 'vip') {
      backgroundColor = theme.colors.rating;
    }

    return {
      ...styles.seat,
      backgroundColor,
      borderColor,
      borderWidth: isSelected ? 2 : 0,
    };
  };

  const getSeatTextColor = (seat: Seat) => {
    return seat.status === 'occupied' ? '#999999' : '#FFFFFF';
  };

  const renderSeatRow = (rowLetter: string) => {
    const rowSeats = seats.filter(seat => seat.row === rowLetter);
    
    return (
      <View key={rowLetter} style={styles.seatRow}>
        <Text variant="caption" color="icon" style={styles.rowLabel}>
          {rowLetter}
        </Text>
        
        <View style={styles.rowSeats}>
          {rowSeats.map((seat) => (
            <TouchableOpacity
              key={seat.id}
              style={getSeatStyle(seat)}
              onPress={() => onSeatPress(seat)}
              disabled={seat.status === 'occupied'}
              activeOpacity={0.7}
            >
              <Text 
                variant="caption" 
                style={[styles.seatText, { color: getSeatTextColor(seat) }]}
              >
                {seat.number}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <Text variant="caption" color="icon" style={styles.rowLabel}>
          {rowLetter}
        </Text>
      </View>
    );
  };

  const renderScreen = () => (
    <View style={styles.screenContainer}>
      <View style={[styles.screen, { backgroundColor: theme.colors.movieCardBorder }]}>
        <Text variant="caption" color="icon" align="center">
          SCREEN
        </Text>
      </View>
    </View>
  );

  const renderLegend = () => (
    <View style={styles.legend}>
      <View style={styles.legendItem}>
        <View style={[styles.legendSeat, { backgroundColor: theme.colors.seatAvailable }]} />
        <Text variant="caption" color="icon">Available</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.legendSeat, { backgroundColor: theme.colors.seatSelected }]} />
        <Text variant="caption" color="icon">Selected</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.legendSeat, { backgroundColor: theme.colors.seatOccupied }]} />
        <Text variant="caption" color="icon">Occupied</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.legendSeat, { backgroundColor: theme.colors.warning }]} />
        <Text variant="caption" color="icon">Premium</Text>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.legendSeat, { backgroundColor: theme.colors.rating }]} />
        <Text variant="caption" color="icon">VIP</Text>
      </View>
    </View>
  );

  // Get unique row letters and sort them
  const rowLetters = Array.from(new Set(seats.map(seat => seat.row))).sort();

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {renderScreen()}
      
      <View style={styles.seatGrid}>
        {rowLetters.map(renderSeatRow)}
      </View>

      {renderLegend()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  screenContainer: {
    width: '80%',
    marginBottom: 32,
  },
  screen: {
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  seatGrid: {
    marginBottom: 24,
  },
  seatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rowLabel: {
    width: 20,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  rowSeats: {
    flexDirection: 'row',
    gap: 6,
  },
  seat: {
    width: 28,
    height: 28,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  seatText: {
    fontSize: 10,
    fontFamily: 'Poppins_700Bold',
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 20,
  },
  legendItem: {
    alignItems: 'center',
    gap: 4,
  },
  legendSeat: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
});