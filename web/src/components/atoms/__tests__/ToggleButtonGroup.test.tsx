import { ToggleButtonGroup } from '../toggleButtonGroup/ToggleButtonGroup';
import { screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { renderWithTheme } from '../../../test/helpers';

describe('ToggleButtonGroup', () => {
	it('renders all inner buttons with the correct labels', () => {
		renderWithTheme(
			<ToggleButtonGroup
				options={['Option 1', 'Option 2']}
				onChange={() => {}}
			/>,
		);

		const option1 = screen.getByText('Option 1');
		const option2 = screen.getByText('Option 2');

		expect(option1).toBeInTheDocument();
		expect(option2).toBeInTheDocument();
	});

	it('calls the onChange callback when a button is clicked', () => {
		const onChangeMock = vi.fn();
		const toggleButtonGroup = renderWithTheme(
			<ToggleButtonGroup
				options={['Option 1', 'Option 2']}
				onChange={onChangeMock}
			/>,
		);

		const option1 = toggleButtonGroup.getByText('Option 1');
		fireEvent.click(option1);

		expect(onChangeMock).toHaveBeenCalled();
	});

	it('changes the active button when the other is clicked', async () => {
		const toggleButtonGroup = renderWithTheme(
			<ToggleButtonGroup
				options={['Option 1', 'Option 2']}
				onChange={() => {}}
			/>,
		);

		const option1 = toggleButtonGroup.getByText('Option 1');
		const option2 = toggleButtonGroup.getByText('Option 2');

		expect(option1).toHaveClass('Mui-selected');
		expect(option2).not.toHaveClass('Mui-selected');

		fireEvent.click(option2);

		expect(option1).not.toHaveClass('Mui-selected');
		expect(option2).toHaveClass('Mui-selected');
	});
});
