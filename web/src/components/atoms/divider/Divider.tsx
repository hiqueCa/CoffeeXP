import { styled } from '@mui/material';
import MuiDivider, { type DividerProps } from '@mui/material/Divider';

interface IDividerProps {
	children?: React.ReactNode;
}

export const Divider = ({ children }: IDividerProps) => {
	return <StyledDivider>{children}</StyledDivider>;
};

const StyledDivider = styled(MuiDivider)<DividerProps>(
	({ theme: { vars, spacing } }) => ({
		color: vars.palette.surface.outline,
		gap: spacing(),
	}),
);
