import {
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    useFonts,
  } from "@expo-google-fonts/inter";
  import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
  import { Stack } from "expo-router";
  import * as SplashScreen from "expo-splash-screen";
  import React, { useEffect, useState } from "react";
  import { GestureHandlerRootView } from "react-native-gesture-handler";
  import { KeyboardProvider } from "react-native-keyboard-controller";
  import { SafeAreaProvider } from "react-native-safe-area-context";
  import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
  } from "react-native";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import { Ionicons } from "@expo/vector-icons";

  import { ErrorBoundary } from "@/components/ErrorBoundary";
  import { PetProvider } from "@/context/PetContext";
  import { initializeRevenueCat, SubscriptionProvider } from "@/lib/revenuecat";
  import { Colors } from "@/constants/colors";

  SplashScreen.preventAutoHideAsync();
  initializeRevenueCat();

  // APP_REVIEW_MODE — simplifies AI phrasing and emphasises educational framing
  export const APP_REVIEW_MODE = true;

  const queryClient = new QueryClient();

  function SafetyModal({ visible, onAccept }: { visible: boolean; onAccept: () => void }) {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        statusBarTranslucent
      >
        <View style={safetyStyles.overlay}>
          <View style={safetyStyles.card}>
            <View style={safetyStyles.iconRow}>
              <Ionicons name="information-circle" size={40} color={Colors.primary} />
            </View>
            <Text style={safetyStyles.title}>Important Information</Text>
            <Text style={safetyStyles.body}>
              PetSnap provides educational pet wellness information only. It does not evaluate health conditions or provide medical advice.{'

'}Always consult a licensed veterinarian for medical concerns.{'

'}This information is educational only and is not veterinary advice.
            </Text>
            <Pressable
              onPress={onAccept}
              style={({ pressed }) => [safetyStyles.button, { opacity: pressed ? 0.85 : 1 }]}
            >
              <Text style={safetyStyles.buttonText}>I Understand</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  }

  const safetyStyles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.6)',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: 24,
      padding: 28,
      width: '100%',
      maxWidth: 380,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.18,
      shadowRadius: 20,
      elevation: 12,
    },
    iconRow: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: `${Colors.primary}15`,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    title: {
      fontSize: 22,
      fontFamily: 'Inter_700Bold',
      color: '#1A2B2A',
      marginBottom: 14,
      textAlign: 'center',
    },
    body: {
      fontSize: 15,
      fontFamily: 'Inter_400Regular',
      color: '#444',
      textAlign: 'center',
      lineHeight: 23,
      marginBottom: 24,
    },
    button: {
      backgroundColor: Colors.primary,
      borderRadius: 14,
      paddingVertical: 16,
      paddingHorizontal: 48,
      width: '100%',
      alignItems: 'center',
    },
    buttonText: {
      fontSize: 17,
      fontFamily: 'Inter_700Bold',
      color: '#fff',
    },
  });

  function RootLayoutNav() {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="scan-wizard" options={{ headerShown: false, presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="results" options={{ headerShown: false }} />
        <Stack.Screen name="add-pet" options={{ headerShown: false, presentation: 'modal', animation: 'slide_from_bottom' }} />
        <Stack.Screen name="pet-detail" options={{ headerShown: false }} />
        <Stack.Screen name="scan-detail" options={{ headerShown: false }} />
      </Stack>
    );
  }

  export default function RootLayout() {
    const [fontsLoaded, fontError] = useFonts({
      Inter_400Regular,
      Inter_500Medium,
      Inter_600SemiBold,
      Inter_700Bold,
    });

    const [safetyAccepted, setSafetyAccepted] = useState<boolean | null>(null);

    useEffect(() => {
      if (fontsLoaded || fontError) {
        SplashScreen.hideAsync();
      }
    }, [fontsLoaded, fontError]);

    useEffect(() => {
      AsyncStorage.getItem('safety_accepted').then(val => {
        setSafetyAccepted(val === 'true');
      });
    }, []);

    const handleAccept = async () => {
      await AsyncStorage.setItem('safety_accepted', 'true');
      setSafetyAccepted(true);
    };

    if (!fontsLoaded && !fontError) return null;

    return (
      <SafeAreaProvider>
        <ErrorBoundary>
          <QueryClientProvider client={queryClient}>
            <SubscriptionProvider>
              <PetProvider>
                <GestureHandlerRootView style={{ flex: 1 }}>
                  <KeyboardProvider>
                    <RootLayoutNav />
                    <SafetyModal
                      visible={safetyAccepted === false}
                      onAccept={handleAccept}
                    />
                  </KeyboardProvider>
                </GestureHandlerRootView>
              </PetProvider>
            </SubscriptionProvider>
          </QueryClientProvider>
        </ErrorBoundary>
      </SafeAreaProvider>
    );
  }
  