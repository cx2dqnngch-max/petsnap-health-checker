import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Colors } from '@/constants/colors';

interface Props {
  style?: ViewStyle;
}

export function DisclaimerBanner({ style }: Props) {
  return (
    <View style={[styles.container, style]}>
      <Ionicons name="warning" size={18} color={Colors.warning} style={{ marginTop: 1 }} />
      <Text style={styles.text}>
        <Text style={styles.bold}>For informational purposes only — not a veterinary diagnosis.</Text>
        {' '}Always consult a licensed veterinarian before making any decisions about your pet's health. Do not rely on this app as a substitute for professional veterinary care.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.warning,
    backgroundColor: Colors.emergencyLight,
    padding: 14,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  text: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    color: '#7B1818',
    lineHeight: 18,
  },
  bold: { fontFamily: 'Inter_700Bold' },
});
