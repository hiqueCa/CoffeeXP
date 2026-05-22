import { createTheme } from '@mui/material';
import { type ThemeOptions } from '@mui/material';

const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: '#a1887f',
    },
  },
};

export const theme = createTheme(themeOptions);
