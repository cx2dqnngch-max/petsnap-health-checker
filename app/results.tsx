import { Ionicons } from '@expo/vector-icons';
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

    const entry = scanHistory.find(s => s.id === id);

    if (!entry) {
      return (
        <View style={{ flex: 1, backgroundColor: bg, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <Text style={{ color: textSec, fontSize: 16 }}>Journal entry not found.</Text>
          <Pressable onPress={() => router.replace('/(tabs)')} style={{ marginTop: 16 }}>
            <Text style={{ color: Colors.primary, fontWeight: '600' }}>Go Home</Text>
          </Pressable>
        </View>
      );
    }

    const topic = entry.educationalTopic;

    return (
      <View style={{ flex: 1, backgroundColor: bg }}>
        {/* Header */}
        <LinearGradient
          colors={[Colors.primaryDark, Colors.primary]}
          style={[styles.header, { paddingTop: topPad + 8 }]}
        >
          <Pressable onPress={() => router.replace('/(tabs)')} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </Pressable>
          <View style={{ flex: 1, marginHorizontal: 12 }}>
            <Text style={styles.headerTitle}>Journal Entry Saved</Text>
            <Text style={styles.headerSub}>{entry.bodyArea} · {entry.petName}</Text>
          </View>
        </LinearGradient>

        <DisclaimerBanner />

        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: bottomPad + 40 }}>

          {/* Journal confirmation */}
          <Animated.View entering={FadeInDown.duration(300).delay(50)}>
            <View style={[styles.confirmCard, { backgroundColor: Colors.primary + '14', borderColor: Colors.primary + '44' }]}>
              <Ionicons name="checkmark-circle" size={28} color={Colors.primary} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.confirmTitle, { color: Colors.primary }]}>Journal entry saved</Text>
                <Text style={[styles.confirmSub, { color: textSec }]}>
                  Your observations for {entry.petName} have been saved to your personal wellness journal.
                  They are not analyzed or interpreted.
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Photo if present */}
          {entry.photoUri && (
            <Animated.View entering={FadeInDown.duration(300).delay(100)}>
              <Image source={{ uri: entry.photoUri }} style={[styles.photo, { borderColor: border }]} />
            </Animated.View>
          )}

          {/* Educational content — shown first, before the user's notes */}
          {topic && (
            <>
              {/* Explicit notice: same content for every user */}
              <Animated.View entering={FadeInDown.duration(300).delay(150)}>
                <View style={[styles.staticNotice, { backgroundColor: surface, borderColor: border }]}>
                  <Ionicons name="information-circle-outline" size={18} color={textSec} />
                  <Text style={[styles.staticNoticeText, { color: textSec }]}>
                    The general wellness article below covers <Text style={{ fontWeight: '700' }}>{entry.bodyArea}</Text>. Every pet
                    owner who selects this topic receives the same fixed article — it is not based on your
                    specific observations or your pet's individual health.
                  </Text>
                </View>
              </Animated.View>

              <Animated.View entering={FadeInDown.duration(300).delay(200)}>
                <View style={[styles.eduHeader, { backgroundColor: Colors.primary + '10', borderColor: Colors.primary + '30' }]}>
                  <Ionicons name="book-outline" size={22} color={Colors.primary} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.eduTitle, { color: Colors.primary }]}>{topic.title}</Text>
                    <Text style={[styles.eduSummary, { color: textSec }]}>{topic.summary}</Text>
                  </View>
                </View>
              </Animated.View>

              <Animated.View entering={FadeInDown.duration(300).delay(250)}>
                <Text style={[styles.sectionTitle, { color: textColor }]}>General Facts</Text>
                <View style={[styles.card, { backgroundColor: surface, borderColor: border }]}>
                  {topic.generalFacts.map((fact, i) => (
                    <View key={i} style={[styles.factRow, i > 0 && { borderTopWidth: 1, borderTopColor: border }]}>
                      <Ionicons name="information-circle-outline" size={18} color={Colors.primary} style={{ marginTop: 2 }} />
                      <Text style={[styles.factText, { color: textColor }]}>{fact}</Text>
                    </View>
                  ))}
                </View>
              </Animated.View>

              <Animated.View entering={FadeInDown.duration(300).delay(300)}>
                <Text style={[styles.sectionTitle, { color: textColor }]}>General Veterinary Guidelines</Text>
                <View style={[styles.card, { backgroundColor: surface, borderColor: border }]}>
                  {topic.whenVetsRecommendVisit.map((tip, i) => (
                    <View key={i} style={[styles.factRow, i > 0 && { borderTopWidth: 1, borderTopColor: border }]}>
                      <Ionicons name="medical-outline" size={18} color={Colors.moderate} style={{ marginTop: 2 }} />
                      <Text style={[styles.factText, { color: textColor }]}>{tip}</Text>
                    </View>
                  ))}
                </View>
              </Animated.View>

              <Animated.View entering={FadeInDown.duration(300).delay(350)}>
                <Text style={[styles.sectionTitle, { color: textColor }]}>General Owner Wellness Tips</Text>
                <View style={[styles.card, { backgroundColor: surface, borderColor: border }]}>
                  {topic.ownerWellnessTips.map((tip, i) => (
                    <View key={i} style={[styles.factRow, i > 0 && { borderTopWidth: 1, borderTopColor: border }]}>
                      <Ionicons name="star-outline" size={18} color={Colors.mild} style={{ marginTop: 2 }} />
                      <Text style={[styles.factText, { color: textColor }]}>{tip}</Text>
                    </View>
                  ))}
                </View>
              </Animated.View>
            </>
          )}

          {/* Safety disclaimer */}
          <Animated.View entering={FadeInDown.duration(300).delay(400)}>
            <View style={[styles.safetyBox, { backgroundColor: surface, borderColor: border }]}>
              <Ionicons name="shield-checkmark-outline" size={22} color={Colors.primary} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.safetyTitle, { color: textColor }]}>Educational Information Only</Text>
                <Text style={[styles.safetyBody, { color: textSec }]}>
                  The content above is general educational information about pet wellness topics. It is not
                  specific to your pet and does not constitute veterinary advice, diagnosis, or medical opinion.
                  Always consult a licensed veterinarian for your pet's health needs.
                </Text>
                <Pressable
                  onPress={() => Linking.openURL('https://www.avma.org/resources-tools/pet-owners/petcare')}
                  style={styles.avmaLink}
                >
                  <Text style={{ color: Colors.primary, fontSize: 13, fontWeight: '600' }}>
                    Learn more at AVMA.org →
                  </Text>
                </Pressable>
              </View>
            </View>
          </Animated.View>

          {/* Your journal notes — shown AFTER education, clearly labeled as uninterpreted */}
          {entry.observations && entry.observations.length > 0 && (
            <Animated.View entering={FadeInDown.duration(300).delay(450)}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>Your Journal Notes</Text>
              <View style={[styles.card, { backgroundColor: surface, borderColor: border }]}>
                {entry.observations.map((obs, i) => (
                  <View key={i} style={[styles.obsRow, i > 0 && { borderTopWidth: 1, borderTopColor: border }]}>
                    <Ionicons name="journal-outline" size={16} color={textSec} />
                    <Text style={[styles.obsText, { color: textSec }]}>{obs}</Text>
                  </View>
                ))}
              </View>
              <Text style={[styles.noteText, { color: textSec }]}>
                These personal notes are stored only on your device. They are not analyzed, interpreted,
                or used to determine the educational content shown above. The educational article is the
                same for all users who log this topic area.
              </Text>
            </Animated.View>
          )}

          {/* Action buttons */}
          <Animated.View entering={FadeInDown.duration(300).delay(500)} style={styles.actions}>
            <Pressable
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push('/scan-wizard'); }}
              style={[styles.actionBtn, { backgroundColor: Colors.primary }]}
            >
              <Ionicons name="add-circle-outline" size={20} color="#fff" />
              <Text style={styles.actionBtnText}>New Entry</Text>
            </Pressable>
            <Pressable
              onPress={() => router.replace('/(tabs)')}
              style={[styles.actionBtnSecondary, { borderColor: border }]}
            >
              <Ionicons name="home-outline" size={20} color={textColor} />
              <Text style={[styles.actionBtnSecondaryText, { color: textColor }]}>Home</Text>
            </Pressable>
          </Animated.View>

        </ScrollView>
      </View>
    );
  }

  const styles = StyleSheet.create({
    header: { paddingHorizontal: 16, paddingBottom: 14, flexDirection: 'row', alignItems: 'center' },
    headerTitle: { color: '#fff', fontSize: 17, fontWeight: '700' },
    headerSub: { color: 'rgba(255,255,255,0.75)', fontSize: 12, marginTop: 2 },
    backBtn: { padding: 4 },
    confirmCard: { flexDirection: 'row', gap: 12, borderRadius: 14, padding: 16, borderWidth: 1, marginBottom: 16, alignItems: 'flex-start' },
    confirmTitle: { fontSize: 15, fontWeight: '700' },
    confirmSub: { fontSize: 13, lineHeight: 18, marginTop: 2 },
    photo: { width: '100%', height: 200, borderRadius: 14, marginBottom: 16, borderWidth: 1 },
    staticNotice: { flexDirection: 'row', gap: 10, borderRadius: 12, padding: 14, borderWidth: 1, marginBottom: 12, alignItems: 'flex-start' },
    staticNoticeText: { fontSize: 13, lineHeight: 18, flex: 1 },
    sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 10, marginTop: 4 },
    card: { borderRadius: 14, borderWidth: 1, marginBottom: 8, overflow: 'hidden' },
    obsRow: { flexDirection: 'row', gap: 10, padding: 12, alignItems: 'center' },
    obsText: { fontSize: 14, flex: 1 },
    noteText: { fontSize: 12, lineHeight: 17, marginBottom: 16 },
    eduHeader: { flexDirection: 'row', gap: 12, borderRadius: 14, padding: 16, borderWidth: 1, marginBottom: 16, alignItems: 'flex-start' },
    eduTitle: { fontSize: 14, fontWeight: '700', marginBottom: 4 },
    eduSummary: { fontSize: 13, lineHeight: 19 },
    factRow: { flexDirection: 'row', gap: 10, padding: 14, alignItems: 'flex-start' },
    factText: { fontSize: 14, lineHeight: 20, flex: 1 },
    safetyBox: { flexDirection: 'row', gap: 12, borderRadius: 14, padding: 16, borderWidth: 1, marginTop: 8, marginBottom: 20, alignItems: 'flex-start' },
    safetyTitle: { fontSize: 14, fontWeight: '700', marginBottom: 6 },
    safetyBody: { fontSize: 13, lineHeight: 19 },
    avmaLink: { marginTop: 10 },
    actions: { flexDirection: 'row', gap: 12 },
    actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 12, paddingVertical: 14 },
    actionBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
    actionBtnSecondary: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 12, paddingVertical: 14, borderWidth: 1 },
    actionBtnSecondaryText: { fontWeight: '600', fontSize: 14 },
  });
  