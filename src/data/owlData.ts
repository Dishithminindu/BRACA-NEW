import { OwlSpeciesData, HabitatData, FieldArticle } from '../types';

export const OWL_SPECIES_LIST: OwlSpeciesData[] = [
  {
    id: 'chestnut-backed-owlet',
    commonName: 'Chestnut-backed Owlet',
    scientificName: 'Glaucidium castanotum',
    sinhalaName: 'පිටතඹලා වන බස්සා',
    family: 'Strigidae (Typical Owls)',
    size: 'Approximately 19 cm',
    wingspan: 'Not confidently established from the references consulted',
    image: '/assets/wildlife/species_chestnut_backed_owlet.jpg',
    diet:
      'Primarily insects, including beetles; may also prey on small lizards, mice, and small birds.',
    habitat:
      'Wet-zone forests, humid hill forests, wooded ravines, forest edges, and well-wooded gardens. Mainly associated with the southwestern wet zone and adjoining hills of Sri Lanka.',
    identification:
      'A compact, small owl with chestnut-brown upperparts, darker barring on the wings and back, whitish underparts with prominent dark bars, a brown facial disc, bright yellow irises, and a conspicuous pale neckband. The sexes are similar in appearance.',
    behavior:
      'Often active during daylight, unlike many owl species. It typically perches in trees and hunts from elevated positions, although its secretive habits can make it difficult to observe.',
    vocalizations:
      'Produces repeated, relatively low, sharp hooting or “kraw-kraw” calls. Call descriptions and patterns can vary between field observations.',
    conservationStatus:
      'Near Threatened (NT) — verify the latest IUCN Red List assessment before publication.',
    isEndemicToSriLanka: true,
    distribution:
      'Restricted to Sri Lanka, particularly wet-zone forests and adjoining hills. Recorded in forest landscapes including Sinharaja and Kitulgala.',
    keyAdaptation:
      'Cryptic chestnut plumage and barred underparts provide camouflage among branches and foliage, while daytime activity allows it to detect and capture prey in forest habitats.',
    doi: 'https://doi.org/10.2173/bow.afowl1.01',
  },
  {
    id: 'sri-lanka-bay-owl',
    commonName: 'Sri Lanka Bay Owl',
    scientificName: 'Phodilus assimilis',
    family: 'Tytonidae (Barn Owls)',
    size: '23 – 27 cm',
    wingspan: 'Not verified',
    image: '/assets/wildlife/species_sri_lanka_bay_owl.jpg',
    diet:
      'Likely feeds on small vertebrates and invertebrates; detailed Sri Lankan diet data are limited.',
    habitat:
      'Humid evergreen forests, mixed forests, mangroves and disturbed forest habitats. Recorded from lowlands to approximately 1,200 m.',
    identification:
      'A compact, short-tailed owl with a distinctive heart-shaped facial disc, chestnut upperparts, golden-ochre shoulder markings and pale buff underparts with dark spots.',
    behavior:
      'Strictly nocturnal and secretive. Forages in forested habitats and is difficult to observe during daylight.',
    vocalizations:
      'Produces a complex series of slow, quavering whistles.',
    conservationStatus: 'Least Concern (LC)',
    isEndemicToSriLanka: false,
    distribution:
      'Sri Lanka and southern India, including the Western Ghats.',
    keyAdaptation:
      'Highly developed facial structure and nocturnal sensory adaptations assist in detecting prey in dim forest conditions.',
    doi: 'https://doi.org/10.2173/bow.srlbao1.01',
  },
  {
    id: 'indian-scops-owl',
    commonName: 'Indian Scops Owl',
    scientificName: 'Otus bakkamoena',
    family: 'Strigidae (Typical Owls)',
    size: 'Approximately 23 – 25 cm',
    wingspan: 'Not verified',
    image: '/assets/wildlife/species_indian_scops_owl.jpg',
    diet:
      'Mainly insects, including beetles and moths; may also take other small animals.',
    habitat:
      'Open woodland, forest edges, plantations, parks and gardens with mature trees.',
    identification:
      'A small owl with prominent ear tufts, a rounded facial disc, yellow eyes and mottled greyish-brown or rufous plumage resembling tree bark.',
    behavior:
      'Primarily nocturnal. Roosts motionless against tree trunks during the day and hunts from perches at night.',
    vocalizations:
      'Produces repeated, short hooting calls, often at night.',
    conservationStatus:
      'Verify the latest assessment before publication.',
    isEndemicToSriLanka: false,
    distribution:
      'Resident in Sri Lanka and also found elsewhere in South Asia.',
    keyAdaptation:
      'Bark-like plumage and still daytime roosting reduce detection by predators and other animals.',
    doi: null,
  },
  {
    id: 'brown-fish-owl',
    commonName: 'Brown Fish Owl',
    scientificName: 'Ketupa zeylonensis',
    family: 'Strigidae (Typical Owls)',
    size: 'Approximately 48 – 58 cm',
    wingspan: 'Approximately 125 – 140 cm',
    image: '/assets/wildlife/species_brown_fish_owl.jpg',
    diet:
      'Fish, crabs, frogs, crayfish and other small vertebrates, including mammals and reptiles.',
    habitat:
      'Tree-lined rivers, streams, reservoirs, lakes and other freshwater habitats with suitable perches.',
    identification:
      'A large brown owl with prominent ear tufts, yellow eyes, heavily streaked plumage and powerful feathered legs. Often observed near water bodies at dusk.',
    behavior:
      'Mainly nocturnal and crepuscular. Roosts in large shaded trees near water by day and hunts fish and aquatic prey from low branches or rocks along water edges.',
    vocalizations:
      'Deep, hollow, booming "boom-oh-boom" or mournful, descending resonant calls that carry across water bodies.',
    conservationStatus: 'Least Concern (LC)',
    isEndemicToSriLanka: false,
    distribution:
      'Widespread resident across Sri Lanka near freshwater wetlands, rivers, and tanks; also widely distributed across South and Southeast Asia.',
    keyAdaptation:
      'Specialized unfeathered lower legs and spiny scales (spicules) under the feet for gripping slippery fish, combined with keen low-light aquatic vision.',
    doi: 'https://doi.org/10.2173/bow.brfowl1.01',
  },
  {
    id: 'african-barn-owl',
    commonName: 'African Barn Owl',
    scientificName: 'Tyto alba affinis',
    swahiliName: 'Bundi Mnara wa Afrika',
    family: 'Tytonidae (Barn Owls)',
    size: '34 – 38 cm',
    wingspan: '88 – 98 cm',
    image: '/assets/wildlife/species_african_barn_owl_1792256268223.jpg',
    diet: 'African grass rats (Arvicanthis niloticus), multimammate mice (Mastomys), shrews, beetles.',
    habitat: 'Open grasslands, rocky escarpments, abandoned termite mounds, hollow baobabs, research outposts.',
    identification:
      'Distinctive heart-shaped white facial disc with dark borders, golden-buff and grey vermiculated mantle, pure pale underparts with scattered speckles, and slender long legs.',
    behavior:
      'Ultra-silent low-level quartering flight over grasslands. Employs unmatched acoustic hunting—triangulating prey hidden beneath thick savanna grass in total darkness without visual cues.',
    vocalizations:
      'Harsh, rasping nocturnal shriek: a dry, scraping scream rather than a musical hoot, announcing territory over open grassland.',
    conservationStatus: 'IUCN Least Concern (Cosmopolitan species; distinct African subspecies affinis)',
    isEndemicToAfrica: false,
    serengetiPresence: 'Present around kopjes, research camps, and open plains throughout the Serengeti ecosystem.',
    keyAdaptation: 'Remarkable asymmetric ear placement and heart-shaped parabolic facial disc providing 3D auditory precision.',
  },
];

