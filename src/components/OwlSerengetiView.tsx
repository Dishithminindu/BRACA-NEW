import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  OWL_SPECIES_LIST,
  HERPETOFAUNA_SPECIES_LIST,
  ICHTHYOFAUNA_SPECIES_LIST,
  SERENGETI_HABITATS,
  NOCTURNAL_STORY_PANELS,
  FIELD_JOURNAL_ARTICLES,
} from '../data/owlData';
import { OwlSpeciesData, HabitatData, FieldArticle, Task } from '../types';
import {
  ArrowDown,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  X,
  Volume2,
  Compass,
  MapPin,
  Clock,
  BookOpen,
  Eye,
  Feather,
  Layers,
  Sparkles,
  HandHeart,
  Crown,
  VolumeX,
  Radio,
  Search,
  Plus,
  Heart,
} from 'lucide-react';
import { bioacoustics } from '../utils/bioacousticsAudio';

interface OwlSerengetiViewProps {
  tasks: Task[];
  onOpenFieldOps: () => void;
  onNewObservationTask: () => void;
  onDonationClick?: () => void;
}

export const OwlSerengetiView: React.FC<OwlSerengetiViewProps> = ({
  tasks,
  onOpenFieldOps,
  onNewObservationTask,
  onDonationClick,
}) => {
  // Navigation refs for smooth scrolling
  const reduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const speciesRef = useRef<HTMLElement>(null);
  const storyRef = useRef<HTMLElement>(null);
  const journalRef = useRef<HTMLElement>(null);
  const habitatsRef = useRef<HTMLElement>(null);
  const closingRef = useRef<HTMLElement>(null);

  // Active taxa division: 'avifauna' (Birds/Owls), 'herpetofauna' (Reptiles/Amphibians), 'ichthyofauna' (Freshwater Fishes)
  type TaxonCategory = 'avifauna' | 'herpetofauna' | 'ichthyofauna';
  const [activeTaxon, setActiveTaxon] = useState<TaxonCategory>('avifauna');

  // Active species in horizontal carousel / showcase
  const [selectedSpeciesIndex, setSelectedSpeciesIndex] = useState<number>(0);
  const [activeSpeciesModal, setActiveSpeciesModal] = useState<OwlSpeciesData | null>(null);

  // Active storytelling panel in Section 3
  const [activeStoryPanel, setActiveStoryPanel] = useState<number>(0);

  // Active habitat in Section 5
  const [selectedHabitat, setSelectedHabitat] = useState<HabitatData>(SERENGETI_HABITATS[0]);

  // Active field journal article modal
  const [activeArticle, setActiveArticle] = useState<FieldArticle | null>(null);

  // Get Involved modals
  const [isVolunteerModalOpen, setIsVolunteerModalOpen] = useState(false);
  const [isMembershipModalOpen, setIsMembershipModalOpen] = useState(false);
  const [volunteerSubmitted, setVolunteerSubmitted] = useState(false);
  const [membershipSubmitted, setMembershipSubmitted] = useState(false);

  // Bioacoustic Audio playback state
  const [playingSpeciesId, setPlayingSpeciesId] = useState<string | null>(null);
  const [isAmbiencePlaying, setIsAmbiencePlaying] = useState<boolean>(false);
  const [speciesSearch, setSpeciesSearch] = useState<string>('');

  React.useEffect(() => {
    const unsub = bioacoustics.subscribe((species, ambience) => {
      setPlayingSpeciesId(species);
      setIsAmbiencePlaying(ambience);
    });
    return unsub;
  }, []);

  const handlePlayCall = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    bioacoustics.playSpeciesCall(id);
  };

  const handleToggleAmbience = () => {
    const active = bioacoustics.toggleAmbience();
    setIsAmbiencePlaying(active);
  };

  const TAXON_METADATA: Record<
    TaxonCategory,
    {
      title: string;
      label: string;
      subtitle: string;
      subheading: string;
      heading: string;
      description: string;
    }
  > = {
    avifauna: {
      title: 'Avifauna (Birds & Raptors)',
      label: 'Explore Avifauna',
      subtitle: 'Birds & Nocturnal Raptors',
      subheading: 'BRACA Field Inventory · Avian Monitoring',
      heading: 'Meet the night watch & raptors.',
      description:
        'Silent hunters, masters of acoustic triangulation, and remarkable survivors of the Sri Lankan sky monitored under BRACA research.',
    },
    herpetofauna: {
      title: 'Herpetofauna (Reptiles & Amphibians)',
      label: 'Explore Herpetofauna',
      subtitle: 'Reptiles & Amphibians',
      subheading: 'BRACA Herpetology Division · Riverbanks & Forests',
      heading: 'Saurians, serpents & ancient survivors.',
      description:
        'Ectothermic specialists of tropical microclimates, thermal granite outcrops, and riverine corridors monitored under BRACA research.',
    },
    ichthyofauna: {
      title: 'Ichthyofauna (Freshwater & Aquatic Life)',
      label: 'Explore Ichthyofauna',
      subtitle: 'Freshwater & Aquatic Life',
      subheading: 'BRACA Aquatic Division · Mara River Basin',
      heading: 'Life beneath the Mara & Grumeti currents.',
      description:
        'Ancient lungfishes, riverine catfishes, and endemic cichlids navigating seasonal droughts, torrents, and crucial wetland food webs.',
    },
  };

  const baseSpeciesList =
    activeTaxon === 'herpetofauna'
      ? HERPETOFAUNA_SPECIES_LIST
      : activeTaxon === 'ichthyofauna'
      ? ICHTHYOFAUNA_SPECIES_LIST
      : OWL_SPECIES_LIST;

  const currentSpeciesList = baseSpeciesList.filter((sp) => {
    if (!speciesSearch.trim()) return true;
    const q = speciesSearch.toLowerCase();
    return (
      sp.commonName.toLowerCase().includes(q) ||
      sp.scientificName.toLowerCase().includes(q) ||
      sp.family.toLowerCase().includes(q) ||
      (sp.sinhalaName && sp.sinhalaName.toLowerCase().includes(q)) ||
      (sp.swahiliName && sp.swahiliName.toLowerCase().includes(q)) ||
      sp.habitat.toLowerCase().includes(q)
    );
  });

  const activeSpecies = currentSpeciesList[selectedSpeciesIndex] || currentSpeciesList[0] || baseSpeciesList[0];

  const scrollToSection = <T extends HTMLElement,>(ref: React.RefObject<T | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTaxonChange = (taxon: TaxonCategory) => {
    setActiveTaxon(taxon);
    setSelectedSpeciesIndex(0);
    scrollToSection(speciesRef);
  };

  return (
    <div className="bg-[#101510] text-[#F2EFE5] min-h-screen selection:bg-[#C6A56A] selection:text-[#101510]">
      {/* 1. HERO — INTO THE NIGHT */}
      <motion.section
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
        ref={heroRef}
        id="explore"
        className="relative w-full min-h-[92vh] lg:min-h-screen flex flex-col justify-between overflow-hidden"
      >
        {/* Background Image: Authentic African Owl on Acacia at Dusk */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/wildlife/hero_african_owl_dusk_1792256242420.jpg"
            alt="Spotted Eagle-Owl perched on an acacia branch against twilight Serengeti savanna"
            className="w-full h-full object-cover object-center scale-100 transition-transform duration-1000 ease-out"
            referrerPolicy="no-referrer"
          />
          {/* Subtle measured optical dark scrims for maximum legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#101510]/95 via-[#101510]/70 to-[#101510]/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#101510] via-transparent to-[#101510]/60" />
        </div>

        {/* Top Navigation Bar: Strict Top Bar Contract (3 zones, single line) */}
        <header className="relative z-30 flex items-center justify-between gap-8 px-6 sm:px-10 lg:px-16 py-6 border-b border-[#34392F]/60 backdrop-blur-xs">
          {/* Zone 1: Plain brand wordmark without square */}
          <a
            href="#explore"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection(heroRef);
            }}
            className="flex items-center gap-3 group text-[#F2EFE5] hover:text-[#C6A56A] transition-all whitespace-nowrap shrink-0"
          >
            <div className="flex flex-col text-left">
              <span className="text-xl sm:text-2xl tracking-[0.24em] font-serif font-bold text-[#F2EFE5] group-hover:text-[#C6A56A] transition-colors leading-tight">
                BRACA
              </span>
              <span className="hidden sm:inline-block text-[10px] tracking-[0.1em] uppercase text-[#A6AA9A] font-sans group-hover:text-[#F2EFE5] transition-colors leading-none mt-0.5">
                Biodiversity Research and Conservation Alliance
              </span>
            </div>
          </a>

          {/* Zone 2: 4-5 concise single-line nav links */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-9 text-xs tracking-[0.16em] uppercase text-[#A6AA9A] font-medium">
            <button
              onClick={() => scrollToSection(heroRef)}
              className="hover:text-[#F2EFE5] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Explore
            </button>
            <button
              onClick={() => scrollToSection(speciesRef)}
              className="hover:text-[#F2EFE5] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Species
            </button>
            <button
              onClick={() => scrollToSection(journalRef)}
              className="hover:text-[#F2EFE5] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Field Notes
            </button>
            <button
              onClick={() => scrollToSection(habitatsRef)}
              className="hover:text-[#F2EFE5] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Habitats
            </button>
            <button
              onClick={() => scrollToSection(closingRef)}
              className="hover:text-[#F2EFE5] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              About
            </button>
          </nav>

          {/* Compact, horizontally scrollable navigation for mobile */}
          <nav aria-label="Main navigation" className="absolute left-0 right-0 top-full z-30 flex md:hidden items-center gap-6 overflow-x-auto border-b border-[#34392F]/70 bg-[#101510]/90 px-6 py-3 text-[10px] uppercase tracking-[0.16em] text-[#A6AA9A] backdrop-blur-xl">
            <button onClick={() => scrollToSection(heroRef)} className="shrink-0 transition-colors hover:text-[#C6A56A]">Explore</button>
            <button onClick={() => scrollToSection(speciesRef)} className="shrink-0 transition-colors hover:text-[#C6A56A]">Species</button>
            <button onClick={() => scrollToSection(journalRef)} className="shrink-0 transition-colors hover:text-[#C6A56A]">Field Notes</button>
            <button onClick={() => scrollToSection(habitatsRef)} className="shrink-0 transition-colors hover:text-[#C6A56A]">Habitats</button>
            <button onClick={() => scrollToSection(closingRef)} className="shrink-0 transition-colors hover:text-[#C6A56A]">About</button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenFieldOps}
              className="px-4 py-2 text-xs font-semibold tracking-[0.14em] uppercase text-[#101510] bg-[#C6A56A] hover:bg-[#d6b77c] rounded transition-all shadow-sm active:scale-[0.98] whitespace-nowrap shrink-0"
            >
              Field Log
            </button>
          </div>
        </header>

        {/* Hero Narrative Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-16 sm:py-24 flex-1 flex flex-col justify-center">
          <motion.div
            className="max-w-2xl space-y-6"
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Location Eyebrow */}
            <div className="tracking-[0.22em] font-mono uppercase">
              <span className="text-[23px] text-[#fff9f9] font-semibold">BRACA</span>
            </div>

            {/* Main Headline */}
            <motion.h1
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl sm:text-6xl lg:text-7xl font-serif text-[#F2EFE5] font-normal tracking-tight leading-[1.08] text-balance"
            >
              Where the wild watches back.
            </motion.h1>

            {/* Supporting Copy */}
            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="text-sm sm:text-base text-[#A6AA9A] font-light leading-relaxed max-w-xl"
            >
              The Biodiversity Research and Conservation Alliance (BRACA) advances wildlife conservation through scientific research, biodiversity monitoring, habitat protection, and field-based conservation projects, combining ecological research, innovative technologies, and community engagement to protect wildlife and preserve ecosystems for future generations.
            </motion.p>

            {/* Actions: Duplicated Taxa Exploration Buttons */}
            <div className="pt-2 space-y-3.5">
              <div className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#A6AA9A] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C6A56A]" />
                <span>Explore Biodiversity Divisions</span>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* 1. Explore Avifauna ("evians" / Birds & Raptors) */}
                <button
                  onClick={() => handleTaxonChange('avifauna')}
                  className={`px-5 py-3.5 rounded transition-all text-left flex items-center justify-between gap-3 group border active:scale-95 cursor-pointer ${
                    activeTaxon === 'avifauna'
                      ? 'bg-[#C6A56A] text-[#101510] border-[#C6A56A] shadow-md shadow-[#C6A56A]/10 font-bold'
                      : 'bg-[#1D241B]/90 hover:bg-[#252e22] text-[#F2EFE5] border-[#34392F] hover:border-[#C6A56A]'
                  }`}
                  title="Explore Avifauna (Birds, Raptors & Owls)"
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-bold tracking-[0.14em] uppercase">Explore Avifauna</span>
                    <span className={`text-[10px] ${activeTaxon === 'avifauna' ? 'text-[#101510]/80' : 'text-[#A6AA9A]'} font-normal`}>
                      Birds & Nocturnal Raptors
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1 shrink-0" />
                </button>

                {/* 2. Explore Herpetofauna ("hepatofuna" / Reptiles & Amphibians) */}
                <button
                  onClick={() => handleTaxonChange('herpetofauna')}
                  className={`px-5 py-3.5 rounded transition-all text-left flex items-center justify-between gap-3 group border active:scale-95 cursor-pointer ${
                    activeTaxon === 'herpetofauna'
                      ? 'bg-[#C6A56A] text-[#101510] border-[#C6A56A] shadow-md shadow-[#C6A56A]/10 font-bold'
                      : 'bg-[#1D241B]/90 hover:bg-[#252e22] text-[#F2EFE5] border-[#34392F] hover:border-[#C6A56A]'
                  }`}
                  title="Explore Herpetofauna (Reptiles & Amphibians)"
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-bold tracking-[0.14em] uppercase">Explore Herpetofauna</span>
                    <span className={`text-[10px] ${activeTaxon === 'herpetofauna' ? 'text-[#101510]/80' : 'text-[#A6AA9A]'} font-normal`}>
                      Reptiles & Amphibians
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1 shrink-0" />
                </button>

                {/* 3. Explore Ichthyofauna ("ethiofunoa" / Freshwater & Aquatic Life) */}
                <button
                  onClick={() => handleTaxonChange('ichthyofauna')}
                  className={`px-5 py-3.5 rounded transition-all text-left flex items-center justify-between gap-3 group border active:scale-95 cursor-pointer ${
                    activeTaxon === 'ichthyofauna'
                      ? 'bg-[#C6A56A] text-[#101510] border-[#C6A56A] shadow-md shadow-[#C6A56A]/10 font-bold'
                      : 'bg-[#1D241B]/90 hover:bg-[#252e22] text-[#F2EFE5] border-[#34392F] hover:border-[#C6A56A]'
                  }`}
                  title="Explore Ichthyofauna (Freshwater & Aquatic Life)"
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-bold tracking-[0.14em] uppercase">Explore Ichthyofauna</span>
                    <span className={`text-[10px] ${activeTaxon === 'ichthyofauna' ? 'text-[#101510]/80' : 'text-[#A6AA9A]'} font-normal`}>
                      Freshwater & Aquatic Life
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1 shrink-0" />
                </button>
              </div>

              {/* Secondary Actions: Field Journal & Night Audio */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => scrollToSection(journalRef)}
                  className="text-xs text-[#A6AA9A] hover:text-[#C6A56A] font-mono tracking-wider uppercase flex items-center gap-1.5 transition-colors group cursor-pointer"
                >
                  <span>Enter the Field Journal</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 text-[#C6A56A]" />
                </button>

                <span className="text-[#34392F]">·</span>

                <button
                  type="button"
                  onClick={handleToggleAmbience}
                  className={`text-xs font-mono uppercase tracking-wider flex items-center gap-2 px-3 py-1.5 rounded transition-all cursor-pointer border ${
                    isAmbiencePlaying
                      ? 'bg-[#1D241B] border-[#C6A56A] text-[#C6A56A] shadow-xs'
                      : 'bg-[#101510]/80 hover:bg-[#1D241B] border-[#34392F] text-[#A6AA9A] hover:text-[#F2EFE5]'
                  }`}
                >
                  {isAmbiencePlaying ? (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-[#C6A56A] animate-pulse" />
                      <span>Night Soundscape Active</span>
                      <span className="flex gap-0.5 items-end h-3 w-3">
                        <span className="w-0.5 h-1.5 bg-[#C6A56A] animate-pulse" />
                        <span className="w-0.5 h-3 bg-[#C6A56A] animate-pulse" style={{ animationDelay: '150ms' }} />
                        <span className="w-0.5 h-2 bg-[#C6A56A] animate-pulse" style={{ animationDelay: '300ms' }} />
                      </span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-3.5 h-3.5" />
                      <span>Listen to Savanna Night</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Subtle Scroll Indicator */}
        <div className="relative z-10 pb-8 px-6 sm:px-10 lg:px-16 flex items-center justify-end text-xs text-[#A6AA9A] font-mono border-t border-[#34392F]/40 pt-4">
          <button
            onClick={() => scrollToSection(speciesRef)}
            aria-label="Scroll down to species section"
            className="flex items-center gap-2 text-xs tracking-wider uppercase text-[#A6AA9A] hover:text-[#C6A56A] transition-colors group cursor-pointer"
          >
            <span>Scroll to encounter</span>
            <ArrowDown className="w-3.5 h-3.5 transition-transform group-hover:translate-y-1 text-[#C6A56A]" />
          </button>
        </div>
      </motion.section>

      {/* 2. SECTION TWO — THE OWLS OF THE SAVANNA */}
      <motion.section
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
        ref={speciesRef}
        id="species"
        className="py-28 px-6 sm:px-10 lg:px-16 bg-[#101510] border-t border-[#34392F]"
      >
        <div className="max-w-7xl mx-auto space-y-14">
          {/* Taxa Division Selector Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#34392F] pb-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-widest text-[#A6AA9A] mr-1 hidden sm:inline">
                Division:
              </span>
              {(['avifauna', 'herpetofauna', 'ichthyofauna'] as TaxonCategory[]).map((tax) => (
                <button
                  key={tax}
                  onClick={() => handleTaxonChange(tax)}
                  className={`px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider rounded transition-all cursor-pointer border ${
                    activeTaxon === tax
                      ? 'border-[#C6A56A] text-[#101510] bg-[#C6A56A] font-bold shadow-sm'
                      : 'border-[#34392F] text-[#A6AA9A] hover:text-[#F2EFE5] hover:border-[#C6A56A]/60 bg-[#141A13]'
                  }`}
                >
                  {tax === 'avifauna'
                    ? 'Avifauna (Birds)'
                    : tax === 'herpetofauna'
                    ? 'Herpetofauna (Reptiles)'
                    : 'Ichthyofauna (Aquatic)'}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Species Search Input */}
              <div className="relative min-w-[200px] max-w-xs flex-1 sm:flex-initial">
                <Search className="w-3.5 h-3.5 text-[#A6AA9A] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter species..."
                  value={speciesSearch}
                  onChange={(e) => {
                    setSpeciesSearch(e.target.value);
                    setSelectedSpeciesIndex(0);
                  }}
                  className="w-full bg-[#141A13] border border-[#34392F] rounded pl-8 pr-7 py-1.5 text-xs text-[#F2EFE5] placeholder-[#A6AA9A]/60 focus:outline-none focus:border-[#C6A56A]"
                />
                {speciesSearch && (
                  <button
                    onClick={() => {
                      setSpeciesSearch('');
                      setSelectedSpeciesIndex(0);
                    }}
                    className="absolute right-2.5 top-2 text-[#A6AA9A] hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <span className="text-xs font-mono text-[#C6A56A] hidden md:inline">
                {currentSpeciesList.length} Species
              </span>
            </div>
          </div>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#34392F] pb-8">
            <div className="space-y-3 max-w-xl">
              <p className="text-xs tracking-[0.2em] uppercase font-mono text-[#C6A56A]">
                {TAXON_METADATA[activeTaxon].subheading}
              </p>
              <h2 className="text-3xl sm:text-5xl font-serif text-[#F2EFE5] font-normal tracking-tight">
                {TAXON_METADATA[activeTaxon].heading}
              </h2>
              <p className="text-sm text-[#A6AA9A] font-light leading-relaxed">
                {TAXON_METADATA[activeTaxon].description}
              </p>
            </div>

            {/* Species Selector Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
              {currentSpeciesList.map((sp, idx) => (
                <button
                  key={sp.id}
                  onClick={() => setSelectedSpeciesIndex(idx)}
                  className={`px-3 py-1.5 text-xs font-mono tracking-wider transition-colors whitespace-nowrap shrink-0 border cursor-pointer ${
                    selectedSpeciesIndex === idx
                      ? 'border-[#C6A56A] text-[#C6A56A] bg-[#1D241B]'
                      : 'border-transparent text-[#A6AA9A] hover:text-[#F2EFE5] hover:border-[#34392F]'
                  }`}
                >
                  0{idx + 1} · {sp.commonName.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Immersive Horizontal Featured Species Stage */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-[#1D241B]/40 border border-[#34392F] rounded-lg overflow-hidden">
            {/* Large Species Photographic View */}
            <div className="lg:col-span-7 relative min-h-[420px] lg:min-h-[580px] overflow-hidden group">
              <AnimatePresence mode="wait" initial={false}>
                <motion.img
                  key={activeSpecies.id}
                  src={activeSpecies.image}
                  alt={activeSpecies.commonName}
                  initial={reduceMotion ? false : { opacity: 0, scale: 1.025 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduceMotion ? undefined : { opacity: 0, scale: 0.99 }}
                  transition={{ duration: reduceMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.025]"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  decoding="async"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-[#101510] via-transparent to-black/20" />

              {/* Status pill-free label in image corner */}
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-mono tracking-widest uppercase text-[#C6A56A]">
                    {activeSpecies.isEndemicToSriLanka
                      ? 'Sri Lankan Endemic'
                      : activeSpecies.isEndemicToAfrica
                      ? 'African Endemic'
                      : activeSpecies.distribution
                      ? 'Native / Regional Resident'
                      : 'Cosmopolitan Distribution'}
                  </div>
                  <div className="text-xl font-serif text-white font-medium">
                    {activeSpecies.scientificName}
                  </div>
                </div>

                <button
                  onClick={() => setActiveSpeciesModal(activeSpecies)}
                  className="px-4 py-2 bg-[#101510]/80 hover:bg-[#C6A56A] hover:text-[#101510] text-[#F2EFE5] border border-[#34392F] hover:border-[#C6A56A] text-xs font-mono tracking-wider uppercase transition-colors shrink-0 cursor-pointer"
                >
                  Expand Dossier →
                </button>
              </div>
            </div>

            {/* Detailed Scientific Profile Column */}
            <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between space-y-8 bg-[#141A13]">
              <div className="space-y-6">
                <div>
                  <div className="text-xs font-mono text-[#C6A56A] uppercase tracking-widest">
                    Species 0{selectedSpeciesIndex + 1} of 0{currentSpeciesList.length}
                  </div>
                  <h3 className="text-3xl font-serif text-[#F2EFE5] font-normal tracking-wide mt-1">
                    {activeSpecies.commonName}
                  </h3>
                  <div className="text-xs text-[#A6AA9A] mt-0.5">
                    <span className="italic">{activeSpecies.scientificName}</span>
                    {(activeSpecies.sinhalaName || activeSpecies.swahiliName) && (
                      <span className="ml-1.5 font-sans text-[#C6A56A]/90">
                        · {activeSpecies.sinhalaName || activeSpecies.swahiliName}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-sm text-[#A6AA9A] font-light leading-relaxed">
                  {activeSpecies.identification}
                </p>

                {/* Ecological Metadata (No pills, clean unboxed text) */}
                <div className="border-t border-[#34392F] pt-4 space-y-3 text-xs">
                  <div className="flex justify-between items-baseline gap-2">
                    <span className="text-[#A6AA9A] font-mono uppercase tracking-wider">Habitat</span>
                    <span className="text-[#F2EFE5] text-right font-light">{activeSpecies.habitat}</span>
                  </div>

                  <div className="flex justify-between items-baseline gap-2">
                    <span className="text-[#A6AA9A] font-mono uppercase tracking-wider">Size & Scale</span>
                    <span className="text-[#F2EFE5] font-mono text-right">{activeSpecies.size} · {activeSpecies.wingspan}</span>
                  </div>

                  <div className="flex justify-between items-baseline gap-2">
                    <span className="text-[#A6AA9A] font-mono uppercase tracking-wider">Dietary Niche</span>
                    <span className="text-[#F2EFE5] text-right font-light">{activeSpecies.diet}</span>
                  </div>

                  <div className="flex justify-between items-baseline gap-2">
                    <span className="text-[#C6A56A] font-mono uppercase tracking-wider">Conservation</span>
                    <span className="text-[#F2EFE5] text-right font-light">{activeSpecies.conservationStatus}</span>
                  </div>
                </div>

                {/* Key Adaptation highlight */}
                <div className="p-4 bg-[#101510] border border-[#34392F] rounded text-xs space-y-1.5">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-[#C6A56A]">
                    Key Evolutionary Adaptation
                  </span>
                  <p className="text-[#A6AA9A] font-light leading-relaxed">
                    {activeSpecies.keyAdaptation}
                  </p>
                </div>

                {/* Vocalization & Field Action Row */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={(e) => handlePlayCall(e, activeSpecies.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded text-xs font-mono uppercase tracking-wider transition-all border cursor-pointer ${
                      playingSpeciesId === activeSpecies.id
                        ? 'bg-[#C6A56A] text-[#101510] border-[#C6A56A] font-bold shadow-md'
                        : 'bg-[#101510] hover:bg-[#1D241B] text-[#C6A56A] border-[#C6A56A]/60 hover:border-[#C6A56A]'
                    }`}
                  >
                    {playingSpeciesId === activeSpecies.id ? (
                      <>
                        <Volume2 className="w-4 h-4 animate-pulse text-[#101510]" />
                        <span>Playing Call</span>
                        <span className="flex gap-0.5 items-end h-3 w-3">
                          <span className="w-0.5 h-1 bg-[#101510] animate-pulse" />
                          <span className="w-0.5 h-3 bg-[#101510] animate-pulse" style={{ animationDelay: '120ms' }} />
                          <span className="w-0.5 h-2 bg-[#101510] animate-pulse" style={{ animationDelay: '240ms' }} />
                        </span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4 text-[#C6A56A]" />
                        <span>Listen to Call</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={onNewObservationTask}
                    className="flex items-center gap-1.5 px-3.5 py-2.5 bg-[#101510] hover:bg-[#1D241B] text-[#F2EFE5] border border-[#34392F] hover:border-[#C6A56A]/60 rounded text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#C6A56A]" />
                    <span>Record Sighting</span>
                  </button>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between border-t border-[#34392F] pt-6">
                <button
                  onClick={() =>
                    setSelectedSpeciesIndex((prev) =>
                      prev === 0 ? currentSpeciesList.length - 1 : prev - 1
                    )
                  }
                  className="flex items-center gap-1.5 text-xs text-[#A6AA9A] hover:text-[#C6A56A] transition-colors uppercase font-mono tracking-wider cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={() => setActiveSpeciesModal(activeSpecies)}
                  className="text-xs text-[#C6A56A] hover:underline font-mono uppercase tracking-wider cursor-pointer font-semibold"
                >
                  Expand Full Dossier →
                </button>

                <button
                  onClick={() =>
                    setSelectedSpeciesIndex((prev) =>
                      (prev + 1) % currentSpeciesList.length
                    )
                  }
                  className="flex items-center gap-1.5 text-xs text-[#A6AA9A] hover:text-[#C6A56A] transition-colors uppercase font-mono tracking-wider cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Species Thumbnails Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {currentSpeciesList.map((sp, idx) => (
              <div
                key={sp.id}
                onClick={() => setSelectedSpeciesIndex(idx)}
                className={`cursor-pointer p-3 rounded-lg border transition-all text-left space-y-2.5 relative group ${
                  selectedSpeciesIndex === idx
                    ? 'border-[#C6A56A] bg-[#1D241B] shadow-md ring-1 ring-[#C6A56A]/40'
                    : 'border-[#34392F]/60 bg-[#141A13]/60 hover:border-[#34392F] hover:bg-[#1D241B]/40'
                }`}
              >
                <div className="aspect-[4/3] overflow-hidden rounded relative">
                  <img
                    src={sp.image}
                    alt={sp.commonName}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  {/* Quick Audio preview overlay button */}
                  <button
                    type="button"
                    onClick={(e) => handlePlayCall(e, sp.id)}
                    title={`Listen to ${sp.commonName} call`}
                    className={`absolute bottom-2 right-2 p-1.5 rounded-full backdrop-blur-md transition-all ${
                      playingSpeciesId === sp.id
                        ? 'bg-[#C6A56A] text-[#101510] shadow-md scale-110'
                        : 'bg-black/60 text-[#F2EFE5] hover:bg-[#C6A56A] hover:text-[#101510] opacity-80 group-hover:opacity-100'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-0.5">
                  <div className="text-[10px] font-mono text-[#C6A56A]">0{idx + 1}</div>
                  <div className="text-xs font-serif font-medium text-[#F2EFE5] truncate">
                    {sp.commonName}
                  </div>
                  <div className="text-[11px] text-[#A6AA9A] italic truncate">
                    {sp.scientificName}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 3. SECTION THREE — LIFE AFTER SUNSET */}
      <motion.section
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
        ref={storyRef}
        id="life-after-sunset"
        className="relative py-28 px-6 sm:px-10 lg:px-16 bg-[#1D241B]/80 border-t border-[#34392F] overflow-hidden"
      >
        {/* Full-width atmospheric savanna twilight background */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/wildlife/nocturnal_savanna_landscape_1792256244156.jpg"
            alt="Twilight Serengeti landscape"
            className="w-full h-full object-cover object-center opacity-30"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-[#1D241B]/90" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto space-y-16">
          {/* Editorial Header */}
          <div className="max-w-2xl space-y-3">
            <p className="text-xs tracking-[0.2em] uppercase font-mono text-[#C6A56A]">
              BRACA Nocturnal Observation
            </p>
            <h2 className="text-3xl sm:text-5xl font-serif text-[#F2EFE5] font-normal tracking-tight">
              When the rainforest falls silent.
            </h2>
            <p className="text-sm sm:text-base text-[#A6AA9A] font-light leading-relaxed">
              As daylight fades, another world begins to move. BRACA field biologists listen for distant calls, monitor canopy cavities beneath the dense forest canopy, and investigate the evolutionary adaptations that help owls navigate the rainforest night.
            </p>
          </div>

          {/* Three Visual Storytelling Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {NOCTURNAL_STORY_PANELS.map((panel, idx) => (
              <div
                key={panel.id}
                onClick={() => setActiveStoryPanel(idx)}
                className={`rounded-lg border transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer ${
                  activeStoryPanel === idx
                    ? 'border-[#C6A56A] bg-[#141A13] shadow-lg'
                    : 'border-[#34392F] bg-[#101510]/80 hover:border-[#A6AA9A]/50'
                }`}
              >
                <div className="space-y-6 p-7">
                  <div className="aspect-[16/10] overflow-hidden rounded border border-[#34392F]/60">
                    <img
                      src={panel.image}
                      alt={panel.title}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-mono text-[#C6A56A]">
                      <span>{panel.code}</span>
                      <span aria-hidden="true" className="text-[#34392F]">/</span>
                      <span className="uppercase tracking-widest">{panel.theme}</span>
                    </div>

                    <h3 className="text-xl font-serif text-[#F2EFE5] font-medium leading-snug">
                      {panel.title}
                    </h3>

                    <p className="text-xs text-[#A6AA9A] font-light leading-relaxed">
                      {panel.description}
                    </p>
                  </div>
                </div>

                {/* Key stats strip */}
                <div className="border-t border-[#34392F] bg-[#101510] px-7 py-4 grid grid-cols-3 gap-2 text-center">
                  {panel.keyStats.map((stat, sIdx) => (
                    <div key={sIdx} className="space-y-0.5">
                      <div className="text-[10px] text-[#A6AA9A] uppercase font-mono tracking-wider truncate">
                        {stat.label}
                      </div>
                      <div className="text-xs font-mono text-[#C6A56A] font-semibold">
                        {stat.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 4. SECTION FOUR — THE FIELD JOURNAL */}
      <motion.section
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
        ref={journalRef}
        id="journal"
        className="py-28 px-6 sm:px-10 lg:px-16 bg-[#101510] border-t border-[#34392F]"
      >
        <div className="max-w-7xl mx-auto space-y-14">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#34392F] pb-8">
            <div className="space-y-3 max-w-xl">
              <p className="text-xs tracking-[0.2em] uppercase font-mono text-[#C6A56A]">
                BRACA Field Dispatches &amp; Research
              </p>
              <h2 className="text-3xl sm:text-5xl font-serif text-[#F2EFE5] font-normal tracking-tight">
                Notes from the wild.
              </h2>
              <p className="text-sm text-[#A6AA9A] font-light leading-relaxed">
                Scientific dispatches, sensory anatomy studies, bioacoustics datasets, and ethical observation protocols from BRACA field naturalists in the Serengeti.
              </p>
            </div>

            <button
              onClick={onNewObservationTask}
              className="text-xs font-mono uppercase tracking-wider text-[#C6A56A] hover:text-[#d6b77c] flex items-center gap-2 self-start md:self-auto border border-[#34392F] hover:border-[#C6A56A] px-4 py-2 rounded transition-colors"
            >
              <span>Log Field Observation</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Asymmetric Editorial Article Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {FIELD_JOURNAL_ARTICLES.map((article, idx) => (
              <article
                key={article.id}
                onClick={() => setActiveArticle(article)}
                className="bg-[#141A13] border border-[#34392F] rounded-lg p-6 flex flex-col justify-between space-y-6 hover:border-[#C6A56A]/50 transition-colors cursor-pointer group"
              >
                <div className="space-y-4">
                  {/* Aspect Thumbnail */}
                  <div className="aspect-[16/10] overflow-hidden rounded border border-[#34392F]/60">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-104"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Clean unboxed metadata with typographic separators */}
                  <div className="flex items-center gap-2 text-xs font-mono text-[#A6AA9A]">
                    <span className="text-[#C6A56A]">{article.category}</span>
                    <span aria-hidden="true" className="text-[#34392F]">·</span>
                    <span>{article.readTime}</span>
                    <span aria-hidden="true" className="text-[#34392F]">·</span>
                    <span>{article.date}</span>
                  </div>

                  <h3 className="text-xl font-serif text-[#F2EFE5] group-hover:text-[#C6A56A] transition-colors leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-xs text-[#A6AA9A] font-light leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>
                </div>

                <div className="border-t border-[#34392F] pt-4 flex items-center justify-between text-xs font-mono">
                  <span className="text-[#A6AA9A] truncate max-w-[170px]">{article.author}</span>
                  <span className="text-[#C6A56A] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Read Article</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 5. SECTION FIVE — EXPLORE THE HABITAT */}
      <motion.section
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
        ref={habitatsRef}
        id="habitats"
        className="py-28 px-6 sm:px-10 lg:px-16 bg-[#1D241B]/50 border-t border-[#34392F]"
      >
        <div className="max-w-7xl mx-auto space-y-14">
          {/* Header */}
          <div className="space-y-3 max-w-2xl">
            <p className="text-xs tracking-[0.2em] uppercase font-mono text-[#C6A56A]">
              BRACA Habitat Conservation Matrix
            </p>
            <h2 className="text-3xl sm:text-5xl font-serif text-[#F2EFE5] font-normal tracking-tight">
              Habitats of the Serengeti.
            </h2>
            <p className="text-sm text-[#A6AA9A] font-light leading-relaxed">
              Explore the four principal landscape zones monitored by BRACA that provide critical roosting, nesting, and prey corridors for African owls.
            </p>
          </div>

          {/* Interactive Habitat Tabs & Panoramic Experience */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Habitat List Controls */}
            <div className="lg:col-span-5 space-y-3">
              {SERENGETI_HABITATS.map((hab) => {
                const isSelected = selectedHabitat.id === hab.id;
                return (
                  <button
                    key={hab.id}
                    onClick={() => setSelectedHabitat(hab)}
                    className={`w-full text-left p-5 rounded-lg border transition-all cursor-pointer flex flex-col space-y-2 ${
                      isSelected
                        ? 'border-[#C6A56A] bg-[#141A13] shadow-md'
                        : 'border-[#34392F] bg-[#101510]/80 hover:border-[#34392F]/90 hover:bg-[#1D241B]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-base font-serif text-[#F2EFE5] font-medium">
                        {hab.name}
                      </div>
                      <span className="text-xs font-mono text-[#C6A56A]">
                        {isSelected ? '●' : '○'}
                      </span>
                    </div>

                    <div className="text-xs text-[#A6AA9A] italic">
                      {hab.swahiliName} · {hab.serengetiLocation}
                    </div>

                    <p className="text-xs text-[#A6AA9A] font-light line-clamp-2">
                      {hab.description}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Selected Habitat Deep Dive */}
            <div className="lg:col-span-7 bg-[#141A13] border border-[#34392F] rounded-lg p-8 sm:p-10 flex flex-col justify-between space-y-8">
              <div className="space-y-6">
                <div>
                  <div className="text-xs font-mono text-[#C6A56A] uppercase tracking-widest">
                    Habitat Dossier · {selectedHabitat.serengetiLocation}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif text-[#F2EFE5] mt-1 font-normal">
                    {selectedHabitat.name}
                  </h3>
                </div>

                <p className="text-sm text-[#A6AA9A] font-light leading-relaxed">
                  {selectedHabitat.description}
                </p>

                <div className="space-y-4 border-t border-[#34392F] pt-6 text-xs">
                  <div className="space-y-1">
                    <span className="font-mono text-[#C6A56A] uppercase tracking-wider">
                      Roosting & Cavity Opportunities
                    </span>
                    <p className="text-[#F2EFE5] font-light leading-relaxed">
                      {selectedHabitat.roostingOpportunities}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="font-mono text-[#C6A56A] uppercase tracking-wider">
                      Ecological Context
                    </span>
                    <p className="text-[#F2EFE5] font-light leading-relaxed">
                      {selectedHabitat.ecologicalContext}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="font-mono text-[#C6A56A] uppercase tracking-wider">
                      Characteristic Flora
                    </span>
                    <p className="text-[#A6AA9A] italic font-serif">
                      {selectedHabitat.characteristicFlora}
                    </p>
                  </div>
                </div>
              </div>

              {/* Resident Species Unboxed Chips */}
              <div className="border-t border-[#34392F] pt-6">
                <span className="text-xs font-mono text-[#A6AA9A] uppercase tracking-wider block mb-2">
                  Resident & Foraging Species
                </span>
                <div className="flex flex-wrap gap-2 text-xs">
                  {selectedHabitat.residentSpecies.map((spName, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-3 py-1 bg-[#101510] border border-[#34392F] text-[#F2EFE5] font-mono text-[11px]"
                    >
                      {spName}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 6. SECTION SIX — A CLOSING WILDLIFE STATEMENT */}
      <motion.section
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        transition={{ duration: reduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
        ref={closingRef}
        id="about"
        className="relative py-32 px-6 sm:px-10 lg:px-16 bg-[#101510] border-t border-[#34392F] overflow-hidden"
      >
        {/* High-detail owl face emerging from nocturnal shadow */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/wildlife/owl_close_up_night_closing_1792256244113.jpg"
            alt="African Owl eyes in darkness"
            className="w-full h-full object-cover object-right lg:object-center opacity-40 lg:opacity-60"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#101510] via-[#101510]/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#101510] via-transparent to-[#101510]/60" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto space-y-12">
          {/* Get Involved & Make A Difference Banner Card */}
          <div className="bg-[#141A13]/95 text-[#F2EFE5] rounded-3xl p-8 sm:p-12 lg:p-14 shadow-2xl border border-[#34392F] backdrop-blur-md">
            <div className="text-center max-w-2xl mx-auto space-y-3.5">
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#C6A56A]">
                Direct Conservation Action
              </p>
              <h2 className="text-3xl sm:text-5xl font-serif font-normal tracking-tight text-[#F2EFE5]">
                Get Involved &amp; <span className="text-[#C6A56A] italic">Make A Difference</span>
              </h2>
              <p className="text-sm sm:text-base text-[#A6AA9A] font-light leading-relaxed">
                Join our mission to protect Sri Lanka’s endemic owls and nocturnal biodiversity. Whether through field volunteering, membership, or direct project support, your backing drives empirical conservation impact.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10">
              {/* 1. Volunteers Card */}
              <button
                type="button"
                onClick={() => {
                  setVolunteerSubmitted(false);
                  setIsVolunteerModalOpen(true);
                }}
                className="bg-[#101510] hover:bg-[#1D241B] text-left p-6 rounded-2xl shadow-sm hover:shadow-md border border-[#34392F] hover:border-[#C6A56A]/60 transition-all flex flex-col justify-between gap-6 cursor-pointer group"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-[#C6A56A]/15 border border-[#C6A56A]/30 flex items-center justify-center text-[#C6A56A] shrink-0 group-hover:scale-105 transition-transform">
                    <HandHeart className="w-6 h-6" strokeWidth={1.85} />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif font-medium text-[#F2EFE5] group-hover:text-[#C6A56A] transition-colors">
                      Volunteers
                    </h3>
                    <p className="text-xs text-[#A6AA9A] mt-1 font-light leading-relaxed">
                      Participate in nocturnal forest transects, camera-trapping &amp; audio tagging.
                    </p>
                  </div>
                </div>
                <div className="flex items-center text-xs font-mono text-[#C6A56A] gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Apply to Volunteer</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>

              {/* 2. Membership Card */}
              <button
                type="button"
                onClick={() => {
                  setMembershipSubmitted(false);
                  setIsMembershipModalOpen(true);
                }}
                className="bg-[#101510] hover:bg-[#1D241B] text-left p-6 rounded-2xl shadow-sm hover:shadow-md border border-[#34392F] hover:border-[#4A69BD]/60 transition-all flex flex-col justify-between gap-6 cursor-pointer group"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-[#4A69BD]/15 border border-[#4A69BD]/30 flex items-center justify-center text-[#4A69BD] shrink-0 group-hover:scale-105 transition-transform">
                    <Crown className="w-6 h-6" strokeWidth={1.85} />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif font-medium text-[#F2EFE5] group-hover:text-[#7d9ff5] transition-colors">
                      Membership
                    </h3>
                    <p className="text-xs text-[#A6AA9A] mt-1 font-light leading-relaxed">
                      Become a recognized ally of the BRACA conservation network with research access.
                    </p>
                  </div>
                </div>
                <div className="flex items-center text-xs font-mono text-[#7d9ff5] gap-1 group-hover:translate-x-1 transition-transform">
                  <span>View Member Tiers</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>

              {/* 3. Direct Support / Donate Card */}
              <button
                type="button"
                onClick={onDonationClick}
                className="bg-[#101510] hover:bg-[#1D241B] text-left p-6 rounded-2xl shadow-sm hover:shadow-md border border-[#34392F] hover:border-emerald-500/60 transition-all flex flex-col justify-between gap-6 cursor-pointer group"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
                    <Heart className="w-6 h-6 fill-current" strokeWidth={1.85} />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif font-medium text-[#F2EFE5] group-hover:text-emerald-400 transition-colors">
                      Support Research
                    </h3>
                    <p className="text-xs text-[#A6AA9A] mt-1 font-light leading-relaxed">
                      Directly fund acoustic loggers, veterinary medicines &amp; habitat corridors.
                    </p>
                  </div>
                </div>
                <div className="flex items-center text-xs font-mono text-emerald-400 gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Make a Contribution</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          </div>

          {/* Editorial Closing & Navigation Links */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4 border-t border-[#34392F]/60 text-xs text-[#A6AA9A]">
            <div className="space-y-1 text-center md:text-left">
              <p className="text-xs tracking-[0.2em] font-mono uppercase text-[#C6A56A]">
                BRACA Nocturnal Sanctuary · Beyond the Light
              </p>
              <p className="text-sm text-[#F2EFE5] font-serif font-light">
                The night has its own stories. Discover the wild under empirical field research.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <button
                onClick={() => scrollToSection(heroRef)}
                className="px-6 py-2.5 bg-[#C6A56A] hover:bg-[#d8b87d] text-[#101510] text-xs font-bold tracking-[0.14em] uppercase rounded transition-all shadow-md active:scale-95 cursor-pointer"
              >
                Top of Field
              </button>
              <button
                onClick={() => scrollToSection(speciesRef)}
                className="px-6 py-2.5 bg-transparent hover:bg-[#1D241B] border border-[#34392F] hover:border-[#C6A56A]/60 text-[#F2EFE5] text-xs font-medium tracking-[0.14em] uppercase rounded transition-colors cursor-pointer"
              >
                Species Archive
              </button>
              <button
                onClick={() => scrollToSection(journalRef)}
                className="px-6 py-2.5 bg-transparent hover:bg-[#1D241B] border border-[#34392F] hover:border-[#C6A56A]/60 text-[#F2EFE5] text-xs font-medium tracking-[0.14em] uppercase rounded transition-colors cursor-pointer"
              >
                Field Journal
              </button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 7. FOOTER */}
      <footer className="bg-[#0b0f0b] border-t border-[#34392F] text-xs text-[#A6AA9A]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Manifesto */}
          <div className="space-y-3 sm:col-span-2 lg:col-span-1">
            <span className="text-xl font-serif font-bold tracking-[0.24em] text-[#F2EFE5] block">
              BRACA
            </span>
            <p className="text-[11px] font-mono uppercase tracking-wider text-[#C6A56A]">
              Biodiversity Research and Conservation Alliance
            </p>
            <p className="text-xs text-[#A6AA9A] font-light leading-relaxed">
              Dedicated to empirical research, bioacoustics, and protecting critical habitats of Sri Lanka's wildlife across the southwestern wet-zone forests, cloud canopies, and freshwater ecosystems.
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-mono uppercase tracking-widest text-[#C6A56A]">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => scrollToSection(heroRef)}
                  className="hover:text-[#F2EFE5] transition-colors"
                >
                  Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection(speciesRef)}
                  className="hover:text-[#F2EFE5] transition-colors"
                >
                  Species Dossiers
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection(storyRef)}
                  className="hover:text-[#F2EFE5] transition-colors"
                >
                  Life After Sunset
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection(habitatsRef)}
                  className="hover:text-[#F2EFE5] transition-colors"
                >
                  Serengeti Habitats
                </button>
              </li>
            </ul>
          </div>

          {/* Research & Observation */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-mono uppercase tracking-widest text-[#C6A56A]">
              Field Logistics
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenFieldOps}
                  className="hover:text-[#F2EFE5] transition-colors"
                >
                  Field Observation Board
                </button>
              </li>
              <li>
                <button
                  onClick={onNewObservationTask}
                  className="hover:text-[#F2EFE5] transition-colors"
                >
                  Record Sighting / Acoustic Log
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection(journalRef)}
                  className="hover:text-[#F2EFE5] transition-colors"
                >
                  Research Papers & Notes
                </button>
              </li>
            </ul>
          </div>

          {/* Scientific Disclaimer */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-mono uppercase tracking-widest text-[#C6A56A]">
              Ecological Integrity
            </h4>
            <p className="text-[11px] text-[#A6AA9A] font-light leading-relaxed">
              No live telemetry or exact nesting tree coordinates are disclosed to prevent disturbance to roosting raptors and vulnerable wildlife.
            </p>
          </div>
        </div>

        {/* Quiet Copyright Bar */}
        <div className="border-t border-[#34392F]/60 py-6 px-6 sm:px-10 lg:px-16 text-center font-mono text-[11px] text-[#A6AA9A]/80">
          BRACA · BIODIVERSITY RESEARCH AND CONSERVATION ALLIANCE · SERENGETI NOCTURNAL OWL INITIATIVE · ALL RIGHTS RESERVED
        </div>
      </footer>

      {/* MODAL: Species Detailed Dossier */}
      {activeSpeciesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#141A13] border border-[#34392F] rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="relative aspect-[16/9] overflow-hidden border-b border-[#34392F]">
              <img
                src={activeSpeciesModal.image}
                alt={activeSpeciesModal.commonName}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={() => setActiveSpeciesModal(null)}
                className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black text-white rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-4 left-6 right-6">
                <span className="text-xs font-mono text-[#C6A56A] uppercase tracking-wider">
                  {activeSpeciesModal.scientificName}
                  {(activeSpeciesModal.sinhalaName || activeSpeciesModal.swahiliName) && (
                    <span className="font-sans ml-2 text-white/90">
                      · {activeSpeciesModal.sinhalaName || activeSpeciesModal.swahiliName}
                    </span>
                  )}
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif text-white">
                  {activeSpeciesModal.commonName}
                </h3>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase text-[#C6A56A] tracking-wider">
                  Physical Characteristics & Camouflage
                </span>
                <p className="text-xs sm:text-sm text-[#F2EFE5] font-light leading-relaxed">
                  {activeSpeciesModal.identification}
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono uppercase text-[#C6A56A] tracking-wider">
                  Behavior & Ecology
                </span>
                <p className="text-xs sm:text-sm text-[#A6AA9A] font-light leading-relaxed">
                  {activeSpeciesModal.behavior}
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono uppercase text-[#C6A56A] tracking-wider">
                  Vocal Signature &amp; Acoustics
                </span>
                <p className="text-xs sm:text-sm text-[#A6AA9A] font-light leading-relaxed">
                  {activeSpeciesModal.vocalizations}
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={(e) => handlePlayCall(e, activeSpeciesModal.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded text-xs font-mono uppercase tracking-wider transition-all border cursor-pointer ${
                      playingSpeciesId === activeSpeciesModal.id
                        ? 'bg-[#C6A56A] text-[#101510] border-[#C6A56A] font-bold shadow-sm'
                        : 'bg-[#101510] hover:bg-[#1D241B] text-[#C6A56A] border-[#C6A56A]/60'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{playingSpeciesId === activeSpeciesModal.id ? 'Stop Vocal Call' : 'Play Bioacoustic Call'}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-[#34392F] pt-4 text-xs font-mono">
                <div>
                  <span className="text-[#A6AA9A] block">Dietary Prey</span>
                  <span className="text-[#F2EFE5] font-sans font-light mt-0.5 block">{activeSpeciesModal.diet}</span>
                </div>
                <div>
                  <span className="text-[#A6AA9A] block">Distribution &amp; Range</span>
                  <span className="text-[#F2EFE5] font-sans font-light mt-0.5 block">
                    {activeSpeciesModal.distribution || activeSpeciesModal.serengetiPresence}
                  </span>
                </div>
              </div>

              {activeSpeciesModal.doi && (
                <div className="border-t border-[#34392F] pt-4 text-xs font-mono flex items-center justify-between">
                  <span className="text-[#A6AA9A]">Scientific Reference</span>
                  <a
                    href={activeSpeciesModal.doi}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#C6A56A] hover:underline"
                  >
                    View Birds of the World Entry ↗
                  </a>
                </div>
              )}

              <div className="pt-4 flex items-center justify-between border-t border-[#34392F]">
                <button
                  type="button"
                  onClick={() => {
                    setActiveSpeciesModal(null);
                    onNewObservationTask();
                  }}
                  className="px-4 py-2 bg-transparent hover:bg-[#1D241B] border border-[#34392F] hover:border-[#C6A56A] text-[#F2EFE5] text-xs font-mono uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#C6A56A]" />
                  <span>Log Sighting</span>
                </button>
                <button
                  onClick={() => setActiveSpeciesModal(null)}
                  className="px-6 py-2.5 bg-[#C6A56A] hover:bg-[#d8b87d] text-[#101510] text-xs font-mono uppercase tracking-wider font-semibold rounded cursor-pointer"
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Full Article Reader */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#141A13] border border-[#34392F] rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-10 space-y-8">
            <div className="flex items-start justify-between gap-4 border-b border-[#34392F] pb-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-[#C6A56A]">
                  <span>{activeArticle.category}</span>
                  <span aria-hidden="true" className="text-[#34392F]">·</span>
                  <span>{activeArticle.readTime}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif text-[#F2EFE5]">
                  {activeArticle.title}
                </h3>
                <p className="text-xs text-[#A6AA9A] italic">
                  By {activeArticle.author} ({activeArticle.authorRole}) · {activeArticle.date}
                </p>
              </div>

              <button
                onClick={() => setActiveArticle(null)}
                className="p-2 text-[#A6AA9A] hover:text-white rounded-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-[16/9] overflow-hidden rounded border border-[#34392F]">
              <img
                src={activeArticle.image}
                alt={activeArticle.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="space-y-4 text-sm text-[#F2EFE5]/90 font-light leading-relaxed">
              {activeArticle.content.map((paragraph, pIdx) => (
                <p key={pIdx}>{paragraph}</p>
              ))}
            </div>

            {/* Key Takeaways */}
            <div className="bg-[#101510] border border-[#34392F] p-5 rounded space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-widest text-[#C6A56A]">
                Key Ecological Takeaways
              </h4>
              <ul className="space-y-2 text-xs text-[#A6AA9A] font-light">
                {activeArticle.keyTakeaways.map((point, kIdx) => (
                  <li key={kIdx} className="flex items-start gap-2">
                    <span className="text-[#C6A56A] font-mono">0{kIdx + 1}.</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {activeArticle.scientificRef && (
              <div className="text-xs font-mono text-[#A6AA9A] border-t border-[#34392F] pt-4">
                Citation: {activeArticle.scientificRef}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveArticle(null)}
                className="px-6 py-2.5 bg-[#C6A56A] hover:bg-[#d8b87d] text-[#101510] text-xs font-mono uppercase tracking-wider font-semibold rounded"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Volunteers */}
      {isVolunteerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#141A13] border border-[#34392F] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 text-[#F2EFE5]">
            <div className="flex items-start justify-between gap-4 border-b border-[#34392F] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#C4742B]/15 border border-[#C4742B]/30 flex items-center justify-center text-[#C4742B]">
                  <HandHeart className="w-6 h-6" strokeWidth={1.85} />
                </div>
                <div>
                  <h3 className="text-2xl font-serif text-[#F2EFE5]">Volunteer with BRACA</h3>
                  <p className="text-xs text-[#A6AA9A] font-light">Make a tangible difference for Sri Lanka’s wildlife</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsVolunteerModalOpen(false);
                  setVolunteerSubmitted(false);
                }}
                className="p-2 text-[#A6AA9A] hover:text-white rounded-md transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!volunteerSubmitted ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setVolunteerSubmitted(true);
                }}
                className="space-y-5"
              >
                <p className="text-sm text-[#A6AA9A] leading-relaxed">
                  BRACA deploys volunteer field teams across the southwestern wet-zone rainforests, Knuckles conservation range, and riverine networks. Select your primary area of contribution:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-lg border border-[#34392F] bg-[#101510] space-y-1">
                    <span className="font-semibold text-[#C6A56A] block">🌿 Field Research &amp; Surveys</span>
                    <p className="text-[#A6AA9A]">Nocturnal transects, camera-traps &amp; wet-zone owl surveys in Kitulgala.</p>
                  </div>
                  <div className="p-3.5 rounded-lg border border-[#34392F] bg-[#101510] space-y-1">
                    <span className="font-semibold text-[#C6A56A] block">🎧 Bioacoustic Sound Tagging</span>
                    <p className="text-[#A6AA9A]">Analyze spectrograms and acoustic recordings from remote rainforest loggers.</p>
                  </div>
                  <div className="p-3.5 rounded-lg border border-[#34392F] bg-[#101510] space-y-1">
                    <span className="font-semibold text-[#C6A56A] block">🌳 Forest Corridors &amp; Trees</span>
                    <p className="text-[#A6AA9A]">Habitat reforestation and micro-corridor planting for endemic species.</p>
                  </div>
                  <div className="p-3.5 rounded-lg border border-[#34392F] bg-[#101510] space-y-1">
                    <span className="font-semibold text-[#C6A56A] block">📢 Community &amp; Schools</span>
                    <p className="text-[#A6AA9A]">Wild coexistence awareness workshops in buffer zone villages.</p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#C6A56A] mb-1">
                      Full Name
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Kasun Perera"
                      className="w-full px-3.5 py-2.5 rounded bg-[#101510] border border-[#34392F] text-sm text-[#F2EFE5] focus:outline-none focus:border-[#C6A56A]"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#C6A56A] mb-1">
                        Email Address
                      </label>
                      <input
                        required
                        type="email"
                        placeholder="kasun@example.com"
                        className="w-full px-3.5 py-2.5 rounded bg-[#101510] border border-[#34392F] text-sm text-[#F2EFE5] focus:outline-none focus:border-[#C6A56A]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#C6A56A] mb-1">
                        Area of Focus
                      </label>
                      <select
                        className="w-full px-3.5 py-2.5 rounded bg-[#101510] border border-[#34392F] text-sm text-[#F2EFE5] focus:outline-none focus:border-[#C6A56A]"
                      >
                        <option value="field">Field Research &amp; Surveys</option>
                        <option value="audio">Bioacoustics &amp; Sound Tagging</option>
                        <option value="corridors">Forest Corridors &amp; Reforestation</option>
                        <option value="community">Community &amp; School Outreach</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#34392F]">
                  <button
                    type="button"
                    onClick={() => setIsVolunteerModalOpen(false)}
                    className="px-5 py-2 text-xs font-mono uppercase text-[#A6AA9A] hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#C4742B] hover:bg-[#b06522] text-white text-xs font-bold tracking-wider uppercase rounded shadow-md transition-all cursor-pointer"
                  >
                    Submit Volunteer Application
                  </button>
                </div>
              </form>
            ) : (
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#508232]/20 border border-[#508232] text-[#84C255] flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-xl font-serif text-[#F2EFE5]">Thank You for Joining Hands</h4>
                <p className="text-sm text-[#A6AA9A] max-w-md mx-auto leading-relaxed">
                  Your volunteer submission has been recorded. The BRACA field operations coordinator will contact you with the upcoming expedition schedule and onboarding details.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setIsVolunteerModalOpen(false);
                      setVolunteerSubmitted(false);
                    }}
                    className="px-6 py-2 bg-[#C6A56A] text-[#101510] text-xs font-mono uppercase tracking-wider font-semibold rounded cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: Membership */}
      {isMembershipModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#141A13] border border-[#34392F] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 text-[#F2EFE5]">
            <div className="flex items-start justify-between gap-4 border-b border-[#34392F] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#4A69BD]/15 border border-[#4A69BD]/30 flex items-center justify-center text-[#4A69BD]">
                  <Crown className="w-6 h-6" strokeWidth={1.85} />
                </div>
                <div>
                  <h3 className="text-2xl font-serif text-[#F2EFE5]">BRACA Membership</h3>
                  <p className="text-xs text-[#A6AA9A] font-light">Become part of the BRACA conservation family</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsMembershipModalOpen(false);
                  setMembershipSubmitted(false);
                }}
                className="p-2 text-[#A6AA9A] hover:text-white rounded-md transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!membershipSubmitted ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setMembershipSubmitted(true);
                }}
                className="space-y-5"
              >
                <p className="text-sm text-[#A6AA9A] leading-relaxed">
                  As a BRACA member, you directly fund biodiversity surveys, bioacoustic monitoring networks, and habitat protection across Sri Lanka.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-4 rounded-xl border border-[#34392F] bg-[#101510] space-y-2 hover:border-[#4A69BD] transition-colors cursor-pointer">
                    <div className="text-[#4A69BD] font-mono text-[11px] uppercase tracking-wider">Student Tier</div>
                    <div className="text-lg font-serif font-bold text-[#F2EFE5]">LKR 1,500<span className="text-xs text-[#A6AA9A] font-normal">/yr</span></div>
                    <p className="text-[#A6AA9A] text-[11px] leading-relaxed">Student field webinars, digital newsletter &amp; research archives.</p>
                  </div>
                  <div className="p-4 rounded-xl border-2 border-[#4A69BD] bg-[#101510] space-y-2 relative">
                    <div className="absolute -top-2.5 right-3 bg-[#4A69BD] text-white text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full">Recommended</div>
                    <div className="text-[#4A69BD] font-mono text-[11px] uppercase tracking-wider">Active Member</div>
                    <div className="text-lg font-serif font-bold text-[#F2EFE5]">LKR 5,000<span className="text-xs text-[#A6AA9A] font-normal">/yr</span></div>
                    <p className="text-[#A6AA9A] text-[11px] leading-relaxed">Quarterly journal, field expedition invites &amp; voting rights.</p>
                  </div>
                  <div className="p-4 rounded-xl border border-[#34392F] bg-[#101510] space-y-2 hover:border-[#4A69BD] transition-colors cursor-pointer">
                    <div className="text-[#4A69BD] font-mono text-[11px] uppercase tracking-wider">Patron Tier</div>
                    <div className="text-lg font-serif font-bold text-[#F2EFE5]">LKR 15,000<span className="text-xs text-[#A6AA9A] font-normal">/yr</span></div>
                    <p className="text-[#A6AA9A] text-[11px] leading-relaxed">Sponsor acoustic monitoring units &amp; attend annual summit.</p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#C6A56A] mb-1">
                      Full Name
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Dr. Anura Senanayake"
                      className="w-full px-3.5 py-2.5 rounded bg-[#101510] border border-[#34392F] text-sm text-[#F2EFE5] focus:outline-none focus:border-[#4A69BD]"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#C6A56A] mb-1">
                        Email Address
                      </label>
                      <input
                        required
                        type="email"
                        placeholder="anura@example.com"
                        className="w-full px-3.5 py-2.5 rounded bg-[#101510] border border-[#34392F] text-sm text-[#F2EFE5] focus:outline-none focus:border-[#4A69BD]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#C6A56A] mb-1">
                        Selected Tier
                      </label>
                      <select
                        defaultValue="active"
                        className="w-full px-3.5 py-2.5 rounded bg-[#101510] border border-[#34392F] text-sm text-[#F2EFE5] focus:outline-none focus:border-[#4A69BD]"
                      >
                        <option value="student">Student Member (LKR 1,500/yr)</option>
                        <option value="active">Active Conservationist (LKR 5,000/yr)</option>
                        <option value="patron">Research Fellow / Patron (LKR 15,000/yr)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#34392F]">
                  <button
                    type="button"
                    onClick={() => setIsMembershipModalOpen(false)}
                    className="px-5 py-2 text-xs font-mono uppercase text-[#A6AA9A] hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#4A69BD] hover:bg-[#3b55a0] text-white text-xs font-bold tracking-wider uppercase rounded shadow-md transition-all cursor-pointer"
                  >
                    Join the BRACA Family
                  </button>
                </div>
              </form>
            ) : (
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#508232]/20 border border-[#508232] text-[#84C255] flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="text-xl font-serif text-[#F2EFE5]">Welcome to the BRACA Family</h4>
                <p className="text-sm text-[#A6AA9A] max-w-md mx-auto leading-relaxed">
                  Your membership registration has been received. You will receive an official BRACA welcome packet and membership credentials via email.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setIsMembershipModalOpen(false);
                      setMembershipSubmitted(false);
                    }}
                    className="px-6 py-2 bg-[#C6A56A] text-[#101510] text-xs font-mono uppercase tracking-wider font-semibold rounded cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
