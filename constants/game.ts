export const GAME_CONFIG = {
  playerStartingHealth: 80,
  playerStartingEnergy: 3,
  maxHandSize: 5,
  maxPathWidth: 4,
  pathHeight: 15, // Including start and boss nodes
  nodeTypes: ['battle', 'shop', 'event', 'camp', 'shrine', 'blacksmith'],
  nodeWeights: {
    battle: 0.5,
    shop: 0.1,
    event: 0.15,
    camp: 0.05,
    shrine: 0.1,
    blacksmith: 0.1,
  },
};

export const BOSSES = [
  {
    id: 'tralalero',
    name: 'Tralalero Tralala',
    description: 'The first and most iconic Italian brainrot character.',
    health: 120,
    image: 'https://static.wikitide.net/italianbrainrotwiki/e/e0/Tralalelo_tralala.png',
    voice: require('../assets/audios/Tralalero Tralala Sound Effect.mp3'),
    abilities: [
      { name: 'Surreal Melody', damage: 12, description: 'Confuses with its iconic sound' },
      { name: 'Visual Distortion', damage: 8, effect: 'weakness', description: 'Applies weakness with surreal visuals' },
      { name: 'Meme Overload', damage: 20, description: 'Overwhelms with concentrated meme energy' },
    ],
    reward: { name: 'Tralalero Essence', effect: 'Draw 1 additional card each turn' }
  },
  {
    id: 'tungtung',
    name: 'Tung Tung Tung Sahur',
    description: 'Indonesian origin character with distinct rhythm.',
    health: 140,
    image: 'https://static.wikitide.net/italianbrainrotwiki/f/fa/Tung_tung_tung_sahur.png',
    voice: null, // Placeholder for future sound effect
    abilities: [
      { name: 'Rhythmic Assault', damage: 10, hits: 3, description: 'Strikes multiple times with its rhythm' },
      { name: 'Cultural Fusion', damage: 15, effect: 'vulnerable', description: 'Applies vulnerable with cultural confusion' },
      { name: 'Unusual Appearance', damage: 25, description: 'Shocks with its bizarre appearance' },
    ],
    reward: { name: 'Rhythm Master', effect: 'First card played each turn costs 0 energy' }
  },
  {
    id: 'bombardiro',
    name: 'Bombardiro Crocodilo',
    description: 'Anthropomorphic crocodile bomber plane.',
    health: 160,
    image: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Bombardiro_Crocodillo.jpg',
    voice: null, // Placeholder for future sound effect
    abilities: [
      { name: 'Aerial Assault', damage: 18, description: 'Dive bombs from above' },
      { name: 'Crocodile Bite', damage: 14, effect: 'bleed', description: 'Applies bleed with powerful jaws' },
      { name: 'Bomber Run', damage: 30, description: 'Devastating bombing attack' },
    ],
    reward: { name: 'Aerial Advantage', effect: 'Start each battle with 5 block' }
  },
  {
    id: 'ballerina',
    name: 'Ballerina Cappuccina',
    description: 'Ballet dancer with a cappuccino mug head.',
    health: 130,
    image: 'https://static.wikitide.net/italianbrainrotwiki/9/9a/Ballerina_cappucappu.png',
    voice: null, // Placeholder for future sound effect
    abilities: [
      { name: 'Pirouette', damage: 12, effect: 'dodge', description: 'Spins gracefully, gaining dodge' },
      { name: 'Hot Coffee Splash', damage: 16, effect: 'burn', description: 'Splashes hot coffee, applying burn' },
      { name: 'Absurd Performance', damage: 22, description: 'Confuses with an absurd dance routine' },
    ],
    reward: { name: 'Graceful Movement', effect: '25% chance to dodge attacks' }
  },
  {
    id: 'lirili',
    name: 'Lirili Larila',
    description: 'Time-bending character with surreal abilities.',
    health: 180,
    image: 'https://static.wikitide.net/italianbrainrotwiki/5/52/Lirili_Larila.jpeg',
    voice: null, // Placeholder for future sound effect
    abilities: [
      { name: 'Time Warp', damage: 14, effect: 'stun', description: 'Bends time, potentially stunning' },
      { name: 'Reality Distortion', damage: 20, description: 'Warps reality around the target' },
      { name: 'Surreal Fusion', damage: 35, description: 'Unleashes pure surreal energy' },
    ],
    reward: { name: 'Time Bender', effect: '10% chance to play a card twice' }
  }
];

