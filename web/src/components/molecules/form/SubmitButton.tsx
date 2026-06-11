import { Button } from '@components/atoms/button';

interface ISubmitButtonProps {
	children: React.ReactNode;
}

export const SubmitButton = ({ children }: ISubmitButtonProps) => {
	return <Button>{children}</Button>;
};
