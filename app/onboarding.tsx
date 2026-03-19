import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/colors';
import { usePets } from '@/context/PetContext';

const SLIDES = [
  {
    id: '1',
    icon: 'camera' as const,
    iconType: 'ionicons' as const,
    title: 'Snap a Symptom',
    subtitle: 'Take a photo of your pet and let PetSnap analyze potential health concerns instantly.',
    gradient: [Colors.primary, Colors.accent] as const,
  },
  {
    id: '2',
    icon: 'stethoscope' as const,
    iconType: 'material' as const,
    title: 'Smart Health Analysis',
    subtitle: 'Get condition insights based on Merck Veterinary Manual, PetMD & ASPCA guidelines.',
    gradient: [Colors.accent, Colors.accentDark] as const,
  },
  {
    id: '3',
    icon: 'heart-pulse' as const,
    iconType: 'material' as const,
    title: 'Track & Stay Ahead',
    subtitle: 'Monitor health trends, store records, and generate vet reports for all your pets.',
    gradient: [Colors.primaryDark, Colors.primary] as const,
  },
];

export default function OnboardingScreen() {
  const { setHasOnboarded } = usePets();
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Math.max(insets.bottom + 24, Platform.OS === 'web' ? 58 : 40);

  const slide = SLIDES[currentIndex];

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentIndex < SLIDES.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleGetStarted();
    }
  };

  const handleGetStarted = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await setHasOnboarded(true);
    router.replace('/(tabs)');
  };

  const isLast = currentIndex === SLIDES.length - 1;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={slide.gradient}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <Animated.View
        key={slide.id}
        entering={FadeIn.duration(300)}
        style={[styles.slideContent, { paddingTop: topPad + 40 }]}
      >
        <View style={styles.iconContainer}>
          {slide.iconType === 'material' ? (
            <MaterialCommunityIcons name={slide.icon as any} size={80} color="rgba(255,255,255,0.9)" />
          ) : (
            <Ionicons name={slide.icon as any} size={80} color="rgba(255,255,255,0.9)" />
          )}
        </View>
        <Animated.Text entering={FadeInDown.delay(100).duration(300)} style={styles.slideTitle}>
          {slide.title}
        </Animated.Text>
        <Animated.Text entering={FadeInDown.delay(200).duration(300)} style={styles.slideSubtitle}>
          {slide.subtitle}
        </Animated.Text>
      </Animated.View>

      <View style={[styles.bottomContainer, { paddingBottom: bottomPad }]}>
        <View style={styles.dotsContainer}>
          {SLIDES.map((_, i) => (
            <Pressable
              key={i}
              onPress={() => setCurrentIndex(i)}
              style={[
                styles.dot,
                { opacity: i === currentIndex ? 1 : 0.3, width: i === currentIndex ? 24 : 8 },
              ]}
            />
          ))}
        </View>

        <Pressable
          onPress={handleNext}
          style={({ pressed }) => [styles.button, { opacity: pressed ? 0.85 : 1 }]}
        >
          <Text style={styles.buttonText}>{isLast ? 'Get Started' : 'Next'}</Text>
          <Ionicons name={isLast ? 'paw' : 'arrow-forward'} size={20} color="#fff" />
        </Pressable>

        {!isLast && (
          <Pressable onPress={handleGetStarted} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primary },
  slideContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingBottom: 160,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  slideTitle: {
    fontSize: 32,
    fontFamily: 'Inter_700Bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  slideSubtitle: {
    fontSize: 17,
    fontFamily: 'Inter_400Regular',
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 26,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: 20,
    paddingHorizontal: 24,
  },
  dotsContainer: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: '#fff',
  },
  skipButton: { paddingVertical: 8 },
  skipText: {
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
    color: 'rgba(255,255,255,0.7)',
  },
});
