import { useEffect } from 'react'
import { Slot, useRouter, useSegments } from 'expo-router'
import { PaperProvider, MD3LightTheme } from 'react-native-paper'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StatusBar } from 'expo-status-bar'
import { AuthProvider, useAuth } from '../src/contexts/AuthContext'

const queryClient = new QueryClient()

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6F4E37',
    secondary: '#D2B48C',
  },
}

function AuthGate() {
  const { isAuthenticated, isLoading } = useAuth()
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return

    const inAuthGroup = segments[0] === '(tabs)'

    if (!isAuthenticated && inAuthGroup) {
      router.replace('/login')
    } else if (isAuthenticated && !inAuthGroup) {
      router.replace('/(tabs)')
    }
  }, [isAuthenticated, isLoading, segments])

  return <Slot />
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <StatusBar style="auto" />
            <AuthGate />
          </AuthProvider>
        </QueryClientProvider>
      </PaperProvider>
    </SafeAreaProvider>
  )
}
