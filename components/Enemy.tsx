import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { COLORS } from '@/constants/colors';
import { EnemyType, BossType } from '@/types/game';

type EnemyProps = {
  enemy: EnemyType | BossType;
};

export default function Enemy({ enemy }: EnemyProps) {
  const { name, currentHealth, health, image, intent } = enemy;
  const healthPercentage = ((currentHealth || 0) / health) * 100;
  
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{name}</Text>
      
      <Image source={{ uri: image }} style={styles.image} />
      
      <View style={styles.healthContainer}>
        <View style={[styles.healthBar, { width: `${healthPercentage}%` }]} />
        <Text style={styles.healthText}>{currentHealth || 0}/{health}</Text>
      </View>
      
      {enemy.block && enemy.block > 0 && (
        <View style={styles.statBadge}>
          <Text style={styles.statText}>🛡️ {enemy.block}</Text>
        </View>
      )}
      
      {enemy.strength && enemy.strength > 0 && (
        <View style={[styles.statBadge, styles.strengthBadge]}>
          <Text style={styles.statText}>💪 {enemy.strength}</Text>
        </View>
      )}
      
      {intent && (
        <View style={styles.intentContainer}>
          <Text style={styles.intentTitle}>Next Move:</Text>
          <Text style={styles.intentName}>{intent.name}</Text>
          {intent.damage !== undefined && (
            <Text style={styles.intentDamage}>Damage: {intent.damage}</Text>
          )}
          {intent.effect !== undefined && (
            <Text style={styles.intentEffect}>Effect: {intent.effect}</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 10,
    marginBottom: 20,
  },
  name: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
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
  statBadge: {
    backgroundColor: COLORS.info,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginVertical: 5,
  },
  strengthBadge: {
    backgroundColor: COLORS.danger,
  },
  statText: {
    color: COLORS.text,
    fontWeight: 'bold',
  },
  intentContainer: {
    backgroundColor: COLORS.cardBackground,
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
    width: 200,
  },
  intentTitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: 5,
  },
  intentName: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  intentDamage: {
    color: COLORS.danger,
    fontSize: 14,
  },
  intentEffect: {
    color: COLORS.warning,
    fontSize: 14,
  },
});