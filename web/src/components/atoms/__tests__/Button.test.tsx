import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { Button } from '../button/Button';
import { renderWithTheme } from '../../../test/helpers';

describe('Button', () => {
	it('renders the button with the correct text', () => {
		renderWithTheme(<Button onClick={() => {}}>Click me</Button>);
		expect(screen.getByRole('button')).toHaveTextContent('Click me');
	});

	it('calls the onClick handler when clicked', () => {
		const handleClick = vi.fn();
		renderWithTheme(<Button onClick={handleClick}>Click me</Button>);
		screen.getByRole('button').click();
		expect(handleClick).toHaveBeenCalled();
	});

	it('renders a starting icon when provided', () => {
		renderWithTheme(
			<Button onClick={() => {}} icon={<span>Icon</span>}>
				Click me
			</Button>,
		);
		expect(screen.getByText('Icon')).toBeInTheDocument();
	});
});
