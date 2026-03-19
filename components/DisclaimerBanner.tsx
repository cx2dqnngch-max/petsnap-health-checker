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
        <Text style={styles.bold}>Informational ONLY — not a veterinary diagnosis.</Text>
        {' '}Always consult a licensed vet for any concerning symptoms. Based on Merck Veterinary Manual, PetMD & ASPCA guidelines.
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
