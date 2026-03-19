import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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

  const { offerings, purchase, restore, isPurchasing, isRestoring, isSubscribed } = useSubscription();

  const [confirmPackage, setConfirmPackage] = useState<any>(null);
  const [statusMsg, setStatusMsg] = useState('');
  const [statusError, setStatusError] = useState(false);

  const currentOffering = offerings?.current;
  const monthlyPkg = currentOffering?.monthly ?? currentOffering?.availablePackages?.find(p => p.packageType === 'MONTHLY');
  const yearlyPkg = currentOffering?.annual ?? currentOffering?.availablePackages?.find(p => p.packageType === 'ANNUAL');

  const monthlyPrice = monthlyPkg?.product?.priceString ?? '$4.99';
  const yearlyPrice = yearlyPkg?.product?.priceString ?? '$39.99';

  const handlePressPlan = (pkg: any) => {
    if (!pkg) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setStatusMsg('');
    setStatusError(false);
    setConfirmPackage(pkg);
  };

  const handleConfirmPurchase = async () => {
    if (!confirmPackage) return;
    setConfirmPackage(null);
    try {
      await purchase(confirmPackage);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setStatusMsg('Purchase successful! Enjoy unlimited scans.');
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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStatusMsg('');
    setStatusError(false);
    try {
      await restore();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setStatusMsg('Purchases restored!');
      setStatusError(false);
      setTimeout(() => onClose(), 1500);
    } catch {
      setStatusError(true);
      setStatusMsg('Could not restore purchases. Try again.');
    }
  };

  const isBusy = isPurchasing || isRestoring;

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={onClose}
      >
        <View style={[styles.container, { backgroundColor: bg }]}>
          <LinearGradient
            colors={[Colors.primary, Colors.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.heroGradient, { paddingTop: Platform.OS === 'web' ? 40 : insets.top + 16 }]}
          >
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="rgba(255,255,255,0.85)" />
            </Pressable>

            <View style={styles.pawRow}>
              <MaterialCommunityIcons name="paw" size={44} color="rgba(255,255,255,0.35)" />
              <MaterialCommunityIcons name="paw" size={60} color="rgba(255,255,255,0.9)" />
              <MaterialCommunityIcons name="paw" size={44} color="rgba(255,255,255,0.35)" />
            </View>

            <Text style={styles.heroTitle}>Upgrade to Premium</Text>
            <Text style={styles.heroSubtitle}>
              {scansUsed >= 3
                ? `You've used all 3 free scans this month!`
                : `You're on the free plan — upgrade for more.`}
            </Text>
          </LinearGradient>

          <ScrollView
            contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}
            showsVerticalScrollIndicator={false}
          >
            <View style={[styles.benefitsCard, { backgroundColor: surface }]}>
              <Text style={[styles.benefitsTitle, { color: textColor }]}>Everything in Premium</Text>
              <View style={styles.benefitsList}>
                {BENEFITS.map((b, i) => (
                  <View key={i} style={styles.benefitRow}>
                    <View style={styles.checkCircle}>
                      <Ionicons name="checkmark" size={14} color="#fff" />
                    </View>
                    <MaterialCommunityIcons name={b.icon as any} size={20} color={Colors.primary} style={{ width: 24 }} />
                    <Text style={[styles.benefitLabel, { color: textColor }]}>{b.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.plansRow}>
              <Pressable
                onPress={() => handlePressPlan(monthlyPkg)}
                disabled={isBusy || !monthlyPkg}
                style={({ pressed }) => [styles.planCard, { backgroundColor: surface, opacity: (pressed || isBusy) ? 0.75 : 1 }]}
              >
                <Text style={[styles.planPeriod, { color: textSec }]}>Monthly</Text>
                <Text style={[styles.planPrice, { color: textColor }]}>{monthlyPrice}</Text>
                <Text style={[styles.planPer, { color: textSec }]}>per month</Text>
              </Pressable>

              <Pressable
                onPress={() => handlePressPlan(yearlyPkg)}
                disabled={isBusy || !yearlyPkg}
                style={({ pressed }) => [styles.planCardHighlight, { opacity: (pressed || isBusy) ? 0.8 : 1 }]}
              >
                <LinearGradient
                  colors={[Colors.primary, Colors.accent]}
                  style={styles.planCardHighlightInner}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.bestValueBadge}>
                    <Text style={styles.bestValueText}>BEST VALUE</Text>
                  </View>
                  <Text style={styles.planPeriodLight}>Yearly</Text>
                  <Text style={styles.planPriceLight}>{yearlyPrice}</Text>
                  <Text style={styles.planPerLight}>per year</Text>
                  <Text style={styles.planSaving}>Save 33%</Text>
                </LinearGradient>
              </Pressable>
            </View>

            <Pressable
              onPress={() => handlePressPlan(yearlyPkg)}
              disabled={isBusy || !yearlyPkg}
              style={({ pressed }) => [styles.mainCta, { opacity: (pressed || isBusy) ? 0.8 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] }]}
            >
              <LinearGradient
                colors={[Colors.primary, Colors.accent]}
                style={styles.mainCtaGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {isBusy ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <MaterialCommunityIcons name="crown" size={22} color="#fff" />
                    <Text style={styles.mainCtaText}>Subscribe Now — {yearlyPrice}/yr</Text>
                  </>
                )}
              </LinearGradient>
            </Pressable>

            {statusMsg ? (
              <View style={[styles.statusBanner, { backgroundColor: statusError ? '#FFF0F0' : '#F0FFF4' }]}>
                <Ionicons
                  name={statusError ? 'alert-circle' : 'checkmark-circle'}
                  size={18}
                  color={statusError ? '#E53E3E' : Colors.primary}
                />
                <Text style={[styles.statusText, { color: statusError ? '#E53E3E' : Colors.primary }]}>
                  {statusMsg}
                </Text>
              </View>
            ) : null}

            <View style={styles.bottomActions}>
              <Pressable onPress={handleRestore} disabled={isBusy} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}>
                <Text style={[styles.restoreText, { color: textSec }]}>
                  {isRestoring ? 'Restoring…' : 'Restore Purchases'}
                </Text>
              </Pressable>

              <Pressable onPress={onClose} style={styles.notNow}>
                <Text style={[styles.notNowText, { color: textSec }]}>Not now — continue with 3 free scans/month</Text>
              </Pressable>
            </View>

            <Text style={[styles.legalNote, { color: textSec }]}>
              Cancel anytime. Subscriptions managed through the App Store or Google Play.
            </Text>
          </ScrollView>
        </View>
      </Modal>

      <Modal
        visible={!!confirmPackage}
        animationType="fade"
        transparent
        onRequestClose={() => setConfirmPackage(null)}
      >
        <View style={styles.confirmOverlay}>
          <View style={[styles.confirmDialog, { backgroundColor: bg }]}>
            <MaterialCommunityIcons name="crown" size={36} color={Colors.primary} style={{ marginBottom: 12 }} />
            <Text style={[styles.confirmTitle, { color: textColor }]}>Confirm Purchase</Text>
            <Text style={[styles.confirmBody, { color: textSec }]}>
              {confirmPackage?.product?.title ?? 'PetSnap Premium'}{'\n'}
              <Text style={{ fontFamily: 'Inter_700Bold', color: textColor }}>
                {confirmPackage?.product?.priceString ?? ''}
              </Text>{' '}
              {confirmPackage?.product?.subscriptionPeriod === 'P1M' ? '/ month' : '/ year'}
            </Text>
            <Text style={[styles.confirmNote, { color: textSec }]}>
              This is a test purchase. No real charge will be made.
            </Text>
            <View style={styles.confirmButtons}>
              <Pressable
                onPress={() => setConfirmPackage(null)}
                style={({ pressed }) => [styles.confirmCancel, { opacity: pressed ? 0.7 : 1, backgroundColor: surface }]}
              >
                <Text style={[styles.confirmCancelText, { color: textSec }]}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleConfirmPurchase}
                style={({ pressed }) => [styles.confirmOk, { opacity: pressed ? 0.85 : 1 }]}
              >
                <LinearGradient
                  colors={[Colors.primary, Colors.accent]}
                  style={styles.confirmOkGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.confirmOkText}>Confirm</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  heroGradient: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    alignItems: 'center',
    gap: 8,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  pawRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 30,
    fontFamily: 'Inter_700Bold',
    color: '#fff',
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 22,
  },
  content: {
    padding: 20,
    gap: 16,
  },
  benefitsCard: {
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  benefitsTitle: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    marginBottom: 14,
  },
  benefitsList: { gap: 12 },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitLabel: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  plansRow: {
    flexDirection: 'row',
    gap: 12,
  },
  planCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  },
  planPeriod: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  planPrice: { fontSize: 26, fontFamily: 'Inter_700Bold' },
  planPer: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  planCardHighlight: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  planCardHighlightInner: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    gap: 4,
  },
  bestValueBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 4,
  },
  bestValueText: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    color: '#fff',
    letterSpacing: 0.5,
  },
  planPeriodLight: { fontSize: 13, fontFamily: 'Inter_500Medium', color: 'rgba(255,255,255,0.85)' },
  planPriceLight: { fontSize: 26, fontFamily: 'Inter_700Bold', color: '#fff' },
  planPerLight: { fontSize: 12, fontFamily: 'Inter_400Regular', color: 'rgba(255,255,255,0.8)' },
  planSaving: { fontSize: 12, fontFamily: 'Inter_700Bold', color: 'rgba(255,255,255,0.9)', marginTop: 2 },
  mainCta: {
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  mainCtaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 10,
    minHeight: 58,
  },
  mainCtaText: { fontSize: 17, fontFamily: 'Inter_700Bold', color: '#fff' },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
  },
  statusText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  bottomActions: { gap: 8, alignItems: 'center' },
  restoreText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    textDecorationLine: 'underline',
  },
  notNow: { alignItems: 'center', paddingVertical: 4 },
  notNowText: { fontSize: 13, fontFamily: 'Inter_400Regular', textAlign: 'center' },
  legalNote: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    lineHeight: 16,
  },
  confirmOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  confirmDialog: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 16,
  },
  confirmTitle: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    marginBottom: 8,
  },
  confirmBody: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 8,
  },
  confirmNote: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  confirmButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  confirmCancel: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  confirmCancelText: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
  },
  confirmOk: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
  },
  confirmOkGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  confirmOkText: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: '#fff',
  },
});
