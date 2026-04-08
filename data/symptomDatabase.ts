// artifacts/petsnap/data/symptomDatabase.ts
// Real 2026 data from PetMD, Merck Veterinary Manual & ASPCA
// Informational only — always show big disclaimer in UI

export const symptomDatabase = {
  // ====================== EYES ======================
  "eyes_red_watery_rubbing": {
    conditions: [
      { name: "Allergic Conjunctivitis", prob: 78, severity: "mild", advice: "Seasonal or environmental allergies. Eye wipes or antihistamines often help.", whenToSeeVet: "Within 1 week if it persists" },
      { name: "Infectious Conjunctivitis", prob: 82, severity: "moderate", advice: "Bacterial or viral. Vet eye drops usually clear it in 7-10 days." }
    ],
    breedAgeModifier: "Higher in brachycephalic breeds (Pugs, Bulldogs) and seniors (+15%)"
  },
  "eyes_squinting_thick_yellow_discharge": {
    conditions: [
      { name: "Bacterial Eye Infection", prob: 85, severity: "moderate", advice: "Needs antibiotic drops.", whenToSeeVet: "ASAP" },
      { name: "Dry Eye (KCS)", prob: 88, severity: "moderate", advice: "Lifelong tear replacement drops needed — very common in dogs." }
    ],
    breedAgeModifier: "Higher in seniors and breeds like Cocker Spaniels, Shih Tzus"
  },
  "eyes_cloudy_squinting": {
    conditions: [
      { name: "Cataracts", prob: 75, severity: "moderate", advice: "Especially common in diabetic dogs. Surgery possible.", whenToSeeVet: "Routine exam" },
      { name: "Glaucoma", prob: 92, severity: "emergency", advice: "Painful emergency — vision loss can happen in hours." }
    ],
    breedAgeModifier: "Higher in seniors and Boston Terriers"
  },
  "eyes_red_cloudy_discharge": {
    conditions: [
      { name: "Corneal Ulcer", prob: 80, severity: "moderate", advice: "Painful scratch on the cornea. Needs immediate vet drops to prevent rupture." }
    ]
  },

  // ====================== SKIN & COAT ======================
  "skin_itching_redness_hairloss": {
    conditions: [
      { name: "Flea Allergy Dermatitis", prob: 87, severity: "moderate", advice: "Even one flea bite can trigger it. Strict monthly prevention required.", whenToSeeVet: "Within 1 week" }
    ]
  },
  "skin_red_bumps_chewing": {
    conditions: [
      { name: "Atopic Dermatitis or Flea Allergy", prob: 82, severity: "moderate", advice: "Allergies or fleas. Vet may prescribe Apoquel or Cytopoint." }
    ]
  },
  "skin_red_circles_hairloss": {
    conditions: [
      { name: "Ringworm", prob: 70, severity: "moderate", advice: "Fungal infection. Contagious to humans and other pets. Needs antifungal treatment." }
    ]
  },

  // ====================== GAIT & MOVEMENT ======================
  "gait_limping_after_exercise": {
    conditions: [
      { name: "Osteoarthritis (Arthritis)", prob: 85, severity: "moderate", advice: "Very common in older dogs. Joint supplements + pain meds help a lot.", whenToSeeVet: "Routine check" }
    ],
    breedAgeModifier: "Higher in seniors and large breeds (+20%)"
  },
  "gait_non_weight_bearing": {
    conditions: [
      { name: "Fracture or Cruciate Ligament Tear", prob: 93, severity: "emergency", advice: "Especially common in large breeds. Surgery often needed." }
    ]
  },

  // ====================== EARS ======================
  "ears_head_shaking_dark_discharge": {
    conditions: [
      { name: "Ear Mites", prob: 85, severity: "moderate", advice: "Highly contagious. Monthly preventives stop it easily." }
    ]
  },
  "ears_red_smelly_discharge": {
    conditions: [
      { name: "Yeast or Bacterial Ear Infection", prob: 90, severity: "moderate", advice: "Clean + medicated drops. Allergies often the root cause." }
    ]
  },

  // ====================== MOUTH & TEETH ======================
  "mouth_bad_breath_red_gums": {
    conditions: [
      { name: "Periodontal Disease / Gingivitis", prob: 92, severity: "moderate", advice: "Affects 80% of dogs over age 3. Dental cleaning + daily brushing recommended." }
    ]
  },

  // ====================== GENERAL / EMERGENCY ======================
  "general_difficulty_breathing": {
    conditions: [
      { name: "Respiratory Distress or Heart Issue", prob: 95, severity: "emergency", advice: "GO TO ER VET NOW — could be collapsing trachea, heart failure, or obstruction." }
    ]
  },
  "general_collapse": {
    conditions: [
      { name: "Possible Heart Failure or Poisoning", prob: 94, severity: "emergency", advice: "Immediate ER visit required." }
    ]
  },
  "general_severe_bleeding": {
    conditions: [
      { name: "Trauma or Bleeding Disorder", prob: 96, severity: "emergency", advice: "Apply pressure and go to ER immediately." }
    ]
  }
} as const;