export const EQUIPMENT = [
  {
    id: 'fists',
    name: 'Gigachad Fists',
    description: 'Your natural weapons. Simple but effective.',
    image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=300',
    slot: 'weapon' as EquipmentSlotType,
    grade: 'common' as const,
    cards: [
      { id: 'punch', name: 'Punch', damage: 6, energy: 1, description: 'Deal 6 damage', quantity: 4, grade: 'common' as const },
      { id: 'block', name: 'Block', block: 5, energy: 1, description: 'Gain 5 block', quantity: 4, grade: 'common' as const },
      { id: 'flex', name: 'Flex', strength: 2, energy: 1, description: 'Gain 2 strength for this turn', quantity: 2, grade: 'uncommon' as const },
    ]
  },
  {
    id: 'gauntlet',
    name: 'Infinite Gauntlet',
    description: 'Harness the power of the cosmos.',
    image: 'https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?q=80&w=300',
    slot: 'offhand' as EquipmentSlotType,
    grade: 'legendary' as const,
    cards: [
      { id: 'finger_snap', name: 'Finger Snap', damage: 20, energy: 3, description: 'Deal 20 damage to all enemies', quantity: 1, grade: 'legendary' as const },
      { id: 'power_bash', name: 'Power Bash', damage: 10, energy: 1, description: 'Deal 10 damage', quantity: 2, grade: 'rare' as const },
      { id: 'cosmic_shield', name: 'Cosmic Shield', block: 8, energy: 1, description: 'Gain 8 block', quantity: 3, grade: 'uncommon' as const },
      { id: 'reality_warp', name: 'Reality Warp', energy: 2, draw: 3, description: 'Draw 3 cards', quantity: 1, grade: 'epic' as const },
    ]
  },
  {
    id: 'sunglasses',
    name: 'Deal With It Sunglasses',
    description: 'Enhance your coolness factor to damaging levels.',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=300',
    slot: 'head' as EquipmentSlotType,
    grade: 'uncommon' as const,
    cards: [
      { id: 'cool_stare', name: 'Cool Stare', damage: 8, energy: 1, description: 'Deal 8 damage and apply 2 weak', quantity: 3, grade: 'uncommon' as const },
      { id: 'shade_block', name: 'Shade Block', block: 7, energy: 1, description: 'Gain 7 block', quantity: 3, grade: 'common' as const },
      { id: 'meme_power', name: 'Meme Power', strength: 3, energy: 2, description: 'Gain 3 strength for this turn', quantity: 2, grade: 'rare' as const },
      { id: 'deal_with_it', name: 'Deal With It', damage: 15, energy: 2, description: 'Deal 15 damage. If enemy is weak, deal 20 instead', quantity: 1, grade: 'epic' as const },
    ]
  },
  {
    id: 'chad_sword',
    name: 'Chad Sword',
    description: 'A mighty blade forged from pure testosterone.',
    image: 'https://images.unsplash.com/photo-1590419690008-905895e8fe0d?q=80&w=300',
    slot: 'weapon' as EquipmentSlotType,
    grade: 'rare' as const,
    cards: [
      { id: 'slash', name: 'Slash', damage: 9, energy: 1, description: 'Deal 9 damage', quantity: 3, grade: 'common' as const },
      { id: 'parry', name: 'Parry', block: 9, energy: 1, description: 'Gain 9 block', quantity: 3, grade: 'uncommon' as const },
      { id: 'double_strike', name: 'Double Strike', damage: 6, hits: 2, energy: 2, description: 'Deal 6 damage twice', quantity: 2, grade: 'rare' as const },
      { id: 'gigachad_stance', name: 'Gigachad Stance', energy: 2, description: 'Gain 4 strength and 4 block', quantity: 1, grade: 'epic' as const },
    ]
  },
  {
    id: 'abs_armor',
    name: 'Six-Pack Abs Armor',
    description: 'Natural armor that makes enemies jealous.',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=300',
    slot: 'chest' as EquipmentSlotType,
    grade: 'common' as const,
    cards: [
      { id: 'flex_defense', name: 'Flex Defense', block: 10, energy: 1, description: 'Gain 10 block', quantity: 3, grade: 'common' as const },
      { id: 'intimidate', name: 'Intimidate', energy: 1, description: 'Enemy loses 2 strength this turn', quantity: 2, grade: 'uncommon' as const },
      { id: 'taunt', name: 'Taunt', energy: 1, description: 'Apply 3 weak to enemy', quantity: 2, grade: 'uncommon' as const },
    ]
  },
  {
    id: 'sigma_boots',
    name: 'Sigma Grindset Boots',
    description: 'Never skip leg day. These boots increase your mobility.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=300',
    slot: 'feet' as EquipmentSlotType,
    grade: 'uncommon' as const,
    cards: [
      { id: 'quick_step', name: 'Quick Step', energy: 0, draw: 1, description: 'Draw 1 card', quantity: 2, grade: 'rare' as const },
      { id: 'leg_sweep', name: 'Leg Sweep', damage: 5, energy: 1, description: 'Deal 5 damage and gain 5 block', quantity: 3, grade: 'uncommon' as const },
      { id: 'run_away', name: 'Tactical Retreat', block: 12, energy: 2, description: 'Gain 12 block', quantity: 2, grade: 'common' as const },
    ]
  },
  {
    id: 'protein_necklace',
    name: 'Protein Shake Necklace',
    description: 'A vial of pure protein always at the ready.',
    image: 'https://images.unsplash.com/photo-1535556116002-6281ff3e9f36?q=80&w=300',
    slot: 'accessory1' as EquipmentSlotType,
    grade: 'common' as const,
    cards: [
      { id: 'protein_boost', name: 'Protein Boost', strength: 1, energy: 1, description: 'Gain 1 permanent strength', quantity: 1, grade: 'epic' as const },
      { id: 'quick_sip', name: 'Quick Sip', heal: 5, energy: 1, description: 'Heal 5 HP', quantity: 2, grade: 'uncommon' as const },
      { id: 'energy_drink', name: 'Energy Drink', energyGain: 2, energy: 0, description: 'Gain 2 energy', quantity: 1, grade: 'rare' as const },
    ]
  },
  {
    id: 'meme_bracelet',
    name: 'Meme Knowledge Bracelet',
    description: 'Contains the power of a thousand memes.',
    image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=300',
    slot: 'accessory2' as EquipmentSlotType,
    grade: 'rare' as const,
    cards: [
      { id: 'meme_reference', name: 'Obscure Reference', damage: 12, energy: 2, description: 'Deal 12 damage. If enemy is confused, deal 18 instead', quantity: 2, grade: 'rare' as const },
      { id: 'viral_content', name: 'Viral Content', energy: 1, description: 'Apply 3 vulnerable to enemy', quantity: 2, grade: 'uncommon' as const },
      { id: 'repost', name: 'Repost', energy: 1, description: 'Copy the last card you played into your hand', quantity: 1, grade: 'epic' as const },
    ]
  },
  {
    id: 'basic_hat',
    name: 'Basic Hat',
    description: 'A simple hat for basic protection.',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=300',
    slot: 'head' as EquipmentSlotType,
    grade: 'common' as const,
    cards: [
      { id: 'headbutt', name: 'Headbutt', damage: 4, energy: 1, description: 'Deal 4 damage', quantity: 3, grade: 'common' as const },
      { id: 'duck', name: 'Duck', block: 4, energy: 1, description: 'Gain 4 block', quantity: 3, grade: 'common' as const },
    ]
  },
  {
    id: 'basic_shield',
    name: 'Basic Shield',
    description: 'A simple wooden shield for basic defense.',
    image: 'https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?q=80&w=300',
    slot: 'offhand' as EquipmentSlotType,
    grade: 'common' as const,
    cards: [
      { id: 'shield_bash', name: 'Shield Bash', damage: 3, energy: 1, description: 'Deal 3 damage', quantity: 3, grade: 'common' as const },
      { id: 'shield_block', name: 'Shield Block', block: 6, energy: 1, description: 'Gain 6 block', quantity: 3, grade: 'common' as const },
    ]
  },
  {
    id: 'basic_shoes',
    name: 'Basic Shoes',
    description: 'Simple shoes for basic mobility.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=300',
    slot: 'feet' as EquipmentSlotType,
    grade: 'common' as const,
    cards: [
      { id: 'kick', name: 'Kick', damage: 5, energy: 1, description: 'Deal 5 damage', quantity: 3, grade: 'common' as const },
      { id: 'step_back', name: 'Step Back', block: 3, energy: 1, description: 'Gain 3 block', quantity: 3, grade: 'common' as const },
    ]
  },
  {
    id: 'basic_ring',
    name: 'Basic Ring',
    description: 'A simple ring with basic magical properties.',
    image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=300',
    slot: 'accessory2' as EquipmentSlotType,
    grade: 'common' as const,
    cards: [
      { id: 'magic_spark', name: 'Magic Spark', damage: 4, energy: 1, description: 'Deal 4 damage', quantity: 2, grade: 'common' as const },
      { id: 'basic_heal', name: 'Basic Heal', heal: 3, energy: 1, description: 'Heal 3 HP', quantity: 2, grade: 'common' as const },
    ]
  }
];

