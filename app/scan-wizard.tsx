import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInRight, SlideInRight } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/colors';
import { usePets } from '@/context/PetContext';
import { BODY_AREAS, SYMPTOM_DATABASE, SYMPTOM_QUESTIONS, analyzeSymptoms, type BodyArea } from '@/data/symptomDatabase';
import { DisclaimerBanner } from '@/components/DisclaimerBanner';
import { UpgradeModal } from '@/components/UpgradeModal';
import { useSubscription } from '@/lib/revenuecat';

const TOTAL_STEPS = 5;

export default function ScanScreen() {
  const { pets, addScanResult, freeScansLeft, monthlyScansUsed, incrementMonthlyScans } = usePets();
  const { isSubscribed } = useSubscription();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : Math.max(insets.bottom, 24);

  const [step, setStep] = useState(1);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(pets[0]?.id ?? null);
  const [selectedArea, setSelectedArea] = useState<BodyArea | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [checkedSymptoms, setCheckedSymptoms] = useState<string[]>([]);
  const [sliderValues, setSliderValues] = useState<Record<string, number>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const bg = isDark ? Colors.dark.background : Colors.background;
  const surface = isDark ? Colors.dark.surface : Colors.surface;
  const textColor = isDark ? Colors.dark.text : Colors.text;
  const textSec = isDark ? Colors.dark.textSecondary : Colors.textSecondary;
  const border = isDark ? Colors.dark.border : Colors.border;

  const selectedPet = pets.find(p => p.id === selectedPetId);

  const goNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (step < TOTAL_STEPS) setStep(step + 1);
  };

  const goBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (step > 1) setStep(step - 1);
    else router.back();
  };

  const canProceed = () => {
    if (step === 1) return !!selectedPetId;
    if (step === 2) return !!selectedArea;
    if (step === 3) return true;
    if (step === 4) return true;
    return true;
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Camera needed', 'Please allow camera access in settings to take a photo.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.8, allowsEditing: true });
    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const pickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Photo access needed', 'Please allow photo library access to select a photo.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.8, allowsEditing: true });
    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedPetId || !selectedArea) return;
    if (freeScansLeft <= 0 && !isSubscribed) {
      setShowUpgrade(true);
      return;
    }
    setIsAnalyzing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    await new Promise(r => setTimeout(r, 2500));

    const pet = pets.find(p => p.id === selectedPetId);
    const analysis = analyzeSymptoms(selectedArea, checkedSymptoms, sliderValues, pet?.ageYears, pet?.breed, pet?.weightLbs);

    const severityOrder: Record<string, number> = { mild: 1, moderate: 2, severe: 3, emergency: 4 };
    const topSeverity = analysis.conditions.reduce<'mild' | 'moderate' | 'severe' | 'emergency'>((max, c) => {
      return (severityOrder[c.severity] ?? 0) > (severityOrder[max] ?? 0) ? c.severity : max;
    }, analysis.isEmergency ? 'emergency' : 'mild');

    const matchedKey = Object.keys(SYMPTOM_DATABASE).find(k => {
      if (!k.startsWith(selectedArea)) return false;
      const keyParts = k.split('_').slice(1);
      return checkedSymptoms.some(s => keyParts.some(kp => s.includes(kp)));
    }) ?? Object.keys(SYMPTOM_DATABASE).find(k => k.startsWith(selectedArea));

    const matchedEntry = matchedKey ? SYMPTOM_DATABASE[matchedKey] : null;

    // Merge age/weight-adjusted probabilities from analyzeSymptoms with real advice from SYMPTOM_DATABASE
    const fullConditions = matchedEntry
      ? matchedEntry.conditions.map((dbCond, i) => {
          const adjusted = analysis.conditions.find(a => a.name === dbCond.name);
          return {
            ...dbCond,
            probability: adjusted?.probability ?? dbCond.probability,
          };
        })
      : analysis.conditions.map(c => ({
          name: c.name,
          probability: c.probability,
          severity: c.severity as 'mild' | 'moderate' | 'severe' | 'emergency',
          advice: `Consult your veterinarian about ${c.name} for an accurate diagnosis and treatment plan.`,
          whenToSeeVet: 'Consult your veterinarian if symptoms persist or worsen.',
        }));

    const savedResult = await addScanResult({
      petId: selectedPetId,
      petName: pet?.name ?? '',
      bodyArea: BODY_AREAS.find(b => b.id === selectedArea)?.label ?? selectedArea,
      photoUri: photoUri ?? undefined,
      symptoms: checkedSymptoms,
      conditions: fullConditions,
      overallSeverity: analysis.isEmergency ? 'emergency' : topSeverity,
      healthScore: 100,
      homeCare: analysis.homeCare,
      vetTips: analysis.vetTips,
    });

    await incrementMonthlyScans();
    setIsAnalyzing(false);
    router.replace({ pathname: '/results', params: { id: savedResult.id } });
  };

  const toggleSymptom = (id: string) => {
    setCheckedSymptoms(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const progressWidth = `${(step / TOTAL_STEPS) * 100}%` as any;

  if (isAnalyzing) {
    return (
      <View style={[styles.analyzingContainer, { backgroundColor: bg }]}>
        <LinearGradient colors={[Colors.primary, Colors.accent]} style={styles.analyzingGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <Animated.View entering={FadeIn} style={styles.analyzingContent}>
            <MaterialCommunityIcons name="paw" size={80} color="rgba(255,255,255,0.9)" />
            <Text style={styles.analyzingTitle}>Creating your wellness log...</Text>
            <Text style={styles.analyzingSubtitle}>Gathering educational wellness information</Text>
            <ActivityIndicator size="large" color="rgba(255,255,255,0.8)" style={{ marginTop: 20 }} />
          </Animated.View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <View style={[styles.headerBar, { paddingTop: topPad + 8 }]}>
        <Pressable onPress={goBack} style={styles.backButton}>
          <Ionicons name="close" size={24} color={textColor} />
        </Pressable>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={[styles.stepLabel, { color: textSec }]}>Step {step} of {TOTAL_STEPS}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <View style={[styles.progressBar, { backgroundColor: border }]}>
        <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: bottomPad + 100 }} showsVerticalScrollIndicator={false}>
        {step === 1 && (
          <Animated.View entering={FadeInDown} style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: textColor }]}>Select Pet</Text>
            <Text style={[styles.stepSubtitle, { color: textSec }]}>Who are we checking today?</Text>

            {pets.length === 0 ? (
              <View style={[styles.noPetsCard, { backgroundColor: surface, borderColor: border }]}>
                <MaterialCommunityIcons name="paw" size={48} color={Colors.primary} style={{ marginBottom: 12 }} />
                <Text style={[styles.noPetsTitle, { color: textColor }]}>No pets added yet</Text>
                <Text style={[styles.noPetsSubtitle, { color: textSec }]}>
                  Add your pet's profile first so we can track their health over time.
                </Text>
                <Pressable
                  onPress={() => { router.back(); router.push('/add-pet'); }}
                  style={styles.addPetButton}
                >
                  <LinearGradient
                    colors={[Colors.primary, Colors.accent]}
                    style={styles.addPetButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Ionicons name="add" size={20} color="#fff" />
                    <Text style={styles.addPetButtonText}>Add a Pet</Text>
                  </LinearGradient>
                </Pressable>
              </View>
            ) : (
              <View style={styles.petList}>
                {pets.map(pet => (
                  <Pressable
                    key={pet.id}
                    onPress={() => { Haptics.selectionAsync(); setSelectedPetId(pet.id); }}
                    style={[styles.petOption, { backgroundColor: surface, borderColor: selectedPetId === pet.id ? Colors.primary : border, borderWidth: selectedPetId === pet.id ? 2 : 1 }]}
                  >
                    <LinearGradient
                      colors={pet.type === 'cat' ? [Colors.accent, Colors.accentDark] : [Colors.primary, Colors.primaryDark]}
                      style={styles.petOptionAvatar}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <MaterialCommunityIcons name={pet.type === 'cat' ? 'cat' : 'dog'} size={28} color="#fff" />
                    </LinearGradient>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.petOptionName, { color: textColor }]}>{pet.name}</Text>
                      <Text style={[styles.petOptionBreed, { color: textSec }]}>{pet.breed} · {pet.ageYears}y</Text>
                    </View>
                    {selectedPetId === pet.id && (
                      <View style={styles.petOptionCheck}>
                        <Ionicons name="checkmark" size={16} color="#fff" />
                      </View>
                    )}
                  </Pressable>
                ))}
              </View>
            )}
          </Animated.View>
        )}

        {step === 2 && (
          <Animated.View entering={FadeInDown} style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: textColor }]}>Choose Body Area</Text>
            <Text style={[styles.stepSubtitle, { color: textSec }]}>Where did you notice the concern?</Text>
            <View style={styles.areaGrid}>
              {BODY_AREAS.map(area => (
                <Pressable
                  key={area.id}
                  onPress={() => { Haptics.selectionAsync(); setSelectedArea(area.id); }}
                  style={({ pressed }) => [
                    styles.areaCard,
                    { backgroundColor: surface, borderColor: selectedArea === area.id ? Colors.primary : border, opacity: pressed ? 0.85 : 1 },
                    selectedArea === area.id && { backgroundColor: `${Colors.primary}15` },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={area.icon as any}
                    size={32}
                    color={selectedArea === area.id ? Colors.primary : textSec}
                  />
                  <Text style={[styles.areaLabel, { color: selectedArea === area.id ? Colors.primary : textColor }]}>{area.label}</Text>
                  <Text style={[styles.areaDesc, { color: textSec }]} numberOfLines={2}>{area.description}</Text>
                </Pressable>
              ))}
            </View>
          </Animated.View>
        )}

        {step === 3 && (
          <Animated.View entering={FadeInDown} style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: textColor }]}>Take a Photo</Text>
            <Text style={[styles.stepSubtitle, { color: textSec }]}>A photo helps with your vet visit record (optional)</Text>

            {photoUri ? (
              <View style={styles.photoContainer}>
                <Image source={{ uri: photoUri }} style={styles.photo} resizeMode="cover" />
                <Pressable onPress={() => setPhotoUri(null)} style={styles.removePhotoBtn}>
                  <Ionicons name="close-circle" size={28} color={Colors.warning} />
                </Pressable>
              </View>
            ) : (
              <View style={[styles.photoPlaceholder, { backgroundColor: surface, borderColor: border }]}>
                <MaterialCommunityIcons name="camera-plus" size={56} color={textSec} />
                <Text style={[styles.photoPlaceholderText, { color: textSec }]}>No photo selected</Text>
              </View>
            )}

            <View style={styles.photoButtons}>
              <Pressable onPress={takePhoto} style={[styles.photoButton, { backgroundColor: Colors.primary }]}>
                <Ionicons name="camera" size={22} color="#fff" />
                <Text style={styles.photoButtonText}>Take Photo</Text>
              </Pressable>
              <Pressable onPress={pickPhoto} style={[styles.photoButtonOutline, { borderColor: Colors.primary }]}>
                <Ionicons name="images" size={22} color={Colors.primary} />
                <Text style={[styles.photoButtonTextOutline, { color: Colors.primary }]}>Gallery</Text>
              </Pressable>
            </View>
          </Animated.View>
        )}

        {step === 4 && selectedArea && (
          <Animated.View entering={FadeInDown} style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: textColor }]}>Symptom Checklist</Text>
            <Text style={[styles.stepSubtitle, { color: textSec }]}>Check all that apply for {BODY_AREAS.find(b => b.id === selectedArea)?.label}</Text>

            <View style={styles.symptomList}>
              {SYMPTOM_QUESTIONS[selectedArea]?.map((q, i) => (
                <View key={q.id} style={[styles.symptomItem, { backgroundColor: surface, borderColor: border }]}>
                  {q.type === 'boolean' ? (
                    <Pressable
                      onPress={() => { Haptics.selectionAsync(); toggleSymptom(q.id); }}
                      style={styles.symptomRow}
                    >
                      <Text style={[styles.symptomLabel, { color: textColor, flex: 1 }]}>{q.label}</Text>
                      <View style={[styles.checkbox, checkedSymptoms.includes(q.id) && styles.checkboxChecked]}>
                        {checkedSymptoms.includes(q.id) && <Ionicons name="checkmark" size={14} color="#fff" />}
                      </View>
                    </Pressable>
                  ) : (
                    <View>
                      <Text style={[styles.symptomLabel, { color: textColor }]}>{q.label}</Text>
                      <View style={styles.sliderRow}>
                        <Text style={[styles.sliderValue, { color: Colors.primary }]}>{sliderValues[q.id] ?? q.sliderMin ?? 0} {q.sliderLabel}</Text>
                        <View style={styles.sliderButtons}>
                          {[0, 2, 4, 6, 8, 10].map(v => (
                            <Pressable
                              key={v}
                              onPress={() => { Haptics.selectionAsync(); setSliderValues(prev => ({ ...prev, [q.id]: v })); }}
                              style={[styles.sliderPip, (sliderValues[q.id] ?? 0) >= v && { backgroundColor: Colors.primary }]}
                            />
                          ))}
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </Animated.View>
        )}

        {step === 5 && (
          <Animated.View entering={FadeInDown} style={styles.stepContent}>
            <Text style={[styles.stepTitle, { color: textColor }]}>Ready to Analyze</Text>
            <Text style={[styles.stepSubtitle, { color: textSec }]}>Review and start your health analysis</Text>

            <DisclaimerBanner style={{ marginBottom: 20 }} />

            <View style={[styles.summaryCard, { backgroundColor: surface }]}>
              <View style={styles.summaryRow}>
                <MaterialCommunityIcons name="paw" size={20} color={Colors.primary} />
                <Text style={[styles.summaryLabel, { color: textSec }]}>Pet</Text>
                <Text style={[styles.summaryValue, { color: textColor }]}>{selectedPet?.name ?? '—'}</Text>
              </View>
              <View style={styles.summaryRow}>
                <MaterialCommunityIcons name="eye" size={20} color={Colors.primary} />
                <Text style={[styles.summaryLabel, { color: textSec }]}>Area</Text>
                <Text style={[styles.summaryValue, { color: textColor }]}>{BODY_AREAS.find(b => b.id === selectedArea)?.label ?? '—'}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
                <Text style={[styles.summaryLabel, { color: textSec }]}>Symptoms</Text>
                <Text style={[styles.summaryValue, { color: textColor }]}>{checkedSymptoms.length} checked</Text>
              </View>
              <View style={styles.summaryRow}>
                <Ionicons name="camera" size={20} color={Colors.primary} />
                <Text style={[styles.summaryLabel, { color: textSec }]}>Photo</Text>
                <Text style={[styles.summaryValue, { color: textColor }]}>{photoUri ? 'Included' : 'No photo'}</Text>
              </View>
            </View>

            <Pressable
              onPress={handleAnalyze}
              style={({ pressed }) => [styles.analyzeButton, { opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] }]}
            >
              <LinearGradient
                colors={[Colors.primary, Colors.accent]}
                style={styles.analyzeButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <MaterialCommunityIcons name="stethoscope" size={24} color="#fff" />
                <Text style={styles.analyzeButtonText}>Analyze Now</Text>
              </LinearGradient>
            </Pressable>
          </Animated.View>
        )}
      </ScrollView>

      {step < 5 && (
        <View style={[styles.footer, { paddingBottom: bottomPad + 12, backgroundColor: bg }]}>
          <Pressable
            onPress={goNext}
            disabled={!canProceed()}
            style={({ pressed }) => [styles.nextButton, !canProceed() && styles.nextButtonDisabled, { opacity: pressed ? 0.85 : 1 }]}
          >
            <LinearGradient
              colors={canProceed() ? [Colors.primary, Colors.accent] : [Colors.border, Colors.border]}
              style={styles.nextButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.nextButtonText}>Continue</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </LinearGradient>
          </Pressable>
        </View>
      )}

      <UpgradeModal
        visible={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        scansUsed={monthlyScansUsed}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  stepLabel: { fontSize: 14, fontFamily: 'Inter_500Medium' },
  progressBar: { height: 4, marginHorizontal: 24, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 2 },
  stepContent: { padding: 24, gap: 16 },
  stepTitle: { fontSize: 26, fontFamily: 'Inter_700Bold' },
  stepSubtitle: { fontSize: 15, fontFamily: 'Inter_400Regular', lineHeight: 22 },
  petList: { gap: 10 },
  petOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 14,
    gap: 14,
  },
  petOptionAvatar: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  petOptionName: { fontSize: 16, fontFamily: 'Inter_700Bold' },
  petOptionBreed: { fontSize: 13, fontFamily: 'Inter_400Regular', marginTop: 2 },
  petOptionCheck: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  areaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  areaCard: {
    width: '47%',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  areaLabel: { fontSize: 15, fontFamily: 'Inter_600SemiBold', textAlign: 'center' },
  areaDesc: { fontSize: 11, fontFamily: 'Inter_400Regular', textAlign: 'center', lineHeight: 16 },
  photoContainer: { position: 'relative', borderRadius: 20, overflow: 'hidden' },
  photo: { width: '100%', height: 220, borderRadius: 20 },
  removePhotoBtn: { position: 'absolute', top: 10, right: 10 },
  photoPlaceholder: {
    height: 200,
    borderRadius: 20,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  photoPlaceholderText: { fontSize: 14, fontFamily: 'Inter_400Regular' },
  photoButtons: { flexDirection: 'row', gap: 12 },
  photoButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
  },
  photoButtonText: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: '#fff' },
  photoButtonOutline: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 2,
    gap: 8,
  },
  photoButtonTextOutline: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  symptomList: { gap: 10 },
  symptomItem: { borderRadius: 14, borderWidth: 1, padding: 14 },
  symptomRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  symptomLabel: { fontSize: 15, fontFamily: 'Inter_400Regular', lineHeight: 22 },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  sliderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  sliderValue: { fontSize: 20, fontFamily: 'Inter_700Bold', width: 80 },
  sliderButtons: { flexDirection: 'row', gap: 6 },
  sliderPip: { width: 28, height: 12, borderRadius: 6, backgroundColor: Colors.border },
  summaryCard: { borderRadius: 16, padding: 16, gap: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  summaryLabel: { fontSize: 14, fontFamily: 'Inter_400Regular', width: 80 },
  summaryValue: { flex: 1, fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  analyzeButton: { borderRadius: 18, overflow: 'hidden', shadowColor: Colors.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8 },
  analyzeButtonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 20, gap: 12 },
  analyzeButtonText: { fontSize: 20, fontFamily: 'Inter_700Bold', color: '#fff' },
  footer: { paddingHorizontal: 24, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: Colors.border },
  nextButton: { borderRadius: 16, overflow: 'hidden', shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 5 },
  nextButtonDisabled: { opacity: 0.5 },
  nextButtonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, gap: 10 },
  nextButtonText: { fontSize: 17, fontFamily: 'Inter_700Bold', color: '#fff' },
  analyzingContainer: { flex: 1 },
  analyzingGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  analyzingContent: { alignItems: 'center', gap: 16 },
  analyzingTitle: { fontSize: 26, fontFamily: 'Inter_700Bold', color: '#fff', textAlign: 'center' },
  analyzingSubtitle: { fontSize: 16, fontFamily: 'Inter_400Regular', color: 'rgba(255,255,255,0.8)', textAlign: 'center' },
  noPetsCard: {
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 28,
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  noPetsTitle: { fontSize: 20, fontFamily: 'Inter_700Bold', textAlign: 'center' },
  noPetsSubtitle: { fontSize: 15, fontFamily: 'Inter_400Regular', textAlign: 'center', lineHeight: 22, marginBottom: 8 },
  addPetButton: { width: '100%', borderRadius: 14, overflow: 'hidden', marginTop: 4 },
  addPetButtonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, gap: 10 },
  addPetButtonText: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#fff' },
});
