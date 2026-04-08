import React from 'react';
  import { StyleSheet, Text, View, ViewStyle } from 'react-native';
  import { Ionicons } from '@expo/vector-icons';
  import { Colors } from '@/constants/colors';

  interface Props { style?: ViewStyle; }

  export function DisclaimerBanner({ style }: Props) {
    return (
      <View style={[styles.container, style]}>
        <Ionicons name="information-circle" size={16} color={Colors.primary} style={{ marginTop: 1 }} />
        <Text style={styles.text}>
          <Text style={styles.bold}>Educational information only.</Text>
          {' '}This is not veterinary advice. Always consult a licensed veterinarian for your pet's health concerns. For medical concerns, consult a licensed veterinarian.
        </Text>
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 8,
      backgroundColor: `${Colors.primary}12`,
      borderRadius: 12,
      padding: 12,
      borderLeftWidth: 3,
      borderLeftColor: Colors.primary,
    },
    text: {
      flex: 1,
      fontSize: 12,
      fontFamily: 'Inter_400Regular',
      color: Colors.textSecondary,
      lineHeight: 17,
    },
    bold: {
      fontFamily: 'Inter_600SemiBold',
      color: Colors.primary,
    },
  });
  