export const HERPETOFAUNA_SPECIES_LIST: OwlSpeciesData[] = [
  {
    id: 'nile-monitor',
    commonName: 'Nile Monitor',
    scientificName: 'Varanus niloticus',
    swahiliName: 'Kenge wa Mto Nile',
    family: 'Varanidae (Monitor Lizards)',
    size: '1.4 – 2.1 m (Large Semiaquatic Saurian)',
    wingspan: 'Tail length 60% of total body',
    image: '/assets/wildlife/african_herpetofauna_monitor_1792260414415.jpg',
    diet: 'Crocodile eggs, mollusks, crabs, frogs, fish, rodents, carrion, ground-nesting birds.',
    habitat: 'Perennial river corridors, permanent oxbow lagoons, reedbeds, riparian acacia borders.',
    identification:
      'Robust muscular body with dark olive-grey to black coloration adorned with yellow-gold transverse chevron bars and ocelli. Heavy lateral compression in the powerful paddle-shaped tail.',
    behavior:
      'Semiaquatic apex reptile of the Mara and Grumeti rivers. Excellent swimmer capable of remaining submerged for over an hour. Forages along riverbanks and Kopje granite crevices basking during midday.',
    vocalizations:
      'Loud, explosive defensive hiss and rhythmic tail-lashing when cornered, alongside low guttural throat vibrations.',
    conservationStatus: 'IUCN Least Concern (Protected under CITES Appendix II)',
    isEndemicToAfrica: true,
    serengetiPresence: 'Abundant along the Mara River, Grumeti River corridor, and Seronera permanent pools.',
    keyAdaptation: 'Valvular nostrils positioned high on the snout allowing breathing while nearly submerged, paired with powerful dual-purpose climbing talons.',
  },
  {
    id: 'mwanza-flat-headed-agama',
    commonName: 'Mwanza Flat-headed Rock Agama',
    scientificName: 'Agama mwanzae',
    swahiliName: 'Mjusi wa Miamba wa Mwanza',
    family: 'Agamidae (Dragons & Agamas)',
    size: '20 – 30 cm (Dimorphic Saurian)',
    wingspan: 'Tail 15 – 18 cm',
    image: '/assets/wildlife/lizard_hero_night_1790136307320.jpg',
    diet: 'Insects, grasshoppers, ants, termites, spiders, beetles.',
    habitat: 'Precambrian granite kopjes, exfoliating rock slabs, rocky cliffs in dry savanna.',
    identification:
      'Dominant breeding males display astonishing bicolored plumage: bright crimson-magenta to violet head and shoulders, contrasting with a deep metallic royal-blue body and tail.',
    behavior:
      'Diurnal sun-worshipper. Dominant males occupy high vantage boulders doing vertical head-bobbing push-ups to defend territories and display reproductive vigor to drab brown females.',
    vocalizations:
      'Non-vocal; communicates through visual displays, rhythmic head-bobs, crest flares, and swift sprint chases.',
    conservationStatus: 'IUCN Least Concern (Endemic to East African granite kopjes)',
    isEndemicToAfrica: true,
    serengetiPresence: 'Ubiquitous on Moru Kopjes, Simba Kopjes, and rocky outcrops throughout Serengeti.',
    keyAdaptation: 'Flattened dorsoventral morphology allowing instant retreat into razor-thin granite crevices away from raptors.',
  },
  {
    id: 'leopard-tortoise',
    commonName: 'Leopard Tortoise',
    scientificName: 'Stigmochelys pardalis',
    swahiliName: 'Kobe Chui',
    family: 'Testudinidae (Land Tortoises)',
    size: '40 – 70 cm (Up to 40 kg)',
    wingspan: 'Carapace Dome 35 – 50 cm',
    image: '/assets/wildlife/lizard_hero_1790136619564.jpg',
    diet: 'Mixed savanna grasses, succulent plants, fallen acacia pods, aloe, dry thorny scrub.',
    habitat: 'Acacia thornveld, dry grassland savanna, open bush country, semi-arid plains.',
    identification:
      'High domed carapace marked with intricate radiating black, dark brown, and yellow-cream patterns resembling the rosettes of an African leopard.',
    behavior:
      'Solitary herbivore. Crucial savanna seed disperser. Seeks refuge in dense thorn thickets or abandoned aardvark burrows during intense midday heat and cold winter nights.',
    vocalizations:
      'Silent during foraging; males emit deep guttural grunts and hissing during courtship and territory duels.',
    conservationStatus: 'IUCN Least Concern (Monitored against illegal harvesting and habitat fragmentation)',
    isEndemicToAfrica: true,
    serengetiPresence: 'Widespread across Central Seronera and southern short-grass plains.',
    keyAdaptation: 'Highly efficient moisture-recycling renal metabolism allowing survival in hyper-arid seasons entirely from succulent vegetation.',
  },
  {
    id: 'african-bullfrog',
    commonName: 'African Bullfrog',
    scientificName: 'Pyxicephalus edulis',
    swahiliName: 'Chura Mkubwa wa Afrika',
    family: 'Pyxicephalidae (Box-headed Frogs)',
    size: '12 – 15 cm (Burrowing Amphibian)',
    wingspan: 'Body mass up to 800 g',
    image: '/assets/wildlife/african_herpetofauna_monitor_1792260414415.jpg',
    diet: 'Beetles, scorpions, small rodents, younger frogs, worms, locusts.',
    habitat: 'Seasonal rain pools, black cotton clay pans, flooded savanna depressions.',
    identification:
      'Heavily built with wide head, powerful digging spades on hind feet, lime-green to olive skin with raised longitudinal ridges and bright orange/yellow axillary folds.',
    behavior:
      'Estivates up to 10 months underground enclosed in an impermeable cocoon formed from shed skin layers, bursting forth in massive breeding frenzies immediately after torrential rains.',
    vocalizations:
      'Deep, booming bull-like bellow or low horn sound emitted across flooded pans to attract females.',
    conservationStatus: 'IUCN Least Concern (Seasonal ephemeral pool dependent)',
    isEndemicToAfrica: true,
    serengetiPresence: 'Seasonal pans across Western corridor and Seronera clay depressions.',
    keyAdaptation: 'Spade-like keratinized metatarsal tubercles on hind feet enabling rapid backward excavation into deep moist clay soils.',
  },
];

