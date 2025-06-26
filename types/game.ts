export type CardType = {
  id: string;
  name: string;
  damage?: number;
  block?: number;
  energy: number;
  description: string;
  hits?: number;
  strength?: number;
  quantity?: number;
  upgraded?: boolean;
};

export type EquipmentSlotType = 'head' | 'chest' | 'weapon' | 'offhand' | 'legs' | 'feet' | 'accessory1' | 'accessory2';

export type EquipmentType = {
  id: string;
  name: string;
  description: string;
  image: string;
  slot: EquipmentSlotType;
  cards: CardType[];
};

export type ItemType = {
  id: string;
  name: string;
  description: string;
  effect: string;
  usableInBattle: boolean;
  quantity: number;
};

export type EnemyType = {
  id: string;
  name: string;
  health: number;
  currentHealth?: number;
  image: string;
  moves: {
    name: string;
    damage?: number;
    hits?: number;
    effect?: string;
    value?: number;
    probability: number;
  }[];
  intent?: {
    name: string;
    damage?: number;
    effect?: string;
    value?: number;
  };
  strength?: number;
  block?: number;
};

export type BossType = {
  id: string;
  name: string;
  description: string;
  health: number;
  currentHealth?: number;
  image: string;
  abilities: {
    name: string;
    damage: number;
    hits?: number;
    effect?: string;
    description: string;
  }[];
  intent?: {
    name: string;
    damage?: number;
    effect?: string;
  };
  reward: {
    name: string;
    effect: string;
  };
  strength?: number;
  block?: number;
};

export type EventType = {
  id: string;
  title: string;
  description: string;
  options: {
    text: string;
    effect: {
      type: string;
      hp?: number;
      reward?: string;
      stat?: string;
      value?: number;
      good?: any;
      bad?: any;
      target?: string;
    };
  }[];
};

export type NodeType = {
  id: string;
  type: 'start' | 'battle' | 'shop' | 'event' | 'camp' | 'shrine' | 'blacksmith' | 'boss';
  x: number;
  y: number;
  connections: string[];
  visited?: boolean;
  available?: boolean;
  content?: any;
};

export type PathType = {
  nodes: NodeType[];
  currentNode: string | null;
};

export type PerkType = {
  id: string;
  name: string;
  effect: string;
  description: string;
};

export type EquippedItemsType = {
  [key in EquipmentSlotType]?: string;
};

export type PlayerType = {
  health: number;
  maxHealth: number;
  energy: number;
  maxEnergy: number;
  gold: number;
  equipment: EquipmentType[];
  equippedItems: EquippedItemsType;
  items: ItemType[];
  deck: CardType[];
  hand: CardType[];
  drawPile: CardType[];
  discardPile: CardType[];
  strength: number;
  block: number;
  perks: PerkType[];
};

export type BattleLogEntryType = {
  id: string;
  type: 'damage' | 'block' | 'heal' | 'effect' | 'card';
  source: 'player' | 'enemy' | 'system';
  target: 'player' | 'enemy' | 'system';
  value: number;
  message: string;
  timestamp: number;
};

export type RewardType = {
  type: string;
  name: string;
  description: string;
  amount?: number;
  item?: ItemType;
  equipment?: EquipmentType;
  perk?: PerkType;
};

export type GameStateType = {
  player: PlayerType;
  path: PathType;
  currentBoss: BossType | null;
  defeatedBosses: string[];
  currentBattle: {
    enemy: EnemyType | BossType;
    turn: number;
    playerTurn: boolean;
    battleLog: BattleLogEntryType[];
  } | null;
  currentEvent: EventType | null;
  gameStatus: 'menu' | 'path' | 'battle' | 'event' | 'shop' | 'camp' | 'shrine' | 'blacksmith' | 'victory' | 'defeat';
  showVictoryEffect?: boolean;
  lastReward: RewardType | null;
  previewNode: NodeType | null;
};

export type ShopItemType = {
  type: string;
  name: string;
  damage?: number;
  block?: number;
  energy?: number;
  description?: string;
  effect?: string;
  usableInBattle?: boolean;
  id?: string;
  price: number;
};