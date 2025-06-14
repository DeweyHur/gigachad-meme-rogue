import React from 'react';
import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import { COLORS } from '@/constants/colors';
import { RewardType } from '@/types/game';

type RewardPopupProps = {
  reward: RewardType | null;
  onClose: () => void;
};

export default function RewardPopup({ reward, onClose }: RewardPopupProps) {
  if (!reward) return null;
  
  const getRewardTitle = () => {
    switch (reward.type) {
      case 'gold': return 'Gold Reward';
      case 'heal': return 'Healing';
      case 'maxHealth': return 'Max Health Increased';
      case 'strength': return 'Strength Buff';
      case 'equipment': return 'New Equipment';
      case 'card': return 'New Card';
      case 'perk': return 'New Perk';
      case 'upgrade': return 'Card Upgraded';
      case 'curse': return 'Cursed!';
      default: return 'Reward';
    }
  };
  
  const getRewardIcon = () => {
    switch (reward.type) {
      case 'gold': return '💰';
      case 'heal': return '❤️';
      case 'maxHealth': return '💗';
      case 'strength': return '💪';
      case 'equipment': return '🛡️';
      case 'card': return '🃏';
      case 'perk': return '🏆';
      case 'upgrade': return '⚡';
      case 'curse': return '☠️';
      default: return '🎁';
    }
  };
  
  const getRewardDescription = () => {
    switch (reward.type) {
      case 'gold': 
        return `You received ${reward.amount} gold!`;
      case 'heal': 
        return `You recovered ${reward.amount} health points.`;
      case 'maxHealth': 
        return `Your maximum health increased by ${reward.amount} points.`;
      case 'strength': 
        return `You gained ${reward.amount} strength.`;
      case 'equipment': 
        return reward.description ? 
          `You acquired ${reward.name}: ${reward.description}` : 
          `You acquired ${reward.name}!`;
      case 'card': 
        return reward.description ? 
          `Added to your deck: ${reward.name} - ${reward.description}` : 
          `Added to your deck: ${reward.name}`;
      case 'perk': 
        return reward.description ? 
          `New perk: ${reward.name} - ${reward.description}` : 
          `New perk: ${reward.name}`;
      case 'upgrade': 
        return `Your card ${reward.name} has been upgraded!`;
      case 'curse': 
        return reward.description ? 
          `Cursed with: ${reward.name} - ${reward.description}` : 
          `Cursed with: ${reward.name}`;
      default: 
        return 'You received a reward!';
    }
  };
  
  return (
    <Modal
      visible={!!reward}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.iconContainer}>
            <Text style={styles.rewardIcon}>{getRewardIcon()}</Text>
          </View>
          
          <Text style={styles.title}>{getRewardTitle()}</Text>
          <Text style={styles.description}>{getRewardDescription()}</Text>
          
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.buttonText}>Continue</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.secondary,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: COLORS.secondary,
  },
  rewardIcon: {
    fontSize: 36,
  },
  title: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  closeButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});