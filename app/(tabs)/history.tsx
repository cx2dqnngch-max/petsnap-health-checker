import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/colors';
import { usePets } from '@/context/PetContext';
import { ScanHistoryCard } from '@/components/ScanHistoryCard';

type FilterType = 'all' | 'mild' | 'moderate' | 'severe' | 'emergency';

const FILTERS: { id: FilterType; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'mild', label: 'Mild' },
  { id: 'moderate', label: 'Moderate' },
  { id: 'severe', label: 'Severe' },
  { id: 'emergency', label: 'Emergency' },
];

export default function HistoryScreen() {
  const { scanHistory, deleteScanResult } = usePets();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 + 84 : insets.bottom + 90;

  const bg = isDark ? Colors.dark.background : Colors.background;
  const textColor = isDark ? Colors.dark.text : Colors.text;
  const textSec = isDark ? Colors.dark.textSecondary : Colors.textSecondary;
  const surface = isDark ? Colors.dark.surface : Colors.surface;

  const [filter, setFilter] = useState<FilterType>('all');

  const filtered = filter === 'all'
    ? scanHistory
    : scanHistory.filter(s => s.overallSeverity === filter);

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <Text style={[styles.headerTitle, { color: textColor }]}>Scan History</Text>
        <Text style={[styles.headerCount, { color: textSec }]}>{scanHistory.length} records</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {FILTERS.map(f => (
          <Pressable
            key={f.id}
            onPress={() => { Haptics.selectionAsync(); setFilter(f.id); }}
            style={[styles.filterChip, filter === f.id && styles.filterChipActive]}
          >
            <Text style={[styles.filterChipText, filter === f.id && styles.filterChipTextActive]}>
              {f.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView
        contentContainerStyle={[styles.list, { paddingBottom: bottomPad }]}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="time-outline" size={52} color={textSec} />
            <Text style={[styles.emptyTitle, { color: textColor }]}>No scans yet</Text>
            <Text style={[styles.emptySubtitle, { color: textSec }]}>
              {filter !== 'all' ? `No ${filter} severity scans found.` : 'Tap the camera icon to scan a symptom.'}
            </Text>
          </View>
        ) : (
          filtered.map((scan, i) => (
            <Animated.View key={scan.id} entering={FadeInDown.delay(i * 60)}>
              <ScanHistoryCard
                scan={scan}
                onPress={() => router.push({ pathname: '/scan-detail', params: { id: scan.id } })}
              />
            </Animated.View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 24, paddingBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  headerTitle: { fontSize: 28, fontFamily: 'Inter_700Bold' },
  headerCount: { fontSize: 14, fontFamily: 'Inter_400Regular', marginBottom: 4 },
  filterRow: { paddingHorizontal: 20, paddingBottom: 16, gap: 8 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: 'transparent', borderWidth: 1.5, borderColor: Colors.border },
  filterChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterChipText: { fontSize: 13, fontFamily: 'Inter_500Medium', color: Colors.textSecondary },
  filterChipTextActive: { color: '#fff' },
  list: { paddingHorizontal: 20, gap: 12 },
  emptyState: { paddingTop: 60, alignItems: 'center', gap: 12 },
  emptyTitle: { fontSize: 20, fontFamily: 'Inter_700Bold' },
  emptySubtitle: { fontSize: 15, fontFamily: 'Inter_400Regular', textAlign: 'center', lineHeight: 22 },
});
