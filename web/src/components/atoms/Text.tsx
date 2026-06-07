import { Typography } from '@mui/material';

interface ITextProps {
	label: string;
}

export const Text = ({ label }: ITextProps) => {
	return <Typography>{label}</Typography>;
};
