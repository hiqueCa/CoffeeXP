import { type Story } from '@ladle/react';
import { Divider } from '@components/atoms/divider';

export const Default: Story = () => <Divider />;

export const WithChildren: Story = () => <Divider>Lorem</Divider>;