// ─── Types ────────────────────────────────────────────────────────────────────

export type BodyArea = 'eyes' | 'skin' | 'gait' | 'ears' | 'mouth' | 'general';

export interface SymptomQuestion {
  id: string;
  label: string;
  type: 'boolean' | 'slider';
  sliderMin?: number;
  sliderMax?: number;
  sliderLabel?: string;
}

export interface ConditionData {
  name: string;
  probability: number;
  severity: 'mild' | 'moderate' | 'severe' | 'emergency';
  advice: string;
  whenToSeeVet: string;
}

export interface SymptomEntry {
  conditions: ConditionData[];
  homeCare: string[];
  vetTips: string[];
  isEmergency?: boolean;
}

// ─── Symptom Questions ────────────────────────────────────────────────────────

export const SYMPTOM_QUESTIONS: Record<BodyArea, SymptomQuestion[]> = {
  eyes: [
    { id: 'red_watery', label: 'Eyes appear red or watery', type: 'boolean' },
    { id: 'rubbing_eyes', label: 'Pet is rubbing or pawing at eyes', type: 'boolean' },
    { id: 'squinting', label: 'Squinting or keeping eye partially closed', type: 'boolean' },
    { id: 'discharge_clear', label: 'Clear or watery discharge', type: 'boolean' },
    { id: 'discharge_yellow', label: 'Yellow, green, or thick discharge', type: 'boolean' },
    { id: 'cloudy_hazy', label: 'Eye appears cloudy or hazy', type: 'boolean' },
    { id: 'third_eyelid', label: 'Third eyelid (pink tissue) visible', type: 'boolean' },
    { id: 'swollen_eyelid', label: 'Swollen or puffy eyelids', type: 'boolean' },
    { id: 'suddenly_blind', label: 'Pet seems to bump into objects', type: 'boolean' },
    { id: 'duration', label: 'How many days has this been happening?', type: 'slider', sliderMin: 0, sliderMax: 14, sliderLabel: 'days' },
  ],
  skin: [
    { id: 'itching', label: 'Excessive scratching or itching', type: 'boolean' },
    { id: 'hair_loss', label: 'Hair loss or bald patches', type: 'boolean' },
    { id: 'redness', label: 'Red, inflamed skin', type: 'boolean' },
    { id: 'bumps', label: 'Bumps, pustules, or hives', type: 'boolean' },
    { id: 'chewing_skin', label: 'Chewing or licking skin obsessively', type: 'boolean' },
    { id: 'dry_flaky', label: 'Dry, flaky, or scaly skin', type: 'boolean' },
    { id: 'hot_spots', label: 'Moist, raw, painful areas (hot spots)', type: 'boolean' },
    { id: 'odor', label: 'Unusual skin odor', type: 'boolean' },
    { id: 'parasites', label: 'Visible fleas, ticks, or mites', type: 'boolean' },
    { id: 'severity_scale', label: 'How much is pet scratching? (0=none, 10=constantly)', type: 'slider', sliderMin: 0, sliderMax: 10, sliderLabel: 'intensity' },
  ],
  gait: [
    { id: 'limping', label: 'Noticeable limp on one leg', type: 'boolean' },
    { id: 'non_weight_bearing', label: 'Refusing to put weight on a leg', type: 'boolean' },
    { id: 'stiffness_morning', label: 'Stiffness especially in the morning', type: 'boolean' },
    { id: 'after_exercise', label: 'Symptoms worse after exercise', type: 'boolean' },
    { id: 'swollen_joint', label: 'Visibly swollen joint', type: 'boolean' },
    { id: 'crying_pain', label: 'Vocalizing pain when touched or moving', type: 'boolean' },
    { id: 'reluctant_stairs', label: 'Reluctant to climb stairs or jump', type: 'boolean' },
    { id: 'wobbling', label: 'Wobbling, loss of balance, or falling', type: 'boolean' },
    { id: 'duration', label: 'How many days has the limping lasted?', type: 'slider', sliderMin: 0, sliderMax: 30, sliderLabel: 'days' },
  ],
  ears: [
    { id: 'head_shaking', label: 'Shaking head frequently', type: 'boolean' },
    { id: 'scratching_ears', label: 'Scratching or pawing at ears', type: 'boolean' },
    { id: 'dark_discharge', label: 'Dark or waxy discharge in ear', type: 'boolean' },
    { id: 'yellow_discharge', label: 'Yellow or green discharge from ear', type: 'boolean' },
    { id: 'bad_odor', label: 'Foul smell from ear', type: 'boolean' },
    { id: 'tilting_head', label: 'Head tilting to one side', type: 'boolean' },
    { id: 'loss_balance', label: 'Loss of balance or circling', type: 'boolean' },
    { id: 'red_inner_ear', label: 'Red or swollen inner ear flap', type: 'boolean' },
  ],
  mouth: [
    { id: 'bad_breath', label: 'Unusual or very bad breath', type: 'boolean' },
    { id: 'red_gums', label: 'Red, swollen, or bleeding gums', type: 'boolean' },
    { id: 'yellow_teeth', label: 'Brown/yellow tartar on teeth', type: 'boolean' },
    { id: 'drooling', label: 'Excessive drooling', type: 'boolean' },
    { id: 'difficulty_eating', label: 'Difficulty chewing or dropping food', type: 'boolean' },
    { id: 'pawing_mouth', label: 'Pawing at mouth or face', type: 'boolean' },
    { id: 'mouth_sores', label: 'Visible sores, lumps, or growths', type: 'boolean' },
    { id: 'bleeding', label: 'Bleeding from mouth', type: 'boolean' },
  ],
  general: [
    { id: 'breathing_difficulty', label: 'Labored breathing or gasping', type: 'boolean' },
    { id: 'collapse', label: 'Collapsed or unable to stand', type: 'boolean' },
    { id: 'vomiting', label: 'Vomiting (more than once)', type: 'boolean' },
    { id: 'diarrhea', label: 'Diarrhea or bloody stool', type: 'boolean' },
    { id: 'lethargy', label: 'Unusually tired or lethargic', type: 'boolean' },
    { id: 'not_eating', label: 'Not eating or drinking (24h+)', type: 'boolean' },
    { id: 'seizure', label: 'Seizures or convulsions', type: 'boolean' },
    { id: 'bleeding', label: 'External bleeding', type: 'boolean' },
    { id: 'pale_gums', label: 'Pale, white, or bluish gums', type: 'boolean' },
    { id: 'swollen_abdomen', label: 'Distended or painful abdomen', type: 'boolean' },
  ],
};

