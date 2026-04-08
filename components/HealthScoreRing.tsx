import { MaterialCommunityIcons } from '@expo/vector-icons';
  import React from 'react';
  import { View, StyleSheet } from 'react-native';
  import { Colors } from '@/constants/colors';

  interface Props {
    score?: number;
    size?: number;
    strokeWidth?: number;
    light?: boolean;
  }

  // Displays a simple wellness indicator — no numeric score shown
  export function HealthScoreRing({ score, size = 72, strokeWidth = 7, light = false }: Props) {
    const iconSize = Math.round(size * 0.45);
    const color = light ? 'rgba(255,255,255,0.9)' : Colors.primary;
    return (
      <View style={[styles.container, { width: size, height: size, borderRadius: size / 2, borderWidth: strokeWidth, borderColor: light ? 'rgba(255,255,255,0.4)' : `${Colors.primary}30` }]}>
        <MaterialCommunityIcons name="paw" size={iconSize} color={color} />
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'transparent',
    },
  });
  