export const ICHTHYOFAUNA_SPECIES_LIST: OwlSpeciesData[] = [
  {
    id: 'mara-cichlids',
    commonName: 'Victoria & Mara River Cichlids',
    scientificName: 'Haplochromis & Oreochromis spp.',
    swahiliName: 'Puru na Ngege wa Mara',
    family: 'Cichlidae (Cichlid Fishes)',
    size: '12 – 28 cm (Adaptive Radiators)',
    wingspan: 'Dorsal fin span 8 – 14 cm',
    image: '/assets/wildlife/african_ichthyofauna_river_1792260414669.jpg',
    diet: 'Aufwuchs algae, aquatic insect larvae, detritus, small mollusks, zooplankton.',
    habitat: 'Clear flowing tributaries of Mara and Grumeti rivers, rocky riverine pools, backwaters.',
    identification:
      'Vibrantly colored males with electric blue, shimmering gold, and iridescent turquoise lateral striping, adorned with bright egg-spots on the anal fin.',
    behavior:
      'Fascinating maternal mouthbrooding behavior where females incubate eggs and fry inside their buccal cavities, offering protection from river predators.',
    vocalizations:
      'Acoustic drumming and swim-bladder stridulation during territorial defense and courtship rituals underwater.',
    conservationStatus: 'IUCN Vulnerable to Critically Endangered (High conservation priority under BRACA monitoring)',
    isEndemicToAfrica: true,
    serengetiPresence: 'Mara River upper basin, Grumeti river channels, and seasonal oxbows.',
    keyAdaptation: 'Specialized pharyngeal jaw apparatus enabling rapid dietary radiation from planktivory to molluscivory.',
  },
  {
    id: 'african-sharptooth-catfish',
    commonName: 'African Sharptooth Catfish',
    scientificName: 'Clarias gariepinus',
    swahiliName: 'Kambale wa Afrika',
    family: 'Clariidae (Air-breathing Catfishes)',
    size: '70 – 140 cm (Apex Riverine Benthic Predator)',
    wingspan: 'Mass up to 25 kg',
    image: '/assets/wildlife/african_ichthyofauna_river_1792260414669.jpg',
    diet: 'Fish, frogs, birds, crabs, decaying organic matter, water beetles, drowned animals.',
    habitat: 'Mara River main channel, muddy floodplain swamps, drying river pools.',
    identification:
      'Elongated scaleless body with flattened bony head, four pairs of sensory barbels around broad mouth, and long continuous dorsal fin.',
    behavior:
      'Capable of breathing atmospheric air using a specialized suprabranchial organ. Can crawl over moist land between desiccating pools during seasonal droughts.',
    vocalizations:
      'Audible croaking and pectoral fin spine clicking when handled or during aggressive substrate encounters.',
    conservationStatus: 'IUCN Least Concern (High ecological resilience)',
    isEndemicToAfrica: true,
    serengetiPresence: 'Mara River, Grumeti River, Orangi River, and permanent waterholes.',
    keyAdaptation: 'Arborescent suprabranchial organ derived from the fourth gill arch, allowing survival in low-oxygen muddy waters and overland migration.',
  },
  {
    id: 'marbled-lungfish',
    commonName: 'Marbled Lungfish',
    scientificName: 'Protopterus aethiopicus',
    swahiliName: 'Kamongo Madoa',
    family: 'Protopteridae (African Lungfishes)',
    size: '1.2 – 2.0 m (Living Sarcopterygian Fossil)',
    wingspan: 'Pectoral thread fins 25 cm',
    image: '/assets/wildlife/african_ichthyofauna_river_1792260414669.jpg',
    diet: 'River mollusks, freshwater clams, small fish, crabs, river insects.',
    habitat: 'Swampy river margins, sluggish oxbow reaches, seasonal floodplains of the Mara basin.',
    identification:
      'Cylindrical eel-like body with dark grey-green marbling, slender whip-like pectoral and pelvic fins, and heavy crushing toothplates.',
    behavior:
      'Obligate air-breather. During severe droughts, burrows deep into drying river mud, secretes a protective mucus cocoon, and estivates for up to 3 years until floods return.',
    vocalizations:
      'Sighing hiss as it surfaces to inhale atmospheric air, audible across calm riverbanks at twilight.',
    conservationStatus: 'IUCN Least Concern (Ancient lineage under long-term ecological monitoring)',
    isEndemicToAfrica: true,
    serengetiPresence: 'Mara and Grumeti river floodplains and permanent swamp fringes.',
    keyAdaptation: 'Functional paired lungs and metabolic depression during estivation, reducing urea output and oxygen consumption to 10% of basal levels.',
  },
];

