import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, ScrollView } from 'react-native';
import { COLORS } from '@/constants/colors';
import { ItemType } from '@/types/game';

type ItemsManagerProps = {
  items: ItemType[];
  onUseItem: (itemId: string) => void;
  inBattle?: boolean;
};

export default function ItemsManager({ 
  items, 
  onUseItem, 
  inBattle = false 
}: ItemsManagerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ItemType | null>(null);
  
  const handleOpen = () => {
    setIsVisible(true);
  };
  
  const handleClose = () => {
    setIsVisible(false);
  };
  
  const handleItemSelect = (item: ItemType) => {
    setSelectedItem(item);
  };
  
  const handleUseItem = () => {
    if (selectedItem) {
      onUseItem(selectedItem.id);
      setSelectedItem(null);
    }
  };
  
  const closeItemDetails = () => {
    setSelectedItem(null);
  };
  
  // Filter items based on whether we're in battle
  const availableItems = inBattle 
    ? items.filter(item => item.usableInBattle)
    : items;
  
  return (
    <>
      <Pressable style={styles.manageButton} onPress={handleOpen}>
        <Text style={styles.manageText}>Items ({items.length})</Text>
      </Pressable>
      
      <Modal
        visible={isVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Items</Text>
            
            {availableItems.length > 0 ? (
              <ScrollView style={styles.itemsList}>
                {availableItems.map(item => (
                  <Pressable
                    key={item.id}
                    style={[
                      styles.itemCard,
                      selectedItem?.id === item.id && styles.selectedItem
                    ]}
                    onPress={() => handleItemSelect(item)}
                  >
                    <View style={styles.itemHeader}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                    </View>
                    <Text style={styles.itemDescription}>{item.description}</Text>
                    <Text style={styles.itemEffect}>{item.effect}</Text>
                    {item.usableInBattle && (
                      <View style={styles.battleBadge}>
                        <Text style={styles.battleBadgeText}>Battle</Text>
                      </View>
                    )}
                  </Pressable>
                ))}
              </ScrollView>
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {inBattle 
                    ? "No items usable in battle" 
                    : "No items in inventory"}
                </Text>
              </View>
            )}
            
            <View style={styles.buttonContainer}>
              {selectedItem && (
                <Pressable 
                  style={styles.useButton} 
                  onPress={handleUseItem}
                >
                  <Text style={styles.buttonText}>Use Item</Text>
                </Pressable>
              )}
              <Pressable style={styles.closeButton} onPress={handleClose}>
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
  manageButton: {
    backgroundColor: COLORS.warning,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignSelf: 'center',
    marginVertical: 10,
  },
  manageText: {
    color: '#000',
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
    borderColor: COLORS.warning,
  },
  title: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  itemsList: {
    flex: 1,
    marginBottom: 20,
  },
  itemCard: {
    backgroundColor: COLORS.cardBackground,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  selectedItem: {
    borderColor: COLORS.primary,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  itemName: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemQuantity: {
    color: COLORS.warning,
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemDescription: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: 5,
  },
  itemEffect: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  battleBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: COLORS.danger,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  battleBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
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
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  useButton: {
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