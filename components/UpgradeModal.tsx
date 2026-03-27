import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Purchases from 'react-native-purchases';
import { Colors } from '@/constants/colors';
import { useSubscription } from '@/lib/revenuecat';

const BENEFITS = [
  { icon: 'infinity', label: 'Unlimited scans every month' },
  { icon: 'file-pdf-box', label: 'PDF vet report export' },
  { icon: 'shield-check', label: 'Ad-free experience' },
  { icon: 'bell-ring', label: 'Priority care reminders' },
  { icon: 'chart-line', label: 'Advanced health trends' },
  { icon: 'paw', label: 'Multi-pet profiles, unlimited' },
];

interface UpgradeModalProps {
  visible: boolean;
  onClose: () => void;
  scansUsed?: number;
}

export function UpgradeModal({ visible, onClose, scansUsed = 3 }: UpgradeModalProps) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const bg = isDark ? Colors.dark.background : '#fff';
  const textColor = isDark ? Colors.dark.text : Colors.text;
  const textSec = isDark ? Colors.dark.textSecondary : Colors.textSecondary;
  const surface = isDark ? Colors.dark.surface : '#F7FFFE';

  const { offerings, purchase, restore, isPurchasing, isRestoring } = useSubscription();

  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');
  const [statusMsg, setStatusMsg] = useState('');
  const [statusError, setStatusError] = useState(false);

  const currentOffering = offerings?.current;

  const monthlyPkg = currentOffering?.monthly
    ?? currentOffering?.availablePackages?.find(
        (p: any) => p.packageType === 'MONTHLY' || p.identifier === '$rc_monthly'
      );

  const yearlyPkg = currentOffering?.annual
    ?? currentOffering?.availablePackages?.find(
        (p: any) =>
          p.packageType === 'ANNUAL' ||
          p.identifier === '$rc_annual' ||
          (p.product?.productIdentifier ?? '').toLowerCase().includes('annual') ||
          (p.product?.productIdentifier ?? '').toLowerCase().includes('yearly')
      );

  const monthlyPrice = monthlyPkg?.product?.priceString ?? '$4.99';
  const yearlyPrice = yearlyPkg?.product?.priceString ?? '$39.99';

  const selectedPkg = selectedPlan === 'annual' ? yearlyPkg : monthlyPkg;

  const handleSubscribe = async () => {
    // Yearly fallback: if offering slot empty, fetch product directly from StoreKit
    if (!selectedPkg && selectedPlan === 'annual') {
      setStatusMsg('');
      setStatusError(false);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      try {
        const products = await Purchases.getProducts(
          ['petsnap_premium_yearly', 'petsnap_premium_annual']
        );
        if (products.length === 0) {
          setStatusError(true);
          setStatusMsg('Subscription plans are still loading. Please wait a moment and try again.');
          return;
        }
        const { customerInfo } = await Purchases.purchaseStoreProduct(products[0]);
        if (customerInfo) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          setStatusMsg('Welcome to PetSnap Premium! Enjoy unlimited scans.');
          setStatusError(false);
          setTimeout(() => onClose(), 1500);
        }
      } catch (err: any) {
        if (!err?.userCancelled) {
          setStatusError(true);
          setStatusMsg(err?.message ?? 'Purchase failed. Please try again.');
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        } else {
          setStatusMsg('');
        }
      }
      return;
    }
    if (!selectedPkg) {
      setStatusError(true);
      setStatusMsg('Subscription plans are still loading. Please wait a moment and try again.');
      return;
    }
    setStatusMsg('');
    setStatusError(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await purchase(selectedPkg);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setStatusMsg('Welcome to PetSnap Premium! Enjoy unlimited scans.');
      setStatusError(false);
      setTimeout(() => onClose(), 1500);
    } catch (err: any) {
      if (err?.userCancelled) {
        setStatusMsg('');
      } else {
        setStatusError(true);
        setStatusMsg(err?.message ?? 'Purchase failed. Please try again.');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }
  };

  const handleRestore = async () => {
    setStatusMsg('');
    setStatusError(false);
    try {
      await restore();
      setStatusMsg('Purchases restored successfully.');
    } catch {
      setStatusError(true);
      setStatusMsg('Could not restore purchases. Please try again.');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <LinearGradient
        colors={isDark ? ['#1a1a2e', '#16213e'] : [Colors.primary, Colors.accent]}
        style={styles.heroGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={[styles.heroTop, { paddingTop: insets.top + 16 }]}>
          <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={16}>
            <Ionicons name="close" size={24} color="#fff" />
          </Pressable>
          <MaterialCommunityIcons name="crown" size={48} color="#FFD700" style={{ marginBottom: 8 }} />
          <Text style={styles.heroTitle}>PetSnap Premium</Text>
          <Text style={styles.heroSubtitle}>
            {scansUsed >= 3
              ? "You have used all 3 free scans. Upgrade for unlimited access."
              : "Unlock everything PetSnap has to offer."}
          </Text>
        </View>
      </LinearGradient>

      <ScrollView
        style={[styles.container, { backgroundColor: bg }]}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      >
        <View style={styles.benefitsSection}>
          {BENEFITS.map((b) => (
            <View key={b.label} style={styles.benefitRow}>
              <MaterialCommunityIcons
                name={b.icon as any}
                size={20}
                color={Colors.primary}
                style={{ marginRight: 12 }}
              />
              <Text style={[styles.benefitText, { color: textColor }]}>{b.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.plansRow}>
          <Pressable
            style={[
              styles.planCard,
              {
                backgroundColor: surface,
                borderColor: selectedPlan === 'annual' ? Colors.primary : (isDark ? '#333' : '#E0E0E0'),
                borderWidth: selectedPlan === 'annual' ? 2.5 : 2,
              },
            ]}
            onPress={() => { setSelectedPlan('annual'); setStatusMsg(''); }}
          >
            <View style={styles.bestValueBadge}>
              <Text style={styles.bestValueText}>BEST VALUE</Text>
            </View>
            <Text style={[styles.planPrice, { color: textColor }]}>{yearlyPrice}</Text>
            <Text style={[styles.planPeriod, { color: textSec }]}>per year</Text>
            <Text style={[styles.planNote, { color: Colors.primary }]}>Save over 30%</Text>
          </Pressable>

          <Pressable
            style={[
              styles.planCard,
              {
                backgroundColor: surface,
                borderColor: selectedPlan === 'monthly' ? Colors.primary : (isDark ? '#333' : '#E0E0E0'),
                borderWidth: selectedPlan === 'monthly' ? 2.5 : 2,
              },
            ]}
            onPress={() => { setSelectedPlan('monthly'); setStatusMsg(''); }}
          >
            <Text style={[styles.planPrice, { color: textColor, marginTop: 8 }]}>{monthlyPrice}</Text>
            <Text style={[styles.planPeriod, { color: textSec }]}>per month</Text>
            <Text style={[styles.planNote, { color: textSec }]}>Cancel anytime</Text>
          </Pressable>
        </View>

        <Pressable
          onPress={handleSubscribe}
          disabled={isPurchasing}
          style={({ pressed }) => [styles.subscribeBtn, { opacity: pressed || isPurchasing ? 0.8 : 1 }]}
        >
          <LinearGradient
            colors={[Colors.primary, Colors.accent]}
            style={styles.subscribeBtnGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {isPurchasing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.subscribeBtnText}>
                {selectedPlan === 'annual'
                  ? 'Subscribe Now · ' + yearlyPrice + '/yr'
                  : 'Subscribe Now · ' + monthlyPrice + '/mo'}
              </Text>
            )}
          </LinearGradient>
        </Pressable>

        {statusMsg ? (
          <Text style={[styles.statusMsg, { color: statusError ? Colors.warning : Colors.success }]}>
            {statusMsg}
          </Text>
        ) : null}

        <Pressable onPress={handleRestore} disabled={isRestoring} style={styles.restoreBtn}>
          {isRestoring ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : (
            <Text style={[styles.restoreText, { color: textSec }]}>Restore Purchases</Text>
          )}
        </Pressable>

        <Text style={[styles.legalText, { color: textSec }]}>
          Subscriptions renew automatically unless cancelled at least 24 hours before the end of the
          current period. Cancel anytime in your App Store subscription settings.
          Subscriptions are managed through the App Store.
        </Text>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heroGradient: { paddingBottom: 24 },
  heroTop: { alignItems: 'center', paddingHorizontal: 24 },
  closeBtn: { position: 'absolute', top: 0, right: 16, padding: 8 },
  heroTitle: {
    fontSize: 26,
    fontFamily: 'Inter_700Bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 20,
  },
  benefitsSection: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 8 },
  benefitRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  benefitText: { fontSize: 15, fontFamily: 'Inter_400Regular', flex: 1 },
  plansRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 12, marginVertical: 16 },
  planCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  bestValueBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.primary,
    paddingVertical: 3,
    alignItems: 'center',
  },
  bestValueText: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    color: '#fff',
    letterSpacing: 0.5,
  },
  planPrice: { fontSize: 22, fontFamily: 'Inter_700Bold', marginTop: 20 },
  planPeriod: { fontSize: 13, fontFamily: 'Inter_400Regular', marginTop: 2 },
  planNote: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 6, textAlign: 'center' },
  subscribeBtn: { marginHorizontal: 16, marginTop: 8, borderRadius: 16, overflow: 'hidden' },
  subscribeBtnGradient: { paddingVertical: 16, alignItems: 'center' },
  subscribeBtnText: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#fff' },
  statusMsg: {
    textAlign: 'center',
    marginHorizontal: 24,
    marginTop: 12,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  restoreBtn: { alignItems: 'center', marginTop: 16, paddingVertical: 8 },
  restoreText: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    textDecorationLine: 'underline',
  },
  legalText: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    marginHorizontal: 24,
    marginTop: 16,
    lineHeight: 16,
  },
});
