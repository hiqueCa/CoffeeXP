import MuiToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import MuiToggleButton from '@mui/material/ToggleButton';
import { styled } from '@mui/material';
import { useState } from 'react';

interface IToggleButtonProps {
  options: [string, ...string[]];
  onChange: () => void;
}

const StyledToggleButton = styled(MuiToggleButton)({
  textTransform: 'none',
  borderRadius: 16,
});

export const ToggleButtonGroup = ({
  options,
  onChange,
}: IToggleButtonProps) => {
  const initialActive = options[0];
  const [active, setActive] = useState<string | null>(initialActive);

  const handleToggle = (
    _event: React.MouseEvent<HTMLElement>,
    newActive: string | null,
  ) => {
    setActive(newActive);
    onChange();
  };

  return (
    <MuiToggleButtonGroup value={active} onChange={handleToggle} exclusive>
      {options.map((option) => (
        <StyledToggleButton key={option} value={option}>
          {option}
        </StyledToggleButton>
      ))}
    </MuiToggleButtonGroup>
  );
};
