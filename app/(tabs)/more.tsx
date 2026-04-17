import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import {
  Alert,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/colors';
import { usePets } from '@/context/PetContext';
import { UpgradeModal } from '@/components/UpgradeModal';
import { useSubscription, ANNUAL_PRODUCT_ID, MONTHLY_PRODUCT_ID } from '@/lib/revenuecat';

const EDUCATION_ARTICLES = [
  {
    title: 'Understanding Conjunctivitis',
    summary: 'Eye infections are common in dogs and cats. Learn the signs and when to seek help.',
    body: `Conjunctivitis (pink eye) is inflammation of the tissue lining the eyelids and covering the white part of the eye.

COMMON SIGNS:
• Red, irritated, or swollen eyes
• Watery or thick discharge (clear, yellow, or green)
• Squinting or pawing at the eye
• Crusting around the eyelids

CAUSES:
• Bacterial or viral infection
• Allergies (pollen, dust, mold)
• Foreign body in the eye
• Dry eye (keratoconjunctivitis sicca)
• Anatomical issues (entropion)

HOME CARE:
• Gently wipe discharge with a warm, damp cloth
• Keep your pet from rubbing the eye
• Avoid exposing to smoke or irritants

WHEN TO SEE A VET:
• Discharge is thick, yellow, or green
• Eye appears cloudy or the pupil looks abnormal
• Symptoms persist more than 48 hours
• Your pet is in obvious discomfort

Source: Merck Veterinary Manual, ASPCA`,
  },
  {
    title: 'Flea Allergy Dermatitis',
    summary: 'Even one flea bite can trigger severe allergic reactions. Prevention is key.',
    body: `Flea Allergy Dermatitis (FAD) is the most common skin condition in dogs and cats. Pets with FAD are allergic to flea saliva — even a single bite causes intense itching.

COMMON SIGNS:
• Intense itching, especially at the base of the tail
• Hair loss, hot spots, or bald patches
• Red, inflamed, or scabby skin
• Restlessness and constant scratching/chewing
• You may not see fleas — they can be very hard to spot

DIAGNOSIS:
Vets diagnose FAD based on symptoms, a positive flea comb test, or response to flea treatment.

TREATMENT:
• Kill existing fleas with a vet-recommended flea product
• Treat ALL pets in the household
• Treat the environment (wash bedding, vacuum thoroughly)
• Soothe skin with prescribed antihistamines or steroids

PREVENTION:
• Year-round flea prevention is essential
• Monthly topical treatments or oral medications
• Regular home vacuuming and washing pet bedding

Source: PetMD, ASPCA`,
  },
  {
    title: 'Signs of Arthritis in Dogs',
    summary: 'Older dogs often hide pain. Learn the subtle signs of joint disease.',
    body: `Osteoarthritis (degenerative joint disease) affects 1 in 5 adult dogs and is very common in seniors. Dogs are instinctively good at hiding pain, so early detection matters.

COMMON SIGNS:
• Limping or favoring one leg
• Stiffness, especially after rest or in cold weather
• Difficulty climbing stairs or jumping
• Reluctance to play or exercise
• Yelping when touched in certain areas
• Personality changes — becoming irritable or withdrawn

RISK FACTORS:
• Age (over 7 years)
• Large or giant breeds
• Previous joint injuries
• Obesity

MANAGEMENT:
• Weight management — every pound matters for joints
• Low-impact exercise like swimming or short walks
• Joint supplements (glucosamine, fish oil)
• Anti-inflammatory medications prescribed by vet
• Orthopedic beds and ramps to minimize jumping

WHEN TO SEE A VET:
• Limping that lasts more than 24–48 hours
• Sudden inability to bear weight
• Visible swelling in a joint

Source: Merck Veterinary Manual`,
  },
  {
    title: 'Dental Disease Prevention',
    summary: '80% of pets over 3 have dental disease. Daily brushing can prevent most of it.',
    body: `Periodontal disease is the most common health problem in adult cats and dogs. It begins with plaque and tartar buildup and progresses to gum disease, tooth loss, and systemic infections.

STAGES:
1. Plaque buildup (reversible)
2. Gingivitis — red, swollen gums (reversible)
3. Early periodontitis — some bone loss
4. Advanced periodontitis — severe bone and tooth loss

WARNING SIGNS:
• Bad breath (a common early sign)
• Yellow or brown tartar on teeth
• Red, swollen, or bleeding gums
• Pawing at the mouth
• Difficulty eating or dropping food
• Loose or missing teeth

PREVENTION:
• Daily tooth brushing is the gold standard — use pet-safe toothpaste (human toothpaste is toxic to pets)
• Dental chews and toys approved by the VOHC
• Water additives designed to reduce tartar
• Annual professional dental cleanings under anesthesia

WHY IT MATTERS:
Bacteria from dental disease can enter the bloodstream and damage the heart, kidneys, and liver.

Source: ASPCA, PetMD`,
  },
  {
    title: 'Understanding Ear Infections',
    summary: 'Otitis externa is one of the most common reasons for vet visits in dogs.',
    body: `Ear infections (otitis externa) affect the outer ear canal and are extremely common — especially in dogs with floppy ears, heavy coats, or allergies.

COMMON SIGNS:
• Shaking head or tilting it to one side
• Scratching at the ear
• Redness or swelling inside the ear
• Dark, waxy, or foul-smelling discharge
• Whimpering when the ear is touched
• Loss of balance or hearing (in severe cases)

CAUSES:
• Yeast overgrowth (most common)
• Bacterial infection
• Ear mites (more common in cats)
• Allergies (food or environmental)
• Moisture — water in the ear after swimming

TREATMENT:
• Vet will diagnose with an otoscope and possibly a swab culture
• Medicated ear drops (antifungal, antibiotic, or combination)
• Thorough ear cleaning — always follow vet guidance

HOME CARE TIPS:
• Keep ears dry after bathing or swimming
• Never insert cotton swabs deep into the ear canal
• Use a vet-approved ear cleaner for routine maintenance

PREVENTION FOR PRONE DOGS:
• Regular ear checks (weekly)
• Keep ear hair trimmed
• Address underlying allergies

Source: Merck Veterinary Manual, PetMD`,
  },
];

interface ArticleModalProps {
  article: typeof EDUCATION_ARTICLES[0] | null;
  visible: boolean;
  onClose: () => void;
  isDark: boolean;
}

function ArticleModal({ article, visible, onClose, isDark }: ArticleModalProps) {
  const insets = useSafeAreaInsets();
  const bg = isDark ? Colors.dark.background : '#fff';
  const textColor = isDark ? Colors.dark.text : Colors.text;
  const textSec = isDark ? Colors.dark.textSecondary : Colors.textSecondary;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={[styles.modalContainer, { backgroundColor: bg }]}>
        <View style={[styles.modalHeader, { paddingTop: insets.top + 12 }]}>
          <Pressable onPress={onClose} style={styles.modalClose}>
            <Ionicons name="close" size={24} color={textColor} />
          </Pressable>
          <Text style={[styles.modalHeaderTitle, { color: textColor }]} numberOfLines={1}>
            {article?.title}
          </Text>
          <View style={{ width: 44 }} />
        </View>
        <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: insets.bottom + 40 }} showsVerticalScrollIndicator={false}>
          <View style={styles.articleBadge}>
            <MaterialCommunityIcons name="stethoscope" size={16} color={Colors.primary} />
            <Text style={styles.articleBadgeText}>Veterinary Guide</Text>
          </View>
          <Text style={[styles.articleTitle, { color: textColor }]}>{article?.title}</Text>
          <Text style={[styles.articleBody, { color: textSec }]}>{article?.body}</Text>
        </ScrollView>
      </View>
    </Modal>
  );
}