export const ITEMS = [
  {
    id: 'health_potion',
    name: 'Health Potion',
    description: 'Restores 20 HP when used.',
    effect: 'Heal 20 HP',
    usableInBattle: true,
    quantity: 1
  },
  {
    id: 'energy_drink',
    name: 'Energy Drink',
    description: 'Grants 2 energy when used.',
    effect: 'Gain 2 energy',
    usableInBattle: true,
    quantity: 1
  },
  {
    id: 'strength_potion',
    name: 'Strength Potion',
    description: 'Grants 3 strength for the current battle.',
    effect: 'Gain 3 strength',
    usableInBattle: true,
    quantity: 1
  },
  {
    id: 'block_potion',
    name: 'Block Potion',
    description: 'Grants 15 block immediately.',
    effect: 'Gain 15 block',
    usableInBattle: true,
    quantity: 1
  },
  {
    id: 'cleansing_oil',
    name: 'Cleansing Oil',
    description: 'Removes all negative status effects.',
    effect: 'Remove all debuffs',
    usableInBattle: true,
    quantity: 1
  }
];

export const ENEMIES = [
  {
    id: 'meme_goblin',
    name: 'Meme Goblin',
    health: 30,
    image: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?q=80&w=300',
    moves: [
      { name: 'Scratch', damage: 5, probability: 0.6 },
      { name: 'Bite', damage: 8, probability: 0.4 },
    ]
  },
  {
    id: 'doge',
    name: 'Feral Doge',
    health: 40,
    image: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?q=80&w=300',
    moves: [
      { name: 'Much Bite', damage: 7, probability: 0.5 },
      { name: 'Very Scratch', damage: 4, hits: 2, probability: 0.3 },
      { name: 'Wow Howl', effect: 'strength', value: 2, probability: 0.2 },
    ]
  },
  {
    id: 'troll_face',
    name: 'Troll Face',
    health: 50,
    image: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?q=80&w=300',
    moves: [
      { name: 'Problem?', damage: 10, probability: 0.4 },
      { name: 'Troll Logic', effect: 'confusion', probability: 0.3 },
      { name: 'U Mad?', damage: 6, effect: 'weakness', probability: 0.3 },
    ]
  },
];

