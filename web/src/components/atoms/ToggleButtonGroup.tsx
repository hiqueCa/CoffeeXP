import MuiToggleButtonGroup, {
  toggleButtonGroupClasses,
} from '@mui/material/ToggleButtonGroup';
import MuiToggleButton from '@mui/material/ToggleButton';
import { styled } from '@mui/material';
import { useState } from 'react';

interface IToggleButtonProps {
  options: [string, ...string[]];
  onChange: () => void;
}

const StyledToggleButtonGroup = styled(MuiToggleButtonGroup)(({ theme }) => ({
  borderRadius: 9999,
  padding: 4,
  gap: 1,
  border: `2px solid ${theme.palette.primary.light}`,
  [`& .${toggleButtonGroupClasses.grouped}`]: {
    borderRadius: 9999,
    '&:hover': {
      backgroundColor: 'transparent',
    },
    '&.Mui-selected': {
      backgroundColor: theme.palette.primary.light,
    },
  },
}));

const StyledToggleButton = styled(MuiToggleButton)({
  textTransform: 'none',
  border: 'none',
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
    <StyledToggleButtonGroup value={active} onChange={handleToggle} exclusive>
      {options.map((option) => (
        <StyledToggleButton key={option} value={option}>
          {option}
        </StyledToggleButton>
      ))}
    </StyledToggleButtonGroup>
  );
};
