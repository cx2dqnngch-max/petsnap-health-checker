import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { Colors } from '@/constants/colors';
import { ScanResult } from '@/context/PetContext';

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
  emergency: 'Seek Vet',
};

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
  const severityColor = SEVERITY_COLORS[scan.overallSeverity];
  const topCondition = scan.conditions[0];

  if (compact) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.compactCard, { backgroundColor: surface, opacity: pressed ? 0.85 : 1 }]}
      >
        <View style={[styles.severityDot, { backgroundColor: severityColor }]} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.compactArea, { color: textColor }]} numberOfLines={1}>{scan.bodyArea}</Text>
          <Text style={[styles.compactPet, { color: textSec }]} numberOfLines={1}>{scan.petName} · {formatDate(scan.createdAt)}</Text>
        </View>
        <Text style={[styles.severityBadge, { color: severityColor, borderColor: severityColor }]}>
          {SEVERITY_LABELS[scan.overallSeverity]}
        </Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, { backgroundColor: surface, opacity: pressed ? 0.9 : 1 }]}
    >
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.cardPetName, { color: textColor }]}>{scan.petName}</Text>
          <Text style={[styles.cardArea, { color: textSec }]}>{scan.bodyArea} · {formatDate(scan.createdAt)}</Text>
        </View>
        <View style={[styles.severityTag, { backgroundColor: `${severityColor}20` }]}>
          <Text style={[styles.severityTagText, { color: severityColor }]}>{SEVERITY_LABELS[scan.overallSeverity]}</Text>
        </View>
      </View>
      {topCondition && (
        <View style={styles.conditionRow}>
          <Text style={[styles.conditionName, { color: textColor }]} numberOfLines={1}>{topCondition.name}</Text>
          <View style={styles.probBar}>
            <View style={[styles.probFill, { width: `${topCondition.probability}%` as any, backgroundColor: severityColor }]} />
          </View>
          <Text style={[styles.probText, { color: textSec }]}>{topCondition.probability}%</Text>
        </View>
      )}
      <View style={styles.cardFooter}>
        <Text style={[styles.conditionsCount, { color: textSec }]}>
          {scan.conditions.length} condition{scan.conditions.length !== 1 ? 's' : ''} analyzed
        </Text>
        <Ionicons name="chevron-forward" size={16} color={textSec} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    gap: 10,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  cardPetName: { fontSize: 16, fontFamily: 'Inter_700Bold', marginBottom: 2 },
  cardArea: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  severityTag: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  severityTagText: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  conditionRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  conditionName: { fontSize: 14, fontFamily: 'Inter_500Medium', flex: 1 },
  probBar: { width: 60, height: 4, borderRadius: 2, backgroundColor: Colors.borderLight, overflow: 'hidden' },
  probFill: { height: '100%', borderRadius: 2 },
  probText: { fontSize: 12, fontFamily: 'Inter_500Medium', width: 32, textAlign: 'right' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  conditionsCount: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  compactCard: {
    width: 200,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  severityDot: { width: 10, height: 10, borderRadius: 5 },
  compactArea: { fontSize: 14, fontFamily: 'Inter_600SemiBold', marginBottom: 2 },
  compactPet: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  severityBadge: { fontSize: 11, fontFamily: 'Inter_600SemiBold', borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
});
