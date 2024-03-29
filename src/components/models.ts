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
  age: EAge;
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
  attributes: { [key in EAttr]: IAttribute };
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
    name: ECond;
    check: boolean;
  };
}

export interface ISkill {
  attr: EAttr;
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
  grip: EGrip;
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
  req: ESpellReq[];
  ingredient?: string;
  time: string;
  range: string;
  duration: EDuration;
  text: string;
  prepared: boolean;
}

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

export enum EAttr {
  STR = 'STR',
  CON = 'CON',
  AGL = 'AGL',
  INT = 'INT',
  WIL = 'WIL',
  CHA = 'CHA',
}

export enum ECond {
  Exhausted = 'Exhausted',
  Sickly = 'Sickly',
  Dazed = 'Dazed',
  Angry = 'Angry',
  Scared = 'Scared',
  Disheartened = 'Disheartened',
}

export enum EDuration {
  Instant = 'Instant',
  Round = 'Round',
  Stretch = 'Stretch',
  Shift = 'Shift',
  Concentration = 'Concentration',
}

export enum ESpellReq {
  Word = 'Word',
  Gesture = 'Gesture',
  Focus = 'Focus',
  Ingredient = 'Ingredient',
}

export enum EAge {
  Young = 'Young',
  Adult = 'Adult',
  Old = 'Old',
}

export enum EGrip {
  None = '-',
  One = '1H',
  Two = '2H',
}

export enum ERollType {
  Attr = 'attribute',
  Primary = 'primary',
  Secondary = 'secondary',
  Weapon = 'weapon',
  Attack = 'attack',
  Spell = 'spell',
}

export enum ED20Result {
  Dragon = 'Dragon!',
  Demon = 'Demon!',
  Success = 'Success!',
  Fail = 'Failure',
}

export type SkillTypes = 'priSkills' | 'secSkills' | 'wepSkills';
