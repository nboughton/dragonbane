import { defineStore } from 'pinia';
import { exportFile } from 'quasar';
import { ICharacter, IConfig, IDBStore } from 'src/components/models';
import { NewCharacter } from 'src/lib/defaults';

export const useCharacterStore = defineStore('character', {
  state: () => ({
    chars: <ICharacter[]>[NewCharacter()],
    conf: <IConfig>{
      char: 0,
      showTrainedSkills: true,
    },
  }),
  getters: {},
  actions: {
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
