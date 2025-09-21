import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Dimensions, Modal, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useMovieTheme } from '../../hooks/useMovieTheme';
import type { MovieImage } from '../../services/api/types';
import { getMovieImageUrl } from '../../utils/helpers';
import { Button } from '../ui/Button';
import { Text } from '../ui/Text';

const { width, height } = Dimensions.get('window');
const IMAGE_WIDTH = (width - 48) / 3; // 3 images per row with padding

interface ImageGalleryProps {
  images: MovieImage[];
  title?: string;
  maxImages?: number;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  title = 'Images',
  maxImages = 6,
}) => {
  const theme = useMovieTheme();
  const insets = useSafeAreaInsets();
  const [selectedImage, setSelectedImage] = useState<MovieImage | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  if (!images || images.length === 0) {
    return null;
  }

  const displayImages = images.slice(0, maxImages);
  const remainingCount = images.length - maxImages;

  const openImageModal = (image: MovieImage) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const closeImageModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  const renderImageItem = (image: MovieImage, index: number) => {
    const imageUrl = getMovieImageUrl(image.file_path, 'w500');
    const isLastItem = index === displayImages.length - 1;
    const showOverlay = isLastItem && remainingCount > 0;

    return (
      <TouchableOpacity
        key={image.file_path}
        style={styles.imageItem}
        onPress={() => openImageModal(image)}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          contentFit="cover"
        />
        
        {showOverlay && (
          <View style={[styles.overlay, { backgroundColor: theme.colors.backdrop }]}>
            <Text variant="h4" style={styles.overlayText}>
              +{remainingCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderFullScreenModal = () => {
    if (!selectedImage) return null;

    const fullImageUrl = getMovieImageUrl(selectedImage.file_path, 'original');

    return (
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeImageModal}
      >
        <View style={[styles.modalContainer, { backgroundColor: theme.colors.backdrop }]}>
          <View style={[styles.modalHeader, { paddingTop: insets.top + 10 }]}>
            <Button
              title="✕ Close"
              onPress={closeImageModal}
              variant="ghost"
              size="small"
              textStyle={{ color: '#FFFFFF' }}
            />
          </View>

          <View style={styles.modalContent}>
            <Image
              source={{ uri: fullImageUrl }}
              style={styles.fullScreenImage}
              contentFit="contain"
            />
          </View>

          <View style={styles.modalFooter}>
            <Text variant="caption" style={styles.imageInfo}>
              {selectedImage.width} × {selectedImage.height}
              {selectedImage.vote_average > 0 && (
                <Text> • ⭐ {selectedImage.vote_average.toFixed(1)}</Text>
              )}
            </Text>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <Text variant="h4" weight="semibold" style={styles.title}>
        {title} ({images.length})
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {displayImages.map(renderImageItem)}
      </ScrollView>

      {renderFullScreenModal()}
    </View>
  );
};

// Backdrop-specific gallery
export const BackdropGallery: React.FC<{ images: MovieImage[] }> = ({ images }) => (
  <ImageGallery images={images} title="Backdrops" />
);

// Poster-specific gallery
export const PosterGallery: React.FC<{ images: MovieImage[] }> = ({ images }) => (
  <ImageGallery images={images} title="Posters" />
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  imageItem: {
    position: 'relative',
  },
  image: {
    width: IMAGE_WIDTH,
    height: IMAGE_WIDTH * 0.6, // 16:9 aspect ratio
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  fullScreenImage: {
    width: width - 32,
    height: height * 0.7,
  },
  modalFooter: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    alignItems: 'center',
  },
  imageInfo: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
});