import OBR from '@owlbear-rodeo/sdk';
import { ref } from 'vue';

export const role = ref<'PLAYER' | 'GM'>('PLAYER');

export const setupRoleView = async () => {
  role.value = await OBR.player.getRole();
  OBR.player.onChange((player) => (role.value = player.role));
};
