import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Button,
  Rating as MuiRating,
  Grid,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { brewingsApi } from '../api/brewings'

export default function BrewingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: brewing, isLoading } = useQuery({
    queryKey: ['brewing', id],
    queryFn: () => brewingsApi.get(Number(id)).then((r) => r.data),
  })

  if (isLoading) return <CircularProgress />
  if (!brewing) return <Typography>Brewing not found</Typography>

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')}>Back</Button>
      <Typography variant="h4" sx={{ mt: 2 }}>{brewing.coffee?.name}</Typography>
      <Typography variant="subtitle1" color="text.secondary">
        {brewing.coffee?.brand?.name} — {brewing.coffee?.brand?.country}
      </Typography>

      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <Typography variant="body2" color="text.secondary">Method</Typography>
              <Chip label={brewing.method} />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Typography variant="body2" color="text.secondary">Ratio</Typography>
              <Typography>{brewing.grams}g / {brewing.ml}ml</Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Typography variant="body2" color="text.secondary">Location</Typography>
              <Typography>{brewing.location || 'Not recorded'}</Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Typography variant="body2" color="text.secondary">Date</Typography>
              <Typography>{new Date(brewing.created_at).toLocaleString()}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {brewing.rating && (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Rating ({brewing.rating.overall}/5)</Typography>
            {(['flavor', 'acidic', 'aroma', 'appearance', 'bitter'] as const).map((field) => (
              <Box key={field} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography sx={{ width: 100, textTransform: 'capitalize' }}>{field}</Typography>
                <MuiRating value={brewing.rating![field]} readOnly max={5} />
              </Box>
            ))}
          </CardContent>
        </Card>
      )}

      {brewing.notes && (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Notes</Typography>
            <Typography>{brewing.notes}</Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  )
}
