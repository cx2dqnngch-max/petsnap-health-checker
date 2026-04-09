import { Ionicons } from '@expo/vector-icons';
  import React from 'react';
  import { Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';
  import { Colors } from '@/constants/colors';
  import { ScanResult } from '@/context/PetContext';

  interface Props {
    scan: ScanResult;
    compact?: boolean;
    onPress?: () => void;
  }

  function formatDate(isoString: string): string {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  export function ScanHistoryCard({ scan, compact, onPress }: Props) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const surface = isDark ? Colors.dark.surface : Colors.surface;
    const textColor = isDark ? Colors.dark.text : Colors.text;
    const textSec = isDark ? Colors.dark.textSecondary : Colors.textSecondary;
    const border = isDark ? Colors.dark.border : Colors.border;

    const obsCount = scan.observations?.length ?? 0;

    if (compact) {
      return (
        <Pressable
          onPress={onPress}
          style={({ pressed }) => [styles.compactCard, { backgroundColor: surface, borderColor: border, opacity: pressed ? 0.85 : 1 }]}
        >
          <View style={[styles.iconDot, { backgroundColor: Colors.primary + '22' }]}>
            <Ionicons name="journal-outline" size={16} color={Colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.compactArea, { color: textColor }]} numberOfLines={1}>{scan.bodyArea}</Text>
            <Text style={[styles.compactPet, { color: textSec }]} numberOfLines={1}>{scan.petName} · {formatDate(scan.createdAt)}</Text>
          </View>
          <Text style={[styles.eduBadge, { color: Colors.primary, borderColor: Colors.primary + '44' }]}>Education</Text>
        </Pressable>
      );
    }

    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.card, { backgroundColor: surface, borderColor: border, opacity: pressed ? 0.9 : 1 }]}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.iconCircle, { backgroundColor: Colors.primary + '18' }]}>
            <Ionicons name="journal-outline" size={22} color={Colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.areaText, { color: textColor }]}>{scan.bodyArea}</Text>
            <Text style={[styles.petText, { color: textSec }]}>{scan.petName} · {formatDate(scan.createdAt)}</Text>
          </View>
          <Text style={[styles.eduBadge, { color: Colors.primary, borderColor: Colors.primary + '44' }]}>Education</Text>
        </View>

        {obsCount > 0 && (
          <View style={[styles.obsPreview, { borderTopColor: border }]}>
            <Ionicons name="list-outline" size={14} color={textSec} />
            <Text style={[styles.obsCount, { color: textSec }]}>{obsCount} observation{obsCount !== 1 ? 's' : ''} logged</Text>
          </View>
        )}

        {scan.educationalTopic?.title && (
          <View style={[styles.eduPreview, { borderTopColor: border }]}>
            <Ionicons name="book-outline" size={14} color={Colors.primary} />
            <Text style={[styles.eduTopicText, { color: textSec }]} numberOfLines={1}>
              {scan.educationalTopic.title}
            </Text>
          </View>
        )}
      </Pressable>
    );
  }

  const styles = StyleSheet.create({
    compactCard: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 12,
      padding: 12,
      borderWidth: 1,
      marginBottom: 8,
      gap: 10,
    },
    iconDot: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
    },
    compactArea: { fontSize: 14, fontWeight: '600' },
    compactPet: { fontSize: 12, marginTop: 1 },
    card: {
      borderRadius: 16,
      borderWidth: 1,
      marginBottom: 12,
      overflow: 'hidden',
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 14,
      gap: 12,
    },
    iconCircle: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
    },
    areaText: { fontSize: 15, fontWeight: '700' },
    petText: { fontSize: 13, marginTop: 2 },
    eduBadge: {
      fontSize: 11,
      fontWeight: '700',
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 8,
      paddingVertical: 3,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    obsPreview: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderTopWidth: 1,
    },
    obsCount: { fontSize: 13 },
    eduPreview: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderTopWidth: 1,
    },
    eduTopicText: { fontSize: 13, flex: 1 },
  });
  