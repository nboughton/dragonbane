export interface IConfig {
  char: number;
}

export interface ICharacter {
  id: string;
  name: string;
  kin: string;
  age: number;
  profession: string;
  weakness: string;
  appearance: string;
  movement: number;
  wp: IPoints;
  hp: IPoints;
  abilities: IAbility[];
  spells: ISpell[];
  inventory: IItem[];
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
}

export interface IItem {
  wt: number;
  text: string;
}

export interface IWeapon {
  name: string;
  grip: string;
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
  rank: number;
  req: ESpellReq[];
  time: string;
  range: string;
  duration: EDuration;
  text: string;
  prepared: boolean;
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
