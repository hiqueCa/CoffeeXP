import '@mui/material/styles';
import type { PaletteOptions } from '@mui/material/styles';

export type Border = {
	default: string;
};

type Radius = Record<
	'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full',
	number
>;

type CustomPalette = {
	tertiary: Palette['primary'];
	surface: Palette['primary'];
	border: Palette['primary'];
	background: Palette['background'];
	scrim: string;
	ruleSoft: string;
};

type CustomPaletteOptions = {
	tertiary?: PaletteOptions['primary'];
	surface?: PaletteOptions['primary'];
	border?: PaletteOptions['primary'];
	background?: PaletteOptions['background'];
	scrim?: string;
	ruleSoft?: string;
};

type CustomTypographyVariants = {
	fontFamilyMonospace: FontFamily;
	serif: FontFamily;
};
type CustomTypographyVariantsOptions = {
	fontFamilyMonospace?: FontFamily;
	serif?: FontFamily;
};

type CustomShapeOptions = {
	radius?: Radius;
};

type CustomPaletteColor = {
	container?: string;
	onContainer?: string;
	dim?: string;
	bright?: string;
	containerLowest?: string;
	containerLow?: string;
	containerHigh?: string;
	containerHighest?: string;
	outline?: string;
};

declare module '@mui/material/styles' {
	interface ThemeVars {
		border: Border;
	}

	interface Theme {
		vars: ThemeVars;
	}

	interface ThemeOptions {
		vars?: ThemeVars;
	}

	interface Easing {
		emphasized: string;
	}

	interface TypographyVariants extends CustomTypographyVariants {}
	interface TypographyVariantsOptions extends CustomTypographyVariantsOptions {}

	interface Shape {
		radius: Radius;
	}
	interface ShapeOptions extends CustomShapeOptions {}

	interface Palette extends CustomPalette {}
	interface PaletteOptions extends CustomPaletteOptions {}

	interface PaletteColor extends CustomPaletteColor {}
	interface SimplePaletteColorOptions extends CustomPaletteColor {}

	interface TypeBackground {
		transparent?: string;
	}
}
