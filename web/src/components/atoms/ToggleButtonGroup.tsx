import MuiToggleButtonGroup, {
	toggleButtonGroupClasses,
	type ToggleButtonGroupProps,
} from '@mui/material/ToggleButtonGroup';
import MuiToggleButton, {
	type ToggleButtonProps,
} from '@mui/material/ToggleButton';
import { styled } from '@mui/material';
import { useState } from 'react';

interface IToggleButtonProps {
	options: [string, ...string[]];
	onChange: () => void;
}

const StyledToggleButtonGroup = styled(
	MuiToggleButtonGroup,
)<ToggleButtonGroupProps>(({ theme: { vars } }) => ({
	borderRadius: vars.shape.radius.full,
	backgroundColor: vars.palette.background.transparent,
	border: `${vars.border.default} ${vars.palette.surface.outline}`,
	[`& .${toggleButtonGroupClasses.firstButton}`]: {
		borderTopLeftRadius: vars.shape.radius.full,
		borderTopRightRadius: vars.shape.radius.none,
		borderBottomLeftRadius: vars.shape.radius.full,
		borderBottomRightRadius: vars.shape.radius.none,
	},
	[`& .${toggleButtonGroupClasses.lastButton}`]: {
		borderTopLeftRadius: vars.shape.radius.none,
		borderTopRightRadius: vars.shape.radius.full,
		borderBottomLeftRadius: vars.shape.radius.none,
		borderBottomRightRadius: vars.shape.radius.full,
	},
	[`& .${toggleButtonGroupClasses.grouped}`]: {
		'&:hover': {
			backgroundColor: vars.palette.surface.containerHigh,
		},
		'&.Mui-selected': {
			backgroundColor: vars.palette.secondary.container,
		},
	},
}));

const StyledToggleButton = styled(MuiToggleButton)<ToggleButtonProps>(
	({ theme: { vars } }) => ({
		textTransform: 'none',
		border: 'none',
		color: vars.palette.secondary.onContainer,
	}),
);

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
