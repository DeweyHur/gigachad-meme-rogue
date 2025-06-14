import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, ScrollView, Modal } from 'react-native';
import { COLORS } from '@/constants/colors';
import { EquipmentType } from '@/types/game';
import Card from './Card';

type EquipmentSelectorProps = {
  equipment: EquipmentType[];
  currentEquipment: string;
  onSelect: (equipmentId: string) => void;
};

export default function EquipmentSelector({ 
  equipment, 
  currentEquipment, 
  onSelect 
}: EquipmentSelectorProps) {
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentType | null>(null);
  
  const handleEquipmentPress = (item: EquipmentType) => {
    setSelectedEquipment(item);
  };
  
  const handleCloseModal = () => {
    setSelectedEquipment(null);
  };
  
  const handleSelectEquipment = () => {
    if (selectedEquipment) {
      onSelect(selectedEquipment.id);
      setSelectedEquipment(null);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Equipment</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {equipment.map(item => (
          <Pressable
            key={item.id}
            style={[
              styles.equipmentItem,
              currentEquipment === item.id && styles.selectedEquipment,
            ]}
            onPress={() => handleEquipmentPress(item)}
          >
            <Image source={{ uri: item.image }} style={styles.equipmentImage} />
            <Text style={styles.equipmentName}>{item.name}</Text>
            {currentEquipment === item.id && (
              <View style={styles.equippedBadge}>
                <Text style={styles.equippedText}>Equipped</Text>
              </View>
            )}
          </Pressable>
        ))}
      </ScrollView>
      
      {/* Equipment Details Modal */}
      <Modal
        visible={selectedEquipment !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedEquipment && (
              <>
                <View style={styles.modalHeader}>
                  <Image source={{ uri: selectedEquipment.image }} style={styles.modalImage} />
                  <View style={styles.modalHeaderText}>
                    <Text style={styles.modalTitle}>{selectedEquipment.name}</Text>
                    <Text style={styles.modalDescription}>{selectedEquipment.description}</Text>
                  </View>
                </View>
                
                <Text style={styles.cardsTitle}>Cards:</Text>
                <ScrollView style={styles.cardsContainer}>
                  <View style={styles.cardsGrid}>
                    {selectedEquipment.cards.map((card, index) => (
                      <Card
                        key={`${card.id}-${index}`}
                        card={card}
                        disabled={true}
                      />
                    ))}
                  </View>
                </ScrollView>
                
                <View style={styles.modalButtons}>
                  {currentEquipment !== selectedEquipment.id && (
                    <Pressable style={styles.selectButton} onPress={handleSelectEquipment}>
                      <Text style={styles.buttonText}>Select Equipment</Text>
                    </Pressable>
                  )}
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
    padding: 10,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  equipmentItem: {
    width: 100,
    height: 130,
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 5,
    marginRight: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  selectedEquipment: {
    borderColor: COLORS.primary,
  },
  equipmentImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginBottom: 5,
  },
  equipmentName: {
    color: COLORS.text,
    fontSize: 12,
    textAlign: 'center',
  },
  equippedBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: COLORS.success,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
  },
  equippedText: {
    color: '#FFF',
    fontSize: 8,
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
    borderColor: COLORS.primary,
  },
  modalHeader: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  modalImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  modalHeaderText: {
    flex: 1,
    justifyContent: 'center',
  },
  modalTitle: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  modalDescription: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  cardsTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardsContainer: {
    maxHeight: 350,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  selectButton: {
    backgroundColor: COLORS.success,
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