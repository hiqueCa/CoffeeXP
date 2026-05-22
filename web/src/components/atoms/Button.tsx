import MuiButton, { type ButtonProps } from '@mui/material/Button';
import { styled } from '@mui/material/styles';

interface IButtonProps {
  children: React.ReactNode;
  onClick: () => void;
}

const StyledButton = styled(MuiButton)<ButtonProps>(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

export const Button = ({ children, onClick }: IButtonProps) => {
  return <StyledButton onClick={onClick}>{children}</StyledButton>;
};
