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

  const URGENCY_COLORS = {
    mild: Colors.mild,
    moderate: Colors.moderate,
    severe: Colors.severe,
    emergency: Colors.emergency,
  };

  const URGENCY_ICONS: Record<string, any> = {
    mild: 'information-circle-outline',
    moderate: 'alert-circle-outline',
    severe: 'warning-outline',
    emergency: 'alert-circle',
  };

  const URGENCY_LABELS = {
    mild: 'Routine Observation',
    moderate: 'Worth Monitoring',
    severe: 'Seek Vet Promptly',
    emergency: 'Contact Vet Today',
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
          <Text style={[{ color: textColor, fontSize: 18, fontFamily: 'Inter_500Medium' }]}>Observation not found</Text>
          <Pressable onPress={() => router.back()} style={{ marginTop: 16 }}>
            <Text style={{ color: Colors.primary, fontFamily: 'Inter_600SemiBold', fontSize: 16 }}>Go Back</Text>
          </Pressable>
        </View>
      );
    }

    const isUrgent = result.overallSeverity === 'emergency' || result.overallSeverity === 'severe';
    const urgencyColor = URGENCY_COLORS[result.overallSeverity];

    const handleShare = async () => {
      const topicsList = result.conditions.map(c => `• ${c.name}`).join('\n');
      const message = `PetSnap Wellness Observation Log for ${result.petName}\n\nArea: ${result.bodyArea}\n\nRelated Educational Topics:\n${topicsList}\n\n${result.vetTips.join('\n')}\n\n⚠️ This information is educational only and is not veterinary advice. Always consult a licensed veterinarian.`;
      await Share.share({ message });
    };

    return (
      <View style={[styles.container, { backgroundColor: bg }]}>
        {isUrgent && (
          <LinearGradient
            colors={[Colors.moderate, '#E65100']}
            style={[styles.urgencyBanner, { paddingTop: topPad + 8 }]}
          >
            <Ionicons name="alert-circle" size={26} color="#fff" />
            <View style={{ flex: 1 }}>
              <Text style={styles.urgencyTitle}>Vet Visit Recommended</Text>
              <Text style={styles.urgencySubtitle}>Some pet safety resources recommend contacting a veterinarian promptly when these types of observations occur.</Text>
            </View>
          </LinearGradient>
        )}

        <View style={[styles.header, { paddingTop: isUrgent ? 8 : topPad + 8 }]}>
          <Pressable onPress={() => router.replace('/(tabs)')} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={textColor} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: textColor }]}>Observation Summary</Text>
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
              <Text style={[styles.bodyArea, { color: textSec }]}>{result.bodyArea} · {new Date(result.createdAt).toLocaleDateString()}</Text>
            </View>
            <View style={[styles.urgencyBadge, { backgroundColor: `${urgencyColor}18`, borderColor: `${urgencyColor}40` }]}>
              <Ionicons name={URGENCY_ICONS[result.overallSeverity]} size={18} color={urgencyColor} />
              <Text style={[styles.urgencyBadgeText, { color: urgencyColor }]}>{URGENCY_LABELS[result.overallSeverity]}</Text>
            </View>
          </Animated.View>

          {result.photoUri && (
            <Animated.View entering={FadeInDown.delay(150)} style={styles.photoSection}>
              <Image source={{ uri: result.photoUri }} style={styles.photo} resizeMode="cover" />
            </Animated.View>
          )}

          <DisclaimerBanner style={{ marginBottom: 4 }} />

          {result.conditions.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, { color: textColor }]}>Wellness Education</Text>
              <Animated.View entering={FadeInDown.delay(200)} style={[styles.infoBox, { backgroundColor: surface, borderColor: border }]}>
                <Text style={[styles.infoBoxNote, { color: textSec }]}>
                  The following are general educational topics that veterinary resources commonly discuss in relation to the observations you logged. This is not a diagnosis.
                </Text>
              </Animated.View>

              {result.conditions.map((condition, i) => (
                <Animated.View key={i} entering={FadeInDown.delay(250 + i * 60)} style={[styles.topicCard, { backgroundColor: surface }]}>
                  <View style={styles.topicHeader}>
                    <MaterialCommunityIcons name="book-open-outline" size={20} color={Colors.primary} />
                    <Text style={[styles.topicName, { color: textColor }]}>{condition.name}</Text>
                  </View>
                  {condition.advice ? (
                    <Text style={[styles.topicInfo, { color: textSec }]}>{condition.advice}</Text>
                  ) : null}
                  {condition.whenToSeeVet ? (
                    <View style={[styles.vetHint, { borderLeftColor: Colors.primary }]}>
                      <Text style={[styles.vetHintText, { color: textColor }]}>{condition.whenToSeeVet}</Text>
                    </View>
                  ) : null}
                  <Text style={[styles.educationalNote, { color: textSec }]}>
                    For medical concerns, consult a licensed veterinarian.
                  </Text>
                </Animated.View>
              ))}
            </>
          )}

          {result.vetTips.length > 0 && (
            <Animated.View entering={FadeInDown.delay(400)} style={[styles.tipsCard, { backgroundColor: surface }]}>
              <View style={styles.tipsHeader}>
                <MaterialCommunityIcons name="stethoscope" size={20} color={Colors.primary} />
                <Text style={[styles.tipsTitle, { color: textColor }]}>Vet Visit Notes</Text>
              </View>
              <Text style={[styles.tipsSubtitle, { color: textSec }]}>Things to mention at your next vet appointment:</Text>
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
                <Text style={[styles.tipsTitle, { color: textColor }]}>General Care Reminders</Text>
              </View>
              <Text style={[styles.tipsSubtitle, { color: textSec }]}>General wellness reminders — not a substitute for veterinary care:</Text>
              {result.homeCare.map((tip, i) => (
                <View key={i} style={styles.tipRow}>
                  <View style={[styles.tipBullet, { backgroundColor: Colors.accent }]} />
                  <Text style={[styles.tipText, { color: textSec }]}>{tip}</Text>
                </View>
              ))}
              <Text style={[styles.educationalNote, { color: textSec, marginTop: 8 }]}>
                This information is educational only and is not veterinary advice.
              </Text>
            </Animated.View>
          )}

          <Animated.View entering={FadeInDown.delay(560)} style={styles.actionButtons}>
            <Pressable
              onPress={handleShare}
              style={({ pressed }) => [styles.actionButton, { backgroundColor: Colors.primary, opacity: pressed ? 0.85 : 1 }]}
            >
              <Ionicons name="share" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Share Notes</Text>
            </Pressable>
            <Pressable
              onPress={() => router.replace('/(tabs)')}
              style={({ pressed }) => [styles.actionButtonOutline, { borderColor: Colors.primary, opacity: pressed ? 0.85 : 1 }]}
            >
              <Ionicons name="home-outline" size={20} color={Colors.primary} />
              <Text style={[styles.actionButtonTextOutline, { color: Colors.primary }]}>Done</Text>
            </Pressable>
          </Animated.View>

          {isUrgent && (
            <Pressable
              onPress={() => Linking.openURL('tel:+18005484823')}
              style={[styles.vetCallButton, { backgroundColor: Colors.moderate }]}
            >
              <MaterialCommunityIcons name="phone" size={22} color="#fff" />
              <Text style={styles.vetCallButtonText}>Find a Veterinarian</Text>
            </Pressable>
          )}
        </ScrollView>
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: { flex: 1 },
    urgencyBanner: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingHorizontal: 20,
      paddingBottom: 16,
      gap: 12,
    },
    urgencyTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#fff', marginBottom: 2 },
    urgencySubtitle: { fontSize: 12, fontFamily: 'Inter_400Regular', color: 'rgba(255,255,255,0.9)', lineHeight: 17 },
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
      justifyContent: 'space-between',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.08,
      shadowRadius: 10,
      elevation: 3,
    },
    petInfo: { flex: 1 },
    petName: { fontSize: 20, fontFamily: 'Inter_700Bold', marginBottom: 4 },
    bodyArea: { fontSize: 13, fontFamily: 'Inter_400Regular' },
    urgencyBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 10,
      borderWidth: 1,
    },
    urgencyBadgeText: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
    photoSection: {
      borderRadius: 20,
      overflow: 'hidden',
      height: 180,
    },
    photo: { width: '100%', height: '100%' },
    sectionTitle: { fontSize: 18, fontFamily: 'Inter_700Bold' },
    infoBox: {
      borderRadius: 12,
      padding: 14,
      borderWidth: 1,
    },
    infoBoxNote: { fontSize: 13, fontFamily: 'Inter_400Regular', lineHeight: 19 },
    topicCard: {
      borderRadius: 16,
      padding: 16,
      gap: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 2,
    },
    topicHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    topicName: { fontSize: 16, fontFamily: 'Inter_700Bold', flex: 1 },
    topicInfo: { fontSize: 14, fontFamily: 'Inter_400Regular', lineHeight: 20 },
    vetHint: {
      borderLeftWidth: 3,
      paddingLeft: 12,
      paddingVertical: 4,
    },
    vetHintText: { fontSize: 13, fontFamily: 'Inter_500Medium', lineHeight: 19 },
    educationalNote: {
      fontSize: 11,
      fontFamily: 'Inter_400Regular',
      fontStyle: 'italic',
      lineHeight: 16,
      marginTop: 2,
    },
    tipsCard: {
      borderRadius: 16,
      padding: 16,
      gap: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 6,
      elevation: 1,
    },
    tipsHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    tipsTitle: { fontSize: 16, fontFamily: 'Inter_700Bold' },
    tipsSubtitle: { fontSize: 12, fontFamily: 'Inter_400Regular', fontStyle: 'italic' },
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
    vetCallButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      borderRadius: 14,
      gap: 10,
      marginTop: 4,
    },
    vetCallButtonText: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#fff' },
  });
  