import { router } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import { usePets } from '@/context/PetContext';
import { Colors } from '@/constants/colors';

export default function IndexScreen() {
  const { hasOnboarded, isLoading } = usePets();

  useEffect(() => {
    if (!isLoading) {
      if (hasOnboarded) {
        router.replace('/(tabs)');
      } else {
        router.replace('/onboarding');
      }
    }
  }, [isLoading, hasOnboarded]);

  return <View style={{ flex: 1, backgroundColor: Colors.primary }} />;
}
