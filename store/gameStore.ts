import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  GameStateType, 
  NodeType, 
  CardType, 
  EquipmentType, 
  BossType, 
  EnemyType, 
  EquipmentSlotType,
  ItemType,
  PerkType,
  BattleLogEntryType,
  EquippedItemsType,
  RewardType,
  ShopItemType
} from '@/types/game';
import { 
  GAME_CONFIG, 
  EQUIPMENT, 
  BOSSES, 
  ENEMIES, 
  EVENTS, 
  SHOP_ITEMS,
  ITEMS
} from '@/constants/game';

// Helper functions
const generatePath = (bossId: string) => {
  const { maxPathWidth, pathHeight, nodeTypes, nodeWeights } = GAME_CONFIG;
  const nodes: NodeType[] = [];
  
  // Add starting node
  const startNode: NodeType = {
    id: 'start',
    type: 'start',
    x: Math.floor(maxPathWidth / 2),
    y: 0,
    connections: [],
    visited: true,
    available: true,
  };
  nodes.push(startNode);
  
  // Add middle nodes
  for (let y = 1; y < pathHeight - 1; y++) {
    const nodesInRow = Math.min(maxPathWidth, Math.max(1, Math.floor(Math.random() * maxPathWidth) + 1));
    const positions = Array.from({ length: maxPathWidth }, (_, i) => i)
      .sort(() => Math.random() - 0.5)
      .slice(0, nodesInRow);
    
    for (const x of positions) {
      // Determine node type based on weights
      let nodeType: string = 'battle';
      
      // Special case: always place a camp before the boss
      if (y === pathHeight - 2) {
        nodeType = 'camp';
      } else {
        const rand = Math.random();
        let cumulativeProbability = 0;
        
        for (const type of nodeTypes) {
          cumulativeProbability += nodeWeights[type as keyof typeof nodeWeights];
          if (rand <= cumulativeProbability) {
            nodeType = type;
            break;
          }
        }
      }
      
      const node: NodeType = {
        id: `node-${y}-${x}`,
        type: nodeType as any,
        x,
        y,
        connections: [],
        visited: false,
        available: false,
      };
      
      // Add content based on node type
      if (nodeType === 'battle') {
        const randomEnemy = ENEMIES[Math.floor(Math.random() * ENEMIES.length)];
        node.content = { ...randomEnemy, currentHealth: randomEnemy.health };
      } else if (nodeType === 'event') {
        const randomEvent = EVENTS[Math.floor(Math.random() * EVENTS.length)];
        node.content = randomEvent;
      }
      
      nodes.push(node);
    }
  }
  
  // Add boss node
  const bossNode: NodeType = {
    id: 'boss',
    type: 'boss',
    x: Math.floor(maxPathWidth / 2),
    y: pathHeight - 1,
    connections: [],
    visited: false,
    available: false,
    content: BOSSES.find(boss => boss.id === bossId),
  };
  nodes.push(bossNode);
  
  // Create connections between nodes
  for (let y = 0; y < pathHeight - 1; y++) {
    const currentRowNodes = nodes.filter(node => node.y === y);
    const nextRowNodes = nodes.filter(node => node.y === y + 1);
    
    for (const currentNode of currentRowNodes) {
      // Connect to 1-2 nodes in the next row
      const connectionsCount = Math.min(nextRowNodes.length, Math.floor(Math.random() * 2) + 1);
      const possibleConnections = [...nextRowNodes].sort((a, b) => {
        return Math.abs(a.x - currentNode.x) - Math.abs(b.x - currentNode.x);
      }).slice(0, connectionsCount);
      
      for (const targetNode of possibleConnections) {
        currentNode.connections.push(targetNode.id);
      }
    }
  }
  
  // Make sure all nodes in the next row are connected to at least one node in the current row
  for (let y = 1; y < pathHeight; y++) {
    const currentRowNodes = nodes.filter(node => node.y === y);
    const prevRowNodes = nodes.filter(node => node.y === y - 1);
    
    for (const currentNode of currentRowNodes) {
      const isConnected = prevRowNodes.some(node => node.connections.includes(currentNode.id));
      
      if (!isConnected && prevRowNodes.length > 0) {
        // Connect to the closest node in the previous row
        const closestNode = [...prevRowNodes].sort((a, b) => {
          return Math.abs(a.x - currentNode.x) - Math.abs(b.x - currentNode.x);
        })[0];
        
        closestNode.connections.push(currentNode.id);
      }
    }
  }
  
  // Make nodes connected to the start node available
  const startConnections = nodes.filter(node => startNode.connections.includes(node.id));
  startConnections.forEach(node => {
    node.available = true;
  });
  
  return {
    nodes,
    currentNode: 'start',
  };
};

const createDeckFromEquippedItems = (equipment: EquipmentType[], equippedItems: EquippedItemsType): CardType[] => {
  const deck: CardType[] = [];
  
  // Get all equipped equipment
  Object.entries(equippedItems).forEach(([slot, equipmentId]) => {
    if (!equipmentId) return;
    
    const equip = equipment.find(e => e.id === equipmentId);
    if (!equip) return;
    
    // Add cards from this equipment
    equip.cards.forEach(card => {
      for (let i = 0; i < (card.quantity || 1); i++) {
        deck.push({ ...card });
      }
    });
  });
  
  return deck;
};

const shuffleDeck = (deck: CardType[]): CardType[] => {
  return [...deck].sort(() => Math.random() - 0.5);
};

