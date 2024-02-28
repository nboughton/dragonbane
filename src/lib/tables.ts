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

export const MagicalMishap: ITable = {
  dice: '1d20',
  rows: [
    { floor: 1, text: 'The magical powers leave you Dazed.' },
    { floor: 2, text: 'The spellcasting suddenly makes you Exhausted.' },
    { floor: 3, text: 'The energies take a toll on your body and make you Sickly.' },
    { floor: 4, text: 'You lose control of the spell, which makes you very Angry.' },
    { floor: 5, text: 'The spell subjects you to demonic visions that leave you Scared.' },
    { floor: 6, text: 'You see the world beyond the veil and realize your own insignificance. You feel Disheartened.' },
    { floor: 7, text: 'The magic ravages your body, inflicting D6 damage per power level.' },
    { floor: 8, text: 'The spell drains your willpower and you lose D6 WP per power level.' },
    {
      floor: 9,
      text: 'The spell gives rise to a magical disease with virulence 3D6. You and everyone you come into contact with during the next shift are exposed to the disease.',
    },
    {
      floor: 10,
      text: 'Another random spell of yours is activated instead of the one you cast, with the same target and power level.',
    },
    {
      floor: 11,
      text: 'You vomit a frog the moment you tell a lie. Roll D4 every morning. On a 1, the effect wears off. It can also be lifted with DISPEL.',
    },
    {
      floor: 12,
      text: 'Any gold or silver you touch withers into dust. Roll D4 every morning. On a 1, the effect wears off. It can also be lifted with DISPEL.',
    },
    {
      floor: 13,
      text: 'The spell blinds you, and you act as if in total darkness (page 52). Roll D4 every morning. On a 1, you recover. The effect can also be lifted with DISPEL.',
    },
    {
      floor: 14,
      text: 'You are struck by amnesia and forget who you and the other player characters are. The effect must be roleplayed. Roll D4 every morning. On a 1, your memory returns.',
    },
    {
      floor: 15,
      text: 'The spell also affects a friend or other unintended victim. A healing or helping spell affects an enemy.',
    },
    {
      floor: 16,
      text: 'The spell backfires. An offensive spell affects you instead of the intended target. A protecting or healing spell inflicts damage instead.',
    },
    {
      floor: 17,
      text: 'You turn into an animal. Roll D6. 1: cat, 2: fox, 3: goat, 4: wolf, 5: deer, 6: bear. You get stats according to the table on page 99 and cannot speak, but you retain your mental acuity. Roll a D4 every morning. On a 1, you revert back to your original form.',
    },
    {
      floor: 18,
      text: 'You become one category younger, for example from adult to young. Your attributes and derived ratings change as per the table on page 24, but your skill levels do not. If you were already young, you turn into a child with −2 STR and CON, to a minimum of 3. The effect is permanent and you age normally from your new age.',
    },
    {
      floor: 19,
      text: 'You become one category older, for example from adult to old. Your attributes and derived ratings change as per the table on page 24, but your skill levels do not. If you were already old, you become very frail and get −2 STR and CON. The effect is permanent and you age normally from your new age.',
    },
    {
      floor: 20,
      text: ' Your magic attracts a demon (page 85) from another dimension. The demon shows up within the next shift and attacks or causes some kind of trouble. The details are up to the GM.',
    },
  ],
};
