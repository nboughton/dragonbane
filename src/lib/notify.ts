import OBR from '@owlbear-rodeo/sdk';
import { ID } from 'src/components/models';

export const send = async (msg: string, variant: 'DEFAULT' | 'ERROR' | 'INFO' | 'SUCCESS' | 'WARNING') => {
  await OBR.notification.show(msg, variant);
  await OBR.broadcast.sendMessage(ID, { msg, variant });
};

export const setupChannels = () => {
  OBR.broadcast.onMessage(ID, (e) => {
    const { msg, variant } = e.data as { msg: string; variant: 'DEFAULT' | 'ERROR' | 'INFO' | 'SUCCESS' | 'WARNING' };
    OBR.notification.show(msg, variant);
  });
};
