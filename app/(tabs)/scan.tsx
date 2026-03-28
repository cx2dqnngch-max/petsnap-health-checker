import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import { FREE_SCANS_PER_MONTH, usePets } from '@/context/PetContext';
import { UpgradeModal } from '@/components/UpgradeModal';
import { useSubscription } from '@/lib/revenuecat';

export default function ScanTabScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 + 84 : insets.bottom + 90;
  const bg = isDark ? Colors.dark.background : Colors.background;
  const surface = isDark ? Colors.dark.surface : Colors.surface;
  const textColor = isDark ? Colors.dark.text : Colors.text;
  const textSec = isDark ? Colors.dark.textSecondary : Colors.textSecondary;
  const border = isDark ? Colors.dark.border : Colors.border;

  const { freeScansLeft, monthlyScansUsed } = usePets();
  const { isSubscribed } = useSubscription();
  const [showUpgrade, setShowUpgrade] = useState(false);

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
      contentContainerStyle={{ flexGrow: 1, paddingBottom: bottomPad }}
      bounces={false}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <Text style={[styles.headerTitle, { color: textColor }]}>Snap & Scan</Text>
        <Text style={[styles.headerSub, { color: textSec }]}>5-step veterinary health analysis</Text>
      </View>

      <View style={[styles.scansLeftPill, { backgroundColor: surface, borderColor: border }]}>
        {isSubscribed ? (
          <MaterialCommunityIcons name="crown" size={18} color={Colors.primary} />
        ) : (
          <View style={styles.scanDotsRow}>
            {Array.from({ length: FREE_SCANS_PER_MONTH }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.scanDot,
                  { backgroundColor: i < monthlyScansUsed ? scansLeftColor : border },
                ]}
              />
            ))}
          </View>
        )}
        <Text style={[styles.scansLeftText, { color: scansLeftColor }]}>
          {isSubscribed
            ? 'Premium — Unlimited scans'
            : freeScansLeft === 0
              ? 'All free scans used this month'
              : `${freeScansLeft} free scan${freeScansLeft === 1 ? '' : 's'} remaining this month`}
        </Text>
      </View>

      <View style={styles.centerContent}>
        <LinearGradient
          colors={(freeScansLeft <= 0 && !isSubscribed) ? ['#9E9E9E', '#757575'] : [Colors.primary, Colors.accent]}
          style={styles.iconCircle}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <MaterialCommunityIcons
            name={(freeScansLeft <= 0 && !isSubscribed) ? 'lock' : 'camera-iris'}
            size={72}
            color="rgba(255,255,255,0.9)"
          />
        </LinearGradient>

        <Text style={[styles.cta, { color: textColor }]}>
          {(freeScansLeft <= 0 && !isSubscribed) ? 'Upgrade to scan again' : 'Ready to scan?'}
        </Text>
        <Text style={[styles.ctaSub, { color: textSec }]}>
          {(freeScansLeft <= 0 && !isSubscribed)
            ? 'You have used your free scans this month. Upgrade to Premium for unlimited scans, PDF reports, and more.'
            : 'Take a photo of your pet symptom area and answer a few quick questions for an instant health analysis.'}
        </Text>

        <Pressable
          onPress={handleStartScan}
          style={({ pressed }) => [styles.startButton, { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] }]}
        >
          <LinearGradient
            colors={(freeScansLeft <= 0 && !isSubscribed) ? [Colors.accent, Colors.primary] : [Colors.primary, Colors.accent]}
            style={styles.startButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <MaterialCommunityIcons
              name={(freeScansLeft <= 0 && !isSubscribed) ? 'crown' : 'arrow-right'}
              size={22}
              color="#fff"
            />
            <Text style={styles.startButtonText}>
              {(freeScansLeft <= 0 && !isSubscribed) ? 'Upgrade to Premium' : 'Start Health Scan'}
            </Text>
          </LinearGradient>
        </Pressable>
      </View>

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
  header: { paddingHorizontal: 24, paddingBottom: 8 },
  headerTitle: { fontSize: 28, fontFamily: 'Inter_700Bold' },
  headerSub: { fontSize: 15, fontFamily: 'Inter_400Regular', marginTop: 4 },
  scansLeftPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 24,
    marginTop: 16,
    marginBottom: 4,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  scanDotsRow: { flexDirection: 'row', gap: 6 },
  scanDot: { width: 24, height: 8, borderRadius: 4 },
  scansLeftText: { flex: 1, fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  centerContent: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: 20 },
  iconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
  },
  cta: { fontSize: 28, fontFamily: 'Inter_700Bold', textAlign: 'center' },
  ctaSub: { fontSize: 16, fontFamily: 'Inter_400Regular', textAlign: 'center', lineHeight: 24 },
  startButton: { width: '100%', borderRadius: 18, overflow: 'hidden', shadowColor: Colors.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8 },
  startButtonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 20, gap: 12 },
  startButtonText: { fontSize: 18, fontFamily: 'Inter_700Bold', color: '#fff' },
});
