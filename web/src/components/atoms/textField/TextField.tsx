import { styled } from '@mui/material';
import MuiTextField, { type TextFieldProps } from '@mui/material/TextField';
import type { HTMLInputTypeAttribute } from 'react';

interface ITextFieldProps {
	label: string;
	required?: boolean;
	type?: HTMLInputTypeAttribute;
}

export const TextField = ({ label, required, type }: ITextFieldProps) => {
	return (
		<StyledTextField
			label={label}
			required={required}
			slotProps={{ inputLabel: { shrink: true } }}
			type={type}
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
