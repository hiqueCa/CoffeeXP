import { createTheme } from '@mui/material';
import { type ThemeOptions } from '@mui/material';

const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: '#a1887f',
      light: '#B39F98',
    },
    background: {
      default: '#fff8e1',
    },
    text: {
      primary: '#3e2723',
      secondary: '#a1887f',
      disabled: '#d7ccc8',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 16,
        },
      },
    },
  },
};

export const theme = createTheme(themeOptions);
