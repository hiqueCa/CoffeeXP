import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider, createTheme } from '@mui/material'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import BrewingListPage from './pages/BrewingListPage'
import BrewingDetailPage from './pages/BrewingDetailPage'
import NewBrewingPage from './pages/NewBrewingPage'
import CoffeeListPage from './pages/CoffeeListPage'
import CoffeeDetailPage from './pages/CoffeeDetailPage'

const queryClient = new QueryClient()
const theme = createTheme()

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/" element={<BrewingListPage />} />
        <Route path="/brewings/new" element={<NewBrewingPage />} />
        <Route path="/brewings/:id" element={<BrewingDetailPage />} />
        <Route path="/coffees" element={<CoffeeListPage />} />
        <Route path="/coffees/:id" element={<CoffeeDetailPage />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
