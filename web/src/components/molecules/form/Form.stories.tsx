import { Form } from '@components/molecules/form';
import { type Story } from '@ladle/react';
import { styled } from '@mui/material';

export const LoginForm: Story = () => (
	<Form>
		<StyledFieldsContainer>
			<Form.EmailInput />
			<Form.PasswordInput />
			<Form.SubmitButton>Lorem Ipsum</Form.SubmitButton>
		</StyledFieldsContainer>
	</Form>
);

const StyledFieldsContainer = styled('div')({
	display: 'flex',
	flexDirection: 'column',
	maxWidth: '50%',
	gap: 16,
});
