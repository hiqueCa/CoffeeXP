import { styled } from '@mui/material';
import MuiDivider, { type DividerProps } from '@mui/material/Divider';

interface IDividerProps {
	children?: React.ReactNode;
}

const StyledDivider = styled(MuiDivider)<DividerProps>(
	({ theme: { vars } }) => ({
		color: vars.palette.surface.outline,
		gap: 12,
	}),
);

export const Divider = ({ children }: IDividerProps) => {
	return <StyledDivider>{children}</StyledDivider>;
};
