import { type Story } from '@ladle/react';
import { Divider } from './Divider';

export const Default: Story = () => <Divider />;

export const WithChildren: Story = () => <Divider>Lorem</Divider>;
