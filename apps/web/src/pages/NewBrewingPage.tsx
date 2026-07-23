import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Typography,
  Box,
  TextField,
  Button,
  MenuItem,
  Rating as MuiRating,
  Alert,
} from '@mui/material'
import { brewingsApi } from '../api/brewings'
import type { CreateBrewingRequest } from '../api/brewings'
import { coffeesApi } from '../api/coffees'

export default function NewBrewingPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    coffee_id: 0,
    method: '',
    grams: 0,
    ml: 0,
    notes: '',
    flavor: 3,
    acidic: 3,
    aroma: 3,
    appearance: 3,
    bitter: 3,
  })

  const { data: coffees } = useQuery({
    queryKey: ['coffees'],
    queryFn: () => coffeesApi.list().then((r) => r.data),
  })

  const mutation = useMutation({
    mutationFn: (data: CreateBrewingRequest) => brewingsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brewings'] })
      navigate('/')
    },
    onError: () => setError('Failed to create brewing'),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate({
      coffee_id: form.coffee_id,
      method: form.method,
      grams: form.grams,
      ml: form.ml,
      notes: form.notes || undefined,
      rating: {
        flavor: form.flavor,
        acidic: form.acidic,
        aroma: form.aroma,
        appearance: form.appearance,
        bitter: form.bitter,
      },
    })
  }

  const update = (field: string, value: string | number | null) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h4" gutterBottom>New Brewing</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TextField select label="Coffee" fullWidth margin="normal" value={form.coffee_id || ''} onChange={(e) => update('coffee_id', Number(e.target.value))} required>
        {coffees?.map((c) => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
      </TextField>

      <TextField label="Method" fullWidth margin="normal" value={form.method} onChange={(e) => update('method', e.target.value)} placeholder="e.g. V60, French Press" required />

      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField label="Grams" type="number" margin="normal" value={form.grams || ''} onChange={(e) => update('grams', Number(e.target.value))} required />
        <TextField label="ML" type="number" margin="normal" value={form.ml || ''} onChange={(e) => update('ml', Number(e.target.value))} required />
      </Box>

      <TextField label="Notes" fullWidth multiline rows={3} margin="normal" value={form.notes} onChange={(e) => update('notes', e.target.value)} />

      <Typography variant="h6" sx={{ mt: 2 }}>Rating</Typography>
      {(['flavor', 'acidic', 'aroma', 'appearance', 'bitter'] as const).map((field) => (
        <Box key={field} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography sx={{ width: 100, textTransform: 'capitalize' }}>{field}</Typography>
          <MuiRating value={form[field]} onChange={(_, v) => update(field, v ?? 1)} max={5} />
        </Box>
      ))}

      <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }} disabled={mutation.isPending}>
        Save Brewing
      </Button>
    </Box>
  )
}
