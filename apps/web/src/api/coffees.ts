import { apiClient } from './client'
import type { CoffeeBrand } from './brewings'

export interface CoffeeDetail {
  id: number
  name: string
  price: string
  coffee_brand_id: number | null
}

export const coffeesApi = {
  list: (brandId?: number) => {
    const params = brandId ? { brand_id: brandId } : {}
    return apiClient.get<CoffeeDetail[]>('/coffees', { params })
  },
  get: (id: number) => apiClient.get<CoffeeDetail>(`/coffees/${id}`),
  create: (data: { name: string; price: string; coffee_brand_id?: number }) =>
    apiClient.post<CoffeeDetail>('/coffees', data),
}

export const coffeeBrandsApi = {
  list: () => apiClient.get<CoffeeBrand[]>('/coffee-brands'),
  create: (data: { name: string; country: string }) =>
    apiClient.post<CoffeeBrand>('/coffee-brands', data),
}
