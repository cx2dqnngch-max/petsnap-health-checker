import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  Image,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/colors';
import { usePets } from '@/context/PetContext';
import { DisclaimerBanner } from '@/components/DisclaimerBanner';
import { HealthScoreRing } from '@/components/HealthScoreRing';

const SEVERITY_COLORS = {
  mild: Colors.mild,
  moderate: Colors.moderate,
  severe: Colors.severe,
  emergency: Colors.emergency,
};

const SEVERITY_LABELS = {
  mild: 'Mild',
  moderate: 'Moderate',
  severe: 'Severe',
  emergency: 'EMERGENCY',
};

export default function ResultsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { scanHistory } = usePets();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const bg = isDark ? Colors.dark.background : Colors.background;
  const surface = isDark ? Colors.dark.surface : Colors.surface;
  const textColor = isDark ? Colors.dark.text : Colors.text;
  const textSec = isDark ? Colors.dark.textSecondary : Colors.textSecondary;
  const border = isDark ? Colors.dark.border : Colors.border;

  const result = scanHistory.find(s => s.id === id);

  if (!result) {
    return (
      <View style={[styles.container, { backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={[{ color: textColor, fontSize: 18, fontFamily: 'Inter_500Medium' }]}>Result not found</Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={{ color: Colors.primary, fontFamily: 'Inter_600SemiBold', fontSize: 16 }}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const isEmergency = result.overallSeverity === 'emergency';
  const severityColor = SEVERITY_COLORS[result.overallSeverity];

  const handleShare = async () => {
    const conditionsList = result.conditions.map(c => `• ${c.name} (${c.probability}%)`).join('\n');
    const message = `PetSnap Health Analysis for ${result.petName}\n\nArea: ${result.bodyArea}\nSeverity: ${SEVERITY_LABELS[result.overallSeverity]}\n\nConditions Analyzed:\n${conditionsList}\n\n${result.vetTips.join('\n')}\n\n⚠️ This is informational only — not a veterinary diagnosis.`;
    await Share.share({ message });
  };

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      {isEmergency && (
        <LinearGradient
          colors={[Colors.emergency, '#B71C1C']}
          style={[styles.emergencyBanner, { paddingTop: topPad + 8 }]}
        >
          <MaterialCommunityIcons name="alert-octagon" size={28} color="#fff" />
          <View style={{ flex: 1 }}>
            <Text style={styles.emergencyTitle}>Emergency Detected</Text>
            <Text style={styles.emergencySubtitle}>Seek emergency vet care immediately</Text>
          </View>
          <Pressable
            onPress={() => Linking.openURL('tel:+18005484823')}
            style={styles.emergencyCallButton}
          >
            <Ionicons name="call" size={20} color={Colors.emergency} />
            <Text style={styles.emergencyCallText}>ER Vet</Text>
          </Pressable>
        </LinearGradient>
      )}

      <View style={[styles.header, { paddingTop: isEmergency ? 8 : topPad + 8 }]}>
        <Pressable onPress={() => router.replace('/(tabs)')} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={textColor} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: textColor }]}>Analysis Results</Text>
        <Pressable onPress={handleShare} style={styles.shareButton}>
          <Ionicons name="share-outline" size={22} color={Colors.primary} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: bottomPad + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.delay(100)} style={[styles.resultHeader, { backgroundColor: surface }]}>
          <View style={styles.petInfo}>
            <Text style={[styles.petName, { color: textColor }]}>{result.petName}</Text>
            <Text style={[styles.bodyArea, { color: textSec }]}>{result.bodyArea}</Text>
          </View>
          <HealthScoreRing score={result.healthScore} size={72} strokeWidth={7} />
        </Animated.View>

        {result.photoUri && (
          <Animated.View entering={FadeInDown.delay(150)} style={styles.photoSection}>
            <Image source={{ uri: result.photoUri }} style={styles.photo} resizeMode="cover" />
            <View style={[styles.photoOverlay, { backgroundColor: `${severityColor}99` }]}>
              <MaterialCommunityIcons name="target" size={40} color="#fff" />
            </View>
          </Animated.View>
        )}

        <DisclaimerBanner style={{ marginBottom: 16 }} />

        <Text style={[styles.sectionTitle, { color: textColor }]}>Conditions Analyzed</Text>

        {result.conditions.map((condition, i) => {
          const cColor = SEVERITY_COLORS[condition.severity];
          return (
            <Animated.View key={i} entering={FadeInDown.delay(200 + i * 80)} style={[styles.conditionCard, { backgroundColor: surface }]}>
              <View style={styles.conditionHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.conditionName, { color: textColor }]}>{condition.name}</Text>
                </View>
                <View style={[styles.severityTag, { backgroundColor: `${cColor}20` }]}>
                  <Text style={[styles.severityTagText, { color: cColor }]}>{SEVERITY_LABELS[condition.severity]}</Text>
                </View>
              </View>
              <View style={styles.probRow}>
                <View style={[styles.probBar, { backgroundColor: border }]}>
                  <View style={[styles.probFill, { width: `${condition.probability}%` as any, backgroundColor: cColor }]} />
                </View>
                <Text style={[styles.probText, { color: cColor }]}>{condition.probability}%</Text>
              </View>
              {condition.advice && (
                <Text style={[styles.conditionAdvice, { color: textSec }]}>{condition.advice}</Text>
              )}
              {condition.whenToSeeVet && (
                <View style={[styles.vetHint, { borderLeftColor: cColor }]}>
                  <Text style={[styles.vetHintText, { color: textColor }]}>{condition.whenToSeeVet}</Text>
                </View>
              )}
            </Animated.View>
          );
        })}

        {result.vetTips.length > 0 && (
          <Animated.View entering={FadeInDown.delay(400)} style={[styles.tipsCard, { backgroundColor: surface }]}>
            <View style={styles.tipsHeader}>
              <MaterialCommunityIcons name="stethoscope" size={20} color={Colors.primary} />
              <Text style={[styles.tipsTitle, { color: textColor }]}>What to Tell Your Vet</Text>
            </View>
            {result.vetTips.map((tip, i) => (
              <View key={i} style={styles.tipRow}>
                <View style={[styles.tipBullet, { backgroundColor: Colors.primary }]} />
                <Text style={[styles.tipText, { color: textSec }]}>{tip}</Text>
              </View>
            ))}
          </Animated.View>
        )}

        {result.homeCare.length > 0 && (
          <Animated.View entering={FadeInDown.delay(480)} style={[styles.tipsCard, { backgroundColor: `${Colors.primary}10` }]}>
            <View style={styles.tipsHeader}>
              <MaterialCommunityIcons name="home-heart" size={20} color={Colors.primary} />
              <Text style={[styles.tipsTitle, { color: textColor }]}>Safe Home Care Tips</Text>
            </View>
            {result.homeCare.map((tip, i) => (
              <View key={i} style={styles.tipRow}>
                <View style={[styles.tipBullet, { backgroundColor: Colors.accent }]} />
                <Text style={[styles.tipText, { color: textSec }]}>{tip}</Text>
              </View>
            ))}
          </Animated.View>
        )}

        <Animated.View entering={FadeInDown.delay(560)} style={styles.actionButtons}>
          <Pressable
            onPress={handleShare}
            style={({ pressed }) => [styles.actionButton, { backgroundColor: Colors.primary, opacity: pressed ? 0.85 : 1 }]}
          >
            <Ionicons name="share" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Share Report</Text>
          </Pressable>
          <Pressable
            onPress={() => router.replace('/(tabs)')}
            style={({ pressed }) => [styles.actionButtonOutline, { borderColor: Colors.primary, opacity: pressed ? 0.85 : 1 }]}
          >
            <Ionicons name="home-outline" size={20} color={Colors.primary} />
            <Text style={[styles.actionButtonTextOutline, { color: Colors.primary }]}>Done</Text>
          </Pressable>
        </Animated.View>

        {isEmergency && (
          <Pressable
            onPress={() => Linking.openURL('tel:+18005484823')}
            style={[styles.emergencyFullButton, { backgroundColor: Colors.emergency }]}
          >
            <MaterialCommunityIcons name="phone-alert" size={24} color="#fff" />
            <Text style={styles.emergencyFullButtonText}>Call Emergency Vet NOW</Text>
          </Pressable>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  emergencyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 12,
  },
  emergencyTitle: { fontSize: 18, fontFamily: 'Inter_700Bold', color: '#fff' },
  emergencySubtitle: { fontSize: 13, fontFamily: 'Inter_400Regular', color: 'rgba(255,255,255,0.85)' },
  emergencyCallButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  emergencyCallText: { fontSize: 14, fontFamily: 'Inter_700Bold', color: Colors.emergency },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  closeButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontFamily: 'Inter_700Bold' },
  shareButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  content: { paddingHorizontal: 20, gap: 16 },
  resultHeader: {
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  petInfo: { flex: 1 },
  petName: { fontSize: 22, fontFamily: 'Inter_700Bold', marginBottom: 4 },
  bodyArea: { fontSize: 14, fontFamily: 'Inter_400Regular' },
  photoSection: {
    position: 'relative',
    borderRadius: 20,
    overflow: 'hidden',
    height: 200,
  },
  photo: { width: '100%', height: '100%' },
  photoOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 64,
    height: 64,
    borderRadius: 32,
    marginLeft: -32,
    marginTop: -32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: { fontSize: 18, fontFamily: 'Inter_700Bold' },
  conditionCard: {
    borderRadius: 16,
    padding: 16,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  conditionHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  conditionName: { fontSize: 17, fontFamily: 'Inter_700Bold' },
  severityTag: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  severityTagText: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  probRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  probBar: { flex: 1, height: 8, borderRadius: 4, overflow: 'hidden' },
  probFill: { height: '100%', borderRadius: 4 },
  probText: { fontSize: 16, fontFamily: 'Inter_700Bold', width: 44, textAlign: 'right' },
  conditionAdvice: { fontSize: 14, fontFamily: 'Inter_400Regular', lineHeight: 20 },
  vetHint: {
    borderLeftWidth: 3,
    paddingLeft: 12,
    paddingVertical: 4,
  },
  vetHintText: { fontSize: 13, fontFamily: 'Inter_500Medium', lineHeight: 20 },
  tipsCard: {
    borderRadius: 16,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  tipsHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  tipsTitle: { fontSize: 16, fontFamily: 'Inter_700Bold' },
  tipRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  tipBullet: { width: 6, height: 6, borderRadius: 3, marginTop: 7 },
  tipText: { flex: 1, fontSize: 14, fontFamily: 'Inter_400Regular', lineHeight: 21 },
  actionButtons: { flexDirection: 'row', gap: 12 },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
  },
  actionButtonText: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#fff' },
  actionButtonOutline: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 2,
    gap: 8,
  },
  actionButtonTextOutline: { fontSize: 16, fontFamily: 'Inter_700Bold' },
  emergencyFullButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    gap: 10,
  },
  emergencyFullButtonText: { fontSize: 18, fontFamily: 'Inter_700Bold', color: '#fff' },
});
