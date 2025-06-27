// Web Audio API implementation specifically for sound effects
class WebSoundEffectService {
  private audioContext: AudioContext | null = null;
  private soundEffects: Map<string, AudioBuffer> = new Map();

  async initialize() {
    try {
      // Create audio context
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      return true;
    } catch (error) {
      console.error('Failed to initialize web sound effect service:', error);
      return false;
    }
  }

  async loadSoundEffect(id: string, uri: any) {
    if (!this.audioContext || !uri) {
      return false;
    }

    try {
      // Fetch the audio file
      const response = await fetch(uri);
      const arrayBuffer = await response.arrayBuffer();
      
      // Decode the audio data
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      
      // Store the sound effect
      this.soundEffects.set(id, audioBuffer);
      
      return true;
    } catch (error) {
      console.error('Failed to load sound effect:', error);
      return false;
    }
  }

  async playSoundEffect(id: string) {
    if (!this.audioContext) {
      return;
    }

    const audioBuffer = this.soundEffects.get(id);
    if (!audioBuffer) {
      return;
    }

    try {
      // Resume audio context if suspended
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      // Create new source node
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      
      // Create gain node for volume control
      const gainNode = this.audioContext.createGain();
      gainNode.gain.value = 0.7; // Slightly lower volume for sound effects
      
      // Connect nodes
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      // Start playing
      source.start(0);
    } catch (error) {
      console.error('Failed to play sound effect:', error);
    }
  }

  async preloadBossSounds(bosses: any[]) {
    for (const boss of bosses) {
      if (boss.voice) {
        await this.loadSoundEffect(boss.id, boss.voice);
      }
    }
  }

  async cleanup() {
    try {
      if (this.audioContext) {
        await this.audioContext.close();
        this.audioContext = null;
      }
      this.soundEffects.clear();
    } catch (error) {
      console.error('Failed to cleanup web sound effect service:', error);
    }
  }
}

export const webSoundEffectService = new WebSoundEffectService(); 