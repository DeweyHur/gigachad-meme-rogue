import { Platform } from 'react-native';
import { BOSSES } from '../constants/game';

// Import appropriate audio service based on platform
let Audio: any = null;
let webSoundEffectService: any = null;

if (Platform.OS === 'web') {
  try {
    webSoundEffectService = require('./webSoundEffectService').webSoundEffectService;
  } catch (error) {
    console.warn('Web sound effect service not available:', error);
  }
} else {
  try {
    Audio = require('expo-av').Audio;
  } catch (error) {
    console.warn('expo-av not available:', error);
  }
}

class SoundEffectService {
  private soundEffects: Map<string, any> = new Map();
  private isWeb = Platform.OS === 'web';

  async initialize() {
    if (this.isWeb) {
      if (!webSoundEffectService) {
        console.warn('Web sound effect service not available');
        return false;
      }
      return await webSoundEffectService.initialize();
    } else {
      if (!Audio) {
        console.warn('Audio not available on this platform');
        return false;
      }

      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
        return true;
      } catch (error) {
        console.error('Failed to initialize audio:', error);
        return false;
      }
    }
  }

  async loadSoundEffect(id: string, uri: any) {
    if (!uri) return false;

    if (this.isWeb) {
      if (!webSoundEffectService) {
        console.warn('Web sound effect service not available');
        return false;
      }
      return await webSoundEffectService.loadSoundEffect(id, uri);
    } else {
      if (!Audio) {
        console.warn('Audio not available on this platform');
        return false;
      }

      try {
        const { sound } = await Audio.Sound.createAsync(
          { uri },
          { 
            shouldPlay: false,
            isLooping: false,
            volume: 1.0,
          }
        );

        this.soundEffects.set(id, sound);
        return true;
      } catch (error) {
        console.error('Failed to load sound effect:', error);
        return false;
      }
    }
  }

  async playSoundEffect(id: string) {
    if (this.isWeb) {
      if (!webSoundEffectService) return;
      await webSoundEffectService.playSoundEffect(id);
    } else {
      const sound = this.soundEffects.get(id);
      if (!sound) return;

      try {
        await sound.replayAsync();
      } catch (error) {
        console.error('Failed to play sound effect:', error);
      }
    }
  }

  async preloadBossSounds() {
    if (this.isWeb) {
      if (!webSoundEffectService) return;
      await webSoundEffectService.preloadBossSounds(BOSSES);
    } else {
      for (const boss of BOSSES) {
        if (boss.voice) {
          await this.loadSoundEffect(boss.id, boss.voice);
        }
      }
    }
  }

  async cleanup() {
    if (this.isWeb) {
      if (!webSoundEffectService) return;
      await webSoundEffectService.cleanup();
    } else {
      for (const [id, sound] of this.soundEffects) {
        try {
          await sound.unloadAsync();
        } catch (error) {
          console.error(`Failed to cleanup sound effect ${id}:`, error);
        }
      }
      this.soundEffects.clear();
    }
  }
}

export const soundEffectService = new SoundEffectService(); 