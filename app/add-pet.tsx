import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from '@/constants/colors';
import { PetType, usePets } from '@/context/PetContext';

const DOG_BREEDS = [
  'Affenpinscher', 'Afghan Hound', 'Airedale Terrier', 'Akita', 'Alaskan Malamute',
  'American Bulldog', 'American Eskimo Dog', 'American Foxhound', 'American Pit Bull Terrier',
  'American Staffordshire Terrier', 'Anatolian Shepherd', 'Australian Cattle Dog',
  'Australian Shepherd', 'Australian Terrier', 'Basenji', 'Basset Hound', 'Beagle',
  'Bearded Collie', 'Belgian Malinois', 'Bernese Mountain Dog', 'Bichon Frise',
  'Bloodhound', 'Border Collie', 'Border Terrier', 'Boston Terrier', 'Boxer',
  'Boykin Spaniel', 'Brittany', 'Bull Terrier', 'Bulldog', 'Bullmastiff',
  'Cairn Terrier', 'Cane Corso', 'Cardigan Welsh Corgi', 'Cavalier King Charles Spaniel',
  'Chesapeake Bay Retriever', 'Chihuahua', 'Chinese Crested', 'Chinese Shar-Pei',
  'Chow Chow', 'Cocker Spaniel', 'Collie', 'Dachshund', 'Dalmatian',
  'Doberman Pinscher', 'English Setter', 'English Springer Spaniel', 'Flat-Coated Retriever',
  'French Bulldog', 'German Shepherd', 'German Shorthaired Pointer', 'Giant Schnauzer',
  'Golden Retriever', 'Gordon Setter', 'Great Dane', 'Great Pyrenees', 'Greyhound',
  'Havanese', 'Irish Setter', 'Irish Wolfhound', 'Italian Greyhound', 'Jack Russell Terrier',
  'Keeshond', 'Labrador Retriever', 'Leonberger', 'Lhasa Apso', 'Maltese',
  'Mastiff', 'Miniature Pinscher', 'Miniature Schnauzer', 'Newfoundland',
  'Norwegian Elkhound', 'Old English Sheepdog', 'Papillon', 'Pekingese',
  'Pembroke Welsh Corgi', 'Plott Hound', 'Pointer', 'Pomeranian', 'Poodle',
  'Portuguese Water Dog', 'Pug', 'Rhodesian Ridgeback', 'Rottweiler',
  'Saint Bernard', 'Samoyed', 'Schipperke', 'Scottish Terrier', 'Shetland Sheepdog',
  'Shiba Inu', 'Shih Tzu', 'Siberian Husky', 'Silky Terrier', 'Soft Coated Wheaten Terrier',
  'Staffordshire Bull Terrier', 'Standard Schnauzer', 'Tibetan Mastiff', 'Tibetan Terrier',
  'Vizsla', 'Weimaraner', 'Welsh Springer Spaniel', 'West Highland White Terrier',
  'Whippet', 'Wire Fox Terrier', 'Yorkshire Terrier', 'Mixed Breed / Other',
];
const CAT_BREEDS = [
  'Abyssinian', 'American Curl', 'American Shorthair', 'Balinese', 'Bengal',
  'Birman', 'Bombay', 'British Longhair', 'British Shorthair', 'Burmese',
  'Burmilla', 'Chartreux', 'Cornish Rex', 'Devon Rex', 'Domestic Longhair',
  'Domestic Shorthair', 'Egyptian Mau', 'Exotic Shorthair', 'Himalayan',
  'Japanese Bobtail', 'Javanese', 'Khao Manee', 'LaPerm', 'Maine Coon',
  'Manx', 'Norwegian Forest Cat', 'Ocicat', 'Oriental Shorthair', 'Persian',
  'Ragamuffin', 'Ragdoll', 'Russian Blue', 'Scottish Fold', 'Selkirk Rex',
  'Siamese', 'Siberian', 'Singapura', 'Snowshoe', 'Somali', 'Sphynx',
  'Tonkinese', 'Turkish Angora', 'Turkish Van', 'Mixed Breed / Other',
];

