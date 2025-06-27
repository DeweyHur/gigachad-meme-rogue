// Web Audio API implementation for web platforms
class WebAudioService {
  private audioContext: AudioContext | null = null;
  private audioBuffer: AudioBuffer | null = null;
  private source: AudioBufferSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying = false;
  private volume = 0.5;
  private audioUrl: string | null = null;

  async initialize() {
    try {
      // Create audio context
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      return true;
    } catch (error) {
      console.error('Failed to initialize web audio:', error);
      return false;
    }
  }

  async loadBackgroundMusic(uri: string) {
    if (!this.audioContext) {
      console.warn('Audio context not available');
      return false;
    }

    try {
      this.audioUrl = uri;
      
      // Fetch the audio file
      const response = await fetch(uri);
      const arrayBuffer = await response.arrayBuffer();
      
      // Decode the audio data
      this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      
      // Create gain node for volume control
      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.value = this.volume;
      this.gainNode.connect(this.audioContext.destination);
      
      return true;
    } catch (error) {
      console.error('Failed to load background music:', error);
      return false;
    }
  }

  async playBackgroundMusic() {
    if (!this.audioContext || !this.audioBuffer || this.isPlaying) {
      return;
    }

    try {
      // Resume audio context if suspended
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      // Create new source node
      this.source = this.audioContext.createBufferSource();
      this.source.buffer = this.audioBuffer;
      this.source.loop = true;
      
      // Connect to gain node
      this.source.connect(this.gainNode!);
      
      // Start playing
      this.source.start(0);
      this.isPlaying = true;
    } catch (error) {
      console.error('Failed to play background music:', error);
    }
  }

  async pauseBackgroundMusic() {
    if (!this.source || !this.isPlaying) {
      return;
    }

    try {
      this.source.stop();
      this.source = null;
      this.isPlaying = false;
    } catch (error) {
      console.error('Failed to pause background music:', error);
    }
  }

  async stopBackgroundMusic() {
    if (!this.source) {
      return;
    }

    try {
      this.source.stop();
      this.source = null;
      this.isPlaying = false;
    } catch (error) {
      console.error('Failed to stop background music:', error);
    }
  }

  async setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.gainNode) {
      this.gainNode.gain.value = this.volume;
    }
  }

  getVolume() {
    return this.volume;
  }

  isMusicPlaying() {
    return this.isPlaying;
  }

  async cleanup() {
    try {
      if (this.source) {
        this.source.stop();
        this.source = null;
      }
      if (this.audioContext) {
        await this.audioContext.close();
        this.audioContext = null;
      }
      this.audioBuffer = null;
      this.gainNode = null;
      this.isPlaying = false;
    } catch (error) {
      console.error('Failed to cleanup web audio:', error);
    }
  }
}

export const webAudioService = new WebAudioService(); 