export const EVENTS = [
  {
    id: 'mysterious_stranger',
    title: 'Mysterious Stranger',
    description: 'A cloaked figure offers you a deal...',
    options: [
      { text: 'Trade 10 HP for a random equipment', effect: { type: 'trade', hp: -10, reward: 'equipment' } },
      { text: 'Ignore and move on', effect: { type: 'none' } },
    ]
  },
  {
    id: 'ancient_shrine',
    title: 'Ancient Shrine',
    description: 'You discover an ancient shrine dedicated to forgotten memes.',
    options: [
      { text: 'Pray for strength (+2 permanent strength)', effect: { type: 'buff', stat: 'strength', value: 2 } },
      { text: 'Pray for protection (+10 max HP)', effect: { type: 'buff', stat: 'maxHealth', value: 10 } },
      { text: 'Desecrate the shrine (50% chance: +50 gold or curse)', effect: { type: 'random', good: { gold: 50 }, bad: { curse: 'Meme Curse' } } },
    ]
  },
  {
    id: 'abandoned_gym',
    title: 'Abandoned Gym',
    description: "You find Zyzz's abandoned gym. The equipment is still in good condition.",
    options: [
      { text: 'Work out (Gain 5 max HP)', effect: { type: 'buff', stat: 'maxHealth', value: 5 } },
      { text: 'Take protein shake (Heal 15 HP)', effect: { type: 'heal', value: 15 } },
      { text: 'Study technique books (Upgrade a card)', effect: { type: 'upgrade', target: 'randomCard' } },
    ]
  },
];

export const SHOP_ITEMS: ShopItemType[] = [
  { type: 'card', name: 'Gigachad Smash', damage: 14, energy: 2, description: 'Deal 14 damage', price: 50 },
  { type: 'card', name: 'Flex Pose', block: 12, energy: 2, description: 'Gain 12 block', price: 50 },
  { type: 'card', name: 'Meme Review', damage: 8, energy: 1, description: 'Deal 8 damage and draw a card', price: 75 },
  { type: 'card', name: 'Sigma Mindset', energy: 1, description: 'Gain 3 strength this turn', price: 100 },
  { type: 'item', name: 'Health Potion', effect: 'Heal 20 HP', usableInBattle: true, price: 40 },
  { type: 'item', name: 'Energy Drink', effect: 'Gain 2 energy', usableInBattle: true, price: 60 },
  { type: 'equipment', name: 'Protein Necklace', id: 'protein_necklace', price: 150 },
  { type: 'equipment', name: 'Meme Bracelet', id: 'meme_bracelet', price: 200 },
];

import { ShopItemType, EquipmentSlotType } from '@/types/game';