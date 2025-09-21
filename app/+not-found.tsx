import { Link, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from '../components/ui/Button';
import { Text } from '../components/ui/Text';
import { useMovieTheme } from '../hooks/useMovieTheme';

export default function NotFoundScreen() {
  const theme = useMovieTheme();

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text variant="h1" align="center" style={styles.title}>
          This screen doesn't exist.
        </Text>
        
        <Text variant="body" align="center" color="icon" style={styles.subtitle}>
          The page you're looking for could not be found.
        </Text>

        <Link href="/" asChild>
          <Button
            title="Go to home screen"
            onPress={() => {}}
            style={styles.button}
          />
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    marginBottom: 16,
  },
  subtitle: {
    marginBottom: 32,
  },
  button: {
    minWidth: 200,
  },
});