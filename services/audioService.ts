import { Platform } from 'react-native';

// Import appropriate audio service based on platform
let Audio: any = null;
let webAudioService: any = null;

if (Platform.OS === 'web') {
  try {
    webAudioService = require('./webAudioService').webAudioService;
  } catch (error) {
    console.warn('Web audio service not available:', error);
  }
} else {
  try {
    Audio = require('expo-av').Audio;
  } catch (error) {
    console.warn('expo-av not available:', error);
  }
}

class AudioService {
  private backgroundMusic: any = null;
  private isPlaying = false;
  private volume = 0.5;
  private isWeb = Platform.OS === 'web';

  async initialize() {
    if (this.isWeb) {
      if (!webAudioService) {
        console.warn('Web audio not available');
        return;
      }
      return await webAudioService.initialize();
    } else {
      if (!Audio) {
        console.warn('Audio not available on this platform');
        return;
      }

      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
      } catch (error) {
        console.error('Failed to initialize audio:', error);
      }
    }
  }

  async loadBackgroundMusic(uri: string) {
    if (this.isWeb) {
      if (!webAudioService) {
        console.warn('Web audio not available');
        return false;
      }
      return await webAudioService.loadBackgroundMusic(uri);
    } else {
      if (!Audio) {
        console.warn('Audio not available on this platform');
        return false;
      }

      try {
        if (this.backgroundMusic) {
          await this.backgroundMusic.unloadAsync();
        }

        const { sound } = await Audio.Sound.createAsync(
          { uri },
          { 
            shouldPlay: false,
            isLooping: true,
            volume: this.volume,
          }
        );

        this.backgroundMusic = sound;
        return true;
      } catch (error) {
        console.error('Failed to load background music:', error);
        return false;
      }
    }
  }

  async playBackgroundMusic() {
    if (this.isWeb) {
      if (!webAudioService) return;
      await webAudioService.playBackgroundMusic();
      this.isPlaying = webAudioService.isMusicPlaying();
    } else {
      if (!Audio || !this.backgroundMusic || this.isPlaying) {
        return;
      }

      try {
        await this.backgroundMusic.playAsync();
        this.isPlaying = true;
      } catch (error) {
        console.error('Failed to play background music:', error);
      }
    }
  }

  async pauseBackgroundMusic() {
    if (this.isWeb) {
      if (!webAudioService) return;
      await webAudioService.pauseBackgroundMusic();
      this.isPlaying = webAudioService.isMusicPlaying();
    } else {
      if (!Audio || !this.backgroundMusic || !this.isPlaying) {
        return;
      }

      try {
        await this.backgroundMusic.pauseAsync();
        this.isPlaying = false;
      } catch (error) {
        console.error('Failed to pause background music:', error);
      }
    }
  }

  async stopBackgroundMusic() {
    if (this.isWeb) {
      if (!webAudioService) return;
      await webAudioService.stopBackgroundMusic();
      this.isPlaying = webAudioService.isMusicPlaying();
    } else {
      if (!Audio || !this.backgroundMusic) {
        return;
      }

      try {
        await this.backgroundMusic.stopAsync();
        await this.backgroundMusic.setPositionAsync(0);
        this.isPlaying = false;
      } catch (error) {
        console.error('Failed to stop background music:', error);
      }
    }
  }

  async setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    
    if (this.isWeb) {
      if (!webAudioService) return;
      await webAudioService.setVolume(this.volume);
    } else {
      if (Audio && this.backgroundMusic) {
        try {
          await this.backgroundMusic.setVolumeAsync(this.volume);
        } catch (error) {
          console.error('Failed to set volume:', error);
        }
      }
    }
  }

  getVolume() {
    if (this.isWeb && webAudioService) {
      return webAudioService.getVolume();
    }
    return this.volume;
  }

  isMusicPlaying() {
    if (this.isWeb && webAudioService) {
      return webAudioService.isMusicPlaying();
    }
    return this.isPlaying;
  }

  async cleanup() {
    if (this.isWeb) {
      if (!webAudioService) return;
      await webAudioService.cleanup();
    } else {
      if (Audio && this.backgroundMusic) {
        try {
          await this.backgroundMusic.unloadAsync();
          this.backgroundMusic = null;
          this.isPlaying = false;
        } catch (error) {
          console.error('Failed to cleanup audio:', error);
        }
      }
    }
  }
}

export const audioService = new AudioService(); 