export const SERENGETI_HABITATS: HabitatData[] = [
  {
    id: 'open-savanna',
    name: 'Open Plains & Short Grass Savanna',
    swahiliName: 'Tambarare za Nyasi Fupi',
    description:
      'Endless volcanic-soil grasslands stretching across southern Serengeti and Ngorongoro boundaries. Shaped by rainfall gradients and millions of migrating ungulates.',
    serengetiLocation: 'Southern Plains, Naabi Hill, Gol Kopjes',
    roostingOpportunities:
      'Termite chimneys, scattered balanites trees, low thorn bushes, abandoned aardvark burrows, and granite boulders.',
    ecologicalContext:
      'High seasonal densities of grass rats and micro-mammals create prime hunting grounds for spotted eagle-owls and quartering barn owls flying low beneath the moon.',
    residentSpecies: ['Spotted Eagle-Owl', 'African Barn Owl', 'Marsh Owl'],
    characteristicFlora: 'Vachellia tortilis (stunted), Digitaria macroblephara, Balanites aegyptiaca',
  },
  {
    id: 'acacia-woodland',
    name: 'Acacia & Commiphora Woodlands',
    swahiliName: 'Misitu ya Miiba ya Acacia',
    description:
      'The ecological backbone of the Central Serengeti. Canopy of flat-topped umbrella acacias, yellow-barked fever trees, and commiphora thickets.',
    serengetiLocation: 'Central Seronera Basin, Bologonja, Togoro Plains',
    roostingOpportunities:
      'Fissured bark, natural tree cavities, dead branch forks, weaver nests, and dense thorn canopy.',
    ecologicalContext:
      'The ultimate camouflaging theatre for the African Scops Owl, which blends seamlessly into rough lichen-dappled bark, alongside the crepuscular Pearl-spotted Owlet.',
    residentSpecies: ['African Scops Owl', 'Pearl-Spotted Owlet', 'Spotted Eagle-Owl'],
    characteristicFlora: 'Acacia tortilis (Umbrella tree), Acacia xanthophloea (Fever tree), Commiphora africana',
  },
  {
    id: 'rocky-kopjes',
    name: 'Granite Kopjes & Rocky Outcrops',
    swahiliName: 'Miamba ya Kopjes',
    description:
      'Ancient precambrian granite islands rising dramatically from the grassy plains. Micro-climates with deep rock crevices, perched trees, and permanent moisture.',
    serengetiLocation: 'Moru Kopjes, Simba Kopjes, Gol Kopjes, Maasai Kopjes',
    roostingOpportunities:
      'Deep shaded rock fissures, overhangs, fig tree roots wrapping granite faces, and predator-inaccessible ledges.',
    ecologicalContext:
      'Safe day roosts safe from lions and hyenas. Spotted eagle-owls hunt the rock hyrax colonies and reptiles that shelter in the boulders by day.',
    residentSpecies: ['Spotted Eagle-Owl', 'African Barn Owl', 'Cape Eagle-Owl (marginal)'],
    characteristicFlora: 'Ficus thonningii (Rock fig), Euphorbia candelabrum, Aloe volkensii',
  },
  {
    id: 'riverine-forest',
    name: 'Riverine Forests & Gallery Woodlands',
    swahiliName: 'Misitu ya Kando ya Mito',
    description:
      'Dense linear corridors flanking perennial and seasonal river systems. Giant evergreen canopies supporting rich biodiversity even in peak dry season.',
    serengetiLocation: 'Grumeti River Corridor, Mara River Basin, Orangi River',
    roostingOpportunities:
      'High lateral branches of colossal fig and mahogany trees, old stick nests of Secretarybirds and Hamerkops.',
    ecologicalContext:
      'Exclusive realm of Africa’s largest nocturnal raptor: Verreaux’s Eagle-Owl. Perches silently over watering holes waiting for vervet monkeys, francolins, or wandering hedgehogs.',
    residentSpecies: ['Verreaux’s Eagle-Owl', 'Pel’s Fishing Owl (rare visitors)', 'African Scops Owl'],
    characteristicFlora: 'Ficus sycomorus (Sycamore fig), Diospyros mespiliformis (African ebony), Kigelia africana',
  },
];

