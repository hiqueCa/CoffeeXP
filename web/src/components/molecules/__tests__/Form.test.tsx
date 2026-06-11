import { describe, it, expect } from 'vitest';
import { renderWithTheme } from '@test/helpers';
import { Form } from '@components/molecules/form';

describe('Form', () => {
	it('renders multiple different kinds of form fields', () => {
		const formElement = renderWithTheme(
			<Form>
				<Form.EmailInput />
				<Form.PasswordInput />
				<Form.SubmitButton>Submit Button</Form.SubmitButton>
			</Form>,
		);

		const emailInput = formElement.getByLabelText('Email *');
		const passwordInput = formElement.getByLabelText('Password *');
		const submitButton = formElement.getByText('Submit Button');

		expect(emailInput).toBeInTheDocument();
		expect(passwordInput).toBeInTheDocument();
		expect(submitButton).toBeInTheDocument();
	});
});
