import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface PaletteColor {
    test?: string;
  }

  interface SimplePaletteColorOptions {
    test?: string;
  }
}