// ─── SYMPTOM_DATABASE — built from the new 2026 symptomDatabase above ─────────

function toEntry(
  key: keyof typeof symptomDatabase,
  homeCare: string[],
  vetTips: string[],
  isEmergency?: boolean,
): SymptomEntry {
  const src = symptomDatabase[key];
  return {
    conditions: src.conditions.map(c => ({
      name: c.name,
      probability: c.prob,
      severity: c.severity as ConditionData['severity'],
      advice: c.advice,
      whenToSeeVet: ('whenToSeeVet' in c ? c.whenToSeeVet : 'Consult your veterinarian if symptoms persist or worsen.') as string,
    })),
    homeCare,
    vetTips,
    isEmergency,
  };
}

export const SYMPTOM_DATABASE: Record<string, SymptomEntry> = {
  'eyes_red_watery_rubbing': toEntry(
    'eyes_red_watery_rubbing',
    ['Gently wipe discharge with a warm, damp cloth', 'Use an e-collar to stop rubbing', 'Keep area free of smoke and dust'],
    ['Describe discharge color and consistency', 'Note how long symptoms have been present', 'Mention any recent plant or chemical exposure'],
  ),
  'eyes_squinting_thick_yellow_discharge': toEntry(
    'eyes_squinting_thick_yellow_discharge',
    ['Clean discharge with sterile saline', 'Use cone to prevent rubbing', 'Keep area clean and dry'],
    ['Bring photos if possible', 'Note how long discharge has been present', 'Mention if one or both eyes are affected'],
  ),
  'eyes_cloudy_squinting': toEntry(
    'eyes_cloudy_squinting',
    ['Keep pet calm and in low light', 'Prevent rubbing', 'Do not apply any drops without vet guidance'],
    ['Note if onset was sudden (emergency) or gradual', 'Describe any changes in behavior', 'Mention any recent injuries'],
    true,
  ),
  'eyes_red_cloudy_discharge': toEntry(
    'eyes_red_cloudy_discharge',
    ['Keep area clean', 'Prevent rubbing with e-collar', 'Avoid bright light'],
    ['Note how long the cloudiness has been present', 'Describe any squinting or discomfort', 'Mention any recent trauma'],
  ),
  'skin_itching_redness_hairloss': toEntry(
    'skin_itching_redness_hairloss',
    ['Gentle oatmeal bath to soothe skin', 'Apply cool compress to hot areas', 'Trim nails to reduce scratching trauma'],
    ['Note where itching is most intense', 'Describe any changes in diet or environment', 'Mention any other pets showing symptoms'],
  ),
  'skin_red_bumps_chewing': toEntry(
    'skin_red_bumps_chewing',
    ['Apply cool compresses', 'Use e-collar to prevent licking', 'Gently clip fur around affected area'],
    ['Bring photos of the affected area', 'Note when bumps appeared', 'Mention any recent environmental changes'],
  ),
  'skin_red_circles_hairloss': toEntry(
    'skin_red_circles_hairloss',
    ['Wear gloves when touching affected area', 'Wash hands thoroughly', 'Isolate from other pets until treated'],
    ['Note the size and shape of lesions', 'Mention any other pets or family members showing signs', 'Bring a list of all household pets'],
  ),
  'gait_limping_after_exercise': toEntry(
    'gait_limping_after_exercise',
    ['Rest for 48–72 hours', 'No stairs, running, or jumping', 'Cold pack (wrapped in cloth) for first 24 hours'],
    ['Note which leg is affected', 'Describe how limp changes through the day', 'Mention any recent activity that preceded symptoms'],
  ),
  'gait_non_weight_bearing': toEntry(
    'gait_non_weight_bearing',
    ['Restrict all movement', 'Carry pet when needed', 'Use a harness for support'],
    ['Note if there was a sudden injury', 'Describe the position of the limb', 'Mention if you heard a pop or snap'],
    true,
  ),
  'ears_head_shaking_dark_discharge': toEntry(
    'ears_head_shaking_dark_discharge',
    ['Clean outer ear flap only with damp cloth', 'Do not insert Q-tips into canal', 'Keep ear dry'],
    ['Note the color and smell of discharge', 'Mention if one or both ears are affected', 'Note how long symptoms have been present'],
  ),
  'ears_red_smelly_discharge': toEntry(
    'ears_red_smelly_discharge',
    ['Clean outer ear with vet-approved cleaner', 'Keep ear dry — no swimming', 'Prevent scratching with e-collar if needed'],
    ['Describe discharge color and odor', 'Note any recent swimming or bathing', 'Mention history of ear infections'],
  ),
  'mouth_bad_breath_red_gums': toEntry(
    'mouth_bad_breath_red_gums',
    ['Brush teeth with pet-safe toothpaste', 'Dental chews approved by VOHC', 'Water additive for dental health'],
    ['Note which teeth appear most affected', 'Describe any difficulty eating', 'Mention date of last dental cleaning'],
  ),
  'general_difficulty_breathing': toEntry(
    'general_difficulty_breathing',
    ['Keep pet calm and still', 'Do not restrict movement or put pressure on chest', 'Transport to vet immediately'],
    ['Note breathing rate if possible', 'Describe the sound of breathing', 'Note any blue or grey color in gums'],
    true,
  ),
  'general_collapse': toEntry(
    'general_collapse',
    ['Keep pet warm and still', 'Do not give food or water', 'Get to emergency vet immediately'],
    ['Note how long pet was collapsed', 'Describe events before collapse', 'Check gum color (pale, white, blue = emergency)'],
    true,
  ),
  'general_severe_bleeding': toEntry(
    'general_severe_bleeding',
    ['Apply firm, direct pressure with clean cloth', 'Do not remove the cloth — add more on top', 'Transport to ER vet immediately'],
    ['Note approximate amount of blood lost', 'Describe the wound location', 'Mention any known trauma or accident'],
    true,
  ),
};