const drawCards = (count: number, state: GameStateType): GameStateType => {
  const newState = { ...state };
  const { drawPile, discardPile, hand } = newState.player;
  
  for (let i = 0; i < count; i++) {
    if (drawPile.length === 0) {
      // Reshuffle discard pile into draw pile
      newState.player.drawPile = shuffleDeck(discardPile);
      newState.player.discardPile = [];
      
      if (newState.player.drawPile.length === 0) {
        // No cards left to draw
        break;
      }
    }
    
    const card = newState.player.drawPile.pop();
    if (card) {
      newState.player.hand.push(card);
    }
  }
  
  return newState;
};

const addBattleLogEntry = (
  battleLog: BattleLogEntryType[],
  type: 'damage' | 'block' | 'heal' | 'effect' | 'card',
  source: 'player' | 'enemy' | 'system',
  target: 'player' | 'enemy' | 'system',
  value: number,
  message: string
): BattleLogEntryType[] => {
  const newEntry: BattleLogEntryType = {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    source,
    target,
    value,
    message,
    timestamp: Date.now()
  };
  
  return [...battleLog, newEntry];
};

const initializeGameState = (bossId: string): GameStateType => {
  // Starting equipment - equip all slots with Common defaults
  const startingWeapon = EQUIPMENT.find(eq => eq.id === 'fists') as EquipmentType;
  const startingHead = EQUIPMENT.find(eq => eq.id === 'basic_hat') as EquipmentType;
  const startingOffhand = EQUIPMENT.find(eq => eq.id === 'basic_shield') as EquipmentType;
  const startingChest = EQUIPMENT.find(eq => eq.id === 'abs_armor') as EquipmentType;
  const startingFeet = EQUIPMENT.find(eq => eq.id === 'basic_shoes') as EquipmentType;
  const startingAccessory1 = EQUIPMENT.find(eq => eq.id === 'protein_necklace') as EquipmentType;
  const startingAccessory2 = EQUIPMENT.find(eq => eq.id === 'basic_ring') as EquipmentType;
  
  // Set up equipped items - all slots equipped with Common gear
  const equippedItems: EquippedItemsType = {
    weapon: startingWeapon.id,
    head: startingHead.id,
    offhand: startingOffhand.id,
    chest: startingChest.id,
    feet: startingFeet.id,
    accessory1: startingAccessory1.id,
    accessory2: startingAccessory2.id,
  };
  
  // Create deck from all equipped items
  const allStartingEquipment = [
    startingWeapon, 
    startingHead, 
    startingOffhand, 
    startingChest, 
    startingFeet, 
    startingAccessory1, 
    startingAccessory2
  ];
  
  const deck = createDeckFromEquippedItems(allStartingEquipment, equippedItems);
  const shuffledDeck = shuffleDeck(deck);
  
  // Starting items
  const startingItems = [
    { ...ITEMS.find(item => item.id === 'health_potion')! }
  ];
  
  const initialState: GameStateType = {
    player: {
      health: GAME_CONFIG.playerStartingHealth,
      maxHealth: GAME_CONFIG.playerStartingHealth,
      energy: GAME_CONFIG.playerStartingEnergy,
      maxEnergy: GAME_CONFIG.playerStartingEnergy,
      gold: 100,
      equipment: allStartingEquipment,
      equippedItems: equippedItems,
      items: startingItems,
      deck: deck,
      hand: [],
      drawPile: shuffledDeck,
      discardPile: [],
      strength: 0,
      block: 0,
      perks: [],
    },
    path: generatePath(bossId),
    currentBoss: BOSSES.find(boss => boss.id === bossId) || null,
    defeatedBosses: [],
    currentBattle: null,
    currentEvent: null,
    gameStatus: 'path',
    showVictoryEffect: false,
    lastReward: null,
    previewNode: null,
  };
  
  return initialState;
};