interface RemindersModalProps {
  visible: boolean;
  onClose: () => void;
  isDark: boolean;
}

const REMINDER_TYPES = [
  { label: 'Annual Vet Checkup', icon: 'calendar-heart', url: '' },
  { label: 'Monthly Flea Prevention', icon: 'bug-outline', url: '' },
  { label: 'Dental Cleaning Reminder', icon: 'tooth-outline', url: '' },
  { label: 'Vaccination Due Date', icon: 'needle', url: '' },
  { label: 'Heartworm Prevention', icon: 'heart-pulse', url: '' },
];

function RemindersModal({ visible, onClose, isDark }: RemindersModalProps) {
  const insets = useSafeAreaInsets();
  const bg = isDark ? Colors.dark.background : '#fff';
  const surface = isDark ? Colors.dark.surface : Colors.surface;
  const textColor = isDark ? Colors.dark.text : Colors.text;
  const textSec = isDark ? Colors.dark.textSecondary : Colors.textSecondary;
  const border = isDark ? Colors.dark.border : Colors.border;

  const openCalendar = (label: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const calUrl = Platform.OS === 'ios' ? 'calshow://' : 'content://com.android.calendar/time/';
    Linking.canOpenURL(calUrl).then(can => {
      if (can) {
        Linking.openURL(calUrl);
      } else {
        Alert.alert(
          `Add Reminder: ${label}`,
          'Open your device calendar to set a recurring reminder for this pet care task.',
          [{ text: 'OK' }]
        );
      }
    });
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={[styles.modalContainer, { backgroundColor: bg }]}>
        <View style={[styles.modalHeader, { paddingTop: insets.top + 12 }]}>
          <Pressable onPress={onClose} style={styles.modalClose}>
            <Ionicons name="close" size={24} color={textColor} />
          </Pressable>
          <Text style={[styles.modalHeaderTitle, { color: textColor }]}>Pet Care Reminders</Text>
          <View style={{ width: 44 }} />
        </View>
        <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: insets.bottom + 40 }}>
          <Text style={[styles.modalSubtitle, { color: textSec }]}>
            Tap any reminder to add it to your device calendar.
          </Text>
          <View style={{ gap: 12, marginTop: 16 }}>
            {REMINDER_TYPES.map((r, i) => (
              <Pressable
                key={i}
                onPress={() => openCalendar(r.label)}
                style={({ pressed }) => [
                  styles.reminderRow,
                  { backgroundColor: surface, borderColor: border, opacity: pressed ? 0.75 : 1 },
                ]}
              >
                <View style={[styles.reminderIcon, { backgroundColor: `${Colors.primary}18` }]}>
                  <MaterialCommunityIcons name={r.icon as any} size={22} color={Colors.primary} />
                </View>
                <Text style={[styles.reminderLabel, { color: textColor }]}>{r.label}</Text>
                <Ionicons name="calendar-outline" size={18} color={textSec} />
              </Pressable>
            ))}
          </View>
          <Text style={[styles.reminderNote, { color: textSec }]}>
            Regular vet visits, preventive treatments, and dental care are the most effective ways to keep your pet healthy.
          </Text>
        </ScrollView>
      </View>
    </Modal>
  );
}

