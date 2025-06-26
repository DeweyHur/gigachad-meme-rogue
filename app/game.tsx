import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { useGameStore } from '@/store/gameStore';
import GameMap from '@/components/GameMap';
import Player from '@/components/Player';
import EventCard from '@/components/EventCard';
import { SHOP_ITEMS } from '@/constants/game';
import ShopItem from '@/components/ShopItem';
import NodePreview from '@/components/NodePreview';
import RewardPopup from '@/components/RewardPopup';
import EquipmentManager from '@/components/EquipmentManager';
import ItemsManager from '@/components/ItemsManager';
import PerksViewer from '@/components/PerksViewer';
import DeckViewer from '@/components/DeckViewer';

export default function GameScreen() {
  const { 
    gameState, 
    moveToNode,
    previewNode,
    confirmNodeMove,
    cancelNodePreview,
    resolveEvent, 
    buyItem, 
    equipItem,
    useItem,
    healPlayer,
    clearLastReward,
  } = useGameStore();
  
  const { 
    player, 
    path, 
    currentEvent, 
    gameStatus,
    defeatedBosses,
    previewNode: nodeToPreview,
    lastReward,
  } = gameState;
  
  useEffect(() => {
    // Handle battle screen navigation
    if (gameStatus === 'battle') {
      router.push('/battle');
    } else if (gameStatus === 'menu') {
      router.replace('/');
    }
  }, [gameStatus]);
  
  const handleNodePress = (nodeId: string) => {
    previewNode(nodeId);
  };
  
  const renderContent = () => {
    switch (gameStatus) {
      case 'event':
        return currentEvent ? (
          <EventCard event={currentEvent} onOptionSelect={resolveEvent} />
        ) : null;
        
      case 'shop':
        return (
          <View style={styles.shopContainer}>
            <Text style={styles.shopTitle}>Shop</Text>
            <Text style={styles.goldText}>Your Gold: {player.gold}</Text>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.shopItems}>
              {SHOP_ITEMS.map((item, index) => (
                <ShopItem
                  key={`${item.type}-${index}`}
                  item={item}
                  onBuy={() => buyItem(index)}
                  canAfford={player.gold >= item.price}
                />
              ))}
            </ScrollView>
            
            <Pressable style={styles.backButton} onPress={() => moveToNode('start')}>
              <Text style={styles.buttonText}>Back to Map</Text>
            </Pressable>
          </View>
        );
        
      case 'camp':
        return (
          <View style={styles.campContainer}>
            <Text style={styles.campTitle}>Rest Site</Text>
            <Text style={styles.campDescription}>
              Take a moment to rest and recover your strength.
            </Text>
            
            <Pressable 
              style={styles.healButton} 
              onPress={() => {
                healPlayer(30);
                moveToNode('start');
              }}
            >
              <Text style={styles.buttonText}>Rest (Heal 30 HP)</Text>
            </Pressable>
            
            <Pressable style={styles.backButton} onPress={() => moveToNode('start')}>
              <Text style={styles.buttonText}>Back to Map</Text>
            </Pressable>
          </View>
        );
        
      case 'shrine':
        return (
          <View style={styles.shrineContainer}>
            <Text style={styles.shrineTitle}>Ancient Shrine</Text>
            <Text style={styles.shrineDescription}>
              You discover an ancient shrine dedicated to forgotten memes.
            </Text>
            
            <Pressable 
              style={styles.shrineButton} 
              onPress={() => {
                // Random buff
                const buffs = [
                  () => healPlayer(15),
                  () => healPlayer(20),
                  () => player.gold += 50,
                ];
                buffs[Math.floor(Math.random() * buffs.length)]();
                moveToNode('start');
              }}
            >
              <Text style={styles.buttonText}>Pray for Blessing</Text>
            </Pressable>
            
            <Pressable style={styles.backButton} onPress={() => moveToNode('start')}>
              <Text style={styles.buttonText}>Back to Map</Text>
            </Pressable>
          </View>
        );
        
      case 'blacksmith':
        return (
          <View style={styles.blacksmithContainer}>
            <Text style={styles.blacksmithTitle}>Blacksmith</Text>
            <Text style={styles.blacksmithDescription}>
              The blacksmith can upgrade your equipment.
            </Text>
            
            <Pressable 
              style={styles.upgradeButton} 
              onPress={() => {
                // Upgrade logic would go here
                moveToNode('start');
              }}
            >
              <Text style={styles.buttonText}>Upgrade Equipment</Text>
            </Pressable>
            
            <Pressable style={styles.backButton} onPress={() => moveToNode('start')}>
              <Text style={styles.buttonText}>Back to Map</Text>
            </Pressable>
          </View>
        );
        
      case 'victory':
        return (
          <View style={styles.victoryContainer}>
            <Text style={styles.victoryTitle}>Victory!</Text>
            <Text style={styles.victoryDescription}>
              Congratulations! You have defeated all the Italian Brain Rots!
            </Text>
            
            <Pressable 
              style={styles.mainMenuButton} 
              onPress={() => router.push('/')}
            >
              <Text style={styles.buttonText}>Return to Main Menu</Text>
            </Pressable>
          </View>
        );
        
      case 'defeat':
        return (
          <View style={styles.defeatContainer}>
            <Text style={styles.defeatTitle}>Defeat</Text>
            <Text style={styles.defeatDescription}>
              You have been defeated. Better luck next time!
            </Text>
            
            <Pressable 
              style={styles.mainMenuButton} 
              onPress={() => router.push('/')}
            >
              <Text style={styles.buttonText}>Return to Main Menu</Text>
            </Pressable>
          </View>
        );
        
      case 'path':
      default:
        return (
          <>
            <Player player={player} />
            
            <View style={styles.statsContainer}>
              <Text style={styles.statsText}>Bosses Defeated: {defeatedBosses.length}/5</Text>
              <Text style={styles.statsText}>Gold: {player.gold}</Text>
            </View>
            
            <View style={styles.managementContainer}>
              <EquipmentManager 
                equipment={player.equipment}
                equippedItems={player.equippedItems}
                onEquip={equipItem}
              />
              <DeckViewer
                equipment={player.equipment}
                equippedItems={player.equippedItems}
              />
              <ItemsManager 
                items={player.items}
                onUseItem={useItem}
              />
              <PerksViewer 
                perks={player.perks}
              />
            </View>
            
            <Text style={styles.mapTitle}>Adventure Map</Text>
            <GameMap path={path} onNodePress={handleNodePress} />
          </>
        );
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {renderContent()}
      </ScrollView>
      
      {nodeToPreview && (
        <NodePreview 
          node={nodeToPreview}
          onConfirm={confirmNodeMove}
          onCancel={cancelNodePreview}
        />
      )}
      
      {lastReward && (
        <RewardPopup 
          reward={lastReward}
          onClose={clearLastReward}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 15,
    paddingBottom: 50, // Extra padding at the bottom
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  statsText: {
    color: COLORS.text,
    fontSize: 16,
  },
  managementContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  mapTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
  shopContainer: {
    padding: 15,
  },
  shopTitle: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  goldText: {
    color: COLORS.warning,
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  shopItems: {
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  campContainer: {
    padding: 20,
    alignItems: 'center',
  },
  campTitle: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  campDescription: {
    color: COLORS.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  healButton: {
    backgroundColor: COLORS.success,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 15,
  },
  shrineContainer: {
    padding: 20,
    alignItems: 'center',
  },
  shrineTitle: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  shrineDescription: {
    color: COLORS.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  shrineButton: {
    backgroundColor: COLORS.info,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 15,
  },
  blacksmithContainer: {
    padding: 20,
    alignItems: 'center',
  },
  blacksmithTitle: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  blacksmithDescription: {
    color: COLORS.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  upgradeButton: {
    backgroundColor: COLORS.warning,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 15,
  },
  victoryContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  victoryTitle: {
    color: COLORS.success,
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  victoryDescription: {
    color: COLORS.text,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
  },
  mainMenuButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  defeatContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  defeatTitle: {
    color: COLORS.danger,
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  defeatDescription: {
    color: COLORS.text,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
  },
});