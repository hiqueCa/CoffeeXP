import { type Story } from '@ladle/react';
import { Button } from './Button';
import LocalCafeIcon from '@mui/icons-material/LocalCafe';

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

export const WithIcon: Story = () => {
  return (
    <Button onClick={() => alert('Button clicked!')} icon={<LocalCafeIcon />}>
      Click me
    </Button>
  );
};
