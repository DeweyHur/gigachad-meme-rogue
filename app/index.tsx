import React from 'react';
import { View, Text, StyleSheet, Pressable, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { BOSSES } from '@/constants/game';
import BossSelector from '@/components/BossSelector';
import { useGameStore } from '@/store/gameStore';

export default function HomeScreen() {
  const { gameState, initGame, resetGame } = useGameStore();
  const { defeatedBosses } = gameState;
  
  const handleBossSelect = (bossId: string) => {
    initGame(bossId);
    router.push('/game');
  };
  
  const handleContinue = () => {
    router.push('/game');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?q=80&w=300' }} 
            style={styles.logo} 
          />
          <Text style={styles.title}>Gigachad vs. Italian Brain Rots</Text>
          <Text style={styles.subtitle}>A Meme-based Rogue-like Adventure</Text>
        </View>
        
        <BossSelector 
          bosses={BOSSES} 
          defeatedBosses={defeatedBosses} 
          onSelect={handleBossSelect} 
        />
        
        <View style={styles.buttonContainer}>
          {defeatedBosses.length > 0 && (
            <Pressable style={styles.continueButton} onPress={handleContinue}>
              <Text style={styles.buttonText}>Continue Game</Text>
            </Pressable>
          )}
          
          <Pressable style={styles.newGameButton} onPress={resetGame}>
            <Text style={styles.buttonText}>Reset Game</Text>
          </Pressable>
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>How to Play</Text>
          <Text style={styles.infoText}>
            • Choose a boss to challenge{'\n'}
            • Navigate through the path to reach the boss{'\n'}
            • Battle enemies using your cards{'\n'}
            • Collect equipment and perks{'\n'}
            • Defeat all 5 bosses to win the game
          </Text>
          
          <Text style={styles.progressTitle}>Your Progress</Text>
          <Text style={styles.progressText}>
            Bosses Defeated: {defeatedBosses.length}/5
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  title: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    marginVertical: 20,
    gap: 15,
  },
  continueButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  newGameButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoContainer: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 10,
    padding: 20,
    marginTop: 10,
  },
  infoTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  progressTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  progressText: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
});