import {
	createTheme,
	type ColorSystemOptions,
	type Shadows,
	type ShapeOptions,
	type ThemeOptions,
	type TransitionsOptions,
	type TypographyVariantsOptions,
} from '@mui/material';

const lightPalette: ColorSystemOptions = {
	palette: {
		primary: {
			main: '#7A4A23',
			contrastText: '#FFFFFF',
			container: '#F6DCBA',
			onContainer: '#2B1700',
		},
		secondary: {
			main: '#6B533F',
			container: '#EFDFCB',
			onContainer: '#3A2A1C',
		},
		tertiary: {
			main: '#715B2E',
			container: '#FDDFA6',
			contrastText: '#221A12',
		},
		error: {
			main: '#BA1A1A',
		},
		background: {
			default: '#FBF7EE',
		},
		surface: {
			main: '#FFFFFF',
			dim: '#F6E0C8',
			bright: '#FDF3E7',
			containerLowest: '#FDF3E7',
			containerLow: '#FDE8D9',
			containerHigh: '#FCD9B6',
			containerHighest: '#FBCB92',
			outline: '#DCCCB1',
		},
		text: {
			primary: '#221A12',
			secondary: '#6B533F',
			disabled: '#A48E76',
		},
		scrim: 'rgba(34,26,18,0.32)',
		ruleSoft: '#E8DDC6',
		divider: '#DCCCB1',
	},
};

const darkPalette: ColorSystemOptions = {
	palette: {
		primary: {
			main: '#FFB68C',
			contrastText: '#4B2400',
			container: '#683613',
			onContainer: '#FFDBC4',
		},
		secondary: {
			main: '#E0C2A6',
			container: '#523F2C',
			onContainer: '#F6E0C8',
		},
		tertiary: {
			main: '#E2C387',
			container: '#574215',
			contrastText: '#221A12',
		},
		error: {
			main: '#FFB4AB',
		},
		background: {
			default: '#1A140E',
		},
		text: {
			primary: '#ECE3D2',
			secondary: '#D0BFA6',
			disabled: '#998669',
		},
		scrim: 'rgba(34,26,18,0.32)',
		ruleSoft: '#36302A',
		divider: '#4D4234',
	},
};

const shape: ShapeOptions = {
	borderRadius: 12,
	radius: {
		xs: 4,
		sm: 8,
		md: 12,
		lg: 16,
		xl: 28,
		full: 9999,
	},
};

const shadows: Shadows = [
	'none',
	'0 1px 2px rgba(58,42,28,.08), 0 1px 3px 1px rgba(58,42,28,.06)',
	'0 1px 2px rgba(58,42,28,.10), 0 2px 6px 2px rgba(58,42,28,.07)',
	'0 1px 3px rgba(58,42,28,.10), 0 4px 8px 3px rgba(58,42,28,.08)',
	'0 2px 3px rgba(58,42,28,.10), 0 6px 12px 4px rgba(58,42,28,.09)',
	'0 3px 5px rgba(58,42,28,.10), 0 8px 16px 4px rgba(58,42,28,.09)',
	'0 4px 5px rgba(58,42,28,.10), 0 9px 18px 5px rgba(58,42,28,.09)',
	'0 5px 5px rgba(58,42,28,.10), 0 10px 20px 6px rgba(58,42,28,.10)',
	'0 5px 6px rgba(58,42,28,.10), 0 11px 22px 7px rgba(58,42,28,.10)',
	'0 6px 6px rgba(58,42,28,.10), 0 12px 24px 8px rgba(58,42,28,.10)',
	'0 6px 7px rgba(58,42,28,.10), 0 13px 26px 9px rgba(58,42,28,.10)',
	'0 7px 8px rgba(58,42,28,.10), 0 14px 28px 10px rgba(58,42,28,.10)',
	'0 7px 8px rgba(58,42,28,.10), 0 15px 30px 10px rgba(58,42,28,.10)',
	'0 7px 9px rgba(58,42,28,.10), 0 16px 32px 11px rgba(58,42,28,.10)',
	'0 8px 9px rgba(58,42,28,.10), 0 17px 34px 11px rgba(58,42,28,.10)',
	'0 8px 10px rgba(58,42,28,.10), 0 18px 36px 12px rgba(58,42,28,.10)',
	'0 8px 11px rgba(58,42,28,.10), 0 19px 38px 13px rgba(58,42,28,.10)',
	'0 9px 11px rgba(58,42,28,.10), 0 20px 40px 14px rgba(58,42,28,.10)',
	'0 9px 12px rgba(58,42,28,.10), 0 21px 42px 15px rgba(58,42,28,.10)',
	'0 10px 13px rgba(58,42,28,.10), 0 22px 44px 16px rgba(58,42,28,.10)',
	'0 10px 13px rgba(58,42,28,.10), 0 23px 46px 16px rgba(58,42,28,.10)',
	'0 10px 14px rgba(58,42,28,.10), 0 24px 48px 17px rgba(58,42,28,.10)',
	'0 11px 14px rgba(58,42,28,.10), 0 25px 50px 18px rgba(58,42,28,.10)',
	'0 11px 15px rgba(58,42,28,.10), 0 26px 52px 18px rgba(58,42,28,.10)',
	'0 12px 15px rgba(58,42,28,.10), 0 27px 54px 19px rgba(58,42,28,.10)',
];

const typography: TypographyVariantsOptions = {
	fontFamily: "'Roboto Flex', 'Roboto', system-ui, -apple-system, sans-serif",
	fontFamilyMonospace: "'Roboto Mono', ui-monospace, Menlo, monospace",
	serif: "'Instrument Serif', Georgia, serif",
	fontSize: 15,
	h1: {
		fontFamily: 'serif',
		fontSize: 40,
		fontWeight: 400,
		letterSpacing: '-0.01em',
		lineHeight: 1.1,
	},
	h2: {
		fontFamily: 'sans-serif',
		fontSize: 22,
		fontWeight: 500,
		letterSpacing: 0,
		lineHeight: 1.27,
	},
	h3: {
		fontFamily: 'sans-serif',
		fontSize: 16,
		fontWeight: 500,
		letterSpacing: '0.1px',
	},
	body1: {
		fontFamily: 'sans-serif',
		fontSize: 15,
		fontWeight: 400,
		letterSpacing: 0,
		lineHeight: 1.5,
	},
	body2: {
		fontFamily: 'sans-serif',
		fontSize: 14,
		fontWeight: 400,
		letterSpacing: '0.5px',
		lineHeight: 1.43,
	},
	overline: {
		fontFamily: 'sans-serif',
		fontSize: 11,
		fontWeight: 500,
		letterSpacing: '0.5px',
	},
};

const transitions: TransitionsOptions = {
	easing: {
		easeInOut: 'cubic-bezier(.2,0,0,1)',
		emphasized: 'cubic-bezier(.3,0,0,1)',
	},
};

const themeOptions: ThemeOptions = {
	cssVariables: {
		colorSchemeSelector: 'class',
	},
	colorSchemes: {
		light: lightPalette,
		dark: darkPalette,
	},
	shape,
	shadows,
	typography,
	transitions,
};

export const theme = createTheme(themeOptions);
