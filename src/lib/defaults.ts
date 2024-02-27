import { uid } from 'quasar';
import {
  ICharacter,
  EAttr,
  ECond,
  ISkill,
  IAttribute,
  IWeapon,
  IAbility,
  ISpell,
  EDuration,
  EAge,
  EGrip,
} from 'src/components/models';

export const NewCharacter = (): ICharacter => ({
  id: uid(),
  name: 'New character',
  kin: '',
  age: EAge.Adult,
  profession: '',
  weakness: '',
  appearance: '',
  movement: 10,
  hp: {
    max: 0,
    current: 0,
  },
  wp: {
    max: 0,
    current: 0,
  },
  abilities: [],
  spells: [],
  inventory: [],
  backpack: false,
  memento: '',
  tinyItems: '',
  money: {
    gold: 0,
    silver: 0,
    copper: 0,
  },
  attributes: {
    [EAttr.STR]: stat(ECond.Exhausted),
    [EAttr.CON]: stat(ECond.Sickly),
    [EAttr.AGL]: stat(ECond.Dazed),
    [EAttr.INT]: stat(ECond.Angry),
    [EAttr.WIL]: stat(ECond.Scared),
    [EAttr.CHA]: stat(ECond.Disheartened),
  },
  priSkills: {
    Acrobatics: skill(EAttr.AGL),
    Awareness: skill(EAttr.INT),
    Bartering: skill(EAttr.CHA),
    'Beast Lore': skill(EAttr.INT),
    Bluffing: skill(EAttr.CHA),
    Bushcraft: skill(EAttr.INT),
    Crafting: skill(EAttr.STR),
    Evade: skill(EAttr.AGL),
    Healing: skill(EAttr.INT),
    'Hunting & Fishing': skill(EAttr.AGL),
    Languages: skill(EAttr.INT),
    'Myths & Legends': skill(EAttr.INT),
    Performance: skill(EAttr.CHA),
    Persuasion: skill(EAttr.CHA),
    Riding: skill(EAttr.AGL),
    Seamanship: skill(EAttr.INT),
    'Sleight of Hand': skill(EAttr.AGL),
    Sneaking: skill(EAttr.AGL),
    'Spot Hidden': skill(EAttr.INT),
    Swimming: skill(EAttr.AGL),
  },
  wepSkills: {
    Axes: skill(EAttr.STR),
    Bows: skill(EAttr.AGL),
    Brawling: skill(EAttr.STR),
    Crossbows: skill(EAttr.AGL),
    Hammers: skill(EAttr.STR),
    Knives: skill(EAttr.AGL),
    Slings: skill(EAttr.AGL),
    Spears: skill(EAttr.STR),
    Staves: skill(EAttr.AGL),
    Swords: skill(EAttr.STR),
  },
  secSkills: {},
  armour: {
    name: '',
    rating: 0,
    bane: {
      Sneaking: false,
      Evade: false,
      Acrobatics: false,
    },
  },
  helmet: {
    name: '',
    rating: 0,
    bane: {
      Awareness: false,
      'Ranged Attacks': false,
    },
  },
  weapons: [],
});

export const skill = (attr: EAttr): ISkill => ({
  attr,
  trained: false,
  checked: false,
  advances: 0,
});

export const stat = (cond: ECond): IAttribute => ({
  score: 0,
  condition: {
    name: cond,
    check: false,
  },
});

export const NewWeapon = (): IWeapon => ({
  name: '',
  grip: EGrip.None,
  range: '',
  damage: '',
  durability: 0,
  features: '',
});

export const NewAbility = (): IAbility => ({
  name: '',
  wp: 0,
  text: '',
});

export const NewSpell = (): ISpell => ({
  name: '',
  rank: 0,
  req: [],
  time: '',
  range: '',
  duration: EDuration.Instant,
  text: '',
  prepared: false,
});

export const BaseChance = (n: number): number => {
  if (n <= 5) return 3;
  if (n <= 8) return 4;
  if (n <= 12) return 5;
  if (n <= 15) return 6;
  if (n <= 18) return 7;
  else return 0;
};

export const DmgBonus = (n: number): string => {
  if (n <= 12) return '-';
  if (n <= 16) return '+D4';
  if (n >= 17) return '+D6';
  else return '-';
};
