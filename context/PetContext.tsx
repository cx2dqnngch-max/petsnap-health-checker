import AsyncStorage from '@react-native-async-storage/async-storage';
  import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
  import type { EducationalTopic } from '@/data/symptomDatabase';

  export type PetType = 'dog' | 'cat';

  export interface Pet {
    id: string;
    name: string;
    type: PetType;
    breed: string;
    ageYears: number;
    ageMonths: number;
    weightLbs: number;
    photoUri?: string;
    createdAt: string;
  }

  // ScanResult is now a wellness journal entry.
  // It records what the owner observed and provides educational content about the topic.
  // It does NOT contain any diagnostic information, probability scores, or health assessments.
  export interface ScanResult {
    id: string;
    petId: string;
    petName: string;
    bodyArea: string;
    photoUri?: string;
    observations: string[];          // what the owner noted in their journal (raw text, uninterpreted)
    educationalTopic: EducationalTopic; // generic education about the body area
    createdAt: string;
    // Legacy fields kept for compatibility with existing stored data — no longer written
    conditions?: never[];
    overallSeverity?: never;
    healthScore?: never;
    homeCare?: never;
    vetTips?: never;
  }

  export const FREE_SCANS_PER_MONTH = 3;

  interface PetContextValue {
    pets: Pet[];
    scanHistory: ScanResult[];
    selectedPetId: string | null;
    addPet: (pet: Omit<Pet, 'id' | 'createdAt'>) => Promise<void>;
    updatePet: (id: string, updates: Partial<Pet>) => Promise<void>;
    deletePet: (id: string) => Promise<void>;
    addScanResult: (result: Omit<ScanResult, 'id' | 'createdAt'>) => Promise<ScanResult>;
    deleteScanResult: (id: string) => Promise<void>;
    setSelectedPetId: (id: string | null) => void;
    getScansForPet: (petId: string) => ScanResult[];
    isLoading: boolean;
    hasOnboarded: boolean;
    setHasOnboarded: (val: boolean) => Promise<void>;
    monthlyScansUsed: number;
    freeScansLeft: number;
    incrementMonthlyScans: () => Promise<void>;
  }

  const PetContext = createContext<PetContextValue | undefined>(undefined);

  function getCurrentMonth() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }

  export function PetProvider({ children }: { children: React.ReactNode }) {
    const [pets, setPets] = useState<Pet[]>([]);
    const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
    const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasOnboarded, setHasOnboardedState] = useState(false);
    const [monthlyScansUsed, setMonthlyScansUsed] = useState(0);

    useEffect(() => {
      loadData();
    }, []);

    const loadData = async () => {
      try {
        const [petsData, scansData, onboardedData, freemiumMonth, freemiumCount] = await Promise.all([
          AsyncStorage.getItem('pets'),
          AsyncStorage.getItem('scans'),
          AsyncStorage.getItem('hasOnboarded'),
          AsyncStorage.getItem('freemium_month'),
          AsyncStorage.getItem('freemium_count'),
        ]);

        const currentMonth = getCurrentMonth();
        if (freemiumMonth === currentMonth && freemiumCount) {
          setMonthlyScansUsed(parseInt(freemiumCount, 10) || 0);
        } else {
          setMonthlyScansUsed(0);
          await AsyncStorage.setItem('freemium_month', currentMonth);
          await AsyncStorage.setItem('freemium_count', '0');
        }

        const SAMPLE_IDS = new Set(['sample-1', 'sample-2', 'sample-3']);

        if (petsData) {
          const parsed = JSON.parse(petsData) as Pet[];
          const isSeedData = parsed.length > 0 && parsed.every(p => SAMPLE_IDS.has(p.id));
          if (isSeedData) {
            setPets([]);
            await AsyncStorage.removeItem('pets');
            await AsyncStorage.removeItem('scans');
            setScanHistory([]);
          } else {
            setPets(parsed);
            if (parsed.length > 0) setSelectedPetId(parsed[0].id);
            if (scansData) {
              setScanHistory(JSON.parse(scansData) as ScanResult[]);
            } else {
              setScanHistory([]);
            }
          }
        } else {
          setPets([]);
          if (scansData) {
            setScanHistory(JSON.parse(scansData) as ScanResult[]);
          } else {
            setScanHistory([]);
          }
        }

        setHasOnboardedState(onboardedData === 'true');
      } catch (e) {
        setPets([]);
        setScanHistory([]);
      } finally {
        setIsLoading(false);
      }
    };

    const addPet = useCallback(async (petData: Omit<Pet, 'id' | 'createdAt'>) => {
      const newPet: Pet = {
        ...petData,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
      };
      const updated = [...pets, newPet];
      setPets(updated);
      if (!selectedPetId) setSelectedPetId(newPet.id);
      await AsyncStorage.setItem('pets', JSON.stringify(updated));
    }, [pets, selectedPetId]);

    const updatePet = useCallback(async (id: string, updates: Partial<Pet>) => {
      const updated = pets.map(p => p.id === id ? { ...p, ...updates } : p);
      setPets(updated);
      await AsyncStorage.setItem('pets', JSON.stringify(updated));
    }, [pets]);

    const deletePet = useCallback(async (id: string) => {
      const updated = pets.filter(p => p.id !== id);
      setPets(updated);
      if (selectedPetId === id) setSelectedPetId(updated[0]?.id ?? null);
      await AsyncStorage.setItem('pets', JSON.stringify(updated));
    }, [pets, selectedPetId]);

    const addScanResult = useCallback(async (resultData: Omit<ScanResult, 'id' | 'createdAt'>): Promise<ScanResult> => {
      const newResult: ScanResult = {
        ...resultData,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
      };
      const updated = [newResult, ...scanHistory];
      setScanHistory(updated);
      await AsyncStorage.setItem('scans', JSON.stringify(updated));
      return newResult;
    }, [scanHistory]);

    const deleteScanResult = useCallback(async (id: string) => {
      const updated = scanHistory.filter(s => s.id !== id);
      setScanHistory(updated);
      await AsyncStorage.setItem('scans', JSON.stringify(updated));
    }, [scanHistory]);

    const setHasOnboarded = useCallback(async (val: boolean) => {
      setHasOnboardedState(val);
      await AsyncStorage.setItem('hasOnboarded', val ? 'true' : 'false');
    }, []);

    const incrementMonthlyScans = useCallback(async () => {
      const currentMonth = getCurrentMonth();
      const newCount = monthlyScansUsed + 1;
      setMonthlyScansUsed(newCount);
      await AsyncStorage.setItem('freemium_month', currentMonth);
      await AsyncStorage.setItem('freemium_count', String(newCount));
    }, [monthlyScansUsed]);

    const getScansForPet = useCallback((petId: string) => {
      return scanHistory.filter(s => s.petId === petId);
    }, [scanHistory]);

    const freeScansLeft = Math.max(0, FREE_SCANS_PER_MONTH - monthlyScansUsed);

    return (
      <PetContext.Provider value={{
        pets, scanHistory, selectedPetId, addPet, updatePet, deletePet,
        addScanResult, deleteScanResult, setSelectedPetId, getScansForPet,
        isLoading, hasOnboarded, setHasOnboarded,
        monthlyScansUsed, freeScansLeft, incrementMonthlyScans,
      }}>
        {children}
      </PetContext.Provider>
    );
  }

  export function usePets() {
    const ctx = useContext(PetContext);
    if (!ctx) throw new Error('usePets must be used within PetProvider');
    return ctx;
  }
  