import { EmailInput } from './EmailInput';
import { PasswordInput } from './PasswordInput';
import { SubmitButton } from './SubmitButton';

interface IFormProps {
	children: React.ReactNode;
}

const FormBase = ({ children }: IFormProps) => {
	return <form>{children}</form>;
};

export const Form = Object.assign(FormBase, {
	EmailInput: EmailInput,
	PasswordInput: PasswordInput,
	SubmitButton: SubmitButton,
});
