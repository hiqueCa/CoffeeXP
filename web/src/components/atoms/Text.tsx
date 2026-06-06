interface ITextProps {
	label: string;
}

export const Text = ({ label }: ITextProps) => {
	return <span>{label}</span>;
};
