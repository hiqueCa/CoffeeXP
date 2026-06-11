import { TextField } from '@components/atoms/textField';
import { type Story } from '@ladle/react';

export const Default: Story = () => <TextField label="Lorem Ipsum" />;

export const Password: Story = () => (
	<TextField label="Lorem Ipsum" type="password" />
);

export const WithPlaceholder: Story = () => (
	<TextField label="Lorem Ipsum" placeholder="Lorem Ipsum Dolor Sit Amet" />
);
