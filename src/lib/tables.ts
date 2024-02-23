import { ITable } from 'src/components/models';
import { parseDiceString, rollDice } from './util';

export const rollTable = (t: ITable): string | undefined => {
  const n = rollDice(parseDiceString(t.dice));

  return t.rows.find((row) => {
    if (n.total == row.floor) return row;
    if (row.ceil && n.total >= row.floor && n.total <= row.ceil) return row;
  })?.text;
};

export const MeleeDemon: ITable = {
  dice: '1d6',
  rows: [
    { floor: 1, text: 'You drop your weapon at your feet. Picking it up is an action.' },
    {
      floor: 2,
      text: 'You expose yourself to the enemy, who gets a free attack (page 43) that cannot be dodged or parried.',
    },
    {
      floor: 3,
      text: 'Your weapon cuts so deep into an object that it gets stuck. Pulling it free requires a STR roll (counts as an action)',
    },
    {
      floor: 4,
      text: 'You accidentally toss your weapon D3+3 meters. To pick it up you must move and then perform an action.',
    },
    {
      floor: 5,
      text: 'You slam your weapon into something hard and damage it. Any use of the weapon gets a bane until it is repaired by an artisan.',
    },
    { floor: 6, text: 'You hit yourself by mistake. Roll for damage as usual, but without any damage bonus.' },
  ],
};

export const RangedDemon: ITable = {
  dice: '1d6',
  rows: [
    { floor: 1, text: 'You drop your weapon at your feet. Picking it up is an action.' },
    {
      floor: 2,
      text: 'You run out of arrows and must get more before you can use the weapon again. Re-roll for sling or throwing weapons.',
    },
    { floor: 3, text: 'You hit a valuable or important item nearby. The GM decides what it is.' },
    { floor: 4, text: 'You break your weapon. Any use of the weapon gets a bane until it is repaired by an artisan.' },
    {
      floor: 5,
      text: 'You accidentally hit a random player character or friendly NPC. Roll for damage as usual, including damage bonus.',
    },
    { floor: 6, text: 'You hit yourself by mistake. Roll for damage as usual, but without damage bonus.' },
  ],
};
