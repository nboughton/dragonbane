import { defineStore } from "pinia";

import {
  type AppConfig,
  type Attr,
  type Character,
  type DBStore,
  type PriSkill,
  PriSkills,
  type Skill,
  type SkillType,
  type WepSkill,
  WepSkills,
} from "../components/models.ts";

import { exportFile } from "quasar";

import { DmgBonus, NewCharacter } from "../lib/defaults.ts";

import { BaseChance } from "../lib/defaults.ts";
import { roll } from "../lib/util.ts";

export const useCharacterStore = defineStore("character", {
  state: () => ({
    chars: [NewCharacter()],
    conf: {
      char: 0,
      showTrainedSkills: true,
      showSpells: true,
      darkMode: true,
    } as AppConfig,
  }),
  getters: {
    char(state): Character {
      return state.chars[state.conf.char]!;
    },
    skill(): (skillType: SkillType, skillName: string) => Skill | undefined {
      return (skillType: SkillType, skillName: string): Skill | undefined => {
        switch (skillType) {
          case "priSkills":
            return this.char[skillType][skillName as PriSkill];
          case "secSkills":
            return this.char[skillType][skillName];
          case "wepSkills":
            return this.char[skillType][skillName as WepSkill];
          default:
            console.error(`app.skill; Skill issue: ${skillName}`);
            return undefined;
        }
      };
    },
    skillValue(): (skilltype: SkillType, skillName: string) => number {
      return (skillType: SkillType, skillName: string): number => {
        const s = this.skill(skillType, skillName);
        if (!s) return -1;

        const b = this.char.attributes[s.attr].score;
        return s.locked && s.value ? s.value : s.advances + (s.trained ? BaseChance(b) * 2 : BaseChance(b));
      };
    },
    dmgBonus(): (attr: Attr) => string {
      return (attr: Attr): string => DmgBonus(this.char.attributes[attr].score);
    },
    banes(): (skillType: SkillType, skillName: string) => number {
      return (skillType: SkillType, skillName: string): number => {
        const s = this.skill(skillType, skillName);
        if (!s) return -1;

        let b = 0;
        if (this.char.attributes[s.attr].condition.check) b++;
        return b;
      };
    },
  },
  actions: {
    log(msg: string) {
      // Store the last 50 log messages
      if (!this.char.log) this.char.log = [];
      //const ts = new Date();
      this.char.log.unshift(msg);
      if (this.char.log.length > 50) this.char.log.pop();
    },

    rollAdvancements(): string[] {
      const advanced: string[] = [];

      Object.values(PriSkills).forEach((s) => {
        if (this.char.priSkills[s].checked) {
          const sk = this.char.priSkills[s];
          const n = roll(20);
          if (n > this.skillValue("priSkills", s)) {
            advanced.push(s);
            if (sk.locked && sk.value) this.char.priSkills[s].value = sk.value + 1;
            else this.char.priSkills[s].advances++;
          }
          this.char.priSkills[s].checked = false;
        }
      });

      Object.values(WepSkills).forEach((s) => {
        if (this.char.wepSkills[s].checked) {
          const sk = this.char.wepSkills[s];
          const n = roll(20);
          if (n > this.skillValue("wepSkills", s)) {
            advanced.push(s);
            if (sk.locked && sk.value) this.char.wepSkills[s].value = sk.value + 1;
            else this.char.wepSkills[s].advances++;
          }
          this.char.wepSkills[s].checked = false;
        }
      });

      Object.keys(this.char.secSkills).forEach((s) => {
        if (!this.char.secSkills[s]) return;
        if (this.char.secSkills[s].checked) {
          const sk = this.char.secSkills[s];
          const n = roll(20);
          if (n > this.skillValue("secSkills", s)) {
            advanced.push(s);
            if (sk.locked && sk.value) this.char.secSkills[s].value = sk.value + 1;
            else this.char.secSkills[s].advances++;
          }
          this.char.secSkills[s].checked = false;
        }
      });

      return advanced;
    },

    exportData() {
      const now = new Date();
      exportFile(
        `DragonbaneCharacters-${now.getFullYear()}-${now.getMonth()}-${now.getDate()}.json`,
        JSON.stringify({
          chars: this.chars,
          conf: this.conf,
        }),
      );
    },

    loadData(d: DBStore) {
      //if (d satisfies DBStore) {
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
      //} else alert('This does not look like valid data for this app');
    },
  },
  persist: true,
});
