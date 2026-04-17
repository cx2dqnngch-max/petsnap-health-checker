import { Ionicons } from '@expo/vector-icons';
  import * as Haptics from 'expo-haptics';
  import * as ImagePicker from 'expo-image-picker';
  import { LinearGradient } from 'expo-linear-gradient';
  import { router } from 'expo-router';
  import React, { useState } from 'react';
  import {
    ActivityIndicator,
    Alert,
    Image,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
    useColorScheme,
  } from 'react-native';
  import Animated, { FadeInDown } from 'react-native-reanimated';
  import { useSafeAreaInsets } from 'react-native-safe-area-context';

  import { Colors } from '@/constants/colors';
  import { usePets } from '@/context/PetContext';
  import { BODY_AREAS, OBSERVATION_PROMPTS, getEducationalContent, type BodyArea } from '@/data/symptomDatabase';
  import { DisclaimerBanner } from '@/components/DisclaimerBanner';
  import { UpgradeModal } from '@/components/UpgradeModal';
  import { useSubscription } from '@/lib/revenuecat';

  const TOTAL_STEPS = 4;

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
    const [checkedObservations, setCheckedObservations] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [showUpgrade, setShowUpgrade] = useState(false);

    const bg = isDark ? Colors.dark.background : Colors.background;
    const surface = isDark ? Colors.dark.surface : Colors.surface;
    const textColor = isDark ? Colors.dark.text : Colors.text;
    const textSec = isDark ? Colors.dark.textSecondary : Colors.textSecondary;
    const border = isDark ? Colors.dark.border : Colors.border;

    const handleBack = () => {
      if (step === 1) { router.back(); return; }
      setStep(s => s - 1);
    };

    const handleNext = () => {
      if (step === 1 && !selectedPetId) {
        Alert.alert('Select a pet', 'Please select a pet to log an observation for.');
        return;
      }
      if (step === 2 && !selectedArea) {
        Alert.alert('Select an area', 'Please select a body area to log observations about.');
        return;
      }
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setStep(s => s + 1);
    };

    const handleSave = async () => {
      if (!selectedPetId || !selectedArea) return;
      if (freeScansLeft <= 0 && !isSubscribed) {
        setShowUpgrade(true);
        return;
      }
      setIsSaving(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const pet = pets.find(p => p.id === selectedPetId);
      const educationalTopic = getEducationalContent(selectedArea);
      const areaLabel = BODY_AREAS.find(b => b.id === selectedArea)?.label ?? selectedArea;

      const savedResult = await addScanResult({
        petId: selectedPetId,
        petName: pet?.name ?? '',
        bodyArea: areaLabel,
        photoUri: photoUri ?? undefined,
        observations: checkedObservations,
        educationalTopic,
      });

      await incrementMonthlyScans();
      setIsSaving(false);
      router.replace({ pathname: '/results', params: { id: savedResult.id } });
    };

    const takePhoto = async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Camera access needed', 'Please allow camera access in your device settings.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({ quality: 0.7, allowsEditing: true, aspect: [1, 1] });
      if (!result.canceled) setPhotoUri(result.assets[0].uri);
    };

    const pickPhoto = async () => {
      const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.7, allowsEditing: true, aspect: [1, 1] });
      if (!result.canceled) setPhotoUri(result.assets[0].uri);
    };

    const toggleObservation = (id: string) => {
      setCheckedObservations(prev =>
        prev.includes(id) ? prev.filter(o => o !== id) : [...prev, id]
      );
    };

    const progressPct = ((step - 1) / (TOTAL_STEPS - 1)) * 100;

    return (
      <View style={{ flex: 1, backgroundColor: bg }}>
        {/* Header */}
        <LinearGradient
          colors={[Colors.primaryDark, Colors.primary]}
          style={[styles.header, { paddingTop: topPad + 8 }]}
        >
          <Pressable onPress={handleBack} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </Pressable>
          <View style={{ flex: 1, marginHorizontal: 12 }}>
            <Text style={styles.headerTitle}>Wellness Journal Entry</Text>
            <Text style={styles.headerSub}>Step {step} of {TOTAL_STEPS}</Text>
          </View>
          <Text style={styles.stepBadge}>{step}/{TOTAL_STEPS}</Text>
        </LinearGradient>

        {/* Progress bar */}
        <View style={[styles.progressTrack, { backgroundColor: border }]}>
          <Animated.View style={[styles.progressFill, { width: progressPct + '%', backgroundColor: Colors.primary }]} />
        </View>

        <DisclaimerBanner />

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: bottomPad + 80 }}>

          {/* STEP 1 — Select Pet */}
          {step === 1 && (
            <Animated.View entering={FadeInDown.duration(300)}>
              <Text style={[styles.stepTitle, { color: textColor }]}>Which pet is this entry for?</Text>
              {pets.length === 0 ? (
                <View style={[styles.card, { backgroundColor: surface, borderColor: border }]}>
                  <Text style={[styles.emptyText, { color: textSec }]}>No pets added yet. Add a pet first.</Text>
                  <Pressable onPress={() => router.push('/add-pet')} style={[styles.addPetBtn, { backgroundColor: Colors.primary }]}>
                    <Text style={styles.addPetBtnText}>Add a Pet</Text>
                  </Pressable>
                </View>
              ) : (
                pets.map(pet => (
                  <Pressable
                    key={pet.id}
                    onPress={() => { setSelectedPetId(pet.id); Haptics.selectionAsync(); }}
                    style={[styles.petCard, { backgroundColor: surface, borderColor: selectedPetId === pet.id ? Colors.primary : border }]}
                  >
                    <View style={[styles.petAvatar, { backgroundColor: Colors.primary + '22' }]}>
                      <Text style={{ fontSize: 24 }}>{pet.type === 'dog' ? '🐶' : '🐱'}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.petName, { color: textColor }]}>{pet.name}</Text>
                      <Text style={[styles.petBreed, { color: textSec }]}>{pet.breed} · {pet.ageYears}y</Text>
                    </View>
                    {selectedPetId === pet.id && <Ionicons name="checkmark-circle" size={22} color={Colors.primary} />}
                  </Pressable>
                ))
              )}
            </Animated.View>
          )}

          {/* STEP 2 — Select Body Area */}
          {step === 2 && (
            <Animated.View entering={FadeInDown.duration(300)}>
              <Text style={[styles.stepTitle, { color: textColor }]}>What area are you logging about?</Text>
              <Text style={[styles.stepSubtitle, { color: textSec }]}>
                Choosing a topic area shows you a fixed general wellness article about that subject. Every owner who selects the same topic sees identical educational content — your specific observations do not change what is displayed.
              </Text>
              <View style={styles.areaGrid}>
                {BODY_AREAS.map(area => (
                  <Pressable
                    key={area.id}
                    onPress={() => { setSelectedArea(area.id); Haptics.selectionAsync(); }}
                    style={[styles.areaCard, { backgroundColor: surface, borderColor: selectedArea === area.id ? Colors.primary : border }]}
                  >
                    <Ionicons name={area.icon as any} size={28} color={selectedArea === area.id ? Colors.primary : textSec} />
                    <Text style={[styles.areaLabel, { color: selectedArea === area.id ? Colors.primary : textColor }]}>{area.label}</Text>
                  </Pressable>
                ))}
              </View>
            </Animated.View>
          )}

          {/* STEP 3 — Add photo + observations */}
          {step === 3 && selectedArea && (
            <Animated.View entering={FadeInDown.duration(300)}>
              <Text style={[styles.stepTitle, { color: textColor }]}>Add a photo (optional)</Text>
              <Text style={[styles.stepSubtitle, { color: textSec }]}>
                Photos are stored locally on your device for your personal wellness journal only.
              </Text>

              {photoUri ? (
                <View style={styles.photoWrapper}>
                  <Image source={{ uri: photoUri }} style={styles.photo} />
                  <Pressable onPress={() => setPhotoUri(null)} style={styles.removePhotoBtn}>
                    <Ionicons name="close-circle" size={28} color={Colors.emergency} />
                  </Pressable>
                </View>
              ) : (
                <View style={styles.photoButtons}>
                  <Pressable onPress={takePhoto} style={[styles.photoBtn, { backgroundColor: Colors.primary }]}>
                    <Ionicons name="camera-outline" size={22} color="#fff" />
                    <Text style={styles.photoBtnText}>Take Photo</Text>
                  </Pressable>
                  <Pressable onPress={pickPhoto} style={[styles.photoBtn, { backgroundColor: surface, borderWidth: 1, borderColor: border }]}>
                    <Ionicons name="image-outline" size={22} color={textColor} />
                    <Text style={[styles.photoBtnText, { color: textColor }]}>Choose Photo</Text>
                  </Pressable>
                </View>
              )}

              <Text style={[styles.sectionLabel, { color: textColor, marginTop: 24 }]}>
                What did you notice? (optional — for your journal only)
              </Text>
              <Text style={[styles.noteText, { color: textSec }]}>
                These are personal journal notes stored privately on your device only. They are not analyzed, interpreted, or used to determine the educational content shown after saving.
              </Text>
              {(OBSERVATION_PROMPTS[selectedArea] ?? []).map(obs => (
                <Pressable
                  key={obs}
                  onPress={() => toggleObservation(obs)}
                  style={[styles.observationRow, { backgroundColor: surface, borderColor: checkedObservations.includes(obs) ? Colors.primary : border }]}
                >
                  <Ionicons
                    name={checkedObservations.includes(obs) ? 'checkbox' : 'square-outline'}
                    size={22}
                    color={checkedObservations.includes(obs) ? Colors.primary : textSec}
                  />
                  <Text style={[styles.observationText, { color: textColor }]}>{obs}</Text>
                </Pressable>
              ))}
            </Animated.View>
          )}

          {/* STEP 4 — Confirm & save */}
          {step === 4 && selectedArea && (
            <Animated.View entering={FadeInDown.duration(300)}>
              <Text style={[styles.stepTitle, { color: textColor }]}>Ready to save your journal entry?</Text>

              <View style={[styles.summaryCard, { backgroundColor: surface, borderColor: border }]}>
                <Text style={[styles.summaryLabel, { color: textSec }]}>Pet</Text>
                <Text style={[styles.summaryValue, { color: textColor }]}>
                  {pets.find(p => p.id === selectedPetId)?.name ?? '—'}
                </Text>

                <Text style={[styles.summaryLabel, { color: textSec, marginTop: 10 }]}>Area logged</Text>
                <Text style={[styles.summaryValue, { color: textColor }]}>
                  {BODY_AREAS.find(b => b.id === selectedArea)?.label ?? selectedArea}
                </Text>

                <Text style={[styles.summaryLabel, { color: textSec, marginTop: 10 }]}>Observations noted</Text>
                <Text style={[styles.summaryValue, { color: textColor }]}>
                  {checkedObservations.length === 0 ? 'None' : checkedObservations.join(', ')}
                </Text>

                {photoUri && (
                  <>
                    <Text style={[styles.summaryLabel, { color: textSec, marginTop: 10 }]}>Photo</Text>
                    <Image source={{ uri: photoUri }} style={styles.summaryPhoto} />
                  </>
                )}
              </View>

              <View style={[styles.disclaimerBox, { backgroundColor: Colors.primary + '14', borderColor: Colors.primary + '44' }]}>
                <Ionicons name="information-circle-outline" size={18} color={Colors.primary} />
                <Text style={[styles.disclaimerText, { color: Colors.primary }]}>
                  After saving, you will see general educational information about{' '}
                  {BODY_AREAS.find(b => b.id === selectedArea)?.label}. This is not an assessment
                  of your pet. Always consult a licensed veterinarian for any health concerns.
                </Text>
              </View>

              <Pressable
                onPress={handleSave}
                disabled={isSaving}
                style={[styles.saveBtn, { backgroundColor: Colors.primary, opacity: isSaving ? 0.7 : 1 }]}
              >
                {isSaving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons name="checkmark-circle-outline" size={22} color="#fff" />
                    <Text style={styles.saveBtnText}>Save Journal Entry</Text>
                  </>
                )}
              </Pressable>
            </Animated.View>
          )}
        </ScrollView>

        {/* Bottom navigation */}
        {step < TOTAL_STEPS && (
          <View style={[styles.navBar, { backgroundColor: bg, borderTopColor: border, paddingBottom: bottomPad }]}>
            <Pressable onPress={handleBack} style={[styles.navBtn, { borderColor: border }]}>
              <Text style={[styles.navBtnText, { color: textColor }]}>Back</Text>
            </Pressable>
            <Pressable onPress={handleNext} style={[styles.navBtnPrimary, { backgroundColor: Colors.primary }]}>
              <Text style={styles.navBtnPrimaryText}>Continue</Text>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </Pressable>
          </View>
        )}

        <UpgradeModal visible={showUpgrade} onClose={() => setShowUpgrade(false)} />
      </View>
    );
  }

  const styles = StyleSheet.create({
    header: { paddingHorizontal: 16, paddingBottom: 14, flexDirection: 'row', alignItems: 'center' },
    headerTitle: { color: '#fff', fontSize: 17, fontWeight: '700' },
    headerSub: { color: 'rgba(255,255,255,0.75)', fontSize: 12, marginTop: 2 },
    backBtn: { padding: 4 },
    stepBadge: { color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: '600' },
    progressTrack: { height: 3, width: '100%' },
    progressFill: { height: 3 },
    stepTitle: { fontSize: 20, fontWeight: '700', marginBottom: 6 },
    stepSubtitle: { fontSize: 14, lineHeight: 20, marginBottom: 16 },
    card: { borderRadius: 14, padding: 20, borderWidth: 1, marginBottom: 12 },
    emptyText: { fontSize: 15, textAlign: 'center', marginBottom: 16 },
    addPetBtn: { borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
    addPetBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
    petCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, padding: 14, borderWidth: 2, marginBottom: 10 },
    petAvatar: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    petName: { fontSize: 16, fontWeight: '700' },
    petBreed: { fontSize: 13, marginTop: 2 },
    areaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    areaCard: { width: '47%', borderRadius: 14, padding: 16, borderWidth: 2, alignItems: 'center', gap: 8 },
    areaLabel: { fontSize: 13, fontWeight: '600', textAlign: 'center' },
    photoWrapper: { position: 'relative', alignSelf: 'center', marginBottom: 16 },
    photo: { width: 200, height: 200, borderRadius: 14 },
    removePhotoBtn: { position: 'absolute', top: -10, right: -10 },
    photoButtons: { flexDirection: 'row', gap: 12, marginBottom: 16 },
    photoBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 12, paddingVertical: 14 },
    photoBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
    sectionLabel: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
    noteText: { fontSize: 12, lineHeight: 18, marginBottom: 12 },
    observationRow: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, padding: 14, borderWidth: 1.5, marginBottom: 8, gap: 10 },
    observationText: { fontSize: 14, flex: 1 },
    summaryCard: { borderRadius: 14, padding: 18, borderWidth: 1, marginBottom: 16 },
    summaryLabel: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
    summaryValue: { fontSize: 15, fontWeight: '500', marginTop: 2 },
    summaryPhoto: { width: 120, height: 120, borderRadius: 10, marginTop: 6 },
    disclaimerBox: { flexDirection: 'row', gap: 8, borderRadius: 12, padding: 14, borderWidth: 1, marginBottom: 20, alignItems: 'flex-start' },
    disclaimerText: { fontSize: 13, lineHeight: 19, flex: 1 },
    saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, borderRadius: 14, paddingVertical: 16 },
    saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
    navBar: { flexDirection: 'row', gap: 12, padding: 16, borderTopWidth: 1 },
    navBtn: { flex: 1, borderRadius: 12, paddingVertical: 14, alignItems: 'center', borderWidth: 1 },
    navBtnText: { fontWeight: '600', fontSize: 15 },
    navBtnPrimary: { flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 12, paddingVertical: 14 },
    navBtnPrimaryText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  });
  