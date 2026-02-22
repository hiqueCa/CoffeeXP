import { Outlet, useNavigate } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material'
import { useAuth } from '../contexts/AuthContext'

export default function Layout() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>
            Coffee Exp
          </Typography>
          <Button color="inherit" onClick={() => navigate('/coffees')}>Coffees</Button>
          <Button color="inherit" onClick={() => { logout(); navigate('/login') }}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 3 }}>
        <Outlet />
      </Container>
    </Box>
  )
}
