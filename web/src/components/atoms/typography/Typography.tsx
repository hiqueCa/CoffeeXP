import MuiTypography from '@mui/material/Typography';

interface ITypographyProps {
	label: string;
}

export const Typography = ({ label }: ITypographyProps) => {
	return <MuiTypography>{label}</MuiTypography>;
};
