import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, ScrollView, Image } from 'react-native';
import { COLORS } from '@/constants/colors';
import { CardType, EquipmentType } from '@/types/game';
import Card from './Card';

type DeckViewerProps = {
  equipment: EquipmentType[];
  currentEquipment: string;
  onChangeEquipment: (equipmentId: string) => void;
};

export default function DeckViewer({ 
  equipment, 
  currentEquipment, 
  onChangeEquipment 
}: DeckViewerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<string>(currentEquipment);
  const [showEquipmentDetails, setShowEquipmentDetails] = useState<EquipmentType | null>(null);
  
  const handleOpen = () => {
    setIsVisible(true);
    setSelectedEquipment(currentEquipment);
  };
  
  const handleClose = () => {
    setIsVisible(false);
  };
  
  const handleSave = () => {
    onChangeEquipment(selectedEquipment);
    setIsVisible(false);
  };
  
  const getCurrentEquipmentCards = () => {
    const equip = equipment.find(e => e.id === selectedEquipment);
    return equip ? equip.cards : [];
  };
  
  const handleEquipmentDetails = (equip: EquipmentType) => {
    setShowEquipmentDetails(equip);
  };
  
  const closeEquipmentDetails = () => {
    setShowEquipmentDetails(null);
  };
  
  return (
    <>
      <Pressable style={styles.viewDeckButton} onPress={handleOpen}>
        <Text style={styles.viewDeckText}>View Deck</Text>
      </Pressable>
      
      <Modal
        visible={isVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Your Deck</Text>
            
            <View style={styles.equipmentSelector}>
              <Text style={styles.sectionTitle}>Select Equipment:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {equipment.map(item => (
                  <Pressable
                    key={item.id}
                    style={[
                      styles.equipmentItem,
                      selectedEquipment === item.id && styles.selectedEquipment,
                    ]}
                    onPress={() => setSelectedEquipment(item.id)}
                    onLongPress={() => handleEquipmentDetails(item)}
                  >
                    <Image source={{ uri: item.image }} style={styles.equipmentImage} />
                    <Text style={styles.equipmentName}>{item.name}</Text>
                    {item.id === currentEquipment && (
                      <View style={styles.equippedBadge}>
                        <Text style={styles.equippedText}>Equipped</Text>
                      </View>
                    )}
                  </Pressable>
                ))}
              </ScrollView>
              <Text style={styles.equipmentHint}>Long press on equipment to see details</Text>
            </View>
            
            <View style={styles.deckInfo}>
              <Text style={styles.sectionTitle}>Cards in Deck:</Text>
              <Text style={styles.cardCount}>{getCurrentEquipmentCards().length} cards</Text>
            </View>
            
            <ScrollView style={styles.cardsContainer}>
              <View style={styles.cardsGrid}>
                {getCurrentEquipmentCards().map((card, index) => (
                  <Card
                    key={`${card.id}-${index}`}
                    card={card}
                    disabled={true}
                  />
                ))}
              </View>
            </ScrollView>
            
            <View style={styles.buttonContainer}>
              <Pressable 
                style={[
                  styles.saveButton,
                  selectedEquipment === currentEquipment && styles.disabledButton
                ]} 
                onPress={handleSave}
                disabled={selectedEquipment === currentEquipment}
              >
                <Text style={styles.buttonText}>Equip Selected</Text>
              </Pressable>
              <Pressable style={styles.closeButton} onPress={handleClose}>
                <Text style={styles.buttonText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Equipment Details Modal */}
      <Modal
        visible={showEquipmentDetails !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={closeEquipmentDetails}
      >
        {showEquipmentDetails && (
          <View style={styles.detailsOverlay}>
            <View style={styles.detailsContent}>
              <View style={styles.detailsHeader}>
                <Image source={{ uri: showEquipmentDetails.image }} style={styles.detailsImage} />
                <View style={styles.detailsHeaderText}>
                  <Text style={styles.detailsTitle}>{showEquipmentDetails.name}</Text>
                  <Text style={styles.detailsDescription}>{showEquipmentDetails.description}</Text>
                </View>
              </View>
              
              <Text style={styles.detailsCardsTitle}>Cards in this equipment:</Text>
              <ScrollView style={styles.detailsCardsContainer}>
                <View style={styles.detailsCardsGrid}>
                  {showEquipmentDetails.cards.map((card, index) => (
                    <Card
                      key={`detail-${card.id}-${index}`}
                      card={card}
                      disabled={true}
                    />
                  ))}
                </View>
              </ScrollView>
              
              <Pressable style={styles.detailsCloseButton} onPress={closeEquipmentDetails}>
                <Text style={styles.buttonText}>Close</Text>
              </Pressable>
            </View>
          </View>
        )}
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  viewDeckButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignSelf: 'center',
    marginVertical: 10,
  },
  viewDeckText: {
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
    height: '90%',
    maxWidth: 600,
    borderWidth: 2,
    borderColor: COLORS.secondary,
  },
  title: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  equipmentSelector: {
    marginBottom: 15,
  },
  equipmentItem: {
    width: 100,
    height: 130,
    backgroundColor: COLORS.cardBackground,
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    position: 'relative',
  },
  selectedEquipment: {
    borderColor: COLORS.primary,
  },
  equipmentImage: {
    width: 70,
    height: 70,
    borderRadius: 5,
    marginBottom: 5,
  },
  equipmentName: {
    color: COLORS.text,
    fontWeight: 'bold',
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
  equipmentHint: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  deckInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardCount: {
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  cardsContainer: {
    flex: 1,
    marginBottom: 15,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: COLORS.success,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },
  disabledButton: {
    backgroundColor: COLORS.cardBackground,
    opacity: 0.7,
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
  
  // Equipment details modal styles
  detailsOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  detailsContent: {
    backgroundColor: COLORS.background,
    borderRadius: 15,
    padding: 20,
    width: '95%',
    maxHeight: '90%',
    maxWidth: 500,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  detailsHeader: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  detailsImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 15,
  },
  detailsHeaderText: {
    flex: 1,
    justifyContent: 'center',
  },
  detailsTitle: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  detailsDescription: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  detailsCardsTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailsCardsContainer: {
    maxHeight: 350,
    marginBottom: 15,
  },
  detailsCardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  detailsCloseButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'center',
  },
});