type GameStore = {
  gameState: GameStateType;
  initGame: (bossId: string) => void;
  moveToNode: (nodeId: string) => void;
  previewNode: (nodeId: string) => void;
  confirmNodeMove: () => void;
  cancelNodePreview: () => void;
  startBattle: (enemy: EnemyType | BossType) => void;
  playCard: (cardIndex: number, targetId?: string) => void;
  endTurn: () => void;
  handleEnemyTurn: () => void;
  discardHand: () => void;
  drawNewHand: () => void;
  resolveEvent: (optionIndex: number) => void;
  buyItem: (itemIndex: number) => void;
  equipItem: (equipmentId: string, slot: EquipmentSlotType) => void;
  acquireEquipment: (equipment: EquipmentType) => void;
  useItem: (itemId: string) => void;
  healPlayer: (amount: number) => void;
  addGold: (amount: number) => void;
  addPerk: (perk: PerkType) => void;
  resetGame: () => void;
  hideVictoryEffect: () => void;
  clearLastReward: () => void;
  triggerShrineEvent: () => void;
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      gameState: initializeGameState('tralalero'),
      
      initGame: (bossId: string) => {
        set({ gameState: initializeGameState(bossId) });
      },
      
      previewNode: (nodeId: string) => {
        const { gameState } = get();
        const { path } = gameState;
        
        // Check if the node is available
        const node = path.nodes.find(n => n.id === nodeId);
        if (!node || !node.available) return;
        
        set({
          gameState: {
            ...gameState,
            previewNode: node,
          },
        });
      },
      
      confirmNodeMove: () => {
        const { gameState } = get();
        if (!gameState.previewNode) return;
        
        get().moveToNode(gameState.previewNode.id);
      },
      
      cancelNodePreview: () => {
        const { gameState } = get();
        
        set({
          gameState: {
            ...gameState,
            previewNode: null,
          },
        });
      },
      
      moveToNode: (nodeId: string) => {
        const { gameState } = get();
        const { path } = gameState;
        
        // Check if the node is available
        const node = path.nodes.find(n => n.id === nodeId);
        if (!node || !node.available) return;
        
        // Update node status
        const updatedNodes = path.nodes.map(n => {
          if (n.id === nodeId) {
            return { ...n, visited: true };
          }
          
          // Make connected nodes available if they're in the next row
          if (node.connections.includes(n.id)) {
            // Only make nodes available if they're in the next row
            if (n.y === node.y + 1) {
              return { ...n, available: true };
            }
          }
          
          // Disable other nodes in the same row that weren't chosen
          if (n.y === node.y && n.id !== nodeId && !n.visited) {
            return { ...n, available: false };
          }
          
          return n;
        });
        
        // Handle node type
        let newGameStatus = gameState.gameStatus;
        let currentBattle = null;
        let currentEvent = null;
        
        if (node.type === 'battle' || node.type === 'boss') {
          newGameStatus = 'battle';
          const enemy = node.content;
          if (enemy) {
            // Create a proper intent for the enemy
            let intent = undefined;
            
            if ('moves' in enemy && enemy.moves) {
              const randomMove = enemy.moves[Math.floor(Math.random() * enemy.moves.length)];
              intent = {
                name: randomMove.name,
                damage: randomMove.damage,
                effect: randomMove.effect,
              };
            } else if ('abilities' in enemy && enemy.abilities) {
              const randomAbility = enemy.abilities[Math.floor(Math.random() * enemy.abilities.length)];
              intent = {
                name: randomAbility.name,
                damage: randomAbility.damage,
                effect: randomAbility.effect,
              };
            }
            
            const enemyWithIntent = {
              ...enemy,
              currentHealth: enemy.health,
              strength: 0,
              block: 0,
              intent,
            } as EnemyType | BossType;
            
            currentBattle = {
              enemy: enemyWithIntent,
              turn: 1,
              playerTurn: true,
              battleLog: []
            };
          }
        } else if (node.type === 'event') {
          newGameStatus = 'event';
          currentEvent = node.content;
        } else {
          newGameStatus = node.type as any;
        }
        
        set({
          gameState: {
            ...gameState,
            path: {
              ...path,
              nodes: updatedNodes,
              currentNode: nodeId,
            },
            currentBattle,
            currentEvent,
            gameStatus: newGameStatus,
            previewNode: null,
          },
        });
        
        // If starting a battle, draw initial hand
        if (newGameStatus === 'battle') {
          // Reset player's temporary stats
          const updatedPlayer = {
            ...gameState.player,
            energy: gameState.player.maxEnergy,
            strength: 0,
            block: 0,
            hand: [],
            drawPile: shuffleDeck([...gameState.player.deck]),
            discardPile: [],
          };
          
          set({
            gameState: {
              ...get().gameState,
              player: updatedPlayer,
            },
          });
          
          get().drawNewHand();
        }
      },
      
      startBattle: (enemy: EnemyType | BossType) => {
        const { gameState } = get();
        
        // Reset player's temporary stats
        const updatedPlayer = {
          ...gameState.player,
          energy: gameState.player.maxEnergy,
          strength: 0,
          block: 0,
          hand: [],
          drawPile: shuffleDeck([...gameState.player.deck]),
          discardPile: [],
        };
        
        // Set enemy intent
        let intent = undefined;
        if ('moves' in enemy && enemy.moves) {
          const randomMove = enemy.moves[Math.floor(Math.random() * enemy.moves.length)];
          intent = {
            name: randomMove.name,
            damage: randomMove.damage,
            effect: randomMove.effect,
          };
        } else if ('abilities' in enemy && enemy.abilities) {
          const randomAbility = enemy.abilities[Math.floor(Math.random() * enemy.abilities.length)];
          intent = {
            name: randomAbility.name,
            damage: randomAbility.damage,
            effect: randomAbility.effect,
          };
        }
        
        const updatedEnemy = {
          ...enemy,
          currentHealth: enemy.health,
          strength: 0,
          block: 0,
          intent,
        };
        
        // Add initial turn message to battle log
        const initialBattleLog = addBattleLogEntry(
          [],
          'effect',
          'system',
          'system',
          0,
          `--- Turn 1 - Player Turn ---`
        );
        
        set({
          gameState: {
            ...gameState,
            player: updatedPlayer,
            currentBattle: {
              enemy: updatedEnemy,
              turn: 1,
              playerTurn: true,
              battleLog: initialBattleLog
            },
            gameStatus: 'battle',
          },
        });
        
        // Draw initial hand
        get().drawNewHand();
      },
      
      playCard: (cardIndex: number) => {
        const { gameState } = get();
        if (!gameState.currentBattle || !gameState.currentBattle.playerTurn) return;
        
        const { player, currentBattle } = gameState;
        const card = player.hand[cardIndex];
        
        if (!card || card.energy > player.energy) return;
        
        // Remove card from hand
        const newHand = [...player.hand];
        newHand.splice(cardIndex, 1);
        
        // Apply card effects
        let updatedPlayer = {
          ...player,
          hand: newHand,
          energy: player.energy - card.energy,
          discardPile: [...player.discardPile, card],
        };
        
        let updatedEnemy = { ...currentBattle.enemy };
        if (!updatedEnemy) return; // Safety check
        
        let updatedBattleLog = [...currentBattle.battleLog];
        
        // Add card played to battle log
        updatedBattleLog = addBattleLogEntry(
          updatedBattleLog,
          'card',
          'player',
          'player',
          0,
          `Played ${card.name}`
        );
        
        // Apply damage
        if (card.damage && updatedEnemy) {
          const totalDamage = card.damage + (player.strength || 0);
          const hits = card.hits || 1;
          
          for (let i = 0; i < hits; i++) {
            let damageDealt = totalDamage;
            
            // Log the damage before applying it
            updatedBattleLog = addBattleLogEntry(
              updatedBattleLog,
              'damage',
              'player',
              'enemy',
              damageDealt,
              `Dealing ${damageDealt} damage${hits > 1 ? ` (hit ${i+1}/${hits})` : ''}`
            );
            
            if (updatedEnemy.block && updatedEnemy.block > 0) {
              if (updatedEnemy.block >= totalDamage) {
                updatedBattleLog = addBattleLogEntry(
                  updatedBattleLog,
                  'block',
                  'enemy',
                  'enemy',
                  totalDamage,
                  `Enemy blocked ${totalDamage} damage`
                );
                updatedEnemy.block -= totalDamage;
                damageDealt = 0;
              } else {
                const remainingDamage = totalDamage - (updatedEnemy.block || 0);
                updatedBattleLog = addBattleLogEntry(
                  updatedBattleLog,
                  'block',
                  'enemy',
                  'enemy',
                  updatedEnemy.block || 0,
                  `Enemy blocked ${updatedEnemy.block} damage`
                );
                updatedEnemy.block = 0;
                updatedEnemy.currentHealth = Math.max(0, (updatedEnemy.currentHealth || 0) - remainingDamage);
                damageDealt = remainingDamage;
              }
            } else {
              updatedEnemy.currentHealth = Math.max(0, (updatedEnemy.currentHealth || 0) - totalDamage);
            }
            
            if (damageDealt > 0) {
              updatedBattleLog = addBattleLogEntry(
                updatedBattleLog,
                'damage',
                'player',
                'enemy',
                damageDealt,
                `Dealt ${damageDealt} damage to enemy`
              );
            }
          }
        }
        
        // Apply block
        if (card.block) {
          updatedPlayer.block = (updatedPlayer.block || 0) + card.block;
          updatedBattleLog = addBattleLogEntry(
            updatedBattleLog,
            'block',
            'player',
            'player',
            card.block,
            `Gained ${card.block} block`
          );
        }
        
        // Apply strength
        if (card.strength) {
          updatedPlayer.strength = (updatedPlayer.strength || 0) + card.strength;
          updatedBattleLog = addBattleLogEntry(
            updatedBattleLog,
            'effect',
            'player',
            'player',
            card.strength,
            `Gained ${card.strength} strength`
          );
        }
        
        // Apply healing
        if (card.heal) {
          const oldHealth = updatedPlayer.health;
          updatedPlayer.health = Math.min(updatedPlayer.maxHealth, updatedPlayer.health + card.heal);
          const actualHeal = updatedPlayer.health - oldHealth;
          
          if (actualHeal > 0) {
            updatedBattleLog = addBattleLogEntry(
              updatedBattleLog,
              'heal',
              'player',
              'player',
              actualHeal,
              `Healed for ${actualHeal} HP`
            );
          }
        }
        
        // Apply energy gain
        if (card.energyGain) {
          const oldEnergy = updatedPlayer.energy;
          updatedPlayer.energy = Math.min(updatedPlayer.maxEnergy, updatedPlayer.energy + card.energyGain);
          const actualEnergyGain = updatedPlayer.energy - oldEnergy;
          
          if (actualEnergyGain > 0) {
            updatedBattleLog = addBattleLogEntry(
              updatedBattleLog,
              'effect',
              'player',
              'player',
              actualEnergyGain,
              `Gained ${actualEnergyGain} energy`
            );
          }
        }
        
        // Apply draw
        if (card.draw) {
          let tempState = { ...gameState, player: updatedPlayer };
          tempState = drawCards(card.draw, tempState);
          const actualDraw = tempState.player.hand.length - updatedPlayer.hand.length;
          updatedPlayer = tempState.player;
          if (actualDraw > 0) {
            updatedBattleLog = addBattleLogEntry(
              updatedBattleLog,
              'effect',
              'player',
              'player',
              actualDraw,
              `Drew ${actualDraw} card${actualDraw > 1 ? 's' : ''}`
            );
          }
        }
        
        // Check for battle end
        let gameStatus = gameState.gameStatus;
        let showVictoryEffect = false;
        let lastReward: RewardType | null = null;
        
        if (updatedEnemy.currentHealth === 0) {
          // Show victory effect
          showVictoryEffect = true;
          
          // Battle won
          if (updatedEnemy.id === gameState.currentBoss?.id) {
            // Boss defeated
            const defeatedBosses = [...gameState.defeatedBosses, updatedEnemy.id];
            
            if (defeatedBosses.length >= 5) {
              // All bosses defeated, game won
              gameStatus = 'victory';
            } else {
              // Add boss perk
              const bossPerk = 'reward' in updatedEnemy ? {
                id: `perk_${updatedEnemy.id}`,
                name: updatedEnemy.reward.name,
                effect: updatedEnemy.reward.effect,
                description: `Defeated ${updatedEnemy.name}`
              } : { id: "", name: "", effect: "", description: "" };
              
              if (bossPerk && bossPerk.name) {
                updatedPlayer.perks = [...updatedPlayer.perks, bossPerk];
                lastReward = {
                  type: 'perk',
                  name: bossPerk.name,
                  description: bossPerk.effect,
                  perk: bossPerk
                };
              }
              
              // Return to path after showing victory effect
              // We'll navigate back to path when hideVictoryEffect is called
            }
            
            set({
              gameState: {
                ...gameState,
                player: updatedPlayer,
                defeatedBosses,
                currentBattle: {
                  ...currentBattle,
                  enemy: updatedEnemy,
                  battleLog: updatedBattleLog
                },
                gameStatus,
                showVictoryEffect,
                lastReward,
              },
            });
          } else {
            // Regular enemy defeated
            // Add gold reward
            const goldReward = 25 + Math.floor(Math.random() * 15);
            updatedPlayer.gold += goldReward;
            
            lastReward = {
              type: 'gold',
              name: 'Gold Reward',
              description: `You earned ${goldReward} gold!`,
              amount: goldReward,
            };
            
            set({
              gameState: {
                ...gameState,
                player: updatedPlayer,
                currentBattle: {
                  ...currentBattle,
                  enemy: updatedEnemy,
                  battleLog: updatedBattleLog
                },
                showVictoryEffect,
                lastReward,
              },
            });
          }
        } else {
          // Battle continues
          set({
            gameState: {
              ...gameState,
              player: updatedPlayer,
              currentBattle: {
                ...currentBattle,
                enemy: updatedEnemy,
                battleLog: updatedBattleLog
              },
            },
          });
        }
      },
      
      hideVictoryEffect: () => {
        const { gameState } = get();
        
        // If we were showing a victory effect, now return to path
        if (gameState.showVictoryEffect) {
          // If we defeated a boss, go back to the main menu
          const wasBossBattle = gameState.currentBattle?.enemy.id === gameState.currentBoss?.id;
          
          set({
            gameState: {
              ...gameState,
              currentBattle: null,
              gameStatus: wasBossBattle ? 'menu' : 'path',
              showVictoryEffect: false,
            },
          });
          
          // If it was a boss battle, we want to go back to the main menu
          if (wasBossBattle) {
            // This will be handled by the battle screen component to navigate back
          }
        }
      },
      
      clearLastReward: () => {
        const { gameState } = get();
        
        set({
          gameState: {
            ...gameState,
            lastReward: null,
          },
        });
      },
      
      endTurn: () => {
        const { gameState } = get();
        if (!gameState.currentBattle) return;
        
        const { currentBattle } = gameState;
        const { playerTurn, turn, battleLog } = currentBattle;
        
        if (playerTurn) {
          // Add enemy turn message to battle log
          const updatedBattleLog = addBattleLogEntry(
            battleLog,
            'effect',
            'system',
            'system',
            0,
            `--- Turn ${turn} - Enemy Turn ---`
          );
          
          set({
            gameState: {
              ...gameState,
              currentBattle: {
                ...currentBattle,
                playerTurn: false,
                battleLog: updatedBattleLog
              },
            },
          });
          
          // Handle enemy turn
          get().handleEnemyTurn();
          
          // Get the updated state after enemy turn
          const updatedGameState = get().gameState;
          if (!updatedGameState.currentBattle) return;
          
          // Start new player turn
          const newTurn = turn + 1;
          const newBattleLog = addBattleLogEntry(
            updatedGameState.currentBattle.battleLog,
            'effect',
            'system',
            'system',
            0,
            `--- Turn ${newTurn} - Player Turn ---`
          );
          
          // Discard all cards and redraw up to max hand size
          const updatedPlayer = {
            ...updatedGameState.player,
            energy: updatedGameState.player.maxEnergy,
            discardPile: [...updatedGameState.player.discardPile, ...updatedGameState.player.hand],
            hand: [],
          };
          
          set({
            gameState: {
              ...updatedGameState,
              player: updatedPlayer,
              currentBattle: {
                ...updatedGameState.currentBattle,
                turn: newTurn,
                playerTurn: true,
                battleLog: newBattleLog
              },
            },
          });
          
          // Draw new hand up to max hand size
          get().drawNewHand();
        }
      },
      
      handleEnemyTurn: () => {
        const { gameState } = get();
        if (!gameState.currentBattle || !gameState.currentBattle.enemy) return;
        
        const { player, currentBattle } = gameState;
        const { enemy, battleLog } = currentBattle;
        
        let updatedPlayer = { ...player };
        let updatedBattleLog = [...battleLog];
        let updatedEnemy = { ...enemy };
        
        // If enemy has no intent, generate one first
        if (!enemy.intent) {
          let newIntent = undefined;
          if ('moves' in enemy && enemy.moves) {
            const randomMove = enemy.moves[Math.floor(Math.random() * enemy.moves.length)];
            newIntent = {
              name: randomMove.name,
              damage: randomMove.damage,
              effect: randomMove.effect,
            };
          } else if ('abilities' in enemy && enemy.abilities) {
            const randomAbility = enemy.abilities[Math.floor(Math.random() * enemy.abilities.length)];
            newIntent = {
              name: randomAbility.name,
              damage: randomAbility.damage,
              effect: randomAbility.effect,
            };
          }
          updatedEnemy.intent = newIntent;
        }
        
        // Apply enemy intent
        if (updatedEnemy.intent) {
          // Log the enemy's intent
          updatedBattleLog = addBattleLogEntry(
            updatedBattleLog,
            'effect',
            'enemy',
            'enemy',
            0,
            `Enemy uses ${updatedEnemy.intent.name}`
          );
          
          // Handle damage
          if (updatedEnemy.intent.damage) {
            let damage = updatedEnemy.intent.damage + (enemy.strength || 0);
            
            // Log the incoming damage
            updatedBattleLog = addBattleLogEntry(
              updatedBattleLog,
              'damage',
              'enemy',
              'player',
              damage,
              `Enemy attacks for ${damage} damage`
            );
            
            if (updatedPlayer.block > 0) {
              if (updatedPlayer.block >= damage) {
                updatedBattleLog = addBattleLogEntry(
                  updatedBattleLog,
                  'block',
                  'player',
                  'player',
                  damage,
                  `Blocked ${damage} damage`
                );
                updatedPlayer.block -= damage;
                damage = 0;
              } else {
                const remainingDamage = damage - updatedPlayer.block;
                updatedBattleLog = addBattleLogEntry(
                  updatedBattleLog,
                  'block',
                  'player',
                  'player',
                  updatedPlayer.block,
                  `Blocked ${updatedPlayer.block} damage`
                );
                damage = remainingDamage;
                updatedPlayer.block = 0;
              }
            }
            
            if (damage > 0) {
              updatedPlayer.health = Math.max(0, updatedPlayer.health - damage);
              updatedBattleLog = addBattleLogEntry(
                updatedBattleLog,
                'damage',
                'enemy',
                'player',
                damage,
                `Took ${damage} damage`
              );
            }
          }
          
          // Handle effects
          if (updatedEnemy.intent.effect) {
            if (updatedEnemy.intent.effect === 'strength') {
              const strengthGain = 2; // Default strength gain
              updatedEnemy.strength = (updatedEnemy.strength || 0) + strengthGain;
              updatedBattleLog = addBattleLogEntry(
                updatedBattleLog,
                'effect',
                'enemy',
                'enemy',
                strengthGain,
                `Enemy gained ${strengthGain} strength`
              );
            }
          }
        }
        
        // Generate new enemy intent for next turn
        let newIntent = undefined;
        if ('moves' in enemy && enemy.moves) {
          const randomMove = enemy.moves[Math.floor(Math.random() * enemy.moves.length)];
          newIntent = {
            name: randomMove.name,
            damage: randomMove.damage,
            effect: randomMove.effect,
          };
        } else if ('abilities' in enemy && enemy.abilities) {
          const randomAbility = enemy.abilities[Math.floor(Math.random() * enemy.abilities.length)];
          newIntent = {
            name: randomAbility.name,
            damage: randomAbility.damage,
            effect: randomAbility.effect,
          };
        }
        
        updatedEnemy.intent = newIntent;
        
        // Check for player defeat
        if (updatedPlayer.health === 0) {
          set({
            gameState: {
              ...gameState,
              player: updatedPlayer,
              currentBattle: {
                ...currentBattle,
                enemy: updatedEnemy,
                playerTurn: false,
                battleLog: updatedBattleLog
              },
              gameStatus: 'defeat',
            },
          });
          return;
        }
        
        set({
          gameState: {
            ...gameState,
            player: updatedPlayer,
            currentBattle: {
              ...currentBattle,
              enemy: updatedEnemy,
              playerTurn: false,
              battleLog: updatedBattleLog
            },
          },
        });
      },
      
      discardHand: () => {
        const { gameState } = get();
        const { player } = gameState;
        
        set({
          gameState: {
            ...gameState,
            player: {
              ...player,
              discardPile: [...player.discardPile, ...player.hand],
              hand: [],
            },
          },
        });
      },
      
      drawNewHand: () => {
        const { gameState } = get();
        const handSize = GAME_CONFIG.maxHandSize;
        
        // Apply perks that modify hand size
        const extraCardsPerk = gameState.player.perks.find(p => p.effect === 'Draw 1 additional card each turn');
        const actualHandSize = extraCardsPerk ? handSize + 1 : handSize;
        
        const updatedState = drawCards(actualHandSize, gameState);
        set({ gameState: updatedState });
      },
      
      resolveEvent: (optionIndex: number) => {
        const { gameState } = get();
        if (!gameState.currentEvent) return;
        
        const option = gameState.currentEvent.options[optionIndex];
        if (!option) return;
        
        const { player } = gameState;
        let updatedPlayer = { ...player };
        let lastReward: RewardType | null = null;
        
        // Apply event effect
        switch (option.effect.type) {
          case 'heal':
            const healAmount = option.effect.value || 0;
            updatedPlayer.health = Math.min(updatedPlayer.maxHealth, updatedPlayer.health + healAmount);
            lastReward = {
              type: 'heal',
              name: 'Healing',
              description: `Healed for ${healAmount} HP`,
              amount: healAmount,
            };
            break;
          case 'buff':
            if (option.effect.stat === 'maxHealth') {
              const healthBuff = option.effect.value || 0;
              updatedPlayer.maxHealth += healthBuff;
              updatedPlayer.health += healthBuff;
              lastReward = {
                type: 'maxHealth',
                name: 'Max Health Increased',
                description: `Gained ${healthBuff} maximum health`,
                amount: healthBuff,
              };
            } else if (option.effect.stat === 'strength') {
              // Create a permanent strength perk
              const strengthValue = option.effect.value || 0;
              const strengthPerk: PerkType = {
                id: `perk_strength_${Date.now()}`,
                name: 'Strength Blessing',
                effect: `Start each battle with ${strengthValue} strength`,
                description: `Gained from an ancient shrine`
              };
              
              updatedPlayer.perks.push(strengthPerk);
              lastReward = {
                type: 'perk',
                name: strengthPerk.name,
                description: strengthPerk.effect,
                perk: strengthPerk
              };
            }
            break;
          case 'trade':
            if (option.effect.hp && option.effect.reward === 'equipment') {
              // Lose HP, gain equipment
              const hpLoss = option.effect.hp || 0;
              updatedPlayer.health = Math.max(1, updatedPlayer.health + hpLoss);
              
              // Get random equipment not already owned
              const availableEquipment = EQUIPMENT.filter(eq => 
                !updatedPlayer.equipment.some(playerEq => playerEq.id === eq.id)
              );
              
              if (availableEquipment.length > 0) {
                const randomEquipment = availableEquipment[Math.floor(Math.random() * availableEquipment.length)] as EquipmentType;
                updatedPlayer.equipment.push(randomEquipment);
                lastReward = {
                  type: 'equipment',
                  name: randomEquipment.name,
                  description: randomEquipment.description,
                  equipment: randomEquipment
                };
              }
            }
            break;
          case 'random':
            // 50% chance of good or bad outcome
            if (Math.random() < 0.5) {
              if (option.effect.good && option.effect.good.gold) {
                const goldAmount = option.effect.good.gold;
                updatedPlayer.gold += goldAmount;
                lastReward = {
                  type: 'gold',
                  name: 'Gold Found',
                  description: `Found ${goldAmount} gold`,
                  amount: goldAmount,
                };
              }
            } else {
              // Apply curse (add a bad card to deck)
              const cursePerk: PerkType = {
                id: `perk_curse_${Date.now()}`,
                name: 'Meme Curse',
                effect: 'Take 3 damage at the end of each turn',
                description: 'Cursed by desecrating a shrine'
              };
              
              updatedPlayer.perks.push(cursePerk);
              lastReward = {
                type: 'curse',
                name: cursePerk.name,
                description: cursePerk.effect,
                perk: cursePerk
              };
            }
            break;
          case 'upgrade':
            if (option.effect.target === 'randomCard' && updatedPlayer.deck.length > 0) {
              // Upgrade a random card
              const randomIndex = Math.floor(Math.random() * updatedPlayer.deck.length);
              const upgradedDeck = [...updatedPlayer.deck];
              
              if (upgradedDeck[randomIndex].damage) {
                upgradedDeck[randomIndex].damage = Math.floor((upgradedDeck[randomIndex].damage || 0) * 1.5);
              }
              
              if (upgradedDeck[randomIndex].block) {
                upgradedDeck[randomIndex].block = Math.floor((upgradedDeck[randomIndex].block || 0) * 1.5);
              }
              
              upgradedDeck[randomIndex].upgraded = true;
              updatedPlayer.deck = upgradedDeck;
              
              lastReward = {
                type: 'upgrade',
                name: upgradedDeck[randomIndex].name,
                description: 'Card upgraded',
              };
            }
            break;
          case 'none':
            // Do nothing, just close the event
            break;
        }
        
        set({
          gameState: {
            ...gameState,
            player: updatedPlayer,
            currentEvent: null,
            gameStatus: 'path',
            lastReward,
          },
        });
      },
      
      buyItem: (itemIndex: number) => {
        const { gameState } = get();
        const { player } = gameState;
        const item = SHOP_ITEMS[itemIndex];
        
        if (!item || player.gold < item.price) return;
        
        let updatedPlayer = {
          ...player,
          gold: player.gold - item.price,
        };
        
        let lastReward: RewardType | null = null;
        
        switch (item.type) {
          case 'card':
            // Create a proper CardType from the shop item
            const cardItem: CardType = {
              id: item.name.toLowerCase().replace(/\s+/g, '_'),
              name: item.name,
              energy: item.energy || 0,
              description: item.description || "",
              damage: item.damage,
              block: item.block,
            };
            
            // Add to deck if player has equipment equipped
            if (Object.values(updatedPlayer.equippedItems).some(id => id)) {
              updatedPlayer.deck.push(cardItem);
              lastReward = {
                type: 'card',
                name: item.name,
                description: item.description || "",
              };
            }
            break;
          case 'item':
            // Add item to inventory
            const newItem: ItemType = {
              id: item.name ? item.name.toLowerCase().replace(/\s+/g, '_') : `item_${Date.now()}`,
              name: item.name || "Unknown Item",
              description: item.description || "",
              effect: item.effect || "",
              usableInBattle: item.usableInBattle || false,
              quantity: 1
            };
            
            // Check if player already has this item
            const existingItemIndex = updatedPlayer.items.findIndex(i => i.id === newItem.id);
            if (existingItemIndex >= 0) {
              updatedPlayer.items[existingItemIndex].quantity += 1;
            } else {
              updatedPlayer.items.push(newItem);
            }
            
            lastReward = {
              type: 'item',
              name: newItem.name,
              description: item.description || "",
              item: newItem
            };
            break;
          case 'equipment':
            // Find the equipment in the EQUIPMENT array
            const equipment = EQUIPMENT.find(e => e.id === item.id) as EquipmentType | undefined;
            if (equipment) {
              // Check if player already has this equipment
              if (!updatedPlayer.equipment.some(e => e.id === equipment.id)) {
                updatedPlayer.equipment.push(equipment);
                lastReward = {
                  type: 'equipment',
                  name: equipment.name,
                  description: equipment.description,
                  equipment
                };
              }
            }
            break;
        }
        
        set({
          gameState: {
            ...gameState,
            player: updatedPlayer,
            lastReward,
          },
        });
      },
      
      equipItem: (equipmentId: string, slot: EquipmentSlotType) => {
        const { gameState } = get();
        const { player } = gameState;
        
        // Find the equipment
        const equipment = player.equipment.find(e => e.id === equipmentId);
        if (!equipment || equipment.slot !== slot) return;
        
        // Update equipped items
        const updatedEquippedItems = {
          ...player.equippedItems,
          [slot]: equipmentId
        };
        
        // Rebuild deck from all equipped items
        const newDeck = createDeckFromEquippedItems(player.equipment, updatedEquippedItems);
        
        set({
          gameState: {
            ...gameState,
            player: {
              ...player,
              equippedItems: updatedEquippedItems,
              deck: newDeck,
              hand: [],
              drawPile: shuffleDeck(newDeck),
              discardPile: [],
            },
          },
        });
      },
      
      acquireEquipment: (equipment: EquipmentType) => {
        const { gameState } = get();
        const { player } = gameState;
        
        // Check if player already has this equipment
        if (player.equipment.some(eq => eq.id === equipment.id)) return;
        
        set({
          gameState: {
            ...gameState,
            player: {
              ...player,
              equipment: [...player.equipment, equipment],
            },
          },
        });
      },
      
      useItem: (itemId: string) => {
        const { gameState } = get();
        const { player, currentBattle } = gameState;
        
        // Find the item
        const itemIndex = player.items.findIndex(i => i.id === itemId);
        if (itemIndex === -1 || player.items[itemIndex].quantity <= 0) return;
        
        const item = player.items[itemIndex];
        let updatedPlayer = { ...player };
        let updatedBattleLog = currentBattle ? [...currentBattle.battleLog] : [];
        
        // Apply item effect
        if (item.effect.includes('Heal')) {
          const healAmount = parseInt(item.effect.match(/\d+/)?.[0] || '0');
          updatedPlayer.health = Math.min(updatedPlayer.maxHealth, updatedPlayer.health + healAmount);
          
          if (currentBattle) {
            updatedBattleLog = addBattleLogEntry(
              updatedBattleLog,
              'heal',
              'player',
              'player',
              healAmount,
              `Used ${item.name} to heal ${healAmount} HP`
            );
          }
        } else if (item.effect.includes('energy')) {
          const energyAmount = parseInt(item.effect.match(/\d+/)?.[0] || '0');
          updatedPlayer.energy += energyAmount;
          
          if (currentBattle) {
            updatedBattleLog = addBattleLogEntry(
              updatedBattleLog,
              'effect',
              'player',
              'player',
              energyAmount,
              `Used ${item.name} to gain ${energyAmount} energy`
            );
          }
        } else if (item.effect.includes('strength')) {
          const strengthAmount = parseInt(item.effect.match(/\d+/)?.[0] || '0');
          updatedPlayer.strength += strengthAmount;
          
          if (currentBattle) {
            updatedBattleLog = addBattleLogEntry(
              updatedBattleLog,
              'effect',
              'player',
              'player',
              strengthAmount,
              `Used ${item.name} to gain ${strengthAmount} strength`
            );
          }
        } else if (item.effect.includes('block')) {
          const blockAmount = parseInt(item.effect.match(/\d+/)?.[0] || '0');
          updatedPlayer.block += blockAmount;
          
          if (currentBattle) {
            updatedBattleLog = addBattleLogEntry(
              updatedBattleLog,
              'block',
              'player',
              'player',
              blockAmount,
              `Used ${item.name} to gain ${blockAmount} block`
            );
          }
        }
        
        // Reduce item quantity
        updatedPlayer.items = [...player.items];
        updatedPlayer.items[itemIndex] = {
          ...item,
          quantity: item.quantity - 1
        };
        
        // Remove item if quantity is 0
        if (updatedPlayer.items[itemIndex].quantity <= 0) {
          updatedPlayer.items.splice(itemIndex, 1);
        }
        
        if (currentBattle) {
          set({
            gameState: {
              ...gameState,
              player: updatedPlayer,
              currentBattle: {
                ...currentBattle,
                battleLog: updatedBattleLog
              }
            },
          });
        } else {
          set({
            gameState: {
              ...gameState,
              player: updatedPlayer
            },
          });
        }
      },
      
      healPlayer: (amount: number) => {
        const { gameState } = get();
        const { player } = gameState;
        
        set({
          gameState: {
            ...gameState,
            player: {
              ...player,
              health: Math.min(player.maxHealth, player.health + amount),
            },
          },
        });
      },
      
      addGold: (amount: number) => {
        const { gameState } = get();
        const { player } = gameState;
        
        set({
          gameState: {
            ...gameState,
            player: {
              ...player,
              gold: player.gold + amount,
            },
          },
        });
      },
      
      addPerk: (perk: PerkType) => {
        const { gameState } = get();
        const { player } = gameState;
        
        set({
          gameState: {
            ...gameState,
            player: {
              ...player,
              perks: [...player.perks, perk],
            },
          },
        });
      },
      
      resetGame: () => {
        set({ gameState: initializeGameState('tralalero') });
      },
      
      triggerShrineEvent: () => {
        const { gameState } = get();
        const shrineEvent = EVENTS.find(event => event.id === 'ancient_shrine');
        if (shrineEvent) {
          set({
            gameState: {
              ...gameState,
              currentEvent: shrineEvent,
              gameStatus: 'event',
            },
          });
        }
      },
    }),
    {
      name: 'gigachad-game-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);