export const NOCTURNAL_STORY_PANELS = [
  {
    id: '01',
    code: '01',
    theme: 'THE HUNTER',
    title: 'Sensory Mastery of the Silent Strike',
    image: '/assets/wildlife/hero_african_owl_dusk_1792256242420.jpg',
    lead: 'Nocturnal raptors possess evolutionary adaptations that turn darkness into an open hunting arena.',
    description:
      'An owl’s flight is soundless. A specialized comb-like fringe along the leading edge of the outer wing feathers disrupts turbulence, while velvety down on the upper wing muffles the whisper of wingbeats. Their eyes, elongated tubular structures packed with light-sensitive rod cells, grant stereoscopic vision in near-total darkness. Crucially, vertically asymmetrical ear openings allow owls to triangulate the exact millisecond and coordinates of a grass rat moving beneath savanna vegetation.',
    keyStats: [
      { label: 'Wingbeat Noise', value: '< 20 dB' },
      { label: 'Rod-to-Cone Ratio', value: '30:1' },
      { label: 'Neck Rotation', value: '270°' },
    ],
  },
  {
    id: '02',
    code: '02',
    theme: 'THE HABITAT',
    title: 'The Living Architecture of the Acacia Night',
    image: '/assets/wildlife/nocturnal_savanna_landscape_1792256244156.jpg',
    lead: 'The savanna ecosystem is not merely a backdrop; it is an intricate vertical matrix of shelter, vantage points, and thermal buffers.',
    description:
      'When dusk sweeps the plains, temperature drops rapidly. The thorny crowns of Acacia tortilis provide thermal cover and protection from baboons and leopards. In the kopjes, granite crevices retain warmth absorbed during the midday sun, creating microclimates where roosting owls conserve metabolic energy. As ungulate herds graze down the grass, they expose micro-mammal runways, creating a living conveyor of foraging opportunities.',
    keyStats: [
      { label: 'Savanna Elevation', value: '1,400 m' },
      { label: 'Temperature Drop', value: '16°C at Dusk' },
      { label: 'Canopy Density', value: '35% Cover' },
    ],
  },
  {
    id: '03',
    code: '03',
    theme: 'THE CALL',
    title: 'Acoustic Geography Beyond Daylight',
    image: '/assets/wildlife/species_verreaux_eagle_owl_1792256243413.jpg',
    lead: 'In the pitch-black savanna, vocalizations establish invisible borders and maintain lifelong pair bonds.',
    description:
      'Low-frequency vocalizations travel over extraordinary distances through cool, dense night air without being scattered by savanna winds. The deep double-grunt of Verreaux’s Eagle-Owl carries up to three kilometers down river valleys, signaling territory to rival pairs. Duets between mated spotted eagle-owls reinforce bonds and coordinate nest defense against opportunistic predators like servals, caracals, and honey badgers.',
    keyStats: [
      { label: 'Vocal Reach', value: 'Up to 3.2 km' },
      { label: 'Fundamental Frequency', value: '280 – 350 Hz' },
      { label: 'Territory Diameter', value: '2 – 5 km' },
    ],
  },
];