interface AboutModalProps {
  visible: boolean;
  onClose: () => void;
  isDark: boolean;
}

function AboutModal({ visible, onClose, isDark }: AboutModalProps) {
  const insets = useSafeAreaInsets();
  const bg = isDark ? Colors.dark.background : '#fff';
  const textColor = isDark ? Colors.dark.text : Colors.text;
  const textSec = isDark ? Colors.dark.textSecondary : Colors.textSecondary;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={[styles.modalContainer, { backgroundColor: bg }]}>
        <View style={[styles.modalHeader, { paddingTop: insets.top + 12 }]}>
            {isSubscribed && (
              <Pressable
                style={({ pressed }) => [styles.menuItem, { opacity: pressed ? 0.7 : 1 }]}
                onPress={() => Linking.openURL('https://apps.apple.com/account/subscriptions')}
              >
                <View style={[styles.menuIconWrap, { backgroundColor: isDark ? '#1e3a2f' : '#e8f5e9' }]}>
                  <Ionicons name="card-outline" size={20} color={Colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.menuLabel, { color: textColor }]}>Manage Subscription</Text>
                  <Text style={[styles.menuSub, { color: textSec }]}>Update or cancel your plan</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={textSec} />
              </Pressable>
            )}
          <Pressable onPress={onClose} style={styles.modalClose}>
            <Ionicons name="close" size={24} color={textColor} />
          </Pressable>
          <Text style={[styles.modalHeaderTitle, { color: textColor }]}>About PetSnap</Text>
          <View style={{ width: 44 }} />
        </View>
        <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: insets.bottom + 40 }}>
          <View style={styles.aboutLogoRow}>
            <LinearGradient colors={[Colors.primary, Colors.accent]} style={styles.aboutLogo} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <MaterialCommunityIcons name="paw" size={36} color="#fff" />
            </LinearGradient>
          </View>
          <Text style={[styles.aboutAppName, { color: textColor }]}>PetSnap Journal</Text>
          <Text style={[styles.aboutVersion, { color: textSec }]}>Version 1.0.0</Text>

          <Text style={[styles.aboutSection, { color: textColor }]}>What PetSnap Does</Text>
          <Text style={[styles.aboutBody, { color: textSec }]}>
            PetSnap Journal is a personal pet wellness journal. Snap an optional photo, choose a topic area, and add your own observations — all saved privately on your device. After each entry, you'll see a general educational article about that pet care topic.
          </Text>

          <Text style={[styles.aboutSection, { color: textColor }]}>Data Sources</Text>
          <Text style={[styles.aboutBody, { color: textSec }]}>
            General educational wellness articles reference publicly available veterinary resources including the AVMA, ASPCA, and Merck Veterinary Manual. No AI or diagnostic system is used.
          </Text>

          <Text style={[styles.aboutSection, { color: textColor }]}>Important Disclaimer</Text>
          <View style={[styles.aboutDisclaimer, { backgroundColor: `${Colors.primary}12`, borderColor: Colors.primary }]}>
            <MaterialCommunityIcons name="alert-circle-outline" size={18} color={Colors.primaryDark} />
            <Text style={[styles.aboutDisclaimerText, { color: Colors.primaryDark }]}>
              PetSnap Journal is an educational journaling tool ONLY. It does not analyze, assess, or interpret your pet's health. Always consult a licensed veterinarian for health concerns.
            </Text>
          </View>

          <Text style={[styles.aboutSection, { color: textColor }]}>Privacy</Text>
          <Text style={[styles.aboutBody, { color: textSec }]}>
            All pet data is stored locally on your device only. PetSnap does not transmit personal or health data to any servers.
          </Text>
        </ScrollView>
      </View>
    </Modal>
  );
}

