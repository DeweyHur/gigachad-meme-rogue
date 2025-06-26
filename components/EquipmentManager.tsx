import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, ScrollView, Image } from 'react-native';
import { COLORS, getGradeColor } from '@/constants/colors';
import { EquipmentType, EquipmentSlotType, EquippedItemsType } from '@/types/game';
import Card from './Card';

type EquipmentManagerProps = {
  equipment: EquipmentType[];
  equippedItems: EquippedItemsType;
  onEquip: (equipmentId: string, slot: EquipmentSlotType) => void;
};

const SLOT_NAMES: Record<EquipmentSlotType, string> = {
  head: 'Head',
  chest: 'Chest',
  weapon: 'Weapon',
  offhand: 'Off-hand',
  legs: 'Legs',
  feet: 'Feet',
  accessory1: 'Accessory 1',
  accessory2: 'Accessory 2'
};

export default function EquipmentManager({ 
  equipment, 
  equippedItems, 
  onEquip
}: EquipmentManagerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<EquipmentSlotType | null>(null);
  const [showEquipmentDetails, setShowEquipmentDetails] = useState<EquipmentType | null>(null);
  
  const handleOpen = () => {
    setIsVisible(true);
  };
  
  const handleClose = () => {
    setIsVisible(false);
    setSelectedSlot(null);
  };
  
  const handleSlotSelect = (slot: EquipmentSlotType) => {
    setSelectedSlot(slot);
  };
  
  const handleEquip = (equipmentId: string) => {
    if (selectedSlot) {
      onEquip(equipmentId, selectedSlot);
      setSelectedSlot(null);
    }
  };
  
  const handleEquipmentDetails = (equip: EquipmentType) => {
    setShowEquipmentDetails(equip);
  };
  
  const closeEquipmentDetails = () => {
    setShowEquipmentDetails(null);
  };
  
  const getEquippedItemName = (slot: EquipmentSlotType) => {
    const equipmentId = equippedItems[slot];
    if (!equipmentId) return 'None';
    
    const item = equipment.find(e => e.id === equipmentId);
    return item ? item.name : 'None';
  };
  
  const getEquipmentForSlot = (slot: EquipmentSlotType) => {
    return equipment.filter(e => e.slot === slot);
  };
  
  return (
    <>
      <Pressable style={styles.manageButton} onPress={handleOpen}>
        <Text style={styles.manageText}>Manage Equipment</Text>
      </Pressable>
      
      <Modal
        visible={isVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Equipment Manager</Text>
            
            {!selectedSlot ? (
              // Show all equipment slots
              <View style={styles.slotsContainer}>
                {Object.entries(SLOT_NAMES).map(([slot, name]) => (
                  <Pressable
                    key={slot}
                    style={styles.slotItem}
                    onPress={() => handleSlotSelect(slot as EquipmentSlotType)}
                  >
                    <Text style={styles.slotName}>{name}</Text>
                    <Text style={styles.equippedName}>
                      {getEquippedItemName(slot as EquipmentSlotType)}
                    </Text>
                  </Pressable>
                ))}
              </View>
            ) : (
              // Show equipment for selected slot
              <View style={styles.equipmentSelector}>
                <Text style={styles.sectionTitle}>
                  Select {SLOT_NAMES[selectedSlot]} Equipment:
                </Text>
                
                <ScrollView style={styles.equipmentList}>
                  <View style={styles.equipmentGrid}>
                    {getEquipmentForSlot(selectedSlot).map(item => (
                      <Pressable
                        key={item.id}
                        style={[
                          styles.equipmentItem,
                          { borderColor: getGradeColor(item.grade) },
                          equippedItems[selectedSlot] === item.id && styles.selectedEquipment,
                        ]}
                        onPress={() => handleEquip(item.id)}
                        onLongPress={() => handleEquipmentDetails(item)}
                      >
                        <Image source={{ uri: item.image }} style={styles.equipmentImage} />
                        <Text style={styles.equipmentName}>{item.name}</Text>
                        {item.grade && item.grade !== 'common' && (
                          <View style={[styles.gradeBadge, { backgroundColor: getGradeColor(item.grade) }]}>
                            <Text style={styles.gradeText}>{item.grade.toUpperCase()}</Text>
                          </View>
                        )}
                        {equippedItems[selectedSlot] === item.id && (
                          <View style={styles.equippedBadge}>
                            <Text style={styles.equippedText}>Equipped</Text>
                          </View>
                        )}
                      </Pressable>
                    ))}
                    
                    {getEquipmentForSlot(selectedSlot).length === 0 && (
                      <Text style={styles.noEquipmentText}>
                        No {SLOT_NAMES[selectedSlot]} equipment available
                      </Text>
                    )}
                  </View>
                </ScrollView>
                
                <Pressable style={styles.backButton} onPress={() => setSelectedSlot(null)}>
                  <Text style={styles.buttonText}>Back to Slots</Text>
                </Pressable>
              </View>
            )}
            
            <Pressable style={styles.closeButton} onPress={handleClose}>
              <Text style={styles.buttonText}>Close</Text>
            </Pressable>
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
                  <Text style={styles.detailsSlot}>Slot: {SLOT_NAMES[showEquipmentDetails.slot]}</Text>
                  {showEquipmentDetails.grade && (
                    <Text style={[styles.detailsGrade, { color: getGradeColor(showEquipmentDetails.grade) }]}>
                      Grade: {showEquipmentDetails.grade.toUpperCase()}
                    </Text>
                  )}
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
              
              {selectedSlot && showEquipmentDetails.slot === selectedSlot && (
                <Pressable 
                  style={styles.equipButton} 
                  onPress={() => {
                    handleEquip(showEquipmentDetails.id);
                    closeEquipmentDetails();
                  }}
                >
                  <Text style={styles.buttonText}>Equip</Text>
                </Pressable>
              )}
              
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
  manageButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignSelf: 'center',
    marginVertical: 10,
  },
  manageText: {
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
    marginBottom: 20,
    textAlign: 'center',
  },
  slotsContainer: {
    flex: 1,
    marginBottom: 20,
  },
  slotItem: {
    backgroundColor: COLORS.cardBackground,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  slotName: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  equippedName: {
    color: COLORS.textSecondary,
    fontSize: 16,
    flex: 2,
  },
  equipmentSelector: {
    flex: 1,
    marginBottom: 20,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  equipmentList: {
    flex: 1,
    marginBottom: 15,
  },
  equipmentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  equipmentItem: {
    width: '48%',
    backgroundColor: COLORS.cardBackground,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
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
    marginBottom: 10,
  },
  equipmentName: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: 14,
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
    fontSize: 10,
    fontWeight: 'bold',
  },
  noEquipmentText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    width: '100%',
  },
  backButton: {
    backgroundColor: COLORS.info,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
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
  detailsSlot: {
    color: COLORS.primary,
    fontSize: 16,
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
  equipButton: {
    backgroundColor: COLORS.success,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 10,
  },
  detailsCloseButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'center',
  },
  gradeBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
  },
  gradeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  detailsGrade: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
});