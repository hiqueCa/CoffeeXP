import { styled } from '@mui/material';
import MuiButton, { type ButtonProps } from '@mui/material/Button';

type ButtonVariant = Exclude<ButtonProps['variant'], 'text'>;

interface IButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: ButtonVariant;
  icon?: React.ReactNode;
}

const StyledButton = styled(MuiButton)({
  textTransform: 'none',
  borderRadius: 9999,
});

export const Button = ({
  children,
  onClick,
  icon,
  variant = 'contained',
}: IButtonProps) => {
  return (
    <StyledButton onClick={onClick} variant={variant} startIcon={icon}>
      {children}
    </StyledButton>
  );
};
