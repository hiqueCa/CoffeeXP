import { describe, it, expect } from 'vitest';
import { renderWithTheme } from '../../../test/helpers';
import { screen } from '@testing-library/react';
import { Divider } from '../divider/Divider';

describe('Divider', () => {
	it('renders with a children when one is provided', () => {
		renderWithTheme(<Divider>Lorem Ipsum Dolor</Divider>);

		expect(screen.getByText('Lorem Ipsum Dolor')).toBeInTheDocument();
	});
});
