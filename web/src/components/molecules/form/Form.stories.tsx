import { Form } from '@components/molecules/form';
import { type Story } from '@ladle/react';
import { styled } from '@mui/material';

export const LoginForm: Story = () => (
	<Form>
		<StyledFieldsContainer>
			<Form.EmailInput />
			<Form.PasswordInput />
		</StyledFieldsContainer>
	</Form>
);

const StyledFieldsContainer = styled('div')({
	display: 'flex',
	flexDirection: 'column',
	maxWidth: '50%',
	gap: 16,
});
