/**
 * BRACA Bioacoustics Audio Synthesizer & Soundscape Engine
 * Native Web Audio API synthesis for nocturnal species calls and ambient night soundscapes.
 * No external media dependencies required; 100% offline-ready & sandbox-safe.
 */

class BioacousticsEngine {
  private ctx: AudioContext | null = null;
  private currentPlayingId: string | null = null;
  private stopActiveSound: (() => void) | null = null;
  private isAmbiencePlaying: boolean = false;
  private stopAmbience: (() => void) | null = null;
  private listeners: Set<(speciesId: string | null, isAmbience: boolean) => void> = new Set();

  private getContext(): AudioContext {
    if (!this.ctx || this.ctx.state === 'closed') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public subscribe(listener: (speciesId: string | null, isAmbience: boolean) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l(this.currentPlayingId, this.isAmbiencePlaying));
  }

  public getActiveSpeciesId(): string | null {
    return this.currentPlayingId;
  }

  public isAmbienceActive(): boolean {
    return this.isAmbiencePlaying;
  }

  /**
   * Stop any active species vocalization playback
   */
  public stopCall() {
    if (this.stopActiveSound) {
      try {
        this.stopActiveSound();
      } catch {
        // Ignore
      }
      this.stopActiveSound = null;
    }
    this.currentPlayingId = null;
    this.notify();
  }

  /**
   * Play synthesized authentic species vocalization by ID
   */
  public playSpeciesCall(speciesId: string) {
    // If currently playing the same species, toggle off
    if (this.currentPlayingId === speciesId) {
      this.stopCall();
      return;
    }

    this.stopCall();
    const ctx = this.getContext();
    this.currentPlayingId = speciesId;
    this.notify();

    let isStopped = false;
    const activeNodes: (AudioNode | number)[] = [];

    const cleanup = () => {
      isStopped = true;
      activeNodes.forEach((node) => {
        if (typeof node === 'number') {
          clearTimeout(node);
        } else {
          try {
            (node as any).stop?.();
            node.disconnect();
          } catch {
            // ignore
          }
        }
      });
      if (this.currentPlayingId === speciesId) {
        this.currentPlayingId = null;
        this.notify();
      }
    };

    this.stopActiveSound = cleanup;

    // Synthesize based on species acoustic profile
    try {
      switch (speciesId) {
        case 'chestnut-backed-owlet':
          // Rapid sharp staccato "kraw-kraw" piping at ~780Hz with pitch slide
          this.synthesizeOwletStaccato(ctx, activeNodes, cleanup);
          break;

        case 'sri-lanka-bay-owl':
          // Quavering, eerie rising-falling mournful whistle at ~680Hz
          this.synthesizeBayOwlWhistle(ctx, activeNodes, cleanup);
          break;

        case 'indian-scops-owl':
        case 'species_indian_scops_owl':
          // Ascending hollow resonant hoot ~440-480Hz repeated
          this.synthesizeScopsOwlHoot(ctx, activeNodes, cleanup);
          break;

        case 'brown-fish-owl':
        case 'species_brown_fish_owl':
          // Deep booming low-frequency two-tone "boom-oh-boom" ~160-220Hz
          this.synthesizeFishOwlBoom(ctx, activeNodes, cleanup);
          break;

        case 'african-barn-owl':
        case 'species_african_barn_owl':
          // Harsh, dry rasping shriek / white-noise hiss scream
          this.synthesizeBarnOwlScreech(ctx, activeNodes, cleanup);
          break;

        case 'african-scops-owl':
        case 'species_african_scops_owl':
          // Rhythmic metallic "prrrp... prrrp" rolling trill
          this.synthesizeAfricanScopsTrill(ctx, activeNodes, cleanup);
          break;

        case 'pearl-spotted-owlet':
        case 'species_pearl_spotted_owlet':
          // Accelerating series of clear musical whistles ~900-1100Hz
          this.synthesizePearlSpottedWhistles(ctx, activeNodes, cleanup);
          break;

        case 'verreaux-eagle-owl':
        case 'species_verreaux_eagle_owl':
          // Low resonant double-grunt "hu-huuu" at 110Hz sub-bass
          this.synthesizeEagleOwlGrunt(ctx, activeNodes, cleanup);
          break;

        case 'nile-monitor':
        case 'african-bullfrog':
          // Guttural low reptile roar/bellow ~95-180Hz
          this.synthesizeReptilianBellow(ctx, activeNodes, cleanup);
          break;

        case 'mwanza-flat-headed-agama':
        case 'leopard-tortoise':
          // Savanna insect & scrub rustling clicks
          this.synthesizeSavannaClicks(ctx, activeNodes, cleanup);
          break;

        case 'mara-cichlids':
        case 'african-sharptooth-catfish':
          // Underwater riverine resonance & acoustic pulse
          this.synthesizeAquaticPulse(ctx, activeNodes, cleanup);
          break;

        default:
          // Generic resonant forest owl hoot
          this.synthesizeScopsOwlHoot(ctx, activeNodes, cleanup);
          break;
      }
    } catch {
      cleanup();
    }
  }

  // --- Acoustic Synthesis Recipes ---

  private synthesizeOwletStaccato(ctx: AudioContext, active: any[], onDone: () => void) {
    const notes = [780, 810, 840, 800, 780];
    let noteTime = ctx.currentTime + 0.05;

    for (let r = 0; r < 2; r++) {
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.92, noteTime + 0.12);

        gain.gain.setValueAtTime(0, noteTime);
        gain.gain.linearRampToValueAtTime(0.22, noteTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.13);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.14);
        active.push(osc);

        noteTime += 0.18;
      });
      noteTime += 0.4;
    }

    const t = setTimeout(onDone, (noteTime - ctx.currentTime + 0.2) * 1000);
    active.push(t);
  }

  private synthesizeBayOwlWhistle(ctx: AudioContext, active: any[], onDone: () => void) {
    const start = ctx.currentTime + 0.05;
    const osc = ctx.createOscillator();
    const vibrato = ctx.createOscillator();
    const vibratoGain = ctx.createGain();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(640, start);
    osc.frequency.exponentialRampToValueAtTime(740, start + 0.9);
    osc.frequency.exponentialRampToValueAtTime(610, start + 1.8);

    // Eerie quavering vibrato
    vibrato.frequency.setValueAtTime(5.5, start);
    vibratoGain.gain.setValueAtTime(22, start);
    vibrato.connect(osc.frequency);

    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.28, start + 0.3);
    gain.gain.setValueAtTime(0.28, start + 1.3);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 2.0);

    osc.connect(gain);
    gain.connect(ctx.destination);

    vibrato.start(start);
    osc.start(start);
    vibrato.stop(start + 2.1);
    osc.stop(start + 2.1);

    active.push(osc, vibrato);
    const t = setTimeout(onDone, 2300);
    active.push(t);
  }

  private synthesizeScopsOwlHoot(ctx: AudioContext, active: any[], onDone: () => void) {
    const hoots = [440, 470, 450];
    let time = ctx.currentTime + 0.05;

    hoots.forEach((freq) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq * 0.95, time);
      osc.frequency.exponentialRampToValueAtTime(freq, time + 0.08);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.9, time + 0.35);

      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.3, time + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.38);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(time);
      osc.stop(time + 0.4);
      active.push(osc);
      time += 0.65;
    });

    const t = setTimeout(onDone, (time - ctx.currentTime + 0.1) * 1000);
    active.push(t);
  }

  private synthesizeFishOwlBoom(ctx: AudioContext, active: any[], onDone: () => void) {
    const start = ctx.currentTime + 0.05;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    // Deep sub-bass boom
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(175, start);
    osc1.frequency.exponentialRampToValueAtTime(140, start + 0.7);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(350, start);
    osc2.frequency.exponentialRampToValueAtTime(280, start + 0.6);

    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.35, start + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.9);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(start);
    osc2.start(start);
    osc1.stop(start + 0.95);
    osc2.stop(start + 0.95);

    // Second boom echo
    const echoStart = start + 1.1;
    const echoOsc = ctx.createOscillator();
    const echoGain = ctx.createGain();
    echoOsc.type = 'sine';
    echoOsc.frequency.setValueAtTime(155, echoStart);
    echoOsc.frequency.exponentialRampToValueAtTime(130, echoStart + 0.8);

    echoGain.gain.setValueAtTime(0, echoStart);
    echoGain.gain.linearRampToValueAtTime(0.28, echoStart + 0.08);
    echoGain.gain.exponentialRampToValueAtTime(0.001, echoStart + 0.95);

    echoOsc.connect(echoGain);
    echoGain.connect(ctx.destination);

    echoOsc.start(echoStart);
    echoOsc.stop(echoStart + 1.0);

    active.push(osc1, osc2, echoOsc);
    const t = setTimeout(onDone, 2400);
    active.push(t);
  }

  private synthesizeBarnOwlScreech(ctx: AudioContext, active: any[], onDone: () => void) {
    const bufferSize = ctx.sampleRate * 1.5;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2600, ctx.currentTime);
    filter.Q.setValueAtTime(3.8, ctx.currentTime);

    const gain = ctx.createGain();
    const start = ctx.currentTime + 0.05;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.25, start + 0.15);
    gain.gain.setValueAtTime(0.25, start + 0.8);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 1.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(start);
    noise.stop(start + 1.45);

    active.push(noise);
    const t = setTimeout(onDone, 1600);
    active.push(t);
  }

  private synthesizeAfricanScopsTrill(ctx: AudioContext, active: any[], onDone: () => void) {
    let time = ctx.currentTime + 0.05;
    for (let p = 0; p < 3; p++) {
      for (let t = 0; t < 6; t++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(560 + t * 15, time);

        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.18, time + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.045);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + 0.05);
        active.push(osc);
        time += 0.05;
      }
      time += 0.45;
    }

    const t = setTimeout(onDone, (time - ctx.currentTime + 0.2) * 1000);
    active.push(t);
  }

  private synthesizePearlSpottedWhistles(ctx: AudioContext, active: any[], onDone: () => void) {
    const freqs = [820, 860, 910, 970, 1040, 1100, 1020, 940];
    let time = ctx.currentTime + 0.05;

    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, time);

      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.2, time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + 0.13);
      active.push(osc);
      time += 0.14 - i * 0.005; // accelerating tempo
    });

    const t = setTimeout(onDone, (time - ctx.currentTime + 0.2) * 1000);
    active.push(t);
  }

  private synthesizeEagleOwlGrunt(ctx: AudioContext, active: any[], onDone: () => void) {
    const start = ctx.currentTime + 0.05;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(115, start);
    osc.frequency.exponentialRampToValueAtTime(95, start + 0.4);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(260, start);

    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.3, start + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.5);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(start);
    osc.stop(start + 0.55);

    // Second deep note
    const s2 = start + 0.65;
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(105, s2);
    osc2.frequency.exponentialRampToValueAtTime(80, s2 + 0.7);

    const filter2 = ctx.createBiquadFilter();
    filter2.type = 'lowpass';
    filter2.frequency.setValueAtTime(220, s2);

    gain2.gain.setValueAtTime(0, s2);
    gain2.gain.linearRampToValueAtTime(0.35, s2 + 0.06);
    gain2.gain.exponentialRampToValueAtTime(0.001, s2 + 0.85);

    osc2.connect(filter2);
    filter2.connect(gain2);
    gain2.connect(ctx.destination);

    osc2.start(s2);
    osc2.stop(s2 + 0.9);

    active.push(osc, osc2);
    const t = setTimeout(onDone, 1800);
    active.push(t);
  }

  private synthesizeReptilianBellow(ctx: AudioContext, active: any[], onDone: () => void) {
    const start = ctx.currentTime + 0.05;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(90, start);
    osc.frequency.exponentialRampToValueAtTime(75, start + 0.8);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(180, start);

    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.28, start + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 1.2);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(start);
    osc.stop(start + 1.25);

    active.push(osc);
    const t = setTimeout(onDone, 1400);
    active.push(t);
  }

  private synthesizeSavannaClicks(ctx: AudioContext, active: any[], onDone: () => void) {
    let time = ctx.currentTime + 0.05;
    for (let i = 0; i < 5; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(2200 + Math.random() * 400, time);

      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.12, time + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.025);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + 0.03);
      active.push(osc);
      time += 0.08 + Math.random() * 0.06;
    }

    const t = setTimeout(onDone, 1000);
    active.push(t);
  }

  private synthesizeAquaticPulse(ctx: AudioContext, active: any[], onDone: () => void) {
    const start = ctx.currentTime + 0.05;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, start);
    osc.frequency.exponentialRampToValueAtTime(210, start + 0.25);
    osc.frequency.exponentialRampToValueAtTime(80, start + 0.6);

    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.25, start + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.7);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 0.75);

    active.push(osc);
    const t = setTimeout(onDone, 950);
    active.push(t);
  }

  /**
   * Toggle Atmospheric Nocturnal Savanna Ambience (crickets & gentle breeze)
   */
  public toggleAmbience(enable?: boolean): boolean {
    const shouldEnable = enable !== undefined ? enable : !this.isAmbiencePlaying;

    if (!shouldEnable) {
      if (this.stopAmbience) {
        try {
          this.stopAmbience();
        } catch {
          // ignore
        }
        this.stopAmbience = null;
      }
      this.isAmbiencePlaying = false;
      this.notify();
      return false;
    }

    const ctx = this.getContext();
    this.isAmbiencePlaying = true;
    this.notify();

    let isRunning = true;
    const intervals: any[] = [];
    const nodes: AudioNode[] = [];

    // 1. Subtle warm savanna breeze (filtered pink noise)
    try {
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        output[i] = (b0 + b1 + b2 + white * 0.5362) * 0.04;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const windFilter = ctx.createBiquadFilter();
      windFilter.type = 'lowpass';
      windFilter.frequency.setValueAtTime(320, ctx.currentTime);

      const windGain = ctx.createGain();
      windGain.gain.setValueAtTime(0.04, ctx.currentTime);

      whiteNoise.connect(windFilter);
      windFilter.connect(windGain);
      windGain.connect(ctx.destination);
      whiteNoise.start();
      nodes.push(whiteNoise, windFilter, windGain);
    } catch {
      // ignore
    }

    // 2. Rhythmic nocturnal crickets / cicadas pulse
    const scheduleCricket = () => {
      if (!isRunning) return;
      try {
        const now = ctx.currentTime;
        const count = 3 + Math.floor(Math.random() * 4);
        for (let i = 0; i < count; i++) {
          const chirpTime = now + i * 0.045;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(4600 + (Math.random() * 200 - 100), chirpTime);

          gain.gain.setValueAtTime(0, chirpTime);
          gain.gain.linearRampToValueAtTime(0.02, chirpTime + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.0001, chirpTime + 0.035);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(chirpTime);
          osc.stop(chirpTime + 0.04);
        }
      } catch {
        // ignore
      }

      if (isRunning) {
        const nextDelay = 800 + Math.random() * 1200;
        const intId = setTimeout(scheduleCricket, nextDelay);
        intervals.push(intId);
      }
    };

    scheduleCricket();

    this.stopAmbience = () => {
      isRunning = false;
      intervals.forEach((id) => clearTimeout(id));
      nodes.forEach((n) => {
        try {
          (n as any).stop?.();
          n.disconnect();
        } catch {
          // ignore
        }
      });
    };

    return true;
  }
}

export const bioacoustics = new BioacousticsEngine();
