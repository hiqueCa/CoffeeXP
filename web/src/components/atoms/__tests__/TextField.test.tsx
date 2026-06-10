import { renderWithTheme } from '@test/helpers';
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { TextField } from '@components/atoms/textField';

describe('TextField', () => {
	it('shows the defined label', () => {
		renderWithTheme(<TextField label="Lorem Ipsum" />);

		expect(screen.getAllByText('Lorem Ipsum').length).toBeGreaterThan(0);
	});
});
