import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, ScrollView, Modal } from 'react-native';
import { COLORS } from '@/constants/colors';
import { BossType } from '@/types/game';

type BossSelectorProps = {
  bosses: BossType[];
  defeatedBosses: string[];
  onSelect: (bossId: string) => void;
};

export default function BossSelector({ 
  bosses, 
  defeatedBosses, 
  onSelect 
}: BossSelectorProps) {
  const [selectedBoss, setSelectedBoss] = useState<BossType | null>(null);
  
  const handleBossPress = (boss: BossType) => {
    setSelectedBoss(boss);
  };
  
  const handleCloseModal = () => {
    setSelectedBoss(null);
  };
  
  const handleSelectBoss = () => {
    if (selectedBoss) {
      onSelect(selectedBoss.id);
      setSelectedBoss(null);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Opponent</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {bosses.map(boss => {
          const isDefeated = defeatedBosses.includes(boss.id);
          
          return (
            <Pressable
              key={boss.id}
              style={[
                styles.bossItem,
                isDefeated && styles.defeatedBoss,
              ]}
              onPress={() => handleBossPress(boss)}
            >
              <Image source={{ uri: boss.image }} style={styles.bossImage} />
              <Text style={styles.bossName}>{boss.name}</Text>
              {isDefeated && (
                <View style={styles.defeatedBadge}>
                  <Text style={styles.defeatedText}>Defeated</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>
      
      {/* Boss Details Modal */}
      <Modal
        visible={selectedBoss !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedBoss && (
              <>
                <View style={styles.modalHeader}>
                  <Image source={{ uri: selectedBoss.image }} style={styles.modalImage} />
                  <View style={styles.modalHeaderText}>
                    <Text style={styles.modalTitle}>{selectedBoss.name}</Text>
                    <Text style={styles.modalHealth}>Health: {selectedBoss.health}</Text>
                  </View>
                </View>
                
                <Text style={styles.modalDescription}>{selectedBoss.description}</Text>
                
                <Text style={styles.abilitiesTitle}>Abilities:</Text>
                <ScrollView style={styles.abilitiesContainer}>
                  {selectedBoss.abilities.map((ability, index) => (
                    <View key={index} style={styles.abilityItem}>
                      <Text style={styles.abilityName}>{ability.name}</Text>
                      <Text style={styles.abilityDescription}>{ability.description}</Text>
                      {ability.damage && (
                        <Text style={styles.abilityDamage}>Damage: {ability.damage}</Text>
                      )}
                    </View>
                  ))}
                </ScrollView>
                
                <View style={styles.rewardContainer}>
                  <Text style={styles.rewardTitle}>Reward:</Text>
                  <Text style={styles.rewardName}>{selectedBoss.reward.name}</Text>
                  <Text style={styles.rewardEffect}>{selectedBoss.reward.effect}</Text>
                </View>
                
                <View style={styles.modalButtons}>
                  <Pressable style={styles.selectButton} onPress={handleSelectBoss}>
                    <Text style={styles.buttonText}>Challenge Boss</Text>
                  </Pressable>
                  <Pressable style={styles.closeButton} onPress={handleCloseModal}>
                    <Text style={styles.buttonText}>Close</Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  bossItem: {
    width: 150,
    height: 200,
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 10,
    marginRight: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.danger,
    position: 'relative',
  },
  defeatedBoss: {
    borderColor: COLORS.success,
    opacity: 0.8,
  },
  bossImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  bossName: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  defeatedBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: COLORS.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  defeatedText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
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
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
    borderWidth: 2,
    borderColor: COLORS.danger,
  },
  modalHeader: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  modalImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 15,
  },
  modalHeaderText: {
    flex: 1,
    justifyContent: 'center',
  },
  modalTitle: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  modalHealth: {
    color: COLORS.health,
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalDescription: {
    color: COLORS.textSecondary,
    fontSize: 16,
    marginBottom: 15,
    lineHeight: 22,
  },
  abilitiesTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  abilitiesContainer: {
    maxHeight: 150,
  },
  abilityItem: {
    backgroundColor: COLORS.cardBackground,
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  abilityName: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  abilityDescription: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: 5,
  },
  abilityDamage: {
    color: COLORS.danger,
    fontSize: 14,
    fontWeight: 'bold',
  },
  rewardContainer: {
    backgroundColor: COLORS.cardBackground,
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
    marginBottom: 15,
  },
  rewardTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  rewardName: {
    color: COLORS.secondary,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  rewardEffect: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  selectButton: {
    backgroundColor: COLORS.danger,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  closeButton: {
    backgroundColor: COLORS.secondary,
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