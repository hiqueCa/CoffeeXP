import { type Story } from '@ladle/react';
import { ToggleButtonGroup } from './ToggleButtonGroup';

export const Default: Story = () => {
  return (
    <ToggleButtonGroup options={['Toggle 1', 'Toggle 2']} onChange={() => {}} />
  );
};
