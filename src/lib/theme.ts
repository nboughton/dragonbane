import OBR, { type Theme } from '@owlbear-rodeo/sdk';
import { setCssVar } from 'quasar';
import { ref } from 'vue';

export const colours = ref<Theme>({
  mode: 'DARK',
  primary: {
    main: '#00827b',
    light: '#13a093',
    dark: '#005d57',
    contrastText: '#fff',
  },
  secondary: {
    main: '#ef2c38',
    light: '#ff5c5f',
    dark: '#b30014',
    contrastText: '#fff',
  },
  background: {
    paper: '#111615',
    default: '#1c2423',
  },
  text: {
    disabled: 'rgba(255, 255, 255, 0.5)',
    primary: '#fff',
    secondary: 'rgba(255, 255, 255, 0.7)',
  },
});

export const setupTheme = async () => {
  const setTheme = (theme: Theme) => {
    const isDark = theme.mode === 'DARK';

    if (isDark) {
      colours.value = {
        mode: 'DARK',
        primary: {
          main: '#00827b', // Beautiful green patina teal
          light: '#13a093',
          dark: '#005d57',
          contrastText: '#fff',
        },
        secondary: {
          main: '#ef2c38', // Crimson Red from logo
          light: '#ff5c5f',
          dark: '#b30014',
          contrastText: '#fff',
        },
        background: {
          paper: '#111615', // Dark paper slate
          default: '#1c2423', // Dark forest default background
        },
        text: {
          disabled: 'rgba(255, 255, 255, 0.5)',
          primary: '#fff',
          secondary: 'rgba(255, 255, 255, 0.7)',
        },
      };

      setCssVar('primary', '#00827b');
      setCssVar('secondary', '#ef2c38');
      setCssVar('accent', '#dcc28c'); // Muted gold/tan
      setCssVar('dark', '#111615');
      setCssVar('positive', '#2e7d32');
      setCssVar('negative', '#c62828');
      setCssVar('info', '#1c2423');
      setCssVar('warning', '#111615');
    } else {
      colours.value = {
        mode: 'LIGHT',
        primary: {
          main: '#007e77', // Muted book teal
          light: '#008a82',
          dark: '#005a55',
          contrastText: '#fff',
        },
        secondary: {
          main: '#ef2c38',
          light: '#ff5c5f',
          dark: '#b30014',
          contrastText: '#fff',
        },
        background: {
          paper: '#ece4d5', // Rich cream paper background
          default: '#f5eedf', // Warm parchment page background
        },
        text: {
          disabled: 'rgba(0, 0, 0, 0.38)',
          primary: '#2b2b2b',
          secondary: 'rgba(0, 0, 0, 0.6)',
        },
      };

      setCssVar('primary', '#007e77');
      setCssVar('secondary', '#ef2c38');
      setCssVar('accent', '#5d4037'); // Warm leather brown
      setCssVar('dark', '#ece4d5');
      setCssVar('positive', '#2e7d32');
      setCssVar('negative', '#c62828');
      setCssVar('info', '#f5eedf');
      setCssVar('warning', '#ece4d5');
    }
  };

  try {
    setTheme(await OBR.theme.getTheme());
  } catch {
    setTheme({ mode: 'DARK' } as Partial<Theme> as Theme);
  }

  OBR.theme.onChange(setTheme);
};
