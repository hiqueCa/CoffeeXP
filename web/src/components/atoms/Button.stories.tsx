import { type Story } from '@ladle/react';
import { Button } from './Button';

export const Text: Story = () => (
  <Button onClick={() => alert('Button clicked!')}>Click me</Button>
);

export const Contained: Story = () => (
  <Button onClick={() => alert('Button clicked!')} variant="contained">
    Click me
  </Button>
);

export const Outlined: Story = () => (
  <Button onClick={() => alert('Button clicked!')} variant="outlined">
    Click me
  </Button>
);
