import { styled } from '@mui/material';
import MuiButton, { type ButtonProps } from '@mui/material/Button';

type ButtonVariant = Exclude<ButtonProps['variant'], 'text'>;

export interface IButtonProps extends ButtonProps {
	children: React.ReactNode;
	onClick?: () => void;
	variant?: ButtonVariant;
	icon?: React.ReactNode;
}

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

const StyledButton = styled(MuiButton)<IButtonProps>(
	({ theme: { vars }, variant }) => ({
		textTransform: 'none',
		borderRadius: vars.shape.radius.full,
		backgroundColor: vars.palette.background.transparent,
		border: `${vars.border.default} ${vars.palette.surface.outline}`,
		...(variant === 'contained' && {
			backgroundColor: vars.palette.primary.container,
			color: vars.palette.primary.onContainer,
			border: 'none',
		}),
	}),
);
