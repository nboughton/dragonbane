// Experimental Dice+ integration
import { ID } from '../components/models';

import OBR from '@owlbear-rodeo/sdk';
import { uid } from 'quasar';

export interface DPlusReady {
  requestId: string;
  timestamp: number;
  ready?: boolean;
}

export const checkDicePlusReady = async (): Promise<boolean> => {
  const requestId = uid();

  return new Promise((resolve) => {
    const unsubscribe = OBR.broadcast.onMessage('dice-plus/isReady', (event) => {
      const data = event.data as DPlusReady;

      // Check if this is a response (not a request)
      if ('ready' in data && data.requestId === requestId) {
        unsubscribe();
        resolve(true);
      }
    });

    // Send ready check request
    void OBR.broadcast.sendMessage(
      'dice-plus/isReady',
      {
        requestId,
        timestamp: Date.now(),
      },
      { destination: 'ALL' },
    );

    // Timeout after 1 second if no response
    setTimeout(() => {
      unsubscribe();
      resolve(false);
    }, 1000);
  });
};

export interface DPlusRollRequest {
  rollId: string; // Unique roll identifier (save this to match results)
  playerId: string; // OBR player ID
  playerName: string; // Player display name
  rollTarget: 'everyone' | 'self' | 'dm' | 'gm_only'; // Who sees the roll
  diceNotation: string; // Standard dice notation (e.g., "2d20kh1+5")
  showResults: boolean; // Show default popup (false = handle in your UI)
  timestamp: number; // Request timestamp
  source: string; // Your extension identifier (e.g., "my-extension-id")
}

export interface DPlusRollResult {
  rollId: string; // Matches the request rollId
  playerId: string; // Who rolled
  playerName: string; // Display name
  rollTarget: 'everyone' | 'self' | 'dm' | 'gm_only'; // Roll target
  timestamp: number; // Original timestamp
  result: {
    rollId: string; // Roll identifier
    diceNotation: string; // Original notation
    totalValue: number; // Final sum
    rollSummary: string; // E.g., "2d6+3 = 11"
    groups: DPlusDiceGroup[]; // Grouped results by notation order
  };
}

// DiceGroup structure
export interface DPlusDiceGroup {
  description?: string; // E.g., "Fire" from "# Fire"
  diceModel?: string; // E.g., "Red" from "{Red}"
  diceType: string; // E.g., "d6", "d20"
  dice: DPlusDiceResult[]; // Individual dice in this group
  total: number; // Total of kept dice in this group
  isNegative?: boolean; // Whether this group is subtracted
}

export interface DPlusDiceResult {
  diceId: string;
  rollId: string;
  diceType: string;
  value: number;
  kept: boolean;
}

export type DPlusRollSuccessHandler = (data: DPlusRollResult) => void;
export type DPlusRollErrorHandler = (data: DPlusRollResult) => void;

export const dPlusRoll = async (
  dice: string,
  successHandler: DPlusRollSuccessHandler,
  errorHandler: DPlusRollErrorHandler,
): Promise<void> => {
  const rollId = `roll-${uid()}`;
  await OBR.broadcast.sendMessage(
    'dice-plus/roll-request',
    {
      rollId,
      playerId: OBR.player.id,
      playerName: await OBR.player.getName(),
      rollTarget: 'everyone',
      diceNotation: dice,
      timestamp: Date.now(),
      showResults: false,
      source: ID,
    },
    { destination: 'ALL' },
  );

  OBR.broadcast.onMessage(`${ID}/roll-result`, (event) => {
    const result = event.data as DPlusRollResult;
    if (rollId === result.rollId) successHandler(result);
  });

  OBR.broadcast.onMessage(`${ID}/roll-error`, (event) => {
    const err = event.data as DPlusRollResult;
    if (rollId === err.rollId) errorHandler(err);
  });
};
