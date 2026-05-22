import { type Story } from '@ladle/react';
import { Button } from './Button';

export const Default: Story = () => (
  <Button onClick={() => alert('Button clicked!')}>Click me</Button>
);
