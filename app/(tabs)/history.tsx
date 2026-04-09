import { Ionicons } from '@expo/vector-icons';
  import * as Haptics from 'expo-haptics';
  import { router } from 'expo-router';
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
    const border = isDark ? Colors.dark.border : Colors.border;

    return (
      <View style={[styles.container, { backgroundColor: bg }]}>
        <View style={[styles.header, { paddingTop: topPad + 16 }]}>
          <Text style={[styles.headerTitle, { color: textColor }]}>My Wellness Journal</Text>
          <Text style={[styles.headerCount, { color: textSec }]}>
            {scanHistory.length} {scanHistory.length === 1 ? 'entry' : 'entries'}
          </Text>
        </View>

        <View style={[styles.notice, { backgroundColor: Colors.primary + '12', borderColor: Colors.primary + '30' }]}>
          <Ionicons name="information-circle-outline" size={16} color={Colors.primary} />
          <Text style={[styles.noticeText, { color: Colors.primary }]}>
            These are your personal wellness journal entries. Each entry shows general educational information
            about pet care topics — not assessments of your pet.
          </Text>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16, paddingBottom: bottomPad }}
          showsVerticalScrollIndicator={false}
        >
          {scanHistory.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: surface, borderColor: border }]}>
              <Ionicons name="journal-outline" size={48} color={textSec} />
              <Text style={[styles.emptyTitle, { color: textColor }]}>No journal entries yet</Text>
              <Text style={[styles.emptySub, { color: textSec }]}>
                Start a new wellness journal entry to log observations and access pet care education.
              </Text>
              <Pressable
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push('/scan-wizard'); }}
                style={[styles.startBtn, { backgroundColor: Colors.primary }]}
              >
                <Ionicons name="add-circle-outline" size={20} color="#fff" />
                <Text style={styles.startBtnText}>New Journal Entry</Text>
              </Pressable>
            </View>
          ) : (
            scanHistory.map((entry, i) => (
              <Animated.View key={entry.id} entering={FadeInDown.duration(250).delay(i * 50)}>
                <ScanHistoryCard
                  scan={entry}
                  onPress={() => {
                    Haptics.selectionAsync();
                    router.push({ pathname: '/results', params: { id: entry.id } });
                  }}
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
    header: { paddingHorizontal: 20, paddingBottom: 10 },
    headerTitle: { fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
    headerCount: { fontSize: 14, marginTop: 4 },
    notice: { flexDirection: 'row', gap: 8, marginHorizontal: 16, marginBottom: 8, borderRadius: 12, padding: 12, borderWidth: 1, alignItems: 'flex-start' },
    noticeText: { fontSize: 12, lineHeight: 17, flex: 1 },
    emptyState: { borderRadius: 16, padding: 32, alignItems: 'center', borderWidth: 1, marginTop: 16 },
    emptyTitle: { fontSize: 18, fontWeight: '700', marginTop: 14, marginBottom: 8 },
    emptySub: { fontSize: 14, lineHeight: 20, textAlign: 'center', marginBottom: 20 },
    startBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 12, paddingHorizontal: 20, paddingVertical: 12 },
    startBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  });
  