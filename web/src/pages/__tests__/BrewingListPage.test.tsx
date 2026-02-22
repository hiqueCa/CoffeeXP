import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import BrewingListPage from '../BrewingListPage'

vi.mock('../../api/brewings', () => ({
  brewingsApi: {
    list: vi.fn().mockResolvedValue({
      data: [
        {
          id: 1,
          method: 'V60',
          grams: 15,
          ml: 250,
          notes: 'Great cup',
          location: 'Amsterdam, NL',
          created_at: '2026-02-22T10:00:00',
          rating: { id: 1, flavor: 4, acidic: 3, aroma: 5, appearance: 4, bitter: 2, overall: 4 },
          coffee: { id: 1, name: 'Classico', price: '14.50', brand: { id: 1, name: 'Illy', country: 'Italy' } },
        },
      ],
    }),
  },
}))

const renderPage = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <BrewingListPage />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

describe('BrewingListPage', () => {
  it('renders page title', async () => {
    renderPage()
    expect(await screen.findByText(/my brewings/i)).toBeInTheDocument()
  })

  it('displays brewing data after loading', async () => {
    renderPage()
    expect(await screen.findByText('V60')).toBeInTheDocument()
    expect(await screen.findByText('Classico')).toBeInTheDocument()
  })
})
