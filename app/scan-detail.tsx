import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import { usePets } from '@/context/PetContext';

export default function ScanDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { scanHistory } = usePets();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const bg = isDark ? Colors.dark.background : Colors.background;
  const textColor = isDark ? Colors.dark.text : Colors.text;

  const result = scanHistory.find(s => s.id === id);

  if (!result) {
    return (
      <View style={[styles.container, { backgroundColor: bg, paddingTop: topPad }]}>
        <Pressable onPress={() => router.back()} style={styles.back}>
          <Ionicons name="chevron-back" size={24} color={textColor} />
        </Pressable>
        <Text style={{ color: textColor, padding: 20, fontFamily: 'Inter_400Regular' }}>Record not found</Text>
      </View>
    );
  }

  router.replace({ pathname: '/results', params: { id: result.id } });
  return null;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  back: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
});
