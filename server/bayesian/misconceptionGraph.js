export const misconceptionGraph = {
  nodes: [
    {
      id: 'M1.00',
      cluster: 'M1',
      label: 'Soil as Sole Source',
      description:
        "The plant's body comes primarily from soil or earth-derived substance.",
      activationPriority: 'entry',
      variance: 0.95,
    },
    {
      id: 'M1.01',
      cluster: 'M1',
      label: 'Humus as Plant Food',
      description:
        "Decayed organic matter is the plant's food.",
      activationPriority: 'early',
      variance: 0.88,
    },
    {
      id: 'M1.02',
      cluster: 'M1',
      label: 'Like Nourishes Like',
      description:
        'Living bodies are nourished by matter similar to themselves.',
      activationPriority: 'early',
      variance: 0.78,
    },
    {
      id: 'M1.03',
      cluster: 'M1',
      label: 'Plant-Animal Analogy',
      description:
        'Plants should be understood by analogy with animal feeding.',
      activationPriority: 'early',
      variance: 0.76,
    },
    {
      id: 'M1.04',
      cluster: 'M1',
      label: 'Earth as External Stomach',
      description:
        'Soil digests or prepares food outside the plant body.',
      activationPriority: 'entry',
      variance: 0.92,
    },
    {
      id: 'M1.05',
      cluster: 'M1',
      label: 'Pre-Elaborated Food',
      description:
        'Food is already prepared in soil before root uptake.',
      activationPriority: 'middle',
      variance: 0.84,
    },
    {
      id: 'M1.06',
      cluster: 'M1',
      label: 'Passive Absorption',
      description:
        'The plant passively receives prepared food rather than synthesizing it.',
      activationPriority: 'middle',
      variance: 0.8,
    },
    {
      id: 'M1.07',
      cluster: 'M1',
      label: 'Roots as Sole Organ',
      description:
        'Roots are the only or primary feeding organs.',
      activationPriority: 'entry',
      variance: 0.86,
    },
    {
      id: 'M1.08',
      cluster: 'M1',
      label: 'Leaves Have No Nutritive Role',
      description:
        'Leaves are not central to nutrition or mass-building.',
      activationPriority: 'middle',
      variance: 0.74,
    },
    {
      id: 'M1.09',
      cluster: 'M1',
      label: 'No Internal Chemistry',
      description:
        'The plant does not transform raw materials chemically into new substances.',
      activationPriority: 'middle',
      variance: 0.82,
    },
    {
      id: 'M1.10',
      cluster: 'M1',
      label: 'Growth as Accretion',
      description:
        'Growth is addition of prepared material, not transformation.',
      activationPriority: 'middle',
      variance: 0.78,
    },
    {
      id: 'M1.11',
      cluster: 'M1',
      label: 'Perfect Selectivity',
      description:
        'Roots select only what the plant needs.',
      activationPriority: 'middle',
      variance: 0.66,
    },
    {
      id: 'M1.12',
      cluster: 'M1',
      label: 'No Excretion',
      description:
        'Because plants have no obvious excrement, they must absorb only useful material.',
      activationPriority: 'middle',
      variance: 0.64,
    },
    {
      id: 'M1.13',
      cluster: 'M1',
      label: 'Diversity of Soil Substances',
      description:
        'Different soils contain different flavors, salts, and nutritive substances.',
      activationPriority: 'early',
      variance: 0.72,
    },
    {
      id: 'M1.14',
      cluster: 'M1',
      label: 'Water as Vehicle Only',
      description:
        "Water's role is to carry soil nourishment, not to be the main substance.",
      activationPriority: 'middle',
      variance: 0.76,
    },
    {
      id: 'M1.15',
      cluster: 'M1',
      label: 'Manure and Ash Fertility',
      description:
        'Manure, compost, ash, and fertile soil improve growth, so soil materials must build plants.',
      activationPriority: 'early',
      variance: 0.9,
    },
    {
      id: 'M1.16',
      cluster: 'M1',
      label: 'Mineral Salts as Body Material',
      description:
        'Salts, ash, nitre, or terrestrial matter are mistaken as the main body-forming material.',
      activationPriority: 'middle',
      variance: 0.72,
    },
    {
      id: 'M1.17',
      cluster: 'M1',
      label: 'Aquatic Plant Pressure',
      description:
        'Aquatic plants challenge ordinary soil dependence but may be interpreted as receiving nourishment through water.',
      activationPriority: 'bridge',
      variance: 0.82,
    },
    {
      id: 'M1.18',
      cluster: 'M1',
      label: 'Nutrients as Vitamins',
      description:
        'Soil nutrients are essential but may be confused with the main source of mass.',
      activationPriority: 'corrective',
      variance: 0.78,
    },
    {
      id: 'M2.00',
      cluster: 'M2',
      label: 'Water as Sole Source',
      description:
        "The plant's body comes mainly from water.",
      activationPriority: 'entry',
      variance: 0.92,
    },
    {
      id: 'M2.01',
      cluster: 'M2',
      label: 'Water as Universal Principle',
      description:
        'Water is treated as the fundamental substance from which plant matter is formed.',
      activationPriority: 'early',
      variance: 0.72,
    },
    {
      id: 'M2.02',
      cluster: 'M2',
      label: 'Visible Water Dependence',
      description:
        'Because plants visibly need water, water is assumed to be the main source of their body mass.',
      activationPriority: 'early',
      variance: 0.9,
    },
    {
      id: 'M2.03',
      cluster: 'M2',
      label: 'Seed Awakening by Water',
      description:
        'Water appears to awaken seeds and is therefore treated as the substance that creates growth.',
      activationPriority: 'early',
      variance: 0.74,
    },
    {
      id: 'M2.04',
      cluster: 'M2',
      label: 'van Helmont Balance',
      description:
        'The increase in plant mass with little soil loss is interpreted as evidence that water creates plant substance.',
      activationPriority: 'entry',
      variance: 0.95,
    },
    {
      id: 'M2.05',
      cluster: 'M2',
      label: 'Soil Mass Unchanged',
      description:
        'Because soil mass changes little, soil is rejected as the main source of plant mass.',
      activationPriority: 'middle',
      variance: 0.88,
    },
    {
      id: 'M2.06',
      cluster: 'M2',
      label: 'Added Input Was Water',
      description:
        'Because water was the main added material, the new plant mass is assumed to come from water.',
      activationPriority: 'middle',
      variance: 0.86,
    },
    {
      id: 'M2.07',
      cluster: 'M2',
      label: 'Sap/Juice Identity',
      description:
        'Plant sap is treated as essentially the same substance as the water taken up by roots.',
      activationPriority: 'middle',
      variance: 0.68,
    },
    {
      id: 'M2.08',
      cluster: 'M2',
      label: 'Water Carries Dissolved Earth',
      description:
        'Water is understood mainly as a carrier of dissolved terrestrial matter into the plant.',
      activationPriority: 'bridge',
      variance: 0.78,
    },
    {
      id: 'M2.09',
      cluster: 'M2',
      label: 'Fresh Mass Confused With Dry Mass',
      description:
        'The large amount of water in fresh plant tissue is confused with the origin of dry biomass.',
      activationPriority: 'middle',
      variance: 0.84,
    },
    {
      id: 'M2.10',
      cluster: 'M2',
      label: 'Transpiration Ignored',
      description:
        'Water loss from leaves is ignored when reasoning about plant mass.',
      activationPriority: 'middle',
      variance: 0.62,
    },
    {
      id: 'M2.11',
      cluster: 'M2',
      label: 'Aquatic Plants as Proof',
      description:
        'Aquatic plants are taken as evidence that water alone can provide the substance for plant growth.',
      activationPriority: 'bridge',
      variance: 0.76,
    },  
    {
      id: 'M3.00',
      cluster: 'M3',
      label: 'Air as Empty Space',
      description:
        'Air is treated as nothing or near nothing.',
      activationPriority: 'late',
      variance: 0.88,
    },
    {
      id: 'M3.01',
      cluster: 'M3',
      label: 'Air as Weightless',
      description:
        'Air seems to have no weight and cannot explain mass.',
      activationPriority: 'late',
      variance: 0.92,
    },
    {
      id: 'M3.02',
      cluster: 'M3',
      label: 'Gases Not Matter',
      description:
        'Gas is not intuitively counted as material substance.',
      activationPriority: 'late',
      variance: 0.82,
    },
    {
      id: 'M3.03',
      cluster: 'M3',
      label: 'Invisible Cannot Build Visible',
      description:
        'Invisible inputs are discounted as sources of solid bodies.',
      activationPriority: 'late',
      variance: 0.86,
    },
    {
      id: 'M3.04',
      cluster: 'M3',
      label: 'Fixed Air Unknown',
      description:
        'Carbon dioxide is not understood as a distinct material input.',
      activationPriority: 'late',
      variance: 0.76,
    },
    {
      id: 'M3.05',
      cluster: 'M3',
      label: 'Air Purity Not Nutrition',
      description:
        'Air may be fresh, spoiled, purified, or corrupted, but not food.',
      activationPriority: 'late',
      variance: 0.74,
    },
    {
      id: 'M3.06',
      cluster: 'M3',
      label: 'Leaves as Breathers Only',
      description:
        'Leaves exchange air but are not seen as feeding organs.',
      activationPriority: 'late',
      variance: 0.7,
    },
    {
      id: 'M3.07',
      cluster: 'M3',
      label: 'Roots Should Absorb Air',
      description:
        'If air matters, it should enter through roots rather than leaves.',
      activationPriority: 'late',
      variance: 0.6,
    },
    {
      id: 'M3.08',
      cluster: 'M3',
      label: 'Gas Exchange Ignored',
      description:
        'Intake and release of gases are not counted as material exchange.',
      activationPriority: 'late',
      variance: 0.78,
    },
    {
      id: 'M3.09',
      cluster: 'M3',
      label: 'Carbon in Air Is Unintuitive',
      description:
        'It is hard to imagine carbon stored in invisible air.',
      activationPriority: 'late',
      variance: 0.92,
    },
    {
      id: 'M3.10',
      cluster: 'M3',
      label: 'Atmosphere Not Weighed',
      description:
        'Experiments count soil and water but omit atmospheric input.',
      activationPriority: 'late',
      variance: 0.88,
    },
    {
      id: 'M3.11',
      cluster: 'M3',
      label: 'Oxygen Release Misread',
      description:
        'Oxygen release is noticed but not linked to carbon fixation.',
      activationPriority: 'late',
      variance: 0.64,
    },
    {
      id: 'M3.12',
      cluster: 'M3',
      label: 'Air as Invisible Storehouse',
      description:
        'Corrective wonder bridge: air can be imagined as a storehouse of carbon.',
      activationPriority: 'corrective',
      variance: 0.86,
    },
    {
      id: 'M3.13',
      cluster: 'M3',
      label: 'Leaf as Doorway',
      description:
        'Corrective bridge: leaves are the entry point for atmospheric carbon dioxide.',
      activationPriority: 'corrective',
      variance: 0.8,
    },
    {
      id: 'M4.00',
      cluster: 'M4',
      label: 'Light as Material Substance',
      description:
        'Light is treated as a subtle substance entering the plant.',
      activationPriority: 'late',
      variance: 0.74,
    },
    {
      id: 'M4.01',
      cluster: 'M4',
      label: 'Sun Causes Growth Therefore Supplies Mass',
      description:
        'Because plants grow in sunlight, sunlight is mistaken as material source.',
      activationPriority: 'late',
      variance: 0.84,
    },
    {
      id: 'M4.02',
      cluster: 'M4',
      label: 'Light as Refinement',
      description:
        'Light refines plant juices without clear matter-energy distinction.',
      activationPriority: 'late',
      variance: 0.66,
    },
    {
      id: 'M4.03',
      cluster: 'M4',
      label: 'Heat or Vital Force Builds Body',
      description:
        'Warmth or vital force is treated as body-building material.',
      activationPriority: 'late',
      variance: 0.62,
    },
    {
      id: 'M4.04',
      cluster: 'M4',
      label: 'Oxygen From Light',
      description:
        'Oxygen appearing in light is misread as light turning into product.',
      activationPriority: 'late',
      variance: 0.58,
    },
    {
      id: 'M4.05',
      cluster: 'M4',
      label: 'Energy Becomes Mass',
      description:
        'Energy is assumed to convert directly into plant mass.',
      activationPriority: 'late',
      variance: 0.72,
    },
    {
      id: 'M4.06',
      cluster: 'M4',
      label: 'E = mc2 Misuse',
      description:
        "Einstein's mass-energy relation is misapplied to ordinary plant growth.",
      activationPriority: 'late',
      variance: 0.6,
    },
    {
      id: 'M4.07',
      cluster: 'M4',
      label: 'Darkness Means No Food',
      description:
        'Darkness stopping photosynthesis is misread as proof light is the food.',
      activationPriority: 'late',
      variance: 0.7,
    },
    {
      id: 'M4.08',
      cluster: 'M4',
      label: 'Leaf as Workshop',
      description:
        'Corrective bridge: leaves rearrange matter using light energy.',
      activationPriority: 'corrective',
      variance: 0.84,
    },
    {
      id: 'M4.09',
      cluster: 'M4',
      label: 'Light as Worker',
      description:
        'Corrective bridge: light powers work but is not the brick.',
      activationPriority: 'corrective',
      variance: 0.88,
    },
    {
      id: 'M4.10',
      cluster: 'M4',
      label: 'Matter-Energy Confusion',
      description:
        'The student has not separated matter inputs from energy input.',
      activationPriority: 'late',
      variance: 0.9,
    },
    {
      id: 'I.00',
      cluster: 'I',
      label: 'Role Assignment',
      description:
        'Soil, water, air, and light each receive a distinct role.',
      activationPriority: 'integration',
      variance: 1.0,
    },
    {
      id: 'I.01',
      cluster: 'I',
      label: 'Necessary vs Sufficient',
      description:
        'Something can be essential without being the main source of mass.',
      activationPriority: 'integration',
      variance: 1.0,
    },
    {
      id: 'I.02',
      cluster: 'I',
      label: 'Matter-Energy Distinction',
      description:
        'Matter inputs and energy input must be separated.',
      activationPriority: 'integration',
      variance: 1.0,
    },
    {
      id: 'I.03',
      cluster: 'I',
      label: 'Visible vs Invisible Accounting',
      description:
        'Invisible gases must be counted alongside visible soil and water.',
      activationPriority: 'integration',
      variance: 1.0,
    },
    {
      id: 'I.04',
      cluster: 'I',
      label: 'Active Internal Chemistry',
      description:
        'The plant actively synthesizes organic matter, especially in leaves.',
      activationPriority: 'integration',
      variance: 1.0,
    },
    {
      id: 'I.05',
      cluster: 'I',
      label: 'Dry Biomass Accounting',
      description:
        'The source of dry mass differs from fresh mass and water content.',
      activationPriority: 'integration',
      variance: 1.0,
    },
],

  edges: [
    {
      source: 'M1.00',
      target: 'M1.01',
      weight: 0.88,
      type: 'supports',
    },
    {
      source: 'M1.00',
      target: 'M1.07',
      weight: 0.86,
      type: 'supports',
    },
    {
      source: 'M1.00',
      target: 'M1.13',
      weight: 0.74,
      type: 'supports',
    },
    {
      source: 'M1.01',
      target: 'M1.02',
      weight: 0.8,
      type: 'implies',
    },
    {
      source: 'M1.01',
      target: 'M1.15',
      weight: 0.86,
      type: 'supports',
    },
    {
      source: 'M1.02',
      target: 'M1.03',
      weight: 0.72,
      type: 'implies',
    },
    {
      source: 'M1.03',
      target: 'M1.04',
      weight: 0.92,
      type: 'implies',
    },
    {
      source: 'M1.04',
      target: 'M1.05',
      weight: 0.9,
      type: 'implies',
    },
    {
      source: 'M1.05',
      target: 'M1.06',
      weight: 0.88,
      type: 'implies',
    },
    {
      source: 'M1.06',
      target: 'M1.09',
      weight: 0.82,
      type: 'hides',
    },
    {
      source: 'M1.09',
      target: 'M1.10',
      weight: 0.84,
      type: 'implies',
    },
    {
      source: 'M1.07',
      target: 'M1.08',
      weight: 0.78,
      type: 'implies',
    },
    {
      source: 'M1.07',
      target: 'M1.14',
      weight: 0.68,
      type: 'supports',
    },
    {
      source: 'M1.08',
      target: 'M1.09',
      weight: 0.74,
      type: 'supports',
    },
    {
      source: 'M1.11',
      target: 'M1.12',
      weight: 0.82,
      type: 'supports',
    },
    {
      source: 'M1.12',
      target: 'M1.06',
      weight: 0.58,
      type: 'supports',
    },
    {
      source: 'M1.13',
      target: 'M1.14',
      weight: 0.7,
      type: 'implies',
    },
    {
      source: 'M1.15',
      target: 'M1.16',
      weight: 0.84,
      type: 'retreats_to',
    },
    {
      source: 'M1.16',
      target: 'M1.18',
      weight: 0.72,
      type: 'corrective_bridge',
    },
    {
      source: 'M1.17',
      target: 'M1.14',
      weight: 0.84,
      type: 'retreats_to',
    },
    {
      source: 'M2.00',
      target: 'M2.01',
      weight: 0.72,
      type: 'supports',
    },
    {
      source: 'M2.00',
      target: 'M2.02',
      weight: 0.9,
      type: 'supports',
    },
    {
      source: 'M2.00',
      target: 'M2.04',
      weight: 0.88,
      type: 'supports',
    },
    {
      source: 'M2.01',
      target: 'M2.03',
      weight: 0.68,
      type: 'supports',
    },
    {
      source: 'M2.02',
      target: 'M2.03',
      weight: 0.76,
      type: 'implies',
    },
    {
      source: 'M2.03',
      target: 'M2.00',
      weight: 0.66,
      type: 'supports',
    },
    {
      source: 'M2.04',
      target: 'M2.05',
      weight: 0.9,
      type: 'supports',
    },
    {
      source: 'M2.04',
      target: 'M2.06',
      weight: 0.92,
      type: 'implies',
    },
    {
      source: 'M2.05',
      target: 'M2.06',
      weight: 0.84,
      type: 'supports',
    },
    {
      source: 'M2.06',
      target: 'M2.07',
      weight: 0.7,
      type: 'implies',
    },
    {
      source: 'M2.06',
      target: 'M2.09',
      weight: 0.82,
      type: 'hides',
    },
    {
      source: 'M2.07',
      target: 'M2.08',
      weight: 0.72,
      type: 'retreats_to',
    },
    {
      source: 'M2.09',
      target: 'M2.10',
      weight: 0.78,
      type: 'hides',
    },
    {
      source: 'M2.11',
      target: 'M2.00',
      weight: 0.74,
      type: 'supports',
    },  
    {
      source: 'M3.00',
      target: 'M3.01',
      weight: 0.9,
      type: 'supports',
    },
    {
      source: 'M3.01',
      target: 'M3.03',
      weight: 0.88,
      type: 'supports',
    },
    {
      source: 'M3.02',
      target: 'M3.01',
      weight: 0.82,
      type: 'supports',
    },
    {
      source: 'M3.03',
      target: 'M3.09',
      weight: 0.86,
      type: 'supports',
    },
    {
      source: 'M3.04',
      target: 'M3.09',
      weight: 0.78,
      type: 'supports',
    },
    {
      source: 'M3.05',
      target: 'M3.11',
      weight: 0.7,
      type: 'supports',
    },
    {
      source: 'M3.06',
      target: 'M3.13',
      weight: 0.62,
      type: 'corrective_bridge',
    },
    {
      source: 'M3.07',
      target: 'M1.07',
      weight: 0.74,
      type: 'bridges_to',
    },
    {
      source: 'M3.08',
      target: 'M3.10',
      weight: 0.84,
      type: 'supports',
    },
    {
      source: 'M3.10',
      target: 'M2.04',
      weight: 0.88,
      type: 'bridges_to',
    },
    {
      source: 'M3.09',
      target: 'M3.12',
      weight: 0.86,
      type: 'corrective_bridge',
    },
    {
      source: 'M3.12',
      target: 'M3.13',
      weight: 0.84,
      type: 'corrective_bridge',
    },
    {
      source: 'M3.13',
      target: 'M4.08',
      weight: 0.88,
      type: 'bridges_to',
    },
    {
      source: 'M4.01',
      target: 'M4.00',
      weight: 0.78,
      type: 'supports',
    },
    {
      source: 'M4.01',
      target: 'M4.07',
      weight: 0.76,
      type: 'supports',
    },
    {
      source: 'M4.00',
      target: 'M4.02',
      weight: 0.64,
      type: 'supports',
    },
    {
      source: 'M4.02',
      target: 'M4.03',
      weight: 0.58,
      type: 'supports',
    },
    {
      source: 'M4.04',
      target: 'M4.01',
      weight: 0.6,
      type: 'supports',
    },
    {
      source: 'M4.05',
      target: 'M4.06',
      weight: 0.82,
      type: 'supports',
    },
    {
      source: 'M4.05',
      target: 'M4.10',
      weight: 0.9,
      type: 'supports',
    },
    {
      source: 'M4.08',
      target: 'M4.09',
      weight: 0.88,
      type: 'corrective_bridge',
    },
    {
      source: 'M4.09',
      target: 'M4.10',
      weight: 0.86,
      type: 'challenges',
    },
    {
      source: 'M4.10',
      target: 'I.02',
      weight: 0.92,
      type: 'corrective_bridge',
    },
    {
      source: 'M4.08',
      target: 'M3.13',
      weight: 0.84,
      type: 'bridges_to',
    },
    {
      source: 'M1.17',
      target: 'M2.08',
      weight: 0.88,
      type: 'bridges_to',
    },
    {
      source: 'M1.16',
      target: 'I.01',
      weight: 0.82,
      type: 'corrective_bridge',
    },
    {
      source: 'M1.18',
      target: 'M3.09',
      weight: 0.9,
      type: 'bridges_to',
    },
    {
      source: 'M1.08',
      target: 'M3.13',
      weight: 0.76,
      type: 'bridges_to',
    },
    {
      source: 'M2.04',
      target: 'M3.10',
      weight: 0.94,
      type: 'bridges_to',
    },
    {
      source: 'M2.09',
      target: 'I.05',
      weight: 0.88,
      type: 'corrective_bridge',
    },
    {
      source: 'M2.08',
      target: 'M1.16',
      weight: 0.76,
      type: 'bridges_to',
    },
    {
      source: 'M3.05',
      target: 'M4.04',
      weight: 0.72,
      type: 'bridges_to',
    },
    {
      source: 'M4.09',
      target: 'I.02',
      weight: 0.92,
      type: 'corrective_bridge',
    },
    {
      source: 'M4.10',
      target: 'I.00',
      weight: 0.88,
      type: 'corrective_bridge',
    },
    {
      source: 'I.00',
      target: 'M1.15',
      weight: 0.58,
      type: 'revisit',
    },
    {
      source: 'I.00',
      target: 'M2.09',
      weight: 0.54,
      type: 'revisit',
    },
],
};

export function getNodeById(id) {
  return misconceptionGraph.nodes.find((node) => node.id === id);
}

export function getOutgoingEdges(nodeId) {
  return misconceptionGraph.edges.filter((edge) => edge.source === nodeId);
}