import { apiClient } from './client'

export interface Rating {
  id: number
  flavor: number
  acidic: number
  aroma: number
  appearance: number
  bitter: number
  overall: number
}

export interface CoffeeBrand {
  id: number
  name: string
  country: string
}

export interface Coffee {
  id: number
  name: string
  price: string
  brand: CoffeeBrand | null
}

export interface Brewing {
  id: number
  method: string
  grams: number
  ml: number
  notes: string | null
  latitude: number | null
  longitude: number | null
  location: string | null
  created_at: string
  rating: Rating | null
  coffee: Coffee | null
}

export interface CreateBrewingRequest {
  coffee_id: number
  method: string
  grams: number
  ml: number
  notes?: string
  latitude?: number
  longitude?: number
  location?: string
  rating: {
    flavor: number
    acidic: number
    aroma: number
    appearance: number
    bitter: number
  }
}

export const brewingsApi = {
  list: () => apiClient.get<Brewing[]>('/brewings'),
  get: (id: number) => apiClient.get<Brewing>(`/brewings/${id}`),
  create: (data: CreateBrewingRequest) => apiClient.post<Brewing>('/brewings', data),
  update: (id: number, data: Partial<Brewing>) => apiClient.put<Brewing>(`/brewings/${id}`, data),
  delete: (id: number) => apiClient.delete(`/brewings/${id}`),
}
