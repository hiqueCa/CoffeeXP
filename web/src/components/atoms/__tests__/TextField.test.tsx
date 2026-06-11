import { renderWithTheme } from '@test/helpers';
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { TextField } from '@components/atoms/textField';

describe('TextField', () => {
	it('shows the defined label', () => {
		renderWithTheme(<TextField label="Lorem Ipsum" />);

		expect(screen.getAllByText('Lorem Ipsum').length).toBeGreaterThan(0);
	});

	it('allows the definition of different input types', () => {
		renderWithTheme(<TextField type="password" label="Lorem Ipsum" />);

		const input = screen.getByLabelText('Lorem Ipsum');

		expect(input).toHaveAttribute('type', 'password');
	});

	it('shows a placeholder for the input when one is provided', () => {
		renderWithTheme(
			<TextField label="Lorem Ipsum" placeholder="Test Placeholder" />,
		);

		const input = screen.getByRole('textbox');

		expect(input).toHaveAttribute('placeholder', 'Test Placeholder');
	});
});
