import { uid } from 'quasar';
import type { Attr, Condition, Character, Skill, Attribute, Weapon, Ability, Spell } from 'src/components/models';
import { Attrs, Conditions, Durations, Ages, Grips, WepSkills } from 'src/components/models';

export const NewCharacter = (): Character => ({
  id: uid(),
  name: 'New character',
  kin: '',
  age: Ages.Adult,
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
    [Attrs.STR]: stat(Conditions.Exhausted),
    [Attrs.CON]: stat(Conditions.Sickly),
    [Attrs.AGL]: stat(Conditions.Dazed),
    [Attrs.INT]: stat(Conditions.Angry),
    [Attrs.WIL]: stat(Conditions.Scared),
    [Attrs.CHA]: stat(Conditions.Disheartened),
  },
  priSkills: {
    Acrobatics: skill(Attrs.AGL),
    Awareness: skill(Attrs.INT),
    Bartering: skill(Attrs.CHA),
    'Beast Lore': skill(Attrs.INT),
    Bluffing: skill(Attrs.CHA),
    Bushcraft: skill(Attrs.INT),
    Crafting: skill(Attrs.STR),
    Evade: skill(Attrs.AGL),
    Healing: skill(Attrs.INT),
    'Hunting & Fishing': skill(Attrs.AGL),
    Languages: skill(Attrs.INT),
    'Myths & Legends': skill(Attrs.INT),
    Performance: skill(Attrs.CHA),
    Persuasion: skill(Attrs.CHA),
    Riding: skill(Attrs.AGL),
    Seamanship: skill(Attrs.INT),
    'Sleight of Hand': skill(Attrs.AGL),
    Sneaking: skill(Attrs.AGL),
    'Spot Hidden': skill(Attrs.INT),
    Swimming: skill(Attrs.AGL),
  },
  wepSkills: {
    Axes: skill(Attrs.STR),
    Bows: skill(Attrs.AGL),
    Brawling: skill(Attrs.STR),
    Crossbows: skill(Attrs.AGL),
    Hammers: skill(Attrs.STR),
    Knives: skill(Attrs.AGL),
    Slings: skill(Attrs.AGL),
    Spears: skill(Attrs.STR),
    Staves: skill(Attrs.AGL),
    Swords: skill(Attrs.STR),
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

export const skill = (attr: Attr): Skill => ({
  attr,
  trained: false,
  checked: false,
  advances: 0,
});

export const stat = (cond: Condition): Attribute => ({
  score: 0,
  condition: {
    name: cond,
    check: false,
  },
});

export const NewWeapon = (): Weapon => ({
  name: '',
  skill: WepSkills.Axes,
  grip: Grips.None,
  range: '',
  damage: '',
  durability: 0,
  features: '',
});

export const NewAbility = (): Ability => ({
  name: '',
  wp: 0,
  text: '',
});

export const NewSpell = (): Spell => ({
  name: '',
  rank: 0,
  req: [],
  time: '',
  range: '',
  duration: Durations.Instant,
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
