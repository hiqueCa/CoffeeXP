import { describe, it, expect, vi } from 'vitest';
import { useForm } from '@hooks/useForm';
import { renderHook } from '@testing-library/react';

describe('useForm', () => {
	it('exposes a register function', () => {
		const { result } = renderHook(() => useForm());

		expect(result.current).toEqual({
			register: expect.anything(),
			handleSubmit: expect.anything(),
		});
	});
});
