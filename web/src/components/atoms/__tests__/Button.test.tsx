import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

describe('Button', () => {
  it('renders the button with the correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toHaveTextContent('Click me')
  })
})