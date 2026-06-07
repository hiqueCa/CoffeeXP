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
)<ToggleButtonGroupProps>(({ theme }) => ({
	borderRadius: theme.shape.radius.full,
	backgroundColor: 'transparent',
	border: `${theme.spacing(theme.spacingFactors.f1)} solid ${theme.palette.border.main}`,
	[`& .${toggleButtonGroupClasses.firstButton}`]: {
		borderTopLeftRadius: theme.shape.radius.full,
		borderTopRightRadius: theme.shape.radius.none,
		borderBottomLeftRadius: theme.shape.radius.full,
		borderBottomRightRadius: theme.shape.radius.none,
	},
	[`& .${toggleButtonGroupClasses.lastButton}`]: {
		borderTopLeftRadius: theme.shape.radius.none,
		borderTopRightRadius: theme.shape.radius.full,
		borderBottomLeftRadius: theme.shape.radius.none,
		borderBottomRightRadius: theme.shape.radius.full,
	},
	[`& .${toggleButtonGroupClasses.grouped}`]: {
		'&:hover': {
			backgroundColor: theme.palette.surface.containerLowest,
		},
		'&.Mui-selected': {
			backgroundColor: theme.palette.secondary.container,
		},
	},
}));

const StyledToggleButton = styled(MuiToggleButton)<ToggleButtonProps>(
	({ theme }) => ({
		textTransform: 'none',
		border: 'none',
		color: theme.palette.secondary.onContainer,
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
