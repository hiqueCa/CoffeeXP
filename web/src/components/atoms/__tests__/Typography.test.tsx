import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Typography } from '../typography/Typography';

describe('Typography', () => {
	it('renders the specified label', async () => {
		render(<Typography label={'Lorem Ipsum Dolor'} />);

		expect(await screen.findByText('Lorem Ipsum Dolor')).toBeInTheDocument();
	});
});