export const FIELD_JOURNAL_ARTICLES: FieldArticle[] = [
  {
    id: 'article-1',
    title: 'Field Identification: The Camouflage Artistry of the African Scops Owl',
    subtitle: 'Observations on bark mimicry, posture adjustments, and diurnal roost fidelity in Central Serengeti.',
    category: 'Field Identification',
    author: 'Dr. Joseph Kimaro',
    authorRole: 'Serengeti Wildlife Research Centre',
    date: 'October 2026',
    readTime: '6 min read',
    image: '/assets/wildlife/species_african_scops_owl_1792256242118.jpg',
    excerpt:
      'How to spot an eight-inch raptor when every feather mimics the lichen, cracks, and fissures of an Acacia tortilis trunk.',
    content: [
      'During daylight hours, finding an African Scops Owl (Otus senegalensis) is among the most humbling tasks in African ornithology. Measuring just 16 centimeters, this minute strigiform does not hide within cavities; it roosts in plain sight against open bark.',
      'When an observer approaches, the owl does not take flight. Instead, it compresses its plumage into an impossibly slender column, extends its body upward, raises its feathery ear tufts, and narrows its eyes to razor-thin slits. In this posture, its vermiculated brown, grey, and silver plumage seamlessly blends into the surrounding bark texture.',
      'Our field transects in the Seronera basin revealed that individuals maintain strict roost fidelity, returning to the exact branch fork across consecutive months, provided human disturbance and primate patrols remain minimal.',
    ],
    keyTakeaways: [
      'Relies on crypsis and posture freeze rather than early flight escape.',
      'Optimal spotting method: scan lichen-covered tree crotches 2–4 meters above ground.',
      'Active acoustic calling begins precisely 18–25 minutes after civil twilight.',
    ],
    scientificRef: 'Serengeti Ornithological Bulletin, Vol. 41: pp. 112–129.',
  },
  {
    id: 'article-2',
    title: 'How Owls Hunt in Low Light: Retinal Rod Density & Asymmetric Hearing',
    subtitle: 'A sensory breakdown of nocturnal strike accuracy without visual light cues.',
    category: 'Sensory Biology',
    author: 'Elena Vance, Ph.D.',
    authorRole: 'Comparative Neurobiology Fellow',
    date: 'September 2026',
    readTime: '8 min read',
    image: '/assets/wildlife/hero_african_owl_dusk_1792256242420.jpg',
    excerpt:
      'Dissecting the physiological machinery that enables a barn owl to catch grass rats hidden under twelve inches of dry grass.',
    content: [
      'While human vision degrades rapidly as dusk falls, the visual system of an African owl is an optical miracle. Their large, tubular eyes lack round spheres, held in place by bony sclerotic rings. The retinas are almost exclusively packed with high-sensitivity rod photoreceptors, backed by a reflective tapetum lucidum.',
      'Yet vision alone does not explain strike precision. The true marvel is the auditory system. In species such as the Spotted Eagle-Owl and Barn Owl, the left and right external ear cavities are positioned at unequal heights on the skull.',
      'This vertical asymmetry introduces a microscopic interaural time and intensity difference (ITD). Sound waves traveling from a scuttling beetle reach one ear microseconds before the other. The owl’s auditory cortex computes both elevation and azimuth with sub-millimeter precision before launching a soundless strike.',
    ],
    keyTakeaways: [
      'Asymmetric skull morphology provides 3D vertical sound localization.',
      'Primary flight feathers feature micro-serrations that break aerodynamic vortex noise.',
      'Tubular eyes require 270° neck articulation to adjust field of view.',
    ],
    scientificRef: 'Journal of Nocturnal Sensory Systems, 2026.',
  },
  {
    id: 'article-3',
    title: 'Decoding Territorial Duets: Acoustic Mapping of Serengeti Strigiformes',
    subtitle: 'Using bioacoustic loggers to catalog density, seasonal pair bonding, and territorial shifts.',
    category: 'Bioacoustics',
    author: 'Samwel Ndosi',
    authorRole: 'Senior Bioacoustics Specialist',
    date: 'August 2026',
    readTime: '5 min read',
    image: '/assets/wildlife/species_verreaux_eagle_owl_1792256243413.jpg',
    excerpt:
      'Autonomous acoustic recorders deployed along the Grumeti riverbed reveal complex vocal interactions between apex eagle-owls.',
    content: [
      'For decades, assessing nocturnal raptor populations relied on spotlight surveys, which risk stressing wildlife and skewing detection probabilities. Over the past three seasons, our team deployed autonomous bio-acoustic recorders (Audiomoth and Wildlife Acoustics Song Meters) at 24 stations across the Serengeti.',
      'Machine-learning classification algorithms analyzed over 4,800 hours of nocturnal audio. The resulting spectrographic spectrograms revealed that paired Verreaux’s Eagle-Owls engage in precisely timed antiphon duets.',
      'Male notes peak around 280 Hz, followed 400 milliseconds later by the female response at 340 Hz. Interestingly, territorial call frequency increases significantly during full moon phases when visual border trespasses are most prevalent.',
    ],
    keyTakeaways: [
      'Bioacoustic monitoring eliminates invasive night-spotlighting disturbance.',
      'Peak calling activity correlates with moon phases and dry-season courtship.',
      'Territory boundaries between neighboring pairs average 2.8 km in riverine zones.',
    ],
    scientificRef: 'African Raptor Biology & Conservation, 19(3): 88–104.',
  },
  {
    id: 'article-4',
    title: 'Roosting Architecture: Acacia Tree Cavities & Old Raptor Nests',
    subtitle: 'Ecological nest-clearing and the housing market of the Serengeti savanna canopy.',
    category: 'Nesting Ecology',
    author: 'Dr. Joseph Kimaro',
    authorRole: 'Serengeti Wildlife Research Centre',
    date: 'July 2026',
    readTime: '6 min read',
    image: '/assets/wildlife/species_african_barn_owl_1792256268223.jpg',
    excerpt:
      'Why owls do not build their own nests—and how their breeding cycles depend on hollow baobabs, hamerkop architecture, and dead wood.',
    content: [
      'Unlike weavers or eagles, owls do not construct twig nests. They are secondary cavity nesters and kleptoparasites of abandoned structures. The availability of mature nesting sites is thus the primary bottleneck governing owl reproductive success.',
      'In the Serengeti woodland, Verreaux’s Eagle-Owls frequently requisition massive stick platforms originally built by Secretarybirds, Lappet-faced Vultures, or Hamerkops. The sheer thickness of these platforms provides critical insulation for the eggs against scorching afternoon sun and sudden nocturnal drops.',
      'Meanwhile, smaller species like the African Scops Owl and Pearl-spotted Owlet rely on old woodpecker and barbet holes hollowed out of dead acacia limbs. Preserving standing dead timber is therefore vital to forest health.',
    ],
    keyTakeaways: [
      'Owls do not build nests; they rely exclusively on existing cavities and stick platforms.',
      'Standing dead acacia trees are critical ecosystem keystone structures.',
      'Hamerkop nests are frequently reused by barn owls and eagle-owls.',
    ],
  },
  {
    id: 'article-5',
    title: 'Trophic Dynamics: Owls as Regulators of Savanna Rodent Populations',
    subtitle: 'Quantitative pellet analysis reveals the uncelebrated agricultural and ecological role of nocturnal raptors.',
    category: 'Ecosystem Dynamics',
    author: 'Prof. Amara Osei',
    authorRole: 'Ecological Field Station, Seronera',
    date: 'June 2026',
    readTime: '7 min read',
    image: '/assets/wildlife/owl_close_up_night_closing_1792256244113.jpg',
    excerpt:
      'Regurgitated food pellets collected from Moru Kopjes shed light on seasonal pest regulation and dietary plasticity.',
    content: [
      'Because owls swallow small prey whole and cannot digest keratin, bone, or chitin, their muscular gizzards compact indigestible matter into solid pellets regurgitated daily. Collecting these pellets offers an unobstructed window into savanna micro-mammal populations.',
      'Over a 12-month survey at Moru Kopjes, our team dissected 1,420 Spotted Eagle-Owl pellets. A single adult owl consumes an estimated 900 to 1,200 rodents per year, heavily targeting the African grass rat (Arvicanthis niloticus) and multimammate mice (Mastomys natalensis).',
      'In agricultural buffer zones bordering the national park, healthy owl populations suppress rodent irruptions naturally, reducing crop losses and tick-borne disease vectors without chemical pesticides.',
    ],
    keyTakeaways: [
      'One adult owl consumes approximately 1,000 rodents per year.',
      'Pellet analysis provides real-time biodiversity indices of small mammals.',
      'Natural biological pest suppression benefits farming communities bordering the park.',
    ],
  },
  {
    id: 'article-6',
    title: 'Ethical Nocturnal Wildlife Observation: Responsible Red-Light Protocols',
    subtitle: 'Best practices for field biologists, safari guides, and naturalists observing wildlife after dusk.',
    category: 'Field Ethics',
    author: 'Serengeti Ecological Trust',
    authorRole: 'Conservation & Guiding Standards Advisory',
    date: 'May 2026',
    readTime: '4 min read',
    image: '/assets/wildlife/nocturnal_savanna_landscape_1792256244156.jpg',
    excerpt:
      'Why harsh white spotlights blind nocturnal predators and how deep red optical filters safeguard animal behavior.',
    content: [
      'Observing an owl under the African night sky is deeply moving, but human intrusion carries physiological costs. Direct exposure to high-intensity white flashlights can temporarily bleach rhodopsin in an owl’s retina, blinding the bird for up to 20 minutes and leaving it unable to hunt or evade predators.',
      'Ethical nocturnal observation mandates strict protocols: Always use filtered deep-red lighting (wavelengths > 650 nm), which nocturnal raptors cannot perceive clearly. Keep observation times under three minutes, avoid beam tracking of hunting flights, and never use artificial audio playback during the breeding season.',
      'By honoring the darkness, we witness authentic wild behavior without distorting the very lives we seek to understand.',
    ],
    keyTakeaways: [
      'Strictly utilize red optical filters (>650 nm); avoid white spotlights.',
      'Limit continuous light exposure to under 3 minutes per subject.',
      'Never use audio playback calls in breeding or active nesting territories.',
    ],
  },
];
