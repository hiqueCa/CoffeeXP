import { render } from '@testing-library/react';
import { theme } from '../theme/theme';
import { ThemeProvider } from '@mui/material';

export function renderWithTheme(children: React.ReactElement) {
	return render(<ThemeProvider theme={theme}>{children}</ThemeProvider>);
}
