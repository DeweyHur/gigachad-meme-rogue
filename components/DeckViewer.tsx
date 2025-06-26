import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, ScrollView } from 'react-native';
import { COLORS, getGradeColor } from '@/constants/colors';
import { CardType, EquipmentType, EquippedItemsType } from '@/types/game';
import Card from './Card';

type DeckViewerProps = {
  equipment: EquipmentType[];
  equippedItems: EquippedItemsType;
};

export default function DeckViewer({ 
  equipment, 
  equippedItems
}: DeckViewerProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  const handleOpen = () => {
    setIsVisible(true);
  };
  
  const handleClose = () => {
    setIsVisible(false);
  };
  
  // Get all cards from all equipped equipment
  const getAllDeckCards = (): Array<{card: CardType, equipment: EquipmentType, slot: string}> => {
    const allCards: Array<{card: CardType, equipment: EquipmentType, slot: string}> = [];
    
    Object.entries(equippedItems).forEach(([slot, equipmentId]) => {
      if (!equipmentId) return;
      
      const equip = equipment.find(e => e.id === equipmentId);
      if (!equip) return;
      
      // Add all cards from this equipment
      equip.cards.forEach(card => {
        for (let i = 0; i < (card.quantity || 1); i++) {
          allCards.push({ card: { ...card }, equipment: equip, slot });
        }
      });
    });
    
    return allCards;
  };
  
  const deckCards = getAllDeckCards();
  
  // Group cards by equipment for display
  const cardsByEquipment = deckCards.reduce((acc, { card, equipment, slot }) => {
    const key = `${equipment.id}-${slot}`;
    if (!acc[key]) {
      acc[key] = {
        equipment,
        slot,
        cards: []
      };
    }
    acc[key].cards.push(card);
    return acc;
  }, {} as Record<string, { equipment: EquipmentType, slot: string, cards: CardType[] }>);
  
  const slotNames: Record<string, string> = {
    weapon: 'Weapon',
    head: 'Head',
    chest: 'Chest', 
    offhand: 'Offhand',
    feet: 'Feet',
    accessory1: 'Accessory 1',
    accessory2: 'Accessory 2'
  };
  
  return (
    <>
      <Pressable style={styles.viewDeckButton} onPress={handleOpen}>
        <Text style={styles.viewDeckText}>View Deck ({deckCards.length})</Text>
      </Pressable>
      
      <Modal
        visible={isVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Your Complete Deck</Text>
            <Text style={styles.subtitle}>{deckCards.length} total cards</Text>
            
            <ScrollView style={styles.cardsContainer}>
              {Object.entries(cardsByEquipment).map(([key, { equipment, slot, cards }]) => (
                <View key={key} style={styles.equipmentSection}>
                  <View style={styles.equipmentHeader}>
                    <Text style={styles.equipmentName}>{equipment.name}</Text>
                    <Text style={styles.slotName}>{slotNames[slot]}</Text>
                    {equipment.grade && equipment.grade !== 'common' && (
                      <View style={[styles.gradeBadge, { backgroundColor: getGradeColor(equipment.grade) }]}>
                        <Text style={styles.gradeText}>{equipment.grade.toUpperCase()}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.cardCount}>{cards.length} cards</Text>
                  
                  <View style={styles.cardsGrid}>
                    {cards.map((card, index) => (
                      <View key={`${card.id}-${index}`} style={styles.cardWrapper}>
                        <Card card={card} disabled={true} />
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </ScrollView>
            
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
    maxWidth: 800,
    borderWidth: 2,
    borderColor: COLORS.secondary,
  },
  title: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 16,
    marginBottom: 15,
    textAlign: 'center',
  },
  cardsContainer: {
    flex: 1,
    marginBottom: 15,
  },
  equipmentSection: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
  },
  equipmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    flexWrap: 'wrap',
  },
  equipmentName: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  slotName: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 10,
  },
  gradeBadge: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
  },
  gradeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardCount: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: 10,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  cardWrapper: {
    margin: 2,
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