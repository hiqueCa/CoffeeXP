import { TextField } from '@components/atoms/textField';

export const EmailInput = () => {
	return (
		<TextField
			label="Email"
			type="email"
			required
			placeholder="yourEmail@coffee.com"
		/>
	);
};
