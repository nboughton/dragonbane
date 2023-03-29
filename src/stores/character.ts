import { defineStore } from 'pinia';
import { ICharacter, IConfig } from 'src/components/models';
import { NewCharacter } from 'src/lib/defaults';

export const useCharacterStore = defineStore('character', {
  state: () => ({
    chars: <ICharacter[]>[NewCharacter()],
    conf: <IConfig>{
      char: 0,
    },
  }),
  getters: {},
  actions: {},
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