export default function MoreScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 + 84 : insets.bottom + 90;
  const { scanHistory, pets, monthlyScansUsed, freeScansLeft } = usePets();
  const { isSubscribed, customerInfo } = useSubscription();

  const scrollRef = useRef<ScrollView>(null);
  const educationY = useRef(0);

  const [selectedArticle, setSelectedArticle] = useState<typeof EDUCATION_ARTICLES[0] | null>(null);
  const [showReminders, setShowReminders] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const bg = isDark ? Colors.dark.background : Colors.background;
  const textColor = isDark ? Colors.dark.text : Colors.text;
  const textSec = isDark ? Colors.dark.textSecondary : Colors.textSecondary;
  const surface = isDark ? Colors.dark.surface : Colors.surface;
  const border = isDark ? Colors.dark.border : Colors.border;

  const handleEducationLibrary = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scrollRef.current?.scrollTo({ y: educationY.current, animated: true });
  };

  const handleManageSubscription = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL('itms-apps://apps.apple.com/account/subscriptions');
  };

  const handleReminders = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowReminders(true);
  };

  const handleExportRecords = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (scanHistory.length === 0) {
      Alert.alert('No Records Yet', 'Complete a health scan first to export your records.');
      return;
    }

    const lines: string[] = [
      '=== PetSnap Health Records ===',
      `Exported: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
      `Pets: ${pets.map(p => p.name).join(', ')}`,
      `Total Scans: ${scanHistory.length}`,
      '',
    ];

    scanHistory.forEach((scan, i) => {
      lines.push(`--- Scan ${i + 1} ---`);
      lines.push(`Pet: ${scan.petName}`);
      lines.push(`Date: ${new Date(scan.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}`);
      lines.push(`Area: ${scan.bodyArea}`);
      lines.push(`Severity: ${scan.overallSeverity.toUpperCase()}`);
      lines.push(`Health Score: ${scan.healthScore}/100`);
      if (scan.conditions.length > 0) {
        lines.push('Possible Conditions:');
        scan.conditions.forEach(c => {
          lines.push(`  • ${c.name} (${c.probability}% likelihood — ${c.severity})`);
          lines.push(`    Advice: ${c.advice}`);
          lines.push(`    Vet: ${c.whenToSeeVet}`);
        });
      }
      if (scan.homeCare.length > 0) {
        lines.push('Home Care:');
        scan.homeCare.forEach(h => lines.push(`  • ${h}`));
      }
      lines.push('');
    });

    lines.push('DISCLAIMER: This report is for informational purposes only and does not constitute a veterinary diagnosis. Consult a licensed veterinarian for professional medical advice.');
    lines.push('Data sourced from Merck Veterinary Manual, PetMD, and ASPCA guidelines.');

    try {
      await Share.share({
        title: 'PetSnap Health Records',
        message: lines.join('\n'),
      });
    } catch {
      Alert.alert('Export Failed', 'Could not share records. Please try again.');
    }
  };

  const handlePrivacyPolicy = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      'Privacy Policy',
      'PetSnap stores all pet data locally on your device only.\n\n' +
      '• No personal data is transmitted to external servers\n' +
      '• No account creation or login is required\n' +
      '• Photos taken in the app are stored locally only\n' +
      '• Scan history is saved to your device storage\n' +
      '• You can delete all data by uninstalling the app\n\n' +
      'PetSnap does not sell, share, or monetize any user data.',
      [{ text: 'Got it' }]
    );
  };

  return (
    <ScrollView
      ref={scrollRef}
      style={[styles.container, { backgroundColor: bg }]}
      contentContainerStyle={{ paddingBottom: bottomPad }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { paddingTop: topPad + 16 }]}>
        <Text style={[styles.headerTitle, { color: textColor }]}>More</Text>
      </View>

      {isSubscribed && (
        <Pressable
          onPress={handleManageSubscription}
          style={({ pressed }) => [{ marginHorizontal: 20, borderRadius: 18, overflow: 'hidden', opacity: pressed ? 0.9 : 1, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 4 }]}
        >
          <LinearGradient
            colors={[Colors.primary, Colors.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flexDirection: 'row', alignItems: 'center', padding: 18, gap: 14 }}
          >
            <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
              <MaterialCommunityIcons name='crown' size={24} color='#fff' />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 17, fontFamily: 'Inter_700Bold', color: '#fff' }}>PetSnap Premium</Text>
              <Text style={{ fontSize: 13, fontFamily: 'Inter_400Regular', color: 'rgba(255,255,255,0.85)', marginTop: 2 }}>
                {(customerInfo?.activeSubscriptions ?? []).some((s: string) => s === ANNUAL_PRODUCT_ID || s.includes('annual') || s.includes('yearly'))
                  ? 'Annual plan · Manage in App Store'
                  : 'Monthly plan · Manage in App Store'}
              </Text>
            </View>
            <Ionicons name='chevron-forward' size={20} color='rgba(255,255,255,0.8)' />
          </LinearGradient>
        </Pressable>
      )}

      {!isSubscribed && <Pressable
        onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); setShowUpgrade(true); }}
        style={({ pressed }) => [{ marginHorizontal: 20, borderRadius: 18, overflow: 'hidden', opacity: pressed ? 0.9 : 1, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.28, shadowRadius: 12, elevation: 8 }]}
      >
        <LinearGradient
          colors={[Colors.primary, Colors.accent]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flexDirection: 'row', alignItems: 'center', padding: 18, gap: 14 }}
        >
          <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
            <MaterialCommunityIcons name="crown" size={24} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 17, fontFamily: 'Inter_700Bold', color: '#fff' }}>Upgrade to Premium</Text>
            <Text style={{ fontSize: 13, fontFamily: 'Inter_400Regular', color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>
              {freeScansLeft === 0 ? 'All free scans used — unlock unlimited' : `${freeScansLeft} free scan${freeScansLeft === 1 ? '' : 's'} left · $4.99/mo`}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.8)" />
        </LinearGradient>
      </Pressable>}

      <View style={[styles.section, { marginHorizontal: 20, backgroundColor: surface, borderRadius: 16 }]}>
        <SettingsRow
          icon={<MaterialCommunityIcons name="book-open-page-variant" size={22} color={Colors.primary} />}
          label="Education Library"
          sublabel="Merck-style condition guides"
          onPress={handleEducationLibrary}
          isDark={isDark}
        />
        <SettingsRow
          icon={<Ionicons name="notifications-outline" size={22} color={Colors.accent} />}
          label="Reminders"
          sublabel="Vet visits & medications"
          onPress={handleReminders}
          isDark={isDark}
        />
        <SettingsRow
          icon={<Feather name="share-2" size={22} color={Colors.primary} />}
          label="Export Records"
          sublabel="Share all scans as a report"
          onPress={handleExportRecords}
          isDark={isDark}
        />
      </View>

      <Text
        style={[styles.sectionTitle, { color: textSec, marginHorizontal: 20, marginTop: 28, marginBottom: 12 }]}
        onLayout={e => { educationY.current = e.nativeEvent.layout.y - 80; }}
      >
        Education
      </Text>
      <View style={{ paddingHorizontal: 20, gap: 12 }}>
        {EDUCATION_ARTICLES.map((item, i) => (
          <Pressable
            key={i}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSelectedArticle(item);
            }}
            style={({ pressed }) => [{
              backgroundColor: surface,
              borderRadius: 14,
              padding: 16,
              borderWidth: 1,
              borderColor: border,
              opacity: pressed ? 0.8 : 1,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
            }]}
          >
            <MaterialCommunityIcons name='book-open-variant' size={22} color={Colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontFamily: 'Inter_600SemiBold', color: textColor, marginBottom: 2 }}>{item.title}</Text>
              <Text style={{ fontSize: 13, fontFamily: 'Inter_400Regular', color: textSec, lineHeight: 18 }}>{item.summary}</Text>
            </View>
            <Feather name='chevron-right' size={18} color={textSec} />
          </Pressable>
        ))}
      </View>

      <View style={[styles.section, { marginHorizontal: 20, marginTop: 28, backgroundColor: surface, borderRadius: 16 }]}>
        <SettingsRow
          icon={<Feather name="shield" size={22} color={Colors.textSecondary} />}
          label="Privacy Policy"
          onPress={handlePrivacyPolicy}
          isDark={isDark}
        />
        <SettingsRow
          icon={<Ionicons name="information-circle-outline" size={22} color={Colors.textSecondary} />}
          label="About PetSnap"
          sublabel="Version 1.0.0"
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setShowAbout(true); }}
          isDark={isDark}
        />
      </View>

      <View style={[styles.dataSourceCard, { marginHorizontal: 20, marginTop: 20, backgroundColor: `${Colors.primary}15`, borderColor: Colors.primary }]}>
        <MaterialCommunityIcons name="check-decagram" size={18} color={Colors.primary} />
        <Text style={[styles.dataSourceText, { color: Colors.primaryDark }]}>
          Health data sourced from Merck Veterinary Manual, PetMD, and ASPCA guidelines.
        </Text>
      </View>

      <Text style={[styles.iapNote, { color: textSec }]}>
        All pet health information is stored privately on your device only.
      </Text>

      <ArticleModal
        article={selectedArticle}
        visible={!!selectedArticle}
        onClose={() => setSelectedArticle(null)}
        isDark={isDark}
      />
      <RemindersModal
        visible={showReminders}
        onClose={() => setShowReminders(false)}
        isDark={isDark}
      />
      <AboutModal
        visible={showAbout}
        onClose={() => setShowAbout(false)}
        isDark={isDark}
      />
      <UpgradeModal
        visible={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        scansUsed={monthlyScansUsed}
      />
    </ScrollView>
  );
}

interface SettingsRowProps {
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  onPress?: () => void;
  isDark: boolean;
}

function SettingsRow({ icon, label, sublabel, onPress, isDark }: SettingsRowProps) {
  const textColor = isDark ? Colors.dark.text : Colors.text;
  const textSec = isDark ? Colors.dark.textSecondary : Colors.textSecondary;
  const surface = isDark ? Colors.dark.surface : Colors.surface;
  const border = isDark ? Colors.dark.border : Colors.border;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.settingsRow, { backgroundColor: surface, borderBottomColor: border, opacity: pressed ? 0.7 : 1 }]}
    >
      <View style={styles.settingsIcon}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.settingsLabel, { color: textColor }]}>{label}</Text>
        {sublabel && <Text style={[styles.settingsSublabel, { color: textSec }]}>{sublabel}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={18} color={textSec} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 24, paddingBottom: 20 },
  headerTitle: { fontSize: 28, fontFamily: 'Inter_700Bold' },
  section: { overflow: 'hidden' },
  sectionTitle: { fontSize: 13, fontFamily: 'Inter_600SemiBold', textTransform: 'uppercase', letterSpacing: 0.5 },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 14,
  },
  settingsIcon: { width: 32, alignItems: 'center' },
  settingsLabel: { fontSize: 15, fontFamily: 'Inter_500Medium' },
  settingsSublabel: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
  educationCard: {
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
    gap: 8,
  },
  educationCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  educationIconBadge: { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  educationTitle: { fontSize: 15, fontFamily: 'Inter_600SemiBold', flex: 1 },
  educationDesc: { fontSize: 13, fontFamily: 'Inter_400Regular', lineHeight: 20 },
  dataSourceCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  dataSourceText: { flex: 1, fontSize: 12, fontFamily: 'Inter_400Regular', lineHeight: 18 },
  iapNote: { textAlign: 'center', fontSize: 12, fontFamily: 'Inter_400Regular', margin: 20 },
  modalContainer: { flex: 1 },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  modalClose: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  modalHeaderTitle: { flex: 1, textAlign: 'center', fontSize: 17, fontFamily: 'Inter_700Bold' },
  modalSubtitle: { fontSize: 14, fontFamily: 'Inter_400Regular', lineHeight: 22 },
  articleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: `${Colors.primary}15`,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 12,
  },
  articleBadgeText: { fontSize: 12, fontFamily: 'Inter_600SemiBold', color: Colors.primary },
  articleTitle: { fontSize: 22, fontFamily: 'Inter_700Bold', marginBottom: 16, lineHeight: 30 },
  articleBody: { fontSize: 15, fontFamily: 'Inter_400Regular', lineHeight: 26 },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    gap: 14,
  },
  reminderIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  reminderLabel: { flex: 1, fontSize: 15, fontFamily: 'Inter_500Medium' },
  reminderNote: { fontSize: 13, fontFamily: 'Inter_400Regular', lineHeight: 20, marginTop: 20, textAlign: 'center' },
  aboutLogoRow: { alignItems: 'center', marginBottom: 16 },
  aboutLogo: { width: 80, height: 80, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  aboutAppName: { fontSize: 24, fontFamily: 'Inter_700Bold', textAlign: 'center', marginBottom: 4 },
  aboutVersion: { fontSize: 14, fontFamily: 'Inter_400Regular', textAlign: 'center', marginBottom: 28 },
  aboutSection: { fontSize: 17, fontFamily: 'Inter_700Bold', marginBottom: 8, marginTop: 20 },
  aboutBody: { fontSize: 15, fontFamily: 'Inter_400Regular', lineHeight: 24 },
  aboutDisclaimer: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    marginTop: 8,
  },
  aboutDisclaimerText: { flex: 1, fontSize: 13, fontFamily: 'Inter_400Regular', lineHeight: 20 },
});
  const { isSubscribed } = useSubscription();