export default function AddPetScreen() {
  const { addPet } = usePets();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const bg = isDark ? Colors.dark.background : Colors.background;
  const surface = isDark ? Colors.dark.surface : Colors.surface;
  const textColor = isDark ? Colors.dark.text : Colors.text;
  const textSec = isDark ? Colors.dark.textSecondary : Colors.textSecondary;
  const border = isDark ? Colors.dark.border : Colors.border;

  const [name, setName] = useState('');
  const [type, setType] = useState<PetType>('dog');
  const [breed, setBreed] = useState('');
  const [ageYears, setAgeYears] = useState(0);
  const [ageMonths, setAgeMonths] = useState(0);
  const [weightLbs, setWeightLbs] = useState(22);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [showBreeds, setShowBreeds] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const breeds = type === 'cat' ? CAT_BREEDS : DOG_BREEDS;

  const pickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.8, allowsEditing: true, aspect: [1, 1] });
    if (!result.canceled && result.assets[0]) setPhotoUri(result.assets[0].uri);
  };

  const handleSave = async () => {
    if (!name.trim()) { Alert.alert('Name required', 'Please enter your pet\'s name.'); return; }
    if (!breed) { Alert.alert('Breed required', 'Please select a breed.'); return; }

    setIsSaving(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    await addPet({
      name: name.trim(),
      type,
      breed,
      ageYears,
      ageMonths,
      weightLbs,
      photoUri: photoUri ?? undefined,
    });

    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={textColor} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: textColor }]}>Add Pet</Text>
        <Pressable
          onPress={handleSave}
          disabled={isSaving || !name.trim()}
          style={[styles.saveButton, { opacity: !name.trim() ? 0.5 : 1 }]}
        >
          <Text style={styles.saveButtonText}>{isSaving ? 'Saving...' : 'Save'}</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: bottomPad + 40 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable onPress={pickPhoto} style={styles.photoPicker}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.photoPreview} />
          ) : (
            <LinearGradient
              colors={type === 'cat' ? [Colors.accent, Colors.accentDark] : [Colors.primary, Colors.primaryDark]}
              style={styles.photoPickerDefault}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <MaterialCommunityIcons name={type === 'cat' ? 'cat' : 'dog'} size={52} color="rgba(255,255,255,0.9)" />
            </LinearGradient>
          )}
          <View style={styles.photoPickerOverlay}>
            <Ionicons name="camera" size={20} color="#fff" />
          </View>
        </Pressable>

        <View style={styles.section}>
          <Text style={[styles.label, { color: textSec }]}>NAME</Text>
          <TextInput
            style={[styles.input, { backgroundColor: surface, color: textColor, borderColor: border }]}
            placeholder="e.g. Max, Luna, Buddy"
            placeholderTextColor={textSec}
            value={name}
            onChangeText={setName}
            maxLength={30}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: textSec }]}>TYPE</Text>
          <View style={styles.typeRow}>
            {(['dog', 'cat'] as PetType[]).map(t => (
              <Pressable
                key={t}
                onPress={() => { Haptics.selectionAsync(); setType(t); setBreed(''); }}
                style={[
                  styles.typeOption,
                  { backgroundColor: surface, borderColor: type === t ? Colors.primary : border },
                  type === t && { backgroundColor: `${Colors.primary}15` },
                ]}
              >
                <MaterialCommunityIcons name={t === 'cat' ? 'cat' : 'dog'} size={28} color={type === t ? Colors.primary : textSec} />
                <Text style={[styles.typeLabel, { color: type === t ? Colors.primary : textColor }]}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: textSec }]}>BREED</Text>
          <Pressable
            style={[styles.input, { backgroundColor: surface, borderColor: border, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}
            onPress={() => setShowBreeds(!showBreeds)}
          >
            <Text style={[{ fontSize: 16, fontFamily: 'Inter_400Regular', color: breed ? textColor : textSec }]}>
              {breed || 'Select breed...'}
            </Text>
            <Ionicons name={showBreeds ? 'chevron-up' : 'chevron-down'} size={18} color={textSec} />
          </Pressable>
          {showBreeds && (
            <View style={[styles.breedDropdown, { backgroundColor: surface, borderColor: border }]}>
              <ScrollView
                style={{ maxHeight: 260 }}
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled
                keyboardShouldPersistTaps="handled"
              >
                {breeds.map(b => (
                  <Pressable
                    key={b}
                    onPress={() => { Haptics.selectionAsync(); setBreed(b); setShowBreeds(false); }}
                    style={[styles.breedOption, breed === b && { backgroundColor: `${Colors.primary}15` }]}
                  >
                    <Text style={[styles.breedOptionText, { color: breed === b ? Colors.primary : textColor }]}>{b}</Text>
                    {breed === b && <Ionicons name="checkmark" size={16} color={Colors.primary} />}
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        <View style={styles.row}>
          <View style={[styles.section, { flex: 1 }]}>
            <Text style={[styles.label, { color: textSec }]}>AGE (YEARS)</Text>
            <View style={styles.stepper}>
              <Pressable onPress={() => setAgeYears(Math.max(0, ageYears - 1))} style={[styles.stepperBtn, { backgroundColor: surface }]}>
                <Ionicons name="remove" size={20} color={textColor} />
              </Pressable>
              <Text style={[styles.stepperValue, { color: textColor }]}>{ageYears}</Text>
              <Pressable onPress={() => setAgeYears(Math.min(30, ageYears + 1))} style={[styles.stepperBtn, { backgroundColor: surface }]}>
                <Ionicons name="add" size={20} color={textColor} />
              </Pressable>
            </View>
          </View>
          <View style={[styles.section, { flex: 1 }]}>
            <Text style={[styles.label, { color: textSec }]}>AGE (MONTHS)</Text>
            <View style={styles.stepper}>
              <Pressable onPress={() => setAgeMonths(Math.max(0, ageMonths - 1))} style={[styles.stepperBtn, { backgroundColor: surface }]}>
                <Ionicons name="remove" size={20} color={textColor} />
              </Pressable>
              <Text style={[styles.stepperValue, { color: textColor }]}>{ageMonths}</Text>
              <Pressable onPress={() => setAgeMonths(Math.min(11, ageMonths + 1))} style={[styles.stepperBtn, { backgroundColor: surface }]}>
                <Ionicons name="add" size={20} color={textColor} />
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: textSec }]}>WEIGHT (LBS)</Text>
          <View style={styles.stepper}>
            <Pressable onPress={() => setWeightLbs(Math.max(1, weightLbs - 1))} style={[styles.stepperBtn, { backgroundColor: surface }]}>
              <Ionicons name="remove" size={20} color={textColor} />
            </Pressable>
            <Text style={[styles.stepperValue, { color: textColor }]}>{weightLbs} lbs</Text>
            <Pressable onPress={() => setWeightLbs(weightLbs + 1)} style={[styles.stepperBtn, { backgroundColor: surface }]}>
              <Ionicons name="add" size={20} color={textColor} />
            </Pressable>
          </View>
        </View>

        <Pressable
          onPress={handleSave}
          disabled={isSaving || !name.trim() || !breed}
          style={({ pressed }) => [
            styles.saveFullButton,
            { opacity: (!name.trim() || !breed) ? 0.5 : pressed ? 0.9 : 1 },
          ]}
        >
          <LinearGradient
            colors={[Colors.primary, Colors.accent]}
            style={styles.saveFullButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <MaterialCommunityIcons name="paw" size={22} color="#fff" />
            <Text style={styles.saveFullButtonText}>Add Pet to Profile</Text>
          </LinearGradient>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  closeButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontFamily: 'Inter_700Bold' },
  saveButton: { paddingHorizontal: 16, paddingVertical: 8 },
  saveButtonText: { fontSize: 16, fontFamily: 'Inter_600SemiBold', color: Colors.primary },
  content: { paddingHorizontal: 24, gap: 20 },
  photoPicker: { alignSelf: 'center', position: 'relative', marginBottom: 8 },
  photoPreview: { width: 110, height: 110, borderRadius: 55 },
  photoPickerDefault: { width: 110, height: 110, borderRadius: 55, alignItems: 'center', justifyContent: 'center' },
  photoPickerOverlay: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  section: { gap: 8 },
  label: { fontSize: 11, fontFamily: 'Inter_600SemiBold', letterSpacing: 0.8, textTransform: 'uppercase' },
  input: {
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
  },
  typeRow: { flexDirection: 'row', gap: 12 },
  typeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    borderWidth: 2,
    paddingVertical: 14,
    gap: 8,
  },
  typeLabel: { fontSize: 16, fontFamily: 'Inter_600SemiBold' },
  breedDropdown: {
    borderRadius: 14,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  breedOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  breedOptionText: { fontSize: 15, fontFamily: 'Inter_400Regular' },
  row: { flexDirection: 'row', gap: 16 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepperBtn: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 1 },
  stepperValue: { flex: 1, textAlign: 'center', fontSize: 18, fontFamily: 'Inter_700Bold' },
  saveFullButton: { borderRadius: 18, overflow: 'hidden', marginTop: 8, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8 },
  saveFullButtonGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, gap: 12 },
  saveFullButtonText: { fontSize: 18, fontFamily: 'Inter_700Bold', color: '#fff' },
});
