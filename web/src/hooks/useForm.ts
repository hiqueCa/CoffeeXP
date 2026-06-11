import {
	useForm as reactHookFormUseForm,
	type FieldValues,
	type UseFormHandleSubmit,
	type UseFormRegister,
} from 'react-hook-form';

type UseForm<T extends FieldValues> = {
	register: UseFormRegister<T>;
	handleSubmit: UseFormHandleSubmit<T>;
};

export const useForm = <T extends FieldValues>(): UseForm<T> => {
	const { register, handleSubmit } = reactHookFormUseForm<T>();

	return { register, handleSubmit };
};
