import { describe, it, expect } from 'vitest';
import { renderWithTheme } from '@test/helpers';
import { screen } from '@testing-library/react';
import { Form } from '@components/molecules/form';

describe('Form', () => {
	it('renders multiple different kinds of form fields', () => {
		renderWithTheme(
			<Form>
				<Form.EmailInput />
				<Form.PasswordInput />
			</Form>,
		);

		const emailInput = screen.getByLabelText('Email *');
		const passwordInput = screen.getByLabelText('Password *');

		expect(emailInput).toBeInTheDocument();
		expect(passwordInput).toBeInTheDocument();
	});
});
