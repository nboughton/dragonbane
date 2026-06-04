export const ID = 'uk.nboughton.obr-dragonbane-sheet';

export interface DBStore {
  chars: Character[];
  conf: AppConfig;
}

export interface AppConfig {
  char: number;
  showTrainedSkills?: boolean;
  showSpells?: boolean;
  darkMode?: boolean;
}

export interface Character {
  id: string;
  name: string;
  kin: string;
  age: Age;
  profession: string;
  weakness: string;
  appearance: string;
  movement: number;
  wp: StatPoints;
  hp: StatPoints;
  abilities: Ability[];
  spells: Spell[];
  inventory: InvItem[];
  backpack?: boolean;
  memento: string;
  tinyItems: string;
  money: {
    gold: number;
    silver: number;
    copper: number;
  };
  attributes: Record<Attr, Attribute>;
  priSkills: Record<PriSkill, Skill>;
  wepSkills: Record<WepSkill, Skill>;
  secSkills: Record<string, Skill>;
  armour: Armour;
  helmet: Armour;
  weapons: Weapon[];
  log?: string[];
}

export interface StatPoints {
  max: number;
  current: number;
}

export interface Attribute {
  score: number;
  condition: {
    name: Condition;
    check: boolean;
  };
}

export interface Skill {
  attr: Attr;
  trained: boolean;
  checked: boolean;
  advances: number;
  locked?: boolean;
  value?: number;
}

export interface InvItem {
  wt: number;
  text: string;
}

export interface Weapon {
  name: string;
  skill: WepSkill;
  grip: Grip;
  range: string;
  damage: string;
  durability: number;
  features: string;
}

export interface Armour {
  name: string;
  rating: number;
  bane: { [index: string]: boolean };
}

export interface Ability {
  name: string;
  wp: number;
  text: string;
}

export interface Spell {
  name: string;
  skill?: string;
  rank: number;
  req: SpellReq[];
  ingredient?: string;
  time: string;
  range: string;
  duration: Duration;
  text: string;
  prepared: boolean;
}

export type DieType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20';

export interface Die {
  n: number; // n is the number of dice, i.e 2 in 2d4
  size: number; // Size is the number of sides, i.e 20 for a d20
}

export interface DiceRoll {
  total: number;
  results: {
    d: Die;
    v: number[];
  }[];
}

export interface TableRow {
  floor: number;
  ceil?: number;
  text: string;
}

export interface Table {
  dice: string;
  rows: TableRow[];
}

export const PriSkills = {
  Acrobatics: 'Acrobatics',
  Awareness: 'Awareness',
  Bartering: 'Bartering',
  BeastLore: 'Beast Lore',
  Bluffing: 'Bluffing',
  Bushcraft: 'Bushcraft',
  Crafting: 'Crafting',
  Evade: 'Evade',
  Healing: 'Healing',
  HuntingFishing: 'Hunting & Fishing',
  Languages: 'Languages',
  MythsLegends: 'Myths & Legends',
  Performance: 'Performance',
  Persuasion: 'Persuasion',
  Riding: 'Riding',
  Seamanship: 'Seamanship',
  SleightOfHand: 'Sleight of Hand',
  Sneaking: 'Sneaking',
  SpotHidden: 'Spot Hidden',
  Swimming: 'Swimming',
} as const;

export type PriSkill = (typeof PriSkills)[keyof typeof PriSkills];

export const WepSkills = {
  Axes: 'Axes',
  Bows: 'Bows',
  Brawling: 'Brawling',
  Crossbows: 'Crossbows',
  Hammers: 'Hammers',
  Knives: 'Knives',
  Slings: 'Slings',
  Spears: 'Spears',
  Staves: 'Staves',
  Swords: 'Swords',
} as const;

export type WepSkill = (typeof WepSkills)[keyof typeof WepSkills];

export const Attrs = {
  STR: 'STR',
  CON: 'CON',
  AGL: 'AGL',
  INT: 'INT',
  WIL: 'WIL',
  CHA: 'CHA',
} as const;

export type Attr = (typeof Attrs)[keyof typeof Attrs];

export const Conditions = {
  Exhausted: 'Exhausted',
  Sickly: 'Sickly',
  Dazed: 'Dazed',
  Angry: 'Angry',
  Scared: 'Scared',
  Disheartened: 'Disheartened',
} as const;

export type Condition = (typeof Conditions)[keyof typeof Conditions];

export const Durations = {
  Instant: 'Instant',
  Round: 'Round',
  Stretch: 'Stretch',
  Shift: 'Shift',
  Concentration: 'Concentration',
} as const;

export type Duration = (typeof Durations)[keyof typeof Durations];

export const SpellReqs = {
  Word: 'Word',
  Gesture: 'Gesture',
  Focus: 'Focus',
  Ingredient: 'Ingredient',
} as const;

export type SpellReq = (typeof SpellReqs)[keyof typeof SpellReqs];

export const Ages = {
  Young: 'Young',
  Adult: 'Adult',
  Old: 'Old',
} as const;

export type Age = (typeof Ages)[keyof typeof Ages];

export const Grips = {
  None: '-',
  One: '1H',
  Two: '2H',
} as const;

export type Grip = (typeof Grips)[keyof typeof Grips];

export const RollTypes = {
  Attr: 'attribute',
  Primary: 'primary',
  Secondary: 'secondary',
  Weapon: 'weapon',
  Attack: 'attack',
  Spell: 'spell',
} as const;

export type RollType = (typeof RollTypes)[keyof typeof RollTypes];

export const D20Results = {
  Dragon: 'Dragon!',
  Demon: 'Demon!',
  Success: 'Success!',
  Fail: 'Failure',
} as const;

export type D20Result = (typeof D20Results)[keyof typeof D20Results];

export type SkillType = 'priSkills' | 'secSkills' | 'wepSkills';
