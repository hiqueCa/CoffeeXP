import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Typography, Box, Card, CardContent, CircularProgress, Button, Chip } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { coffeesApi } from '../api/coffees'
import { brewingsApi } from '../api/brewings'
import type { Brewing } from '../api/brewings'

export default function CoffeeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: coffee, isLoading: coffeeLoading } = useQuery({
    queryKey: ['coffee', id],
    queryFn: () => coffeesApi.get(Number(id)).then((r) => r.data),
  })
  const { data: brewings } = useQuery({
    queryKey: ['brewings'],
    queryFn: () => brewingsApi.list().then((r) => r.data),
  })

  if (coffeeLoading) return <CircularProgress />
  if (!coffee) return <Typography>Coffee not found</Typography>

  const coffeeBrewings = brewings?.filter((b: Brewing) => b.coffee?.id === Number(id)) || []

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/coffees')}>Back</Button>
      <Typography variant="h4" sx={{ mt: 2 }}>{coffee.name}</Typography>
      <Typography variant="subtitle1" color="text.secondary">${coffee.price}</Typography>

      <Typography variant="h6" sx={{ mt: 3 }}>Brewing History ({coffeeBrewings.length})</Typography>
      {coffeeBrewings.map((brewing: Brewing) => (
        <Card key={brewing.id} sx={{ mt: 1, cursor: 'pointer' }} onClick={() => navigate(`/brewings/${brewing.id}`)}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip label={brewing.method} size="small" />
            <Typography variant="body2">{brewing.grams}g / {brewing.ml}ml</Typography>
            {brewing.rating && <Chip label={`${brewing.rating.overall}/5`} size="small" color="primary" />}
            <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
              {new Date(brewing.created_at).toLocaleDateString()}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  )
}
