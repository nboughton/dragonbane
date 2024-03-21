import OBR, { Theme } from '@owlbear-rodeo/sdk';
import { setCssVar } from 'quasar';
import { ref } from 'vue';

export const colours = ref<Theme>({
  mode: 'DARK',
  primary: {
    main: '#bb99ff',
    light: 'rgb(200, 173, 255)',
    dark: 'rgb(130, 107, 178)',
    contrastText: 'rgba(0, 0, 0, 0.87)',
  },
  secondary: {
    main: '#ee99ff',
    light: 'rgb(241, 173, 255)',
    dark: 'rgb(166, 107, 178)',
    contrastText: 'rgba(0, 0, 0, 0.87)',
  },
  background: {
    paper: '#222639',
    default: '#1e2231',
  },
  text: {
    disabled: 'rgba(255, 255, 255, 0.5)',
    primary: '#fff',
    secondary: 'rgba(255, 255, 255, 0.7)',
  },
});

export const setupTheme = async () => {
  const setTheme = (theme: Theme) => {
    setCssVar('primary', theme.primary.main);
    setCssVar('secondary', theme.secondary.main);
    setCssVar('accent', theme.primary.light);
    setCssVar('dark', theme.primary.dark);
    setCssVar('positive', theme.secondary.light);
    setCssVar('negative', theme.secondary.dark);
    setCssVar('info', theme.background.default);
    setCssVar('warning', theme.background.paper);
    colours.value = theme;
  };

  setTheme(await OBR.theme.getTheme());

  OBR.theme.onChange(setTheme);
};
