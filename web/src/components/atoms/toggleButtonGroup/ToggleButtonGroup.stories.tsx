import { type Story } from '@ladle/react';
import { ToggleButtonGroup } from '@components/atoms/toggleButtonGroup';

export const Default: Story = () => {
	return (
		<ToggleButtonGroup options={['Toggle 1', 'Toggle 2']} onChange={() => {}} />
	);
};
