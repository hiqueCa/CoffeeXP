import { useQuery } from '@tanstack/react-query'
import { Typography, Box, Card, CardContent, CardActionArea, Grid, CircularProgress } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { coffeesApi } from '../api/coffees'
import type { CoffeeDetail } from '../api/coffees'

export default function CoffeeListPage() {
  const navigate = useNavigate()
  const { data: coffees, isLoading } = useQuery({
    queryKey: ['coffees'],
    queryFn: () => coffeesApi.list().then((r) => r.data),
  })

  if (isLoading) return <CircularProgress />

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Coffees</Typography>
      <Grid container spacing={2}>
        {coffees?.map((coffee: CoffeeDetail) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={coffee.id}>
            <Card>
              <CardActionArea onClick={() => navigate(`/coffees/${coffee.id}`)}>
                <CardContent>
                  <Typography variant="h6">{coffee.name}</Typography>
                  <Typography color="text.secondary">${coffee.price}</Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
