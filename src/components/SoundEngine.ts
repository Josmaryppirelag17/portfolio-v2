/**
 * Cyberpunk Retro Synthesizer Sound Engine
 * Custom native Web Audio API oscillators helper (Self-contained, zero assets required)
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private enabled: boolean = false;
  private activeWave: OscillatorType = "triangle";

  constructor() {}

  setWaveType(type: OscillatorType) {
    this.activeWave = type;
  }

  getWaveType(): OscillatorType {
    return this.activeWave;
  }

  private initCtx() {
    if (!this.ctx && typeof window !== "undefined") {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        this.ctx = new AudioCtx();
      } catch (err) {
        console.warn("Web Audio Context not supported in this browser", err);
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  toggle(on?: boolean): boolean {
    if (on !== undefined) {
      this.enabled = on;
    } else {
      this.enabled = !this.enabled;
    }
    if (this.enabled) {
      this.initCtx();
    }
    return this.enabled;
  }

  isEnabled() {
    return this.enabled;
  }

  playToggleSound() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    this.playTone(220, "triangle", 0.1, 0.15);
    setTimeout(() => {
      this.playTone(440, "sine", 0.15, 0.15);
    }, 80);
  }

  playHover() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;
    this.playTone(784, "sine", 0.04, 0.05); // high chirp
  }

  playClick() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;
    this.playTone(440, "triangle", 0.08, 0.15);
    setTimeout(() => {
      this.playTone(880, "sine", 0.05, 0.1);
    }, 40);
  }

  playError() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;
    this.playTone(150, "sawtooth", 0.25, 0.2);
  }

  playSuccess() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;
    
    // Arpeggio
    const scale = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    scale.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, "sine", 0.18, 0.1);
      }, idx * 60);
    });
  }

  playSynthKey(frequency: number) {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;
    this.playTone(frequency, this.activeWave, 0.25, 0.12);
  }

  playRadioStatic() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const bufferSize = this.ctx.sampleRate * 0.45; // 0.45s static
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noiseNode = this.ctx.createBufferSource();
      noiseNode.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1200, this.ctx.currentTime);
      filter.Q.setValueAtTime(2.0, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(350, this.ctx.currentTime + 0.45);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.09, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.45);

      noiseNode.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noiseNode.start();
      noiseNode.stop(this.ctx.currentTime + 0.45);

      // Electronic sync beeps
      setTimeout(() => {
        this.playTone(950, "sine", 0.08, 0.04);
      }, 40);
      setTimeout(() => {
        this.playTone(1900, "sine", 0.05, 0.03);
      }, 120);
    } catch (err) {
      this.playTone(650, "sawtooth", 0.35, 0.06);
    }
  }

  private playTone(freq: number, type: OscillatorType, duration: number, volume: number = 0.1) {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(volume, this.ctx.currentTime);
      // Exponentially decay volume over duration
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn("Could not play tone", e);
    }
  }
}

export const soundEngine = new SoundEngine();
