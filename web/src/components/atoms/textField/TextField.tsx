import { styled } from '@mui/material';
import MuiTextField, { type TextFieldProps } from '@mui/material/TextField';

interface ITextFieldProps {
	label: string;
	required?: boolean;
}

export const TextField = ({ label, required }: ITextFieldProps) => {
	return (
		<StyledTextField
			label={label}
			required={required}
			slotProps={{ inputLabel: { shrink: true } }}
		/>
	);
};

const StyledTextField = styled(MuiTextField)<TextFieldProps>(
	({ theme: { vars } }) => ({
		'& div.MuiInputBase-root': {
			color: vars.palette.surface.outline,
		},
		'& label.MuiFormLabel-root': {
			color: vars.palette.text.secondary,
		},
	}),
);