// ─── Body Areas ───────────────────────────────────────────────────────────────

export const BODY_AREAS: { id: BodyArea; label: string; icon: string; description: string }[] = [
  { id: 'eyes', label: 'Eyes', icon: 'eye', description: 'Redness, discharge, cloudiness' },
  { id: 'skin', label: 'Skin & Coat', icon: 'water', description: 'Itching, hair loss, rashes' },
  { id: 'gait', label: 'Gait & Movement', icon: 'walk', description: 'Limping, stiffness, weakness' },
  { id: 'ears', label: 'Ears', icon: 'hearing', description: 'Discharge, shaking, scratching' },
  { id: 'mouth', label: 'Mouth & Teeth', icon: 'medical', description: 'Bad breath, gum issues' },
  { id: 'general', label: 'General / Other', icon: 'pulse', description: 'Overall wellness concerns' },
];

// ─── Rotating Vet Tips ────────────────────────────────────────────────────────

export const VET_TIPS = [
  'Regular dental cleanings can prevent 80% of dental disease in pets over 3 years old.',
  'Dogs should have a wellness exam at least once a year; senior pets (7+) twice a year.',
  'Maintain a healthy weight — obesity is the #1 preventable health issue in pets.',
  'Heartworm prevention should be year-round in most climates, even for indoor pets.',
  'Cats are masters at hiding pain — schedule regular vet visits even when they seem fine.',
  'Keep your pet\'s vaccinations up to date — it protects the whole community.',
  'Microchipping is the best way to ensure your pet can be returned if lost.',
  'Regular exercise keeps joints healthy and prevents weight gain.',
  'Dental disease affects 80% of dogs and 70% of cats over age 3.',
  'Early detection of kidney disease can extend a pet\'s life significantly.',
];

// ─── Analysis Function ────────────────────────────────────────────────────────

export function analyzeSymptoms(
    area: BodyArea,
    checkedSymptoms: string[],
    sliderValues: Record<string, number>,
    petAge?: number,
    petBreed?: string,
    petWeightLbs?: number,
  ): {
    conditions: Array<{ name: string; probability: number; severity: 'mild' | 'moderate' | 'severe' | 'emergency' }>;
    isEmergency: boolean;
    healthScore: number;
    homeCare: string[];
    vetTips: string[];
  } {
    const emergencySymptoms = ['breathing_difficulty', 'collapse', 'seizure', 'bleeding', 'pale_gums', 'non_weight_bearing'];
    const hasEmergency = checkedSymptoms.some(s => emergencySymptoms.includes(s));

    let matchedEntry: SymptomEntry | null = null;
    let bestScore = 0;

    for (const [key, entry] of Object.entries(SYMPTOM_DATABASE)) {
      if (!key.startsWith(area)) continue;
      const keyParts = key.split('_').slice(1);
      const matchCount = checkedSymptoms.filter(s => keyParts.some(kp => s.includes(kp))).length;
      if (matchCount > bestScore) {
        bestScore = matchCount;
        matchedEntry = entry;
      }
    }

    if (!matchedEntry) {
      const key = Object.keys(SYMPTOM_DATABASE).find(k => k.startsWith(area));
      if (key) matchedEntry = SYMPTOM_DATABASE[key]!;
    }

    if (!matchedEntry) {
      return { conditions: [], isEmergency: hasEmergency, healthScore: 100, homeCare: [], vetTips: [] };
    }

    // Return conditions without probability adjustments — shown as educational topics only
    const conditions = matchedEntry.conditions.map(c => ({
      name: c.name,
      probability: 0, // not used for display — educational mode only
      severity: c.severity,
    }));

    return {
      conditions,
      isEmergency: hasEmergency || !!matchedEntry.isEmergency,
      healthScore: 100, // not used for display — wellness log only
      homeCare: matchedEntry.homeCare,
      vetTips: matchedEntry.vetTips,
    };
  }
  