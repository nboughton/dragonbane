export const ID = 'uk.nboughton.obr-dragonbane-sheet';

export interface IDBStore {
  chars: ICharacter[];
  conf: IConfig;
}

export interface IConfig {
  char: number;
  showTrainedSkills?: boolean;
  showSpells?: boolean;
  darkMode?: boolean;
}

export interface ICharacter {
  id: string;
  name: string;
  kin: string;
  age: Age;
  profession: string;
  weakness: string;
  appearance: string;
  movement: number;
  wp: IPoints;
  hp: IPoints;
  abilities: IAbility[];
  spells: ISpell[];
  inventory: IItem[];
  backpack?: boolean;
  memento: string;
  tinyItems: string;
  money: {
    gold: number;
    silver: number;
    copper: number;
  };
  attributes: Record<Attr, IAttribute>;
  priSkills: { [index: string]: ISkill };
  wepSkills: { [index: string]: ISkill };
  secSkills: { [index: string]: ISkill };
  armour: IArmour;
  helmet: IArmour;
  weapons: IWeapon[];
}

export interface IPoints {
  max: number;
  current: number;
}

export interface IAttribute {
  score: number;
  condition: {
    name: Condition;
    check: boolean;
  };
}

export interface ISkill {
  attr: Attr;
  trained: boolean;
  checked: boolean;
  advances: number;
  locked?: boolean;
  value?: number;
}

export interface IItem {
  wt: number;
  text: string;
}

export interface IWeapon {
  name: string;
  skill?: string;
  grip: Grip;
  range: string;
  damage: string;
  durability: number;
  features: string;
}

export interface IArmour {
  name: string;
  rating: number;
  bane: { [index: string]: boolean };
}

export interface IAbility {
  name: string;
  wp: number;
  text: string;
}

export interface ISpell {
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

export type Die = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20';

export interface IDie {
  n: number; // n is the number of dice, i.e 2 in 2d4
  size: number; // Size is the number of sides, i.e 20 for a d20
}

export interface IDiceRoll {
  total: number;
  results: {
    d: IDie;
    v: number[];
  }[];
}

export interface ITableRow {
  floor: number;
  ceil?: number;
  text: string;
}

export interface ITable {
  dice: string;
  rows: ITableRow[];
}

export const Attrs = {
  STR : 'STR',
  CON : 'CON',
  AGL : 'AGL',
  INT : 'INT',
  WIL : 'WIL',
  CHA : 'CHA',
} as const

export type Attr = (typeof Attrs)[keyof typeof Attrs]

export const Conditions = {
  Exhausted : 'Exhausted',
  Sickly : 'Sickly',
  Dazed : 'Dazed',
  Angry : 'Angry',
  Scared : 'Scared',
  Disheartened : 'Disheartened',
} as const

export type Condition = (typeof Conditions)[keyof typeof Conditions]

export const Durations = {
  Instant : 'Instant',
  Round : 'Round',
  Stretch : 'Stretch',
  Shift : 'Shift',
  Concentration : 'Concentration',
} as const

export type Duration = (typeof Durations)[keyof typeof Durations]

export const SpellReqs = {
  Word : 'Word',
  Gesture : 'Gesture',
  Focus : 'Focus',
  Ingredient : 'Ingredient',
} as const

export type SpellReq = (typeof SpellReqs)[keyof typeof SpellReqs]

export const Ages = {
  Young : 'Young',
  Adult : 'Adult',
  Old : 'Old',
} as const

export type Age = (typeof Ages)[keyof typeof Ages]

export const Grips = {
  None : '-',
  One : '1H',
  Two : '2H',
} as const

export type Grip = (typeof Grips)[keyof typeof Grips]

export const RollTypes = {
  Attr : 'attribute',
  Primary : 'primary',
  Secondary : 'secondary',
  Weapon : 'weapon',
  Attack : 'attack',
  Spell : 'spell',
} as const

export type RollType = (typeof RollTypes)[keyof typeof RollTypes]

export const D20Results = {
  Dragon : 'Dragon!',
  Demon : 'Demon!',
  Success : 'Success!',
  Fail : 'Failure',
} as const

export type D20Result = (typeof D20Results)[keyof typeof D20Results]

export type SkillType = 'priSkills' | 'secSkills' | 'wepSkills';

