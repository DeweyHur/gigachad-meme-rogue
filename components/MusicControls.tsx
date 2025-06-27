import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { audioService } from '../services/audioService';

interface MusicControlsProps {
  visible?: boolean;
}

export default function MusicControls({ visible = true }: MusicControlsProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [audioAvailable, setAudioAvailable] = useState(true);

  useEffect(() => {
    // Initialize audio service
    const initAudio = async () => {
      const success = await audioService.initialize();
      if (!success) {
        setAudioAvailable(false);
        return;
      }
      
      // Load the background music
      const musicUrl = require('../assets/audios/Песня для твоего друга.mp3');
      const loadSuccess = await audioService.loadBackgroundMusic(musicUrl);
      if (!loadSuccess) {
        setAudioAvailable(false);
        return;
      }

      // Auto-start the music by default
      await audioService.playBackgroundMusic();
      setIsPlaying(true);
    };
    
    initAudio();

    return () => {
      audioService.cleanup();
    };
  }, []);

  const toggleMusic = async () => {
    if (!audioAvailable) return;
    
    if (isPlaying) {
      await audioService.pauseBackgroundMusic();
      setIsPlaying(false);
    } else {
      await audioService.playBackgroundMusic();
      setIsPlaying(true);
    }
  };

  const adjustVolume = async (newVolume: number) => {
    if (!audioAvailable) return;
    
    setVolume(newVolume);
    await audioService.setVolume(newVolume);
  };

  const handleVolumePress = () => {
    if (!audioAvailable) return;
    setShowVolumeSlider(!showVolumeSlider);
  };

  if (!visible) return null;

  // Show a message if audio is not available
  if (!audioAvailable) {
    return (
      <View style={styles.container}>
        <View style={styles.controls}>
          <TouchableOpacity style={[styles.button, styles.disabledButton]}>
            <Ionicons name="musical-notes" size={20} color="#666" />
          </TouchableOpacity>
          <Text style={styles.audioMessage}>
            {Platform.OS === 'web' ? 'Audio: Click to Enable' : 'Audio: Unavailable'}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <TouchableOpacity onPress={toggleMusic} style={styles.button}>
          <Ionicons 
            name={isPlaying ? 'pause' : 'play'} 
            size={24} 
            color="#fff" 
          />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={handleVolumePress} style={styles.volumeButton}>
          <Ionicons 
            name={volume === 0 ? 'volume-mute' : volume < 0.5 ? 'volume-low' : 'volume-high'} 
            size={20} 
            color="#fff" 
          />
        </TouchableOpacity>
      </View>

      {showVolumeSlider && (
        <View style={styles.volumeSliderContainer}>
          <View style={styles.volumeSlider}>
            <View style={styles.volumeTrack}>
              <View style={[styles.volumeFill, { width: `${volume * 100}%` }]} />
              <TouchableOpacity 
                style={[styles.volumeThumb, { left: `${volume * 100}%` }]}
                onPressIn={() => {}} // This will be handled by gesture
              />
            </View>
            <View style={styles.volumeLabels}>
              <Text style={styles.volumeLabel}>0</Text>
              <Text style={styles.volumeLabel}>100</Text>
            </View>
          </View>
          
          <View style={styles.volumeButtons}>
            <TouchableOpacity 
              style={styles.volumeStepButton}
              onPress={() => adjustVolume(Math.max(0, volume - 0.1))}
            >
              <Ionicons name="remove" size={16} color="#fff" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.volumeStepButton}
              onPress={() => adjustVolume(Math.min(1, volume + 0.1))}
            >
              <Ionicons name="add" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1000,
  },
  controls: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 25,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  audioMessage: {
    color: '#666',
    fontSize: 12,
    marginLeft: 5,
  },
  volumeButton: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  volumeSliderContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 15,
    padding: 15,
    marginTop: 10,
    alignItems: 'center',
  },
  volumeSlider: {
    width: 150,
    alignItems: 'center',
  },
  volumeTrack: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    position: 'relative',
    marginBottom: 5,
  },
  volumeFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 3,
  },
  volumeThumb: {
    position: 'absolute',
    top: -2,
    width: 10,
    height: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginLeft: -5,
  },
  volumeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  volumeLabel: {
    color: '#fff',
    fontSize: 12,
  },
  volumeButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  volumeStepButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 