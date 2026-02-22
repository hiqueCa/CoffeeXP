import { useQuery } from '@tanstack/react-query'
import {
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Grid,
  Chip,
  Box,
  CircularProgress,
  Fab,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useNavigate } from 'react-router-dom'
import { brewingsApi } from '../api/brewings'
import type { Brewing } from '../api/brewings'

export default function BrewingListPage() {
  const navigate = useNavigate()
  const { data: brewings, isLoading } = useQuery({
    queryKey: ['brewings'],
    queryFn: () => brewingsApi.list().then((r) => r.data),
  })

  if (isLoading) return <CircularProgress />

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Brewings
      </Typography>
      <Grid container spacing={2}>
        {brewings?.map((brewing: Brewing) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={brewing.id}>
            <Card>
              <CardActionArea onClick={() => navigate(`/brewings/${brewing.id}`)}>
                <CardContent>
                  <Typography variant="h6">{brewing.coffee?.name}</Typography>
                  <Typography color="text.secondary">{brewing.coffee?.brand?.name}</Typography>
                  <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip label={brewing.method} size="small" />
                    <Chip label={`${brewing.grams}g / ${brewing.ml}ml`} size="small" variant="outlined" />
                    {brewing.rating && (
                      <Chip label={`${brewing.rating.overall}/5`} size="small" color="primary" />
                    )}
                  </Box>
                  {brewing.location && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {brewing.location}
                    </Typography>
                  )}
                  <Typography variant="caption" color="text.secondary">
                    {new Date(brewing.created_at).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Fab color="primary" sx={{ position: 'fixed', bottom: 16, right: 16 }} onClick={() => navigate('/brewings/new')}>
        <AddIcon />
      </Fab>
    </Box>
  )
}
