import OBR from '@owlbear-rodeo/sdk';
import { ID } from 'src/components/models';
import { useCharacterStore } from 'src/stores/character';

export const notifySend = async (msg: string, variant: 'DEFAULT' | 'ERROR' | 'INFO' | 'SUCCESS' | 'WARNING') => {
  await OBR.notification.show(msg, variant);
  await OBR.broadcast.sendMessage(`${ID}/notify`, { msg, variant });

  const app = useCharacterStore();
  app.log(msg);
};

export const setupChannels = () => {
  OBR.broadcast.onMessage(`${ID}/notify`, (e: { data: unknown; connectionId: string }) => {
    const { msg, variant } = e.data as { msg: string; variant: 'DEFAULT' | 'ERROR' | 'INFO' | 'SUCCESS' | 'WARNING' };
    void OBR.notification.show(msg, variant);
  });
};
