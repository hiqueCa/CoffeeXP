import { type GlobalProvider } from '@ladle/react';
import { theme } from '../src/theme/theme';
import { ThemeProvider } from '@mui/material';

export const Provider: GlobalProvider = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
