import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Easing {
    emphasized: string;
  }
  interface TypographyVariantsOptions {
    fontFamilyMonospace: FontFamily;
    serif: FontFamily;
  }
  interface ShapeOptions {
    radius: Record<'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full', number>;
  }

  interface Palette {
    tertiary: Palette['primary'];
    surface: Palette['primary'];
    scrim: string;
    ruleSoft: string;
  }

  interface PaletteOptions {
    tertiary?: PaletteOptions['primary'];
    surface?: PaletteOptions['primary'];
    scrim?: string;
    ruleSoft?: string;
  }

  interface PaletteColor {
    container?: string;
    onContainer?: string;
    dim?: string;
    bright?: string;
    containerLowest?: string;
    containerLow?: string;
    containerHigh?: string;
    containerHighest?: string;
    outline?: string;
  }

  interface SimplePaletteColorOptions {
    container?: string;
    onContainer?: string;
    dim?: string;
    bright?: string;
    containerLowest?: string;
    containerLow?: string;
    containerHigh?: string;
    containerHighest?: string;
    outline?: string;
  }
}