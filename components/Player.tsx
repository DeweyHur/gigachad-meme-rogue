import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { COLORS } from '@/constants/colors';
import { PlayerType } from '@/types/game';

type PlayerProps = {
  player: PlayerType;
};

export default function Player({ player }: PlayerProps) {
  const { health, maxHealth, energy, maxEnergy, gold, block, strength } = player;
  const healthPercentage = (health / maxHealth) * 100;
  
  return (
    <View style={styles.container}>
      <Text style={styles.name}>Gigachad</Text>
      
      <Image 
        source={{ uri: 'https://en.meming.world/images/en/1/18/Giga_Chad.jpg?q=80&w=300' }} 
        style={styles.image} 
      />
      
      <View style={styles.statsContainer}>
        <View style={styles.healthContainer}>
          <View style={[styles.healthBar, { width: `${healthPercentage}%` }]} />
          <Text style={styles.healthText}>{health}/{maxHealth}</Text>
        </View>
        
        <View style={styles.energyContainer}>
          <Text style={styles.energyText}>Energy: {energy}/{maxEnergy}</Text>
        </View>
      </View>
      
      <View style={styles.effectsContainer}>
        {block > 0 && (
          <View style={styles.effectBadge}>
            <Text style={styles.effectText}>🛡️ {block}</Text>
          </View>
        )}
        
        {strength > 0 && (
          <View style={[styles.effectBadge, styles.strengthBadge]}>
            <Text style={styles.effectText}>💪 {strength}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.equipmentContainer}>
        {Object.entries(player.equippedItems).map(([slot, equipmentId]) => {
          if (!equipmentId) return null;
          
          const equipment = player.equipment.find(e => e.id === equipmentId);
          if (!equipment) return null;
          
          return (
            <View key={slot} style={styles.equippedItem}>
              <Image source={{ uri: equipment.image }} style={styles.equipmentImage} />
              <Text style={styles.slotName}>{slot}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 10,
  },
  name: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  statsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  healthContainer: {
    width: 200,
    height: 20,
    backgroundColor: '#333',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
    position: 'relative',
  },
  healthBar: {
    height: '100%',
    backgroundColor: COLORS.health,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  healthText: {
    color: COLORS.text,
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: 'bold',
  },
  energyContainer: {
    backgroundColor: COLORS.energy,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
    marginBottom: 5,
  },
  energyText: {
    color: '#000',
    fontWeight: 'bold',
  },
  effectsContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  effectBadge: {
    backgroundColor: COLORS.info,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginHorizontal: 5,
  },
  strengthBadge: {
    backgroundColor: COLORS.danger,
  },
  effectText: {
    color: COLORS.text,
    fontWeight: 'bold',
  },
  equipmentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 10,
  },
  equippedItem: {
    alignItems: 'center',
    margin: 5,
  },
  equipmentImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  slotName: {
    color: COLORS.textSecondary,
    fontSize: 10,
    marginTop: 2,
  },
});