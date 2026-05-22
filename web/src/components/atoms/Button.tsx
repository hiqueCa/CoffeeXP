import MuiButton, { type ButtonProps } from '@mui/material/Button';

type ButtonVariant = Exclude<ButtonProps['variant'], 'text'>;

interface IButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: ButtonVariant;
}

export const Button = ({
  children,
  onClick,
  variant = 'contained',
}: IButtonProps) => {
  return (
    <MuiButton onClick={onClick} variant={variant}>
      {children}
    </MuiButton>
  );
};
