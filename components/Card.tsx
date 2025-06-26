import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import { COLORS, getGradeColor } from '@/constants/colors';
import { CardType } from '@/types/game';

type CardProps = {
  card: CardType;
  onPress?: () => void;
  disabled?: boolean;
};

export default function Card({ card, onPress, disabled = false }: CardProps) {
  const { name, damage, block, heal, energy, energyGain, description, upgraded, hits, strength, grade } = card;
  const [showDetails, setShowDetails] = useState(false);
  
  const handleLongPress = () => {
    setShowDetails(true);
  };
  
  const closeDetails = () => {
    setShowDetails(false);
  };
  
  const gradeColor = getGradeColor(grade);
  
  return (
    <>
      <Pressable 
        style={[
          styles.container, 
          { borderColor: gradeColor },
          disabled && styles.disabled
        ]} 
        onPress={onPress}
        onLongPress={handleLongPress}
        disabled={disabled}
        delayLongPress={300}
      >
        <View style={styles.header}>
          <Text style={styles.name}>{name}</Text>
          <View style={styles.energyBadge}>
            <Text style={styles.energyText}>{energy}</Text>
          </View>
        </View>
        
        <View style={styles.content}>
          {damage && (
            <Text style={styles.statText}>
              Damage: <Text style={styles.damageText}>{damage}{hits && hits > 1 ? ` x${hits}` : ''}</Text>
            </Text>
          )}
          {block && (
            <Text style={styles.statText}>
              Block: <Text style={styles.blockText}>{block}</Text>
            </Text>
          )}
          {heal && (
            <Text style={styles.statText}>
              Heal: <Text style={styles.healText}>{heal} HP</Text>
            </Text>
          )}
          {strength && (
            <Text style={styles.statText}>
              Strength: <Text style={styles.strengthText}>+{strength}</Text>
            </Text>
          )}
          {energyGain && (
            <Text style={styles.statText}>
              Energy: <Text style={styles.energyGainText}>+{energyGain}</Text>
            </Text>
          )}
          <Text style={styles.description}>{description}</Text>
        </View>
        
        {grade && grade !== 'common' && (
          <View style={[styles.gradeBadge, { backgroundColor: gradeColor }]}>
            <Text style={styles.gradeText}>{grade.toUpperCase()}</Text>
          </View>
        )}
        
        {upgraded && (
          <View style={styles.upgradeBadge}>
            <Text style={styles.upgradeText}>+</Text>
          </View>
        )}
      </Pressable>
      
      {/* Card Details Modal */}
      <Modal
        visible={showDetails}
        transparent={true}
        animationType="fade"
        onRequestClose={closeDetails}
      >
        <Pressable style={styles.modalOverlay} onPress={closeDetails}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{name}</Text>
              <View style={styles.modalEnergyBadge}>
                <Text style={styles.modalEnergyText}>{energy}</Text>
              </View>
            </View>
            
            <View style={styles.modalStats}>
              {damage && (
                <View style={styles.modalStatItem}>
                  <Text style={styles.modalStatLabel}>Damage:</Text>
                  <Text style={styles.modalDamageValue}>{damage}{hits && hits > 1 ? ` x${hits}` : ''}</Text>
                </View>
              )}
              
              {block && (
                <View style={styles.modalStatItem}>
                  <Text style={styles.modalStatLabel}>Block:</Text>
                  <Text style={styles.modalBlockValue}>{block}</Text>
                </View>
              )}
              
              {heal && (
                <View style={styles.modalStatItem}>
                  <Text style={styles.modalStatLabel}>Heal:</Text>
                  <Text style={styles.modalHealValue}>{heal} HP</Text>
                </View>
              )}
              
              {strength && (
                <View style={styles.modalStatItem}>
                  <Text style={styles.modalStatLabel}>Strength:</Text>
                  <Text style={styles.modalStrengthValue}>+{strength}</Text>
                </View>
              )}
              
              {energyGain && (
                <View style={styles.modalStatItem}>
                  <Text style={styles.modalStatLabel}>Energy:</Text>
                  <Text style={styles.modalEnergyGainValue}>+{energyGain}</Text>
                </View>
              )}
            </View>
            
            <Text style={styles.modalDescription}>{description}</Text>
            
            {upgraded && (
              <View style={styles.modalUpgradeBadge}>
                <Text style={styles.modalUpgradeText}>Upgraded</Text>
              </View>
            )}
            
            <Text style={styles.tapToClose}>Tap anywhere to close</Text>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 150,
    height: 200,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 10,
    borderWidth: 2,
    padding: 10,
    margin: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  disabled: {
    opacity: 0.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  name: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: 16,
    flex: 1,
  },
  energyBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.energy,
    justifyContent: 'center',
    alignItems: 'center',
  },
  energyText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  statText: {
    color: COLORS.textSecondary,
    marginBottom: 5,
    fontSize: 14,
  },
  damageText: {
    color: COLORS.danger,
    fontWeight: 'bold',
  },
  blockText: {
    color: COLORS.info,
    fontWeight: 'bold',
  },
  healText: {
    color: COLORS.success,
    fontWeight: 'bold',
  },
  strengthText: {
    color: COLORS.success,
    fontWeight: 'bold',
  },
  energyGainText: {
    color: COLORS.success,
    fontWeight: 'bold',
  },
  description: {
    color: COLORS.text,
    fontSize: 14,
    marginTop: 5,
  },
  upgradeBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.success,
    justifyContent: 'center',
    alignItems: 'center',
  },
  upgradeText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderRadius: 15,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    borderWidth: 2,
    borderColor: COLORS.cardBorder,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  modalEnergyBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.energy,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalEnergyText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 20,
  },
  modalStats: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  modalStatItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  modalStatLabel: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  modalDamageValue: {
    color: COLORS.danger,
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalBlockValue: {
    color: COLORS.info,
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalHealValue: {
    color: COLORS.success,
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalStrengthValue: {
    color: COLORS.success,
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalEnergyGainValue: {
    color: COLORS.success,
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalDescription: {
    color: COLORS.text,
    fontSize: 18,
    lineHeight: 24,
    marginBottom: 20,
  },
  modalUpgradeBadge: {
    backgroundColor: COLORS.success,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  modalUpgradeText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  tapToClose: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
  gradeBadge: {
    position: 'absolute',
    top: 5,
    left: 5,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 8,
    minWidth: 20,
    alignItems: 'center',
  },
  gradeText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 8,
  },
});