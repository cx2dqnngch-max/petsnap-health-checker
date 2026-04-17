import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
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

export default function PetDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { pets, getScansForPet } = usePets();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const bg = isDark ? Colors.dark.background : Colors.background;
  const surface = isDark ? Colors.dark.surface : Colors.surface;
  const textColor = isDark ? Colors.dark.text : Colors.text;
  const textSec = isDark ? Colors.dark.textSecondary : Colors.textSecondary;

  const pet = pets.find(p => p.id === id);
  const scans = pet ? getScansForPet(pet.id) : [];

  if (!pet) {
    return (
      <View style={[{ flex: 1, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ color: textColor, fontFamily: 'Inter_400Regular' }}>Pet not found</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={{ color: Colors.primary, marginTop: 12, fontFamily: 'Inter_600SemiBold' }}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[{ flex: 1, backgroundColor: bg }]}>
      <LinearGradient
        colors={pet.type === 'cat' ? [Colors.accent, Colors.accentDark] : [Colors.primary, Colors.primaryDark]}
        style={[styles.heroHeader, { paddingTop: topPad + 8 }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </Pressable>

        <View style={styles.heroContent}>
          <View style={styles.petAvatarLarge}>
            <MaterialCommunityIcons name={pet.type === 'cat' ? 'cat' : 'dog'} size={64} color="rgba(255,255,255,0.9)" />
          </View>
          <Text style={styles.petHeroName}>{pet.name}</Text>
          <Text style={styles.petHeroBreed}>{pet.breed}</Text>

          <View style={styles.petStats}>
            <View style={styles.petStat}>
              <Text style={styles.petStatValue}>{pet.ageYears}y {pet.ageMonths}m</Text>
              <Text style={styles.petStatLabel}>Age</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.petStat}>
              <Text style={styles.petStatValue}>{pet.weightLbs} lbs</Text>
              <Text style={styles.petStatLabel}>Weight</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.petStat}>
              <Text style={styles.petStatValue}>{scans.length}</Text>
              <Text style={styles.petStatLabel}>Scans</Text>
            </View>
          </View>
        </View>

        <View style={styles.scoreContainer}>
          
          <Text style={styles.scoreLabel}>Health Score</Text>
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: bottomPad + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.actionsRow}>
          <Pressable
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); router.push('/scan-wizard'); }}
            style={[styles.actionBtn, { backgroundColor: Colors.primary }]}
          >
            <MaterialCommunityIcons name="camera-iris" size={20} color="#fff" />
            <Text style={styles.actionBtnText}>New Scan</Text>
          </Pressable>
          <Pressable
            onPress={() => {}}
            style={[styles.actionBtn, { backgroundColor: Colors.accent }]}
          >
            <Ionicons name="share-outline" size={20} color="#fff" />
            <Text style={styles.actionBtnText}>Share Report</Text>
          </Pressable>
        </View>

        <Text style={[styles.sectionTitle, { color: textColor }]}>Scan History</Text>

        {scans.length === 0 ? (
          <View style={[styles.emptyScans, { backgroundColor: surface }]}>
            <MaterialCommunityIcons name="camera-plus-outline" size={40} color={textSec} />
            <Text style={[styles.emptyTitle, { color: textColor }]}>No scans yet</Text>
            <Text style={[styles.emptySubtitle, { color: textSec }]}>Tap New Entry to start a wellness journal entry for {pet.name}.</Text>
          </View>
        ) : (
          scans.map((scan, i) => (
            <Animated.View key={scan.id} entering={FadeInDown.delay(i * 80)}>
              <ScanHistoryCard
                scan={scan}
                onPress={() => router.push({ pathname: '/results', params: { id: scan.id } })}
              />
            </Animated.View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  heroHeader: {
    paddingHorizontal: 24,
    paddingBottom: 28,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  heroContent: { alignItems: 'center', gap: 8 },
  petAvatarLarge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  petHeroName: { fontSize: 28, fontFamily: 'Inter_700Bold', color: '#fff' },
  petHeroBreed: { fontSize: 15, fontFamily: 'Inter_400Regular', color: 'rgba(255,255,255,0.8)' },
  petStats: { flexDirection: 'row', alignItems: 'center', marginTop: 16, gap: 24 },
  petStat: { alignItems: 'center', gap: 2 },
  petStatValue: { fontSize: 18, fontFamily: 'Inter_700Bold', color: '#fff' },
  petStatLabel: { fontSize: 12, fontFamily: 'Inter_400Regular', color: 'rgba(255,255,255,0.7)' },
  statDivider: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.3)' },
  scoreContainer: { alignItems: 'center', gap: 4, marginTop: 16 },
  scoreLabel: { fontSize: 12, fontFamily: 'Inter_400Regular', color: 'rgba(255,255,255,0.75)' },
  content: { padding: 20, gap: 16 },
  actionsRow: { flexDirection: 'row', gap: 12 },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
  },
  actionBtnText: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: '#fff' },
  sectionTitle: { fontSize: 18, fontFamily: 'Inter_700Bold' },
  emptyScans: {
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    gap: 10,
  },
  emptyTitle: { fontSize: 18, fontFamily: 'Inter_700Bold' },
  emptySubtitle: { fontSize: 14, fontFamily: 'Inter_400Regular', textAlign: 'center' },
});
