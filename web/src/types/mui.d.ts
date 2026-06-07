import '@mui/material/styles';

export type SpacingFactors = {
	f1: number;
	f2: number;
	f4: number;
	f8: number;
	f16: number;
	f32: number;
	f64: number;
};

declare module '@mui/material/styles' {
	interface Theme {
		spacingFactors: SpacingFactors;
	}

	interface ThemeOptions {
		spacingFactors: SpacingFactors;
	}

	interface Easing {
		emphasized: string;
	}

	interface TypographyVariants {
		fontFamilyMonospace: FontFamily;
		serif: FontFamily;
	}

	interface TypographyVariantsOptions {
		fontFamilyMonospace: FontFamily;
		serif: FontFamily;
	}

	interface Shape {
		radius: Record<'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full', number>;
	}
	interface ShapeOptions {
		radius: Record<'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full', number>;
	}

	interface Palette {
		tertiary: Palette['primary'];
		surface: Palette['primary'];
		border: Palette['primary'];
		scrim: string;
		ruleSoft: string;
	}

	interface PaletteOptions {
		tertiary?: PaletteOptions['primary'];
		surface?: PaletteOptions['primary'];
		border?: PaletteOptions['primary'];
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
