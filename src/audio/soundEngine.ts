// Procedural Web Audio API engine with zero external audio assets required
class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private currentDroneOscs: OscillatorNode[] = [];
  private currentFilters: BiquadFilterNode[] = [];
  private noiseNode: AudioBufferSourceNode | null = null;

  constructor() {
    // AudioContext created lazily on first user interaction to comply with browser autoplay policies
  }

  private init() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioCtx();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.7, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    this.ambientGain.connect(this.masterGain);
  }

  public resume() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 0.7, this.ctx.currentTime, 0.05);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Set dimension-specific ambient drone & textures
  public setDimensionAtmosphere(dim: string) {
    this.resume();
    if (!this.ctx || !this.ambientGain) return;

    // Fade out previous oscillators
    const now = this.ctx.currentTime;
    this.currentDroneOscs.forEach(osc => {
      try {
        osc.stop(now + 0.8);
      } catch {
        // Already stopped
      }
    });
    this.currentDroneOscs = [];

    // Frequencies tailored to dimension mood
    let freqs = [55, 110, 165]; // Mysterious low A drone (Chamber)
    let type: OscillatorType = 'sawtooth';
    let filterFreq = 180;

    if (dim === 'forest') {
      freqs = [130.81, 196.00, 261.63, 523.25]; // Warm C major / enchanted pentatonic
      type = 'sine';
      filterFreq = 800;
    } else if (dim === 'cyberpunk') {
      freqs = [45, 90, 135, 180]; // Sub-heavy synth bass
      type = 'sawtooth';
      filterFreq = 350;
    } else if (dim === 'cosmic') {
      freqs = [65.41, 98.0, 146.83, 220.0]; // Ethereal fifths
      type = 'sine';
      filterFreq = 600;
    } else if (dim === 'underwater') {
      freqs = [40, 80, 120]; // Muffled abyssal sub
      type = 'triangle';
      filterFreq = 140;
    }

    const subFilter = this.ctx.createBiquadFilter();
    subFilter.type = 'lowpass';
    subFilter.frequency.setValueAtTime(filterFreq, now);
    subFilter.connect(this.ambientGain);

    freqs.forEach((f, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(f + (Math.random() - 0.5) * 1.5, now);

      oscGain.gain.setValueAtTime(0, now);
      oscGain.gain.linearRampToValueAtTime(0.12 / (i + 1), now + 1.2);

      osc.connect(oscGain);
      oscGain.connect(subFilter);
      osc.start(now);
      this.currentDroneOscs.push(osc);
    });
  }

  // Energy Charging Hum (Pitch rises smoothly from 60Hz to 480Hz)
  public playChargeHum(progress: number) {
    this.resume();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    const pitch = 60 + Math.pow(progress, 2) * 440;
    osc.frequency.setValueAtTime(pitch, now);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(pitch * 1.5, now);
    filter.Q.setValueAtTime(4.0, now);

    gain.gain.setValueAtTime(0.08 * progress, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  // Portal Rune Activation Chime
  public playRuneIgnite(runeIndex: number) {
    this.resume();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const scale = [220, 246.94, 277.18, 329.63, 369.99, 440, 493.88, 554.37];
    const freq = scale[runeIndex % scale.length] * 1.5;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.7, now + 0.6);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.6);
  }

  // Portal Opening Big Blast & Resonant Shockwave
  public playPortalBurst() {
    this.resume();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    
    // Sub bass drop
    const sub = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(140, now);
    sub.frequency.exponentialRampToValueAtTime(30, now + 1.2);

    subGain.gain.setValueAtTime(0.6, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    sub.connect(subGain);
    subGain.connect(this.masterGain);
    sub.start(now);
    sub.stop(now + 1.2);

    // Filtered noise sweep
    const bufferSize = this.ctx.sampleRate * 1.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(300, now);
    filter.frequency.exponentialRampToValueAtTime(3200, now + 0.4);
    filter.frequency.exponentialRampToValueAtTime(400, now + 1.5);
    filter.Q.setValueAtTime(3.0, now);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.4, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain);

    noise.start(now);
  }

  // Interdimensional Travel Vortex: Smooth cinematic whoosh & lush harmonic shimmer (No harsh buzzing)
  public playVortexTravel() {
    this.resume();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const now = this.ctx.currentTime;

    // 1. Warm low-frequency wind whoosh using pink/brown noise
    const bufferSize = Math.floor(this.ctx.sampleRate * 1.6);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    // Generate gentle brown/pink noise (soft, natural air rush like a cinematic film transition)
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      lastOut = (lastOut + 0.03 * white) / 1.03;
      data[i] = lastOut * 3.5;
    }

    const windSource = this.ctx.createBufferSource();
    windSource.buffer = buffer;

    // Smooth sweeping low-pass filter: opens up gently and glides down
    const windFilter = this.ctx.createBiquadFilter();
    windFilter.type = 'lowpass';
    windFilter.frequency.setValueAtTime(180, now);
    windFilter.frequency.exponentialRampToValueAtTime(1400, now + 0.5);
    windFilter.frequency.exponentialRampToValueAtTime(120, now + 1.5);
    windFilter.Q.setValueAtTime(1.0, now);

    const windGain = this.ctx.createGain();
    windGain.gain.setValueAtTime(0.01, now);
    windGain.gain.linearRampToValueAtTime(0.35, now + 0.4);
    windGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

    windSource.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(this.masterGain);
    windSource.start(now);

    // 2. Deep warm sub-bass glide (Pure sine wave, pleasant and cinematic)
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(95, now);
    subOsc.frequency.exponentialRampToValueAtTime(50, now + 1.2);

    subGain.gain.setValueAtTime(0.01, now);
    subGain.gain.linearRampToValueAtTime(0.3, now + 0.35);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);

    subOsc.connect(subGain);
    subGain.connect(this.masterGain);
    subOsc.start(now);
    subOsc.stop(now + 1.3);

    // 3. Ethereal crystalline chord shimmer (Pure gentle sine harmonic triad: C - E - G)
    const chordFrequencies = [523.25, 659.25, 783.99, 1046.5];
    chordFrequencies.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const chime = this.ctx.createOscillator();
      const chimeGain = this.ctx.createGain();

      chime.type = 'sine';
      chime.frequency.setValueAtTime(freq, now + 0.1);
      chime.frequency.exponentialRampToValueAtTime(freq * 1.05, now + 0.7);

      chimeGain.gain.setValueAtTime(0.001, now);
      chimeGain.gain.linearRampToValueAtTime(0.045 / (idx + 1), now + 0.35);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

      chime.connect(chimeGain);
      chimeGain.connect(this.masterGain);

      chime.start(now + 0.1);
      chime.stop(now + 1.4);
    });
  }

  // Object Interaction Chime (Mushroom, jellyfish, starburst, skyscraper)
  public playObjectInteract(type: 'sparkle' | 'bubble' | 'cyber' | 'cosmic') {
    this.resume();
    if (!this.ctx || !this.masterGain || this.isMuted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    if (type === 'bubble') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.15);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    } else if (type === 'cyber') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.setValueAtTime(1760, now + 0.05);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    } else if (type === 'cosmic') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.4);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.25);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    }

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.5);
  }
}

export const sound = new SoundEngine();
