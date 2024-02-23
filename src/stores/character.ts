import { defineStore } from 'pinia';

import { EAttr, ICharacter, IConfig, IDBStore, SkillTypes } from 'src/components/models';

import { exportFile } from 'quasar';

import { DmgBonus, NewCharacter } from 'src/lib/defaults';

import { BaseChance } from 'src/lib/defaults';

export const useCharacterStore = defineStore('character', {
  state: () => ({
    chars: <ICharacter[]>[NewCharacter()],
    conf: <IConfig>{
      char: 0,
      showTrainedSkills: true,
      showSpells: true,
      darkMode: true,
    },
  }),
  getters: {
    char: (state): ICharacter => state.chars[state.conf.char],
    skill: (state) => {
      return (skillType: SkillTypes, skillName: string): number => {
        const s = state.chars[state.conf.char][skillType][skillName];
        const b = state.chars[state.conf.char].attributes[s.attr].score;
        return s.locked && s.value ? s.value : s.advances + (s.trained ? BaseChance(b) * 2 : BaseChance(b));
      };
    },
    dmgBonus: (state) => {
      return (attr: EAttr): string => DmgBonus(state.chars[state.conf.char].attributes[attr].score);
    },
    banes: (state) => {
      return (skillType: SkillTypes, skillName: string): number => {
        let b = 0;
        const s = state.chars[state.conf.char][skillType][skillName];
        if (state.chars[state.conf.char].attributes[s.attr as EAttr].condition.check) b++;
        return b;
      };
    },
  },
  actions: {
    lockSkills() {
      const sections: SkillTypes[] = ['priSkills', 'secSkills', 'wepSkills'];

      sections.forEach((section) => {
        Object.keys(this.char[section]).forEach((key) => {
          this.char[section][key].value = this.skill(section, key);
          this.char[section][key].locked = true;
        });
      });
    },

    exportData() {
      const now = new Date();
      exportFile(
        `DragonbaneCharacters-${now.getFullYear()}-${now.getMonth()}-${now.getDate()}.json`,
        JSON.stringify({
          chars: this.chars,
          conf: this.conf,
        })
      );
    },

    loadData(d: IDBStore) {
      this.conf = d.conf;

      d.chars.forEach((lChar) => {
        let overwrite = false;
        this.chars.forEach((sChar, idx) => {
          if (sChar.id == lChar.id) {
            this.chars[idx] = lChar;
            overwrite = true;
            return;
          }
        });
        if (!overwrite) this.chars.push(lChar);
      });
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'DragonbaneCharacters',
        storage: localStorage,
      },
    ],
  },
});
