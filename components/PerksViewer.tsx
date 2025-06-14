import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, ScrollView } from 'react-native';
import { COLORS } from '@/constants/colors';
import { PerkType } from '@/types/game';

type PerksViewerProps = {
  perks: PerkType[];
};

export default function PerksViewer({ perks }: PerksViewerProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  const handleOpen = () => {
    setIsVisible(true);
  };
  
  const handleClose = () => {
    setIsVisible(false);
  };
  
  return (
    <>
      <Pressable style={styles.viewButton} onPress={handleOpen}>
        <Text style={styles.viewText}>Perks ({perks.length})</Text>
      </Pressable>
      
      <Modal
        visible={isVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Your Perks</Text>
            
            {perks.length > 0 ? (
              <ScrollView style={styles.perksList}>
                {perks.map(perk => (
                  <View key={perk.id} style={styles.perkCard}>
                    <Text style={styles.perkName}>{perk.name}</Text>
                    <Text style={styles.perkEffect}>{perk.effect}</Text>
                    <Text style={styles.perkDescription}>{perk.description}</Text>
                  </View>
                ))}
              </ScrollView>
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  You don't have any perks yet. Defeat bosses to earn powerful perks!
                </Text>
              </View>
            )}
            
            <Pressable style={styles.closeButton} onPress={handleClose}>
              <Text style={styles.buttonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  viewButton: {
    backgroundColor: COLORS.info,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignSelf: 'center',
    marginVertical: 10,
  },
  viewText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderRadius: 15,
    padding: 20,
    width: '95%',
    height: '80%',
    maxWidth: 500,
    borderWidth: 2,
    borderColor: COLORS.info,
  },
  title: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  perksList: {
    flex: 1,
    marginBottom: 20,
  },
  perkCard: {
    backgroundColor: COLORS.cardBackground,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  perkName: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  perkEffect: {
    color: COLORS.primary,
    fontSize: 16,
    marginBottom: 5,
  },
  perkDescription: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 24,
  },
  closeButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});