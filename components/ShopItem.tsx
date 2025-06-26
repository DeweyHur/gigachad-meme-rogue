import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, Image } from 'react-native';
import { COLORS, getGradeColor } from '@/constants/colors';
import Card from './Card';
import { ShopItemType, EquipmentType } from '@/types/game';
import { EQUIPMENT } from '@/constants/game';

type ShopItemProps = {
  item: ShopItemType;
  onBuy: () => void;
  canAfford: boolean;
};

export default function ShopItem({ item, onBuy, canAfford }: ShopItemProps) {
  const { type, name, damage, block, energy, description, effect, price, id } = item;
  const [showDetails, setShowDetails] = useState(false);
  
  // Get equipment details if it's an equipment item
  const equipmentDetails = type === 'equipment' && id ? 
    EQUIPMENT.find(e => e.id === id) : undefined;
  
  // For cards, try to infer grade from equipment pool (first match by name)
  let cardGrade: string | undefined = undefined;
  if (type === 'card') {
    for (const eq of EQUIPMENT) {
      const found = eq.cards.find(c => c.name === name);
      if (found) {
        cardGrade = found.grade;
        break;
      }
    }
  }

  // For equipment, get grade from equipmentDetails
  const equipmentGrade = equipmentDetails?.grade;

  // Badge color
  const gradeColor = getGradeColor(equipmentGrade || (cardGrade as any));
  
  const getItemIcon = () => {
    switch (type) {
      case 'card': return '🃏';
      case 'potion': return '🧪';
      case 'relic': return '🏆';
      case 'equipment': return '🛡️';
      default: return '📦';
    }
  };
  
  const handlePress = () => {
    if (canAfford) {
      onBuy();
    }
  };
  
  const handleLongPress = () => {
    setShowDetails(true);
  };
  
  const closeDetails = () => {
    setShowDetails(false);
  };
  
  return (
    <>
      <Pressable
        style={[
          styles.container,
          !canAfford && styles.cantAfford,
        ]}
        onPress={handlePress}
        onLongPress={handleLongPress}
        disabled={!canAfford}
        delayLongPress={300}
      >
        <View style={styles.header}>
          <Text style={styles.icon}>{getItemIcon()}</Text>
          <Text style={styles.name}>{name}</Text>
          {/* Grade badge for equipment and cards */}
          {(equipmentGrade && equipmentGrade !== 'common') && (
            <View style={[styles.gradeBadge, { backgroundColor: getGradeColor(equipmentGrade) }]}> 
              <Text style={styles.gradeText}>{equipmentGrade.toUpperCase()}</Text>
            </View>
          )}
          {(cardGrade && cardGrade !== 'common') && (
            <View style={[styles.gradeBadge, { backgroundColor: getGradeColor(cardGrade as any) }]}> 
              <Text style={styles.gradeText}>{cardGrade.toUpperCase()}</Text>
            </View>
          )}
        </View>
        
        <View style={styles.content}>
          {type === 'card' && (
            <>
              {energy !== undefined && (
                <Text style={styles.statText}>Energy: {energy}</Text>
              )}
              {damage !== undefined && (
                <Text style={styles.statText}>Damage: <Text style={styles.damageText}>{damage}</Text></Text>
              )}
              {block !== undefined && (
                <Text style={styles.statText}>Block: <Text style={styles.blockText}>{block}</Text></Text>
              )}
              {description && (
                <Text style={styles.description}>{description}</Text>
              )}
            </>
          )}
          
          {type === 'potion' && effect && (
            <Text style={styles.description}>{effect}</Text>
          )}
          
          {type === 'relic' && (
            <Text style={styles.description}>{item.effect}</Text>
          )}
          
          {type === 'equipment' && (
            <Text style={styles.description}>Equipment: {name}</Text>
          )}
        </View>
        
        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>{price} Gold</Text>
        </View>
        
        <Text style={styles.detailsHint}>Long press for details</Text>
      </Pressable>
      
      {/* Item Details Modal */}
      <Modal
        visible={showDetails}
        transparent={true}
        animationType="fade"
        onRequestClose={closeDetails}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalIcon}>{getItemIcon()}</Text>
              <Text style={styles.modalTitle}>{name}</Text>
              {/* Grade badge in modal */}
              {(equipmentGrade && equipmentGrade !== 'common') && (
                <View style={[styles.gradeBadge, { backgroundColor: getGradeColor(equipmentGrade) }]}> 
                  <Text style={styles.gradeText}>{equipmentGrade.toUpperCase()}</Text>
                </View>
              )}
              {(cardGrade && cardGrade !== 'common') && (
                <View style={[styles.gradeBadge, { backgroundColor: getGradeColor(cardGrade as any) }]}> 
                  <Text style={styles.gradeText}>{cardGrade.toUpperCase()}</Text>
                </View>
              )}
            </View>
            
            {type === 'card' && (
              <View style={styles.cardPreview}>
                <Card
                  card={{
                    id: name.toLowerCase().replace(/\s+/g, '_'),
                    name,
                    energy: energy || 0,
                    description: description || "",
                    damage,
                    block,
                  }}
                  disabled={true}
                />
              </View>
            )}
            
            {type === 'equipment' && equipmentDetails && (
              <View style={styles.equipmentPreview}>
                <Image source={{ uri: equipmentDetails.image }} style={styles.equipmentImage} />
                <Text style={styles.equipmentDescription}>{equipmentDetails.description}</Text>
                <Text style={styles.equipmentSlot}>Slot: {equipmentDetails.slot}</Text>
                
                <Text style={styles.cardsTitle}>Cards:</Text>
                <View style={styles.cardsContainer}>
                  {equipmentDetails.cards.slice(0, 2).map((card, index) => (
                    <Card
                      key={`${card.id}-${index}`}
                      card={card}
                      disabled={true}
                    />
                  ))}
                  {equipmentDetails.cards.length > 2 && (
                    <Text style={styles.moreCardsText}>+{equipmentDetails.cards.length - 2} more cards</Text>
                  )}
                </View>
              </View>
            )}
            
            <View style={styles.modalDetails}>
              <Text style={styles.modalSectionTitle}>Type:</Text>
              <Text style={styles.modalTypeText}>
                {type === 'card' ? 'Card' : type === 'potion' ? 'Potion' : type === 'equipment' ? 'Equipment' : 'Relic'}
              </Text>
              
              {type === 'potion' && effect && (
                <>
                  <Text style={styles.modalSectionTitle}>Effect:</Text>
                  <Text style={styles.modalEffectText}>{effect}</Text>
                </>
              )}
              
              {type === 'relic' && item.effect && (
                <>
                  <Text style={styles.modalSectionTitle}>Effect:</Text>
                  <Text style={styles.modalEffectText}>{item.effect}</Text>
                </>
              )}
              
              {type === 'equipment' && (
                <>
                  <Text style={styles.modalSectionTitle}>Equipment:</Text>
                  <Text style={styles.modalEffectText}>Adds new cards to your deck</Text>
                </>
              )}
              
              <Text style={styles.modalSectionTitle}>Price:</Text>
              <Text style={styles.modalPriceText}>{price} Gold</Text>
            </View>
            
            <View style={styles.modalButtons}>
              {canAfford && (
                <Pressable style={styles.buyButton} onPress={() => { onBuy(); closeDetails(); }}>
                  <Text style={styles.buttonText}>Buy</Text>
                </Pressable>
              )}
              <Pressable style={styles.closeButton} onPress={closeDetails}>
                <Text style={styles.buttonText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 10,
    padding: 15,
    margin: 10,
    width: 180,
    minHeight: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  cantAfford: {
    opacity: 0.5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    fontSize: 24,
    marginRight: 10,
  },
  name: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  content: {
    flex: 1,
  },
  statText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: 5,
  },
  damageText: {
    color: COLORS.danger,
  },
  blockText: {
    color: COLORS.info,
  },
  description: {
    color: COLORS.text,
    fontSize: 14,
    marginTop: 5,
    marginBottom: 10,
  },
  priceContainer: {
    backgroundColor: COLORS.warning,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  priceText: {
    color: '#000',
    fontWeight: 'bold',
  },
  detailsHint: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontStyle: 'italic',
    marginTop: 5,
    textAlign: 'center',
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
    maxHeight: '90%',
    borderWidth: 2,
    borderColor: COLORS.warning,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalIcon: {
    fontSize: 30,
    marginRight: 15,
  },
  modalTitle: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
  cardPreview: {
    alignItems: 'center',
    marginBottom: 15,
  },
  equipmentPreview: {
    alignItems: 'center',
    marginBottom: 15,
  },
  equipmentImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  equipmentDescription: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 5,
  },
  equipmentSlot: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardsTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 10,
  },
  moreCardsText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    alignSelf: 'center',
    marginTop: 10,
  },
  modalDetails: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  modalSectionTitle: {
    color: COLORS.textSecondary,
    fontSize: 16,
    marginBottom: 5,
  },
  modalTypeText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalEffectText: {
    color: COLORS.secondary,
    fontSize: 16,
    marginBottom: 10,
  },
  modalPriceText: {
    color: COLORS.warning,
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buyButton: {
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
});