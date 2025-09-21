import { ResizeMode, Video } from 'expo-av';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Platform, StyleSheet, View } from 'react-native';

import { useMovieTheme } from '../../hooks/useMovieTheme';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Text } from '../ui/Text';

const { width, height } = Dimensions.get('window');

interface TrailerPlayerProps {
  videoKey: string;
  title?: string;
  autoPlay?: boolean;
  onVideoEnd?: () => void;
  onClose?: () => void;
  fullScreen?: boolean;
}

export const TrailerPlayer: React.FC<TrailerPlayerProps> = ({
  videoKey,
  title,
  autoPlay = true,
  onVideoEnd,
  onClose,
  fullScreen = false,
}) => {
  const theme = useMovieTheme();
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Convert YouTube key to playable URL
  const getVideoUrl = (key: string): string => {
    // For now, we'll use a placeholder since YouTube direct URLs require special handling
    // In a real app, you'd need to use YouTube API or a service that provides direct video URLs
    return `https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`;
  };

  const videoUrl = getVideoUrl(videoKey);

  useEffect(() => {
    if (status.didJustFinish && onVideoEnd) {
      onVideoEnd();
    }
  }, [status.didJustFinish, onVideoEnd]);

  const handlePlaybackStatusUpdate = (playbackStatus: any) => {
    setStatus(playbackStatus);
    
    if (playbackStatus.isLoaded) {
      setIsLoading(false);
      setError(null);
    } else if (playbackStatus.error) {
      setIsLoading(false);
      setError(playbackStatus.error);
    }
  };

  const handlePlayPause = async () => {
    if (videoRef.current) {
      if (status.isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
    }
  };

  const handleReplay = async () => {
    if (videoRef.current) {
      await videoRef.current.replayAsync();
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else if (fullScreen) {
      router.back();
    }
  };

  const containerStyle = fullScreen ? styles.fullScreenContainer : styles.inlineContainer;
  const videoStyle = fullScreen ? styles.fullScreenVideo : styles.inlineVideo;

  if (error) {
    return (
      <View style={[containerStyle, { backgroundColor: theme.colors.background }]}>
        <View style={styles.errorContainer}>
          <Text variant="h4" align="center" color="error">
            Failed to load trailer
          </Text>
          <Text variant="body" align="center" color="icon" style={styles.errorMessage}>
            {error}
          </Text>
          <Button
            title="Close"
            onPress={handleClose}
            variant="outline"
            style={styles.errorButton}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={[containerStyle, { backgroundColor: fullScreen ? '#000000' : theme.colors.background }]}>
      {/* Video Player */}
      <View style={styles.videoContainer}>
        <Video
          ref={videoRef}
          source={{ uri: videoUrl }}
          style={videoStyle}
          useNativeControls={Platform.OS !== 'web'}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay={autoPlay}
          isLooping={false}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        />

        {/* Loading Overlay */}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <LoadingSpinner 
              message="Loading trailer..." 
              color={fullScreen ? '#FFFFFF' : theme.colors.tint}
              textStyle={{ color: fullScreen ? '#FFFFFF' : theme.colors.text }}
            />
          </View>
        )}

        {/* Custom Controls for Web */}
        {Platform.OS === 'web' && !isLoading && (
          <View style={styles.customControls}>
            <Button
              title={status.isPlaying ? '⏸️' : '▶️'}
              onPress={handlePlayPause}
              variant="ghost"
              size="small"
              textStyle={{ color: '#FFFFFF', fontSize: 24 }}
            />
            
            {status.didJustFinish && (
              <Button
                title="🔄"
                onPress={handleReplay}
                variant="ghost"
                size="small"
                textStyle={{ color: '#FFFFFF', fontSize: 20 }}
              />
            )}
          </View>
        )}
      </View>

      {/* Title and Close Button */}
      {fullScreen && (
        <>
          <View style={styles.fullScreenHeader}>
            <Button
              title="✕ Done"
              onPress={handleClose}
              variant="ghost"
              size="small"
              textStyle={{ color: '#FFFFFF' }}
            />
          </View>

          {title && (
            <View style={styles.titleContainer}>
              <Text variant="h4" align="center" style={{ color: '#FFFFFF' }}>
                {title}
              </Text>
            </View>
          )}
        </>
      )}

      {/* Inline Controls */}
      {!fullScreen && (
        <View style={styles.inlineControls}>
          <View style={styles.inlineInfo}>
            {title && (
              <Text variant="movieMeta" weight="semibold" numberOfLines={1}>
                {title}
              </Text>
            )}
            <Text variant="caption" color="icon">
              YouTube Trailer
            </Text>
          </View>
          
          <Button
            title="⛶ Full Screen"
            onPress={() => router.push(`/modals/video-player?videoKey=${videoKey}&title=${encodeURIComponent(title || 'Trailer')}`)}
            variant="ghost"
            size="small"
          />
        </View>
      )}
    </View>
  );
};

// Specialized components
export const InlineTrailerPlayer: React.FC<Omit<TrailerPlayerProps, 'fullScreen'>> = (props) => (
  <TrailerPlayer {...props} fullScreen={false} />
);

export const FullScreenTrailerPlayer: React.FC<Omit<TrailerPlayerProps, 'fullScreen'>> = (props) => (
  <TrailerPlayer {...props} fullScreen={true} />
);

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
  },
  inlineContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 16,
  },
  videoContainer: {
    position: 'relative',
  },
  fullScreenVideo: {
    width: width,
    height: height * 0.6,
  },
  inlineVideo: {
    width: '100%',
    height: 200,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  customControls: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  fullScreenHeader: {
    position: 'absolute',
    top: 50,
    right: 16,
    zIndex: 10,
  },
  titleContainer: {
    position: 'absolute',
    bottom: 60,
    left: 16,
    right: 16,
  },
  inlineControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  inlineInfo: {
    flex: 1,
    marginRight: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorMessage: {
    marginTop: 8,
    marginBottom: 24,
  },
  errorButton: {
    minWidth: 120,
  },
});