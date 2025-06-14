import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Easing, Pressable } from 'react-native';
import { COLORS } from '@/constants/colors';
import { useGameStore } from '@/store/gameStore';

const { width, height } = Dimensions.get('window');

type VictoryEffectProps = {
  onComplete: () => void;
};

export default function VictoryEffect({ onComplete }: VictoryEffectProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const [showContinueButton, setShowContinueButton] = useState(false);
  const { gameState } = useGameStore();
  const { lastReward, currentBattle } = gameState;
  
  const isBossVictory = currentBattle?.enemy.id === gameState.currentBoss?.id;
  
  const particleAnims = Array(20).fill(0).map(() => ({
    position: useRef(new Animated.ValueXY({ x: 0, y: 0 })).current,
    scale: useRef(new Animated.Value(0)).current,
    opacity: useRef(new Animated.Value(1)).current,
  }));
  
  useEffect(() => {
    // Main victory text animation
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 700,
        easing: Easing.elastic(3),
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Show continue button after animations complete
      setTimeout(() => {
        setShowContinueButton(true);
      }, 1000);
    });
    
    // Particle animations
    particleAnims.forEach((anim, i) => {
      const angle = (i / particleAnims.length) * Math.PI * 2;
      const distance = 100 + Math.random() * 100;
      
      Animated.parallel([
        Animated.timing(anim.position, {
          toValue: {
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance,
          },
          duration: 1000 + Math.random() * 500,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(anim.scale, {
            toValue: 0.5 + Math.random() * 0.5,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(anim.scale, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(anim.opacity, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, []);
  
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  return (
    <View style={styles.container}>
      <View style={styles.overlay} />
      
      {/* Particles */}
      {particleAnims.map((anim, i) => (
        <Animated.View
          key={i}
          style={[
            styles.particle,
            {
              backgroundColor: i % 3 === 0 ? COLORS.primary : 
                             i % 3 === 1 ? COLORS.secondary : COLORS.success,
              transform: [
                { translateX: anim.position.x },
                { translateY: anim.position.y },
                { scale: anim.scale },
              ],
              opacity: anim.opacity,
            },
          ]}
        />
      ))}
      
      {/* Victory text */}
      <Animated.View
        style={[
          styles.textContainer,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { rotate: spin },
            ],
          },
        ]}
      >
        <Text style={styles.victoryText}>{isBossVictory ? "BOSS DEFEATED!" : "VICTORY!"}</Text>
      </Animated.View>
      
      {/* Reward info */}
      {lastReward && showContinueButton && (
        <View style={styles.rewardContainer}>
          <Text style={styles.rewardTitle}>Reward:</Text>
          {lastReward.type === 'gold' && (
            <Text style={styles.rewardText}>
              {lastReward.amount} Gold
            </Text>
          )}
          {lastReward.type === 'perk' && (
            <>
              <Text style={styles.rewardName}>{lastReward.name}</Text>
              <Text style={styles.rewardDescription}>{lastReward.description}</Text>
            </>
          )}
          {lastReward.type === 'equipment' && (
            <>
              <Text style={styles.rewardName}>{lastReward.name}</Text>
              <Text style={styles.rewardDescription}>{lastReward.description}</Text>
            </>
          )}
          {lastReward.type === 'item' && (
            <>
              <Text style={styles.rewardName}>{lastReward.name}</Text>
              <Text style={styles.rewardDescription}>{lastReward.description}</Text>
            </>
          )}
        </View>
      )}
      
      {/* Continue button */}
      {showContinueButton && (
        <Pressable style={styles.continueButton} onPress={onComplete}>
          <Text style={styles.continueText}>
            {isBossVictory ? "Return to Main Menu" : "Continue"}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  textContainer: {
    backgroundColor: COLORS.primary,
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: COLORS.secondary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  victoryText: {
    color: '#FFF',
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  particle: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  rewardContainer: {
    backgroundColor: COLORS.cardBackground,
    padding: 20,
    borderRadius: 10,
    marginTop: 30,
    alignItems: 'center',
    width: '80%',
    maxWidth: 300,
  },
  rewardTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  rewardText: {
    color: COLORS.warning,
    fontSize: 24,
    fontWeight: 'bold',
  },
  rewardName: {
    color: COLORS.secondary,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  rewardDescription: {
    color: COLORS.textSecondary,
    fontSize: 16,
    textAlign: 'center',
  },
  continueButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
  },
  continueText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});