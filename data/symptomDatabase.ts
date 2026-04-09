// data/symptomDatabase.ts
  // PetSnap Educational Wellness Journal
  // This file contains ONLY educational content about general pet care topics.
  // It does NOT analyze, diagnose, interpret, or evaluate any individual pet's health.
  // User input is used ONLY to select a relevant educational topic.
  // All content is generic, population-level educational information.

  export type BodyArea =
    | 'eyes'
    | 'skin'
    | 'digestion'
    | 'movement'
    | 'breathing'
    | 'behavior'
    | 'ears'
    | 'mouth';

  export interface EducationalTopic {
    title: string;
    summary: string;
    generalFacts: string[];
    whenVetsRecommendVisit: string[];
    ownerWellnessTips: string[];
  }

  export interface JournalEntry {
    id: string;
    bodyArea: BodyArea;
    topic: EducationalTopic;
    createdAt: string;
  }

  // Body area display labels
  export const BODY_AREAS: { id: BodyArea; label: string; icon: string }[] = [
    { id: 'eyes',      label: 'Eye & Vision Care',   icon: 'eye-outline' },
    { id: 'skin',      label: 'Skin & Coat Care',     icon: 'paw-outline' },
    { id: 'digestion', label: 'Digestive Wellness',   icon: 'nutrition-outline' },
    { id: 'movement',  label: 'Mobility & Joints',    icon: 'walk-outline' },
    { id: 'breathing', label: 'Respiratory Care',     icon: 'fitness-outline' },
    { id: 'behavior',  label: 'Behavioral Wellness',  icon: 'happy-outline' },
    { id: 'ears',      label: 'Ear Health',           icon: 'ear-outline' },
    { id: 'mouth',     label: 'Dental & Oral Care',   icon: 'medical-outline' },
  ];

  // Observation prompts — these are journaling prompts, NOT symptom checklists.
  // They help the owner describe what they noticed for their personal wellness log.
  export const OBSERVATION_PROMPTS: Record<BodyArea, string[]> = {
    eyes: [
      'Noticed watery discharge',
      'Noticed redness',
      'Noticed squinting or blinking',
      'Noticed cloudiness',
      'Noticed third eyelid visible',
      'Noticed rubbing at eyes',
    ],
    skin: [
      'Noticed scratching or licking',
      'Noticed hair or fur changes',
      'Noticed skin color changes',
      'Noticed dry or flaky areas',
      'Noticed bumps or lumps',
      'Noticed odor changes',
    ],
    digestion: [
      'Noticed appetite changes',
      'Noticed stool changes',
      'Noticed vomiting or retching',
      'Noticed bloating or gas',
      'Noticed weight changes',
      'Noticed water intake changes',
    ],
    movement: [
      'Noticed gait changes',
      'Noticed reluctance to move',
      'Noticed swollen joints',
      'Noticed stiffness after rest',
      'Noticed reduced activity',
      'Noticed balance changes',
    ],
    breathing: [
      'Noticed breathing rate changes',
      'Noticed coughing or sneezing',
      'Noticed nasal discharge',
      'Noticed exercise tolerance changes',
      'Noticed open-mouth breathing',
      'Noticed unusual sounds',
    ],
    behavior: [
      'Noticed energy level changes',
      'Noticed sleep pattern changes',
      'Noticed social interaction changes',
      'Noticed eating behavior changes',
      'Noticed anxiety or restlessness',
      'Noticed grooming habit changes',
    ],
    ears: [
      'Noticed head shaking',
      'Noticed scratching at ears',
      'Noticed odor from ears',
      'Noticed discharge or debris',
      'Noticed ear position changes',
      'Noticed sensitivity around ears',
    ],
    mouth: [
      'Noticed breath odor changes',
      'Noticed drooling changes',
      'Noticed chewing changes',
      'Noticed gum color changes',
      'Noticed pawing at mouth',
      'Noticed tooth visibility changes',
    ],
  };

  // Educational content by body area.
  // ALL content is generic population-level information — never specific to any animal.
  export const EDUCATIONAL_CONTENT: Record<BodyArea, EducationalTopic> = {
    eyes: {
      title: 'Pet Eye & Vision Care — General Education',
      summary:
        'Eyes are one of the most sensitive organs in pets. Regular eye care and routine veterinary checkups are the cornerstone of good ocular health in companion animals.',
      generalFacts: [
        'Pets\'s eyes naturally produce small amounts of clear discharge to keep the surface moist.',
        'Many dog breeds — particularly flat-faced (brachycephalic) breeds — are more prone to eye surface exposure and tear duct issues.',
        'Cats have a third eyelid (nictitating membrane) that is normally not visible; its appearance is monitored by veterinarians.',
        'UV exposure, environmental allergens, dust, and plant material are common environmental factors discussed in veterinary eye care literature.',
        'Annual eye exams are part of routine wellness visits recommended by most veterinary associations.',
        'Eye health can be influenced by whole-body factors including nutrition, hydration, and systemic health status.',
      ],
      whenVetsRecommendVisit: [
        'Veterinary guidelines generally recommend a wellness visit if any new eye changes persist beyond 24–48 hours.',
        'Immediate veterinary attention is recommended in cases of trauma, visible eye injury, or sudden change in appearance.',
        'Changes in a pet\'s ability to navigate familiar environments are noted as a reason for veterinary evaluation.',
        'Veterinarians recommend against using human eye drops on pets without professional guidance.',
      ],
      ownerWellnessTips: [
        'Gently wipe around your pet\'s eyes with a soft damp cloth as part of grooming.',
        'Keep hair trimmed away from your pet\'s eyes to reduce irritation.',
        'Ensure your pet\'s diet includes omega-3 fatty acids, which are associated with overall cellular health.',
        'Use this journal to note any changes over time — veterinarians find owner observations very helpful.',
        'Wash your hands before and after touching your pet\'s eye area.',
      ],
    },

    skin: {
      title: 'Pet Skin & Coat Care — General Education',
      summary:
        'The skin is the largest organ of a pet\'s body. A healthy coat and skin are important indicators of overall wellness, and regular grooming is a key part of responsible pet ownership.',
      generalFacts: [
        'A pet\'s skin acts as a physical barrier against environmental pathogens, allergens, and moisture loss.',
        'Coat quality is influenced by nutrition, hydration, grooming frequency, and seasonal factors.',
        'Pets shed seasonally, and some breeds shed year-round; this is a normal biological process.',
        'Fleas, mites, and environmental allergens are commonly discussed in veterinary dermatology literature as factors that affect skin health.',
        'Dry indoor air in winter can affect skin moisture levels in pets, similar to humans.',
        'Regular brushing distributes natural oils throughout the coat and removes loose fur and debris.',
      ],
      whenVetsRecommendVisit: [
        'Veterinary guidelines suggest evaluation when skin changes persist, spread, or are accompanied by discomfort.',
        'Sudden or extensive hair loss is noted in veterinary literature as something worth discussing with a veterinarian.',
        'Open sores, crusting, or areas that bleed are noted as reasons to seek veterinary guidance.',
        'Persistent scratching or licking of a specific area is flagged in veterinary literature for professional assessment.',
      ],
      ownerWellnessTips: [
        'Brush your pet regularly to remove loose fur, distribute coat oils, and spot changes early.',
        'Bathe your pet with a pet-specific shampoo on a schedule appropriate for their breed and coat type.',
        'Maintain year-round flea and parasite prevention as recommended by your veterinarian.',
        'Ensure your pet\'s diet is complete and balanced — skin and coat health is closely tied to nutrition.',
        'Keep this wellness journal to track coat and skin observations over time.',
      ],
    },

    digestion: {
      title: 'Pet Digestive Wellness — General Education',
      summary:
        'A healthy digestive system is essential for nutrient absorption, energy, and immune function. Diet, hydration, and routine care all play important roles in digestive wellness.',
      generalFacts: [
        'Dogs and cats have different digestive systems; cats are obligate carnivores and have specific nutritional requirements.',
        'Fresh water access is essential — dehydration can impact digestion and stool consistency.',
        'Dietary transitions should be done gradually over 7–10 days to support digestive adjustment.',
        'Probiotics for pets are discussed in veterinary literature as a tool that some practitioners recommend.',
        'Normal stool varies by diet; color, consistency, and frequency can all shift with food changes.',
        'Stress is recognized in veterinary literature as a factor that can affect digestive function in companion animals.',
      ],
      whenVetsRecommendVisit: [
        'Veterinary guidelines recommend evaluation if vomiting or loose stools persist beyond 24 hours or occur with other signs.',
        'Blood in stool or vomit is cited in veterinary literature as warranting prompt professional evaluation.',
        'Significant unintentional weight change is flagged as a reason for veterinary discussion.',
        'Inability to keep water down is noted as an urgent concern in veterinary guidelines.',
      ],
      ownerWellnessTips: [
        'Feed a consistent, complete, and balanced diet appropriate for your pet\'s life stage.',
        'Maintain a regular feeding schedule — routine supports digestive rhythm.',
        'Ensure clean, fresh water is always available.',
        'Avoid giving table scraps, especially foods toxic to pets (onions, grapes, xylitol, chocolate, etc.).',
        'Note any diet changes in this journal alongside observations to help your veterinarian understand patterns.',
      ],
    },

    movement: {
      title: 'Pet Mobility & Joint Care — General Education',
      summary:
        'Healthy joints and muscles enable pets to move comfortably and enjoy daily activity. Mobility health is supported by appropriate exercise, weight management, and regular veterinary care.',
      generalFacts: [
        'Large and giant dog breeds are more commonly discussed in veterinary orthopedic literature for joint health considerations.',
        'Maintaining a healthy body weight is widely cited as one of the most impactful factors in joint health.',
        'Regular, moderate exercise supports muscle strength and joint lubrication.',
        'Cold and damp weather is reported by many pet owners to correspond with changes in their pet\'s movement — this is discussed in veterinary literature.',
        'Senior pets naturally experience changes in mobility and may benefit from environmental accommodations like ramps or orthopedic bedding.',
        'Nutritional supplements such as glucosamine and omega-3 fatty acids are discussed in veterinary literature, though recommendations vary.',
      ],
      whenVetsRecommendVisit: [
        'Veterinary associations recommend evaluation when a pet shows reluctance to perform normal activities such as climbing stairs.',
        'Sudden onset of difficulty bearing weight is cited as warranting prompt veterinary evaluation.',
        'Visible joint swelling is noted in veterinary literature as reason for professional assessment.',
        'Changes in gait that persist beyond a day or two are recommended for veterinary discussion.',
      ],
      ownerWellnessTips: [
        'Maintain your pet at a healthy weight — this is one of the most evidence-supported strategies for joint health.',
        'Provide regular, age-appropriate exercise — short, frequent walks are often preferable to infrequent long ones.',
        'Offer non-slip flooring in areas where your pet spends time.',
        'Use this journal to track activity levels and note any changes in how your pet moves over time.',
        'Discuss joint health supplements with your veterinarian before starting them.',
      ],
    },

    breathing: {
      title: 'Pet Respiratory Care — General Education',
      summary:
        'The respiratory system delivers oxygen and removes carbon dioxide. Understanding general respiratory wellness helps owners know when to seek routine versus urgent care.',
      generalFacts: [
        'Normal resting respiratory rates vary by species and size; veterinarians measure this as part of routine exams.',
        'Flat-faced (brachycephalic) breeds are widely discussed in veterinary literature as having anatomical features that affect breathing.',
        'Seasonal allergies and environmental factors like smoke, dust, and pollen are noted as common respiratory irritants in pets.',
        'Cats can develop asthma-like conditions; dogs are more susceptible to kennel cough and other respiratory infections.',
        'Heartworm disease, which is transmitted by mosquitoes, is noted in veterinary literature as affecting cardiorespiratory function.',
        'Year-round heartworm prevention is recommended by most veterinary associations.',
      ],
      whenVetsRecommendVisit: [
        'Labored, rapid, or open-mouth breathing (in cats) is cited in veterinary emergency guidelines as warranting immediate attention.',
        'Persistent coughing that lasts more than a few days is recommended for veterinary evaluation.',
        'Blue or grey gum color is flagged as an emergency sign in veterinary first aid guides.',
        'Breathing difficulty after exercise is noted as worth discussing with a veterinarian.',
      ],
      ownerWellnessTips: [
        'Keep your pet away from smoke, strong chemical fumes, and dusty environments.',
        'Ensure your pet is current on core vaccinations — some respiratory infections are vaccine-preventable.',
        'Maintain year-round heartworm prevention as directed by your veterinarian.',
        'Use this journal to note breathing observations — rate, effort, and any sounds — to share with your vet.',
        'Keep indoor air quality good; air purifiers may benefit pets in polluted environments.',
      ],
    },

    behavior: {
      title: 'Pet Behavioral Wellness — General Education',
      summary:
        'Behavior is a key window into a pet\'s overall wellbeing. Changes in normal behavioral patterns are often the first thing owners notice, and they are valuable information for veterinarians.',
      generalFacts: [
        'Behavioral changes in pets can stem from physical, environmental, or social factors.',
        'Separation anxiety is one of the most commonly discussed behavioral topics in companion animal veterinary literature.',
        'Enrichment — including play, social interaction, and mental stimulation — is recognized as important for behavioral wellness.',
        'Senior pets commonly experience cognitive changes; veterinary behaviorists call this cognitive dysfunction syndrome.',
        'New household members, pets, or environments are known triggers for behavioral adjustment periods.',
        'Positive reinforcement training is the approach most widely endorsed by veterinary behavior organizations.',
      ],
      whenVetsRecommendVisit: [
        'Sudden unexplained behavior changes are recommended for veterinary evaluation — behavior is sometimes the first sign of a health change.',
        'Aggression that is new or escalating is noted in veterinary behavioral guidelines as warranting professional assessment.',
        'Loss of house-training in a previously trained pet is flagged in veterinary literature for evaluation.',
        'Apparent confusion, disorientation, or altered awareness is recommended for veterinary discussion.',
      ],
      ownerWellnessTips: [
        'Provide daily mental and physical enrichment appropriate for your pet\'s age and energy level.',
        'Maintain consistent routines — pets generally thrive on predictability.',
        'Socialize pets positively from a young age; continue social experiences throughout life.',
        'Use this journal to log behavioral observations — patterns over time are very valuable for veterinarians.',
        'Consult a veterinary behaviorist or certified trainer for persistent behavioral concerns.',
      ],
    },

    ears: {
      title: 'Pet Ear Health — General Education',
      summary:
        'Ear care is an often-overlooked part of pet wellness. The structure of a pet\'s ear canal makes it prone to trapping moisture and debris, making routine inspection an important habit.',
      generalFacts: [
        'Dogs with long or floppy ears are discussed more frequently in veterinary literature regarding moisture retention and ear health.',
        'The canine ear canal has a vertical and horizontal section, creating an L-shape that can trap debris.',
        'Swimming and bathing can introduce moisture into the ear canal; drying ears after water exposure is commonly recommended.',
        'Ear mites are a common topic in feline ear care discussions and are highly contagious between animals.',
        'Over-cleaning or using inappropriate products can disrupt the natural ear environment.',
        'Veterinarians typically recommend ear cleaning only as needed, using products specifically formulated for pets.',
      ],
      whenVetsRecommendVisit: [
        'Veterinary guidelines recommend evaluation when head shaking or scratching at ears persists beyond a day or two.',
        'Strong odor from the ear is noted in veterinary literature as a common reason for evaluation.',
        'Dark or unusual discharge from the ear is cited as warranting professional assessment.',
        'Sensitivity or pain when the ear area is touched is flagged in veterinary guidelines.',
      ],
      ownerWellnessTips: [
        'Check your pet\'s ears weekly as part of your grooming routine.',
        'Use only veterinarian-approved ear cleaning solutions.',
        'Never insert anything into the ear canal — clean only the visible outer ear.',
        'Dry ears thoroughly after swimming or bathing.',
        'Record your ear observations in this journal to share with your veterinarian at wellness visits.',
      ],
    },

    mouth: {
      title: 'Pet Dental & Oral Care — General Education',
      summary:
        'Dental health is one of the most underemphasized aspects of pet wellness. Veterinary organizations report dental disease as one of the most common health conditions seen in companion animals.',
      generalFacts: [
        'The American Veterinary Dental College recommends professional dental cleanings for most adult pets.',
        'Plaque can begin accumulating on pet teeth within hours of cleaning; daily brushing is the gold standard.',
        'Small breed dogs and cats are particularly discussed in dental literature for higher rates of dental disease.',
        'Dental disease can have systemic effects — veterinary literature links severe oral bacteria to cardiovascular and kidney health discussions.',
        'Raw hides, dental chews, and water additives are commonly discussed; their effectiveness varies and veterinarians have different recommendations.',
        'Pets rarely show obvious pain from dental disease — routine veterinary exams are the primary way disease is detected.',
      ],
      whenVetsRecommendVisit: [
        'Veterinary guidelines recommend annual dental evaluations as part of routine wellness care.',
        'Difficulty eating, dropping food, or chewing on one side is noted as worth discussing with a veterinarian.',
        'Facial swelling is flagged in veterinary literature as warranting prompt evaluation.',
        'Excessive drooling or pawing at the mouth is noted as something veterinarians recommend having examined.',
      ],
      ownerWellnessTips: [
        'Brush your pet\'s teeth daily with a pet-safe toothpaste — never use human toothpaste.',
        'Offer dental-specific treats or toys approved by the Veterinary Oral Health Council (VOHC).',
        'Schedule annual professional dental cleanings with your veterinarian.',
        'Get your pet comfortable with mouth handling from a young age.',
        'Log any oral observations in this journal — even small changes can be valuable context for your vet.',
      ],
    },
  };

  // getEducationalContent — the ONLY function that processes user observations.
  // Input: a body area selected by the user for journaling.
  // Output: generic educational content about that body area.
  // This function does NOT read, interpret, or reason about which observations were checked.
  // The observations are stored as-is in the journal for the owner's personal record only.
  export function getEducationalContent(area: BodyArea): EducationalTopic {
    return EDUCATIONAL_CONTENT[area];
  }

  // Legacy export kept for import compatibility — no longer used for any analysis.
  // Returns empty educational shell; all analysis logic has been removed.
  export function analyzeSymptoms(
    area: BodyArea,
    _checkedObservations: string[],
    _sliderValues: Record<string, number>,
    _petAge?: number,
    _petBreed?: string,
    _petWeightLbs?: number,
  ): {
    educationalTopic: EducationalTopic;
  } {
    return { educationalTopic: getEducationalContent(area) };
  }

  // VET_TIPS — 31 general daily pet wellness reminders, rotated by day of month.
  // All tips are generic educational content. None are specific to any individual pet.
  export const VET_TIPS: string[] = [
    'Regular wellness visits help veterinarians catch changes early — annual checkups are recommended for most adult pets.',
    'Fresh water available at all times supports kidney health and overall hydration in companion animals.',
    'Dental disease is one of the most common conditions seen in pets — daily brushing is the gold standard for prevention.',
    'Maintaining a healthy body weight is widely cited as one of the most impactful things owners can do for their pet\'s joint health.',
    'Year-round parasite prevention is recommended by most veterinary associations for both dogs and cats.',
    'Pets thrive on routine — consistent feeding and activity schedules support digestive and behavioral wellness.',
    'Regular brushing helps distribute natural coat oils, remove loose fur, and gives you a chance to notice any coat changes.',
    'Mental enrichment — puzzle feeders, playtime, and new experiences — supports behavioral wellness in companion animals.',
    'Core vaccinations protect pets from serious preventable diseases; your veterinarian can recommend a schedule appropriate for your pet.',
    'Outdoor cats and dogs benefit from microchipping — it\'s the most reliable way to reunite lost pets with their owners.',
    'Socialization throughout life helps pets adapt positively to new people, animals, and environments.',
    'Spaying or neutering has documented health and behavioral benefits — discuss timing with your veterinarian.',
    'Most veterinary associations recommend at least annual wellness exams; senior pets often benefit from twice-yearly visits.',
    'Signs of dental disease in pets can be subtle — bad breath, changes in eating habits, or mouth sensitivity are worth noting.',
    'A balanced, age-appropriate diet is foundational to your pet\'s long-term health and wellbeing.',
    'Regular nail trims prevent overgrowth that can affect how pets walk and cause discomfort.',
    'Heat safety matters — never leave pets in parked vehicles and ensure outdoor pets have shade and water in warm weather.',
    'Heartworm disease is transmitted by mosquitoes and is preventable with monthly or periodic medication.',
    'Ear health maintenance — checking ears weekly and drying after water exposure — can prevent common ear concerns.',
    'Stress in pets can be triggered by changes in environment, routine, or household; enrichment and consistency help.',
    'Flea and tick prevention should be tailored to your region and your pet\'s lifestyle — ask your veterinarian for guidance.',
    'Eye care begins with keeping the area around the eyes clean and watching for any new changes at routine wellness exams.',
    'Cats are obligate carnivores with unique nutritional requirements — consult your veterinarian about appropriate feline diets.',
    'Exercise appropriate for your pet\'s age, breed, and health status supports cardiovascular and joint health.',
    'Travel safety for pets includes using appropriate restraints and ensuring carriers are secure and well-ventilated.',
    'Pet insurance and wellness plans are options some owners use to help manage the cost of routine and unexpected veterinary care.',
    'Introducing pets to new animals should be done gradually and in neutral territory to support positive social outcomes.',
    'Winter care includes protecting paws from ice and salt, and ensuring outdoor pets have adequate shelter from cold.',
    'Nutrition labels on pet food show ingredients in descending order by weight — named protein sources are typically preferred.',
    'Keeping records of your pet\'s wellness history, vaccinations, and observations helps your veterinarian provide better care.',
    'The AVMA, ASPCA, and your local veterinary practice are excellent resources for evidence-based pet wellness information.',
  ];
  
