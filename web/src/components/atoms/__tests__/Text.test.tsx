import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Text } from '../Text';

describe('Text', () => {
	it('renders the specified label', async () => {
		render(<Text label={'Lorem Ipsum Dolor'} />);

		expect(await screen.findByText('Lorem Ipsum Dolor')).toBeInTheDocument();
	});
});
