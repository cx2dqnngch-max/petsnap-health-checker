import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
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
import { FREE_SCANS_PER_MONTH, usePets } from '@/context/PetContext';
import { VET_TIPS } from '@/data/symptomDatabase';
import { HealthScoreRing } from '@/components/HealthScoreRing';
import { DisclaimerBanner } from '@/components/DisclaimerBanner';
import { ScanHistoryCard } from '@/components/ScanHistoryCard';
import { UpgradeModal } from '@/components/UpgradeModal';
import { useSubscription } from '@/lib/revenuecat';

const { width } = Dimensions.get('window');

function getDayTip() {
  const day = new Date().getDate();
  return VET_TIPS[day % VET_TIPS.length] ?? VET_TIPS[0]!;
}

export default function HomeScreen() {
  const { pets, scanHistory, selectedPetId, setSelectedPetId, freeScansLeft, monthlyScansUsed } = usePets();
  const { isSubscribed } = useSubscription();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 + 84 : Math.max(insets.bottom, 20) + 100;

  const [showUpgrade, setShowUpgrade] = useState(false);

  const selectedPet = pets.find(p => p.id === selectedPetId) ?? pets[0];
  const recentScans = scanHistory.slice(0, 3);
  const tip = getDayTip();

  const bg = isDark ? Colors.dark.background : Colors.background;
  const surface = isDark ? Colors.dark.surface : Colors.surface;
  const textColor = isDark ? Colors.dark.text : Colors.text;
  const textSec = isDark ? Colors.dark.textSecondary : Colors.textSecondary;

  const handleStartScan = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (freeScansLeft <= 0 && !isSubscribed) {
      setShowUpgrade(true);
    } else {
      router.push('/scan-wizard');
    }
  };

  const scansLeftColor =
    isSubscribed ? Colors.primary :
    freeScansLeft === 0 ? Colors.emergency :
    freeScansLeft === 1 ? Colors.moderate :
    Colors.primary;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: bg }]}
      contentContainerStyle={{ paddingBottom: bottomPad }}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={[Colors.primary, Colors.accent]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: topPad + 16 }]}
      >
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>
              {selectedPet ? `${selectedPet.name}'s Wellness Journal` : 'Good to see you!'}
            </Text>
            <Text style={styles.greetingSubtitle}>
              {selectedPet
                ? `${selectedPet.breed} · ${selectedPet.ageYears}y`
                : 'Add your first pet to get started'}
            </Text>
          </View>
          {selectedPet && (
            <View style={styles.headerScore}>
              <HealthScoreRing score={selectedPet.healthScore} size={64} strokeWidth={6} light />
            </View>
          )}
        </View>

        {pets.length > 1 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.petChips} contentContainerStyle={{ gap: 8, paddingRight: 24 }}>
            {pets.map(p => (
              <Pressable
                key={p.id}
                onPress={() => { Haptics.selectionAsync(); setSelectedPetId(p.id); }}
                style={[styles.petChip, selectedPetId === p.id && styles.petChipActive]}
              >
                <MaterialCommunityIcons name="paw" size={12} color={selectedPetId === p.id ? Colors.primary : 'rgba(255,255,255,0.7)'} />
                <Text style={[styles.petChipText, selectedPetId === p.id && styles.petChipTextActive]}>{p.name}</Text>
              </Pressable>
            ))}
          </ScrollView>
        )}
      </LinearGradient>

      <View style={styles.snapButtonContainer}>
        <Pressable
          onPress={handleStartScan}
          style={({ pressed }) => [styles.snapButton, { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] }]}
        >
          <LinearGradient
            colors={(freeScansLeft <= 0 && !isSubscribed) ? ['#9E9E9E', '#757575'] : [Colors.primary, Colors.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.snapButtonGradient}
          >
            <View style={styles.snapButtonIcon}>
              <MaterialCommunityIcons
                name={(freeScansLeft <= 0 && !isSubscribed) ? 'lock' : 'camera-iris'}
                size={32}
                color="#fff"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.snapButtonTitle}>
                {(freeScansLeft <= 0 && !isSubscribed) ? 'Upgrade to Continue' : 'Log an Observation'}
              </Text>
              <Text style={styles.snapButtonSub}>
                {(freeScansLeft <= 0 && !isSubscribed) ? 'Upgrade to unlock unlimited observation logs' : 'Record wellness observations'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color="rgba(255,255,255,0.8)" />
          </LinearGradient>
        </Pressable>
      </View>

      <Animated.View entering={FadeInDown.delay(100)} style={[styles.scansLeftCard, { backgroundColor: surface, marginHorizontal: 20, marginBottom: 16 }]}>
        <View style={styles.scansLeftRow}>
          <MaterialCommunityIcons name="calendar-month" size={22} color={scansLeftColor} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.scansLeftBig, { color: scansLeftColor }]}>
              {isSubscribed
                ? 'Premium — Unlimited scans'
                : freeScansLeft === 0
                  ? 'No free scans left this month'
                  : `${freeScansLeft} free scan${freeScansLeft === 1 ? '' : 's'} left this month`}
            </Text>
            <View style={styles.scansDots}>
              {isSubscribed ? (
                <MaterialCommunityIcons name="crown" size={16} color={Colors.primary} />
              ) : (
                Array.from({ length: FREE_SCANS_PER_MONTH }).map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.scanDot,
                      { backgroundColor: i < monthlyScansUsed ? scansLeftColor : (isDark ? Colors.dark.border : Colors.border) },
                    ]}
                  />
                ))
              )}
              <Text style={[styles.scansUsedText, { color: textSec }]}>
                {isSubscribed ? 'Active subscription' : `${monthlyScansUsed}/${FREE_SCANS_PER_MONTH} used`}
              </Text>
            </View>
          </View>
          {(freeScansLeft === 0 && !isSubscribed) && (
            <Pressable onPress={() => setShowUpgrade(true)} style={styles.upgradeChip}>
              <Text style={styles.upgradeChipText}>Upgrade</Text>
            </Pressable>
          )}
        </View>
      </Animated.View>

      <DisclaimerBanner style={{ marginHorizontal: 20, marginBottom: 24 }} />

      {recentScans.length > 0 && (
        <Animated.View entering={FadeInDown.delay(200)}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>Recent Scans</Text>
            <Pressable onPress={() => router.push('/(tabs)/history')}>
              <Text style={styles.sectionLink}>View all</Text>
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 20, paddingRight: 20, gap: 12 }}>
            {recentScans.map(scan => (
              <ScanHistoryCard key={scan.id} scan={scan} compact onPress={() => router.push({ pathname: '/scan-detail', params: { id: scan.id } })} />
            ))}
          </ScrollView>
        </Animated.View>
      )}

      <Animated.View entering={FadeInDown.delay(300)} style={[styles.tipCard, { backgroundColor: surface, marginHorizontal: 20, marginTop: 24 }]}>
        <View style={styles.tipHeader}>
          <MaterialCommunityIcons name="lightbulb-on" size={20} color={Colors.accent} />
          <Text style={[styles.tipLabel, { color: Colors.accent }]}>Daily Vet Tip</Text>
        </View>
        <Text style={[styles.tipText, { color: textColor }]}>{tip}</Text>
      </Animated.View>

      <UpgradeModal
        visible={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        scansUsed={monthlyScansUsed}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  greeting: { fontSize: 24, fontFamily: 'Inter_700Bold', color: '#fff', marginBottom: 4 },
  greetingSubtitle: { fontSize: 14, fontFamily: 'Inter_400Regular', color: 'rgba(255,255,255,0.75)' },
  headerScore: { marginLeft: 16 },
  petChips: { marginTop: 4 },
  petChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  petChipActive: { backgroundColor: '#fff' },
  petChipText: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: 'rgba(255,255,255,0.85)' },
  petChipTextActive: { color: Colors.primary },
  snapButtonContainer: { marginHorizontal: 20, marginTop: 16, marginBottom: 16 },
  snapButton: { borderRadius: 20, overflow: 'hidden', shadowColor: Colors.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 10 },
  snapButtonGradient: { flexDirection: 'row', alignItems: 'center', padding: 20, gap: 16 },
  snapButtonIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  snapButtonTitle: { fontSize: 18, fontFamily: 'Inter_700Bold', color: '#fff', marginBottom: 2 },
  snapButtonSub: { fontSize: 13, fontFamily: 'Inter_400Regular', color: 'rgba(255,255,255,0.75)' },
  scansLeftCard: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  scansLeftRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  scansLeftBig: { fontSize: 15, fontFamily: 'Inter_700Bold', marginBottom: 6 },
  scansDots: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  scanDot: { width: 28, height: 8, borderRadius: 4 },
  scansUsedText: { fontSize: 12, fontFamily: 'Inter_400Regular', marginLeft: 4 },
  upgradeChip: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  upgradeChipText: { fontSize: 13, fontFamily: 'Inter_700Bold', color: '#fff' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 20, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontFamily: 'Inter_700Bold' },
  sectionLink: { fontSize: 14, fontFamily: 'Inter_500Medium', color: Colors.primary },
  tipCard: { borderRadius: 16, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  tipHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  tipLabel: { fontSize: 13, fontFamily: 'Inter_600SemiBold', textTransform: 'uppercase', letterSpacing: 0.5 },
  tipText: { fontSize: 15, fontFamily: 'Inter_400Regular', lineHeight: 22 },
});
