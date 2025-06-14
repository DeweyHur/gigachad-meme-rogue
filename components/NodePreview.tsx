import React from 'react';
import { View, Text, StyleSheet, Pressable, Modal, Image } from 'react-native';
import { COLORS } from '@/constants/colors';
import { NodeType, EnemyType, BossType } from '@/types/game';

type NodePreviewProps = {
  node: NodeType | null;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function NodePreview({ node, onConfirm, onCancel }: NodePreviewProps) {
  if (!node) return null;
  
  const getNodeTitle = () => {
    switch (node.type) {
      case 'battle': return 'Battle';
      case 'shop': return 'Shop';
      case 'event': return 'Random Event';
      case 'camp': return 'Rest Site';
      case 'shrine': return 'Ancient Shrine';
      case 'blacksmith': return 'Blacksmith';
      case 'boss': return 'Boss Battle';
      case 'start': return 'Starting Point';
      default: return 'Unknown';
    }
  };
  
  const getNodeDescription = () => {
    switch (node.type) {
      case 'battle': 
        return node.content ? 
          `Fight against ${node.content.name}. Prepare for battle!` : 
          'Face an enemy in combat. Defeat them to earn rewards.';
      case 'shop': 
        return 'Purchase cards, potions, and relics to strengthen your deck.';
      case 'event': 
        return node.content ? 
          node.content.description : 
          'Encounter a random event. Your choices may lead to rewards or penalties.';
      case 'camp': 
        return 'Rest to recover health and prepare for upcoming challenges.';
      case 'shrine': 
        return 'Pray at an ancient shrine for blessings or take a risk for greater rewards.';
      case 'blacksmith': 
        return 'Upgrade your equipment and cards to make them more powerful.';
      case 'boss': 
        return node.content ? 
          `Boss Battle: ${node.content.name}. ${node.content.description}` : 
          'Face a powerful boss. Defeat it to progress further.';
      case 'start': 
        return 'Your journey begins here.';
      default: 
        return 'Unknown location ahead.';
    }
  };
  
  const getNodeIcon = () => {
    switch (node.type) {
      case 'battle': return '⚔️';
      case 'shop': return '🛒';
      case 'event': return '❓';
      case 'camp': return '🏕️';
      case 'shrine': return '🔮';
      case 'blacksmith': return '⚒️';
      case 'boss': return '👑';
      case 'start': return '🏠';
      default: return '•';
    }
  };
  
  // Get enemy image if it's a battle or boss node
  const getEnemyImage = () => {
    if ((node.type === 'battle' || node.type === 'boss') && node.content) {
      const enemy = node.content as EnemyType | BossType;
      return enemy.image;
    }
    return null;
  };
  
  const enemyImage = getEnemyImage();
  
  return (
    <Modal
      visible={!!node}
      transparent={true}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.iconContainer}>
            <Text style={styles.nodeIcon}>{getNodeIcon()}</Text>
          </View>
          
          <Text style={styles.title}>{getNodeTitle()}</Text>
          
          {enemyImage && (
            <Image source={{ uri: enemyImage }} style={styles.enemyImage} />
          )}
          
          <Text style={styles.description}>{getNodeDescription()}</Text>
          
          <View style={styles.buttonContainer}>
            <Pressable style={styles.confirmButton} onPress={onConfirm}>
              <Text style={styles.buttonText}>Proceed</Text>
            </Pressable>
            <Pressable style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
          </View>
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
    borderColor: COLORS.primary,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  nodeIcon: {
    fontSize: 30,
  },
  title: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  enemyImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 15,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  confirmButton: {
    backgroundColor: COLORS.success,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: COLORS.danger,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});