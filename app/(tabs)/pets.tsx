import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import {
  Alert,
  Dimensions,
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
import { HealthScoreRing } from '@/components/HealthScoreRing';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 20 * 2 - 12) / 2;

export default function PetsScreen() {
  const { pets, deletePet, setSelectedPetId } = usePets();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 + 84 : insets.bottom + 100;

  const bg = isDark ? Colors.dark.background : Colors.background;
  const textColor = isDark ? Colors.dark.text : Colors.text;
  const textSec = isDark ? Colors.dark.textSecondary : Colors.textSecondary;
  const surface = isDark ? Colors.dark.surface : Colors.surface;

  function handleDelete(id: string, name: string) {
    Alert.alert(
      `Remove ${name}?`,
      'This will delete all health data for this pet.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); deletePet(id); } },
      ]
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <Text style={[styles.headerTitle, { color: textColor }]}>My Pets</Text>
        <Pressable
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push('/add-pet'); }}
          style={styles.addButton}
        >
          <LinearGradient colors={[Colors.primary, Colors.accent]} style={styles.addButtonGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Ionicons name="add" size={22} color="#fff" />
          </LinearGradient>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[styles.grid, { paddingBottom: bottomPad }]}
        showsVerticalScrollIndicator={false}
      >
        {pets.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="paw-off" size={56} color={textSec} />
            <Text style={[styles.emptyTitle, { color: textColor }]}>No pets yet</Text>
            <Text style={[styles.emptySubtitle, { color: textSec }]}>Add your first pet to start tracking their health.</Text>
            <Pressable
              onPress={() => router.push('/add-pet')}
              style={[styles.emptyButton, { backgroundColor: Colors.primary }]}
            >
              <Text style={styles.emptyButtonText}>Add Pet</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.petGrid}>
            {pets.map((pet, i) => (
              <Animated.View key={pet.id} entering={FadeInDown.delay(i * 100)}>
                <Pressable
                  onPress={() => {
                    Haptics.selectionAsync();
                    setSelectedPetId(pet.id);
                    router.push({ pathname: '/pet-detail', params: { id: pet.id } });
                  }}
                  onLongPress={() => handleDelete(pet.id, pet.name)}
                  style={({ pressed }) => [styles.petCard, { backgroundColor: surface, opacity: pressed ? 0.9 : 1, width: CARD_WIDTH }]}
                >
                  <LinearGradient
                    colors={pet.type === 'cat' ? [Colors.accent, Colors.accentDark] : [Colors.primary, Colors.primaryDark]}
                    style={styles.petAvatar}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <MaterialCommunityIcons
                      name={pet.type === 'cat' ? 'cat' : 'dog'}
                      size={44}
                      color="rgba(255,255,255,0.9)"
                    />
                  </LinearGradient>
                  <Text style={[styles.petName, { color: textColor }]} numberOfLines={1}>{pet.name}</Text>
                  <Text style={[styles.petBreed, { color: textSec }]} numberOfLines={1}>{pet.breed}</Text>
                  <Text style={[styles.petAge, { color: textSec }]}>{pet.ageYears}y · {pet.weightLbs} lbs</Text>
                  <View style={styles.healthScoreContainer}>
                    <HealthScoreRing score={pet.healthScore} size={52} strokeWidth={5} />
                  </View>
                  <Text style={[styles.healthLabel, { color: textSec }]}>Health Score</Text>
                </Pressable>
              </Animated.View>
            ))}
          </View>
        )}
      </ScrollView>

      <Pressable
        onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push('/add-pet'); }}
        style={[styles.fab, { bottom: bottomPad - 60 }]}
      >
        <LinearGradient colors={[Colors.primary, Colors.accent]} style={styles.fabGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <Ionicons name="add" size={28} color="#fff" />
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  headerTitle: { fontSize: 28, fontFamily: 'Inter_700Bold' },
  addButton: { borderRadius: 14, overflow: 'hidden' },
  addButtonGradient: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  grid: { paddingHorizontal: 20 },
  petGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  petCard: {
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  petAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  petName: { fontSize: 16, fontFamily: 'Inter_700Bold', marginBottom: 2, textAlign: 'center' },
  petBreed: { fontSize: 12, fontFamily: 'Inter_400Regular', textAlign: 'center', marginBottom: 4 },
  petAge: { fontSize: 12, fontFamily: 'Inter_500Medium', textAlign: 'center', marginBottom: 12 },
  healthScoreContainer: { marginBottom: 4 },
  healthLabel: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: 12 },
  emptyTitle: { fontSize: 22, fontFamily: 'Inter_700Bold' },
  emptySubtitle: { fontSize: 15, fontFamily: 'Inter_400Regular', textAlign: 'center', lineHeight: 22, paddingHorizontal: 32 },
  emptyButton: { paddingHorizontal: 28, paddingVertical: 14, borderRadius: 14, marginTop: 8 },
  emptyButtonText: { fontSize: 16, fontFamily: 'Inter_600SemiBold', color: '#fff' },
  fab: {
    position: 'absolute',
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  fabGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
