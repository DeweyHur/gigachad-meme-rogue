import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { useGameStore } from '@/store/gameStore';
import Player from '@/components/Player';
import Enemy from '@/components/Enemy';
import Card from '@/components/Card';
import VictoryEffect from '@/components/VictoryEffect';
import BattleLog from '@/components/BattleLog';
import ItemsManager from '@/components/ItemsManager';
import DamageNumber from '@/components/DamageNumber';

export default function BattleScreen() {
  const { 
    gameState, 
    playCard,
    endTurn,
    useItem,
    hideVictoryEffect
  } = useGameStore();
  
  const { 
    player, 
    currentBattle, 
    gameStatus,
    showVictoryEffect
  } = gameState;
  
  const [damageNumbers, setDamageNumbers] = useState<{
    id: string;
    value: number;
    type: 'damage' | 'block' | 'heal';
    position: { x: number; y: number };
  }[]>([]);
  
  // Handle navigation based on game status
  useEffect(() => {
    if (gameStatus === 'menu') {
      router.replace('/');
    } else if (gameStatus !== 'battle' && !showVictoryEffect) {
      router.replace('/game');
    }
  }, [gameStatus, showVictoryEffect]);
  
  // Early return if no battle data
  if (!currentBattle || !currentBattle.enemy) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading battle...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  const { enemy, turn, playerTurn, battleLog } = currentBattle;
  
  const handlePlayCard = (cardIndex: number) => {
    // Add damage number animation
    const card = player.hand[cardIndex];
    if (card.damage) {
      const newDamageNumber = {
        id: `damage-${Date.now()}-${Math.random()}`,
        value: card.damage + (player.strength || 0),
        type: 'damage' as const,
        position: { x: 150, y: 150 }, // Position near enemy
      };
      setDamageNumbers(prev => [...prev, newDamageNumber]);
    }
    
    if (card.block) {
      const newBlockNumber = {
        id: `block-${Date.now()}-${Math.random()}`,
        value: card.block,
        type: 'block' as const,
        position: { x: 150, y: 350 }, // Position near player
      };
      setDamageNumbers(prev => [...prev, newBlockNumber]);
    }
    
    playCard(cardIndex);
  };
  
  const handleEndTurn = () => {
    endTurn();
  };
  
  const handleUseItem = (itemId: string) => {
    useItem(itemId);
  };
  
  const handleRemoveDamageNumber = (id: string) => {
    setDamageNumbers(prev => prev.filter(num => num.id !== id));
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.battleInfo}>
        <Text style={styles.turnText}>Turn {turn}</Text>
        <Text style={[
          styles.playerTurnText,
          { color: playerTurn ? COLORS.success : COLORS.danger }
        ]}>
          {playerTurn ? "Your Turn" : "Enemy Turn"}
        </Text>
        <Text style={styles.debugText}>
          Debug: {JSON.stringify({ turn, playerTurn, enemyIntent: enemy.intent })}
        </Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Enemy enemy={enemy} />
        
        <BattleLog entries={battleLog} />
        
        <View style={styles.divider} />
        
        <Player player={player} />
        
        <View style={styles.handContainer}>
          <Text style={styles.handTitle}>Your Hand ({player.hand.length} cards)</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardsContainer}
          >
            {player.hand.map((card, index) => (
              <Card
                key={`${card.id}-${index}`}
                card={card}
                onPress={() => handlePlayCard(index)}
                disabled={!playerTurn || card.energy > player.energy}
              />
            ))}
            {player.hand.length === 0 && (
              <Text style={styles.noCardsText}>No cards in hand</Text>
            )}
          </ScrollView>
        </View>
      </ScrollView>
      
      <View style={styles.actionsContainer}>
        <ItemsManager 
          items={player.items.filter(item => item.usableInBattle)}
          onUseItem={handleUseItem}
          inBattle={true}
        />
        
        <Pressable 
          style={[
            styles.endTurnButton,
            !playerTurn && styles.disabledButton
          ]}
          onPress={handleEndTurn}
          disabled={!playerTurn}
        >
          <Text style={styles.buttonText}>End Turn</Text>
        </Pressable>
      </View>
      
      {/* Damage number animations */}
      {damageNumbers.map(number => (
        <DamageNumber
          key={number.id}
          value={number.value}
          type={number.type}
          position={number.position}
          onComplete={() => handleRemoveDamageNumber(number.id)}
        />
      ))}
      
      {showVictoryEffect && (
        <VictoryEffect onComplete={hideVictoryEffect} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 15,
    paddingBottom: 80, // Extra padding to ensure end turn button is visible
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.text,
    fontSize: 18,
  },
  battleInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 10,
    margin: 10,
    zIndex: 10,
  },
  turnText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  playerTurnText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    height: 2,
    backgroundColor: COLORS.cardBorder,
    marginVertical: 10,
  },
  handContainer: {
    marginTop: 10,
  },
  handTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  cardsContainer: {
    paddingHorizontal: 10,
    minHeight: 220, // Ensure there's always space for cards
  },
  noCardsText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    alignSelf: 'center',
    marginTop: 80,
  },
  actionsContainer: {
    padding: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  endTurnButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    flex: 1,
    marginLeft: 10,
  },
  disabledButton: {
    backgroundColor: COLORS.cardBackground,
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  debugText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 5,
  },
});