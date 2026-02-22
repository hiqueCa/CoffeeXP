import { useState } from 'react'
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import { TextInput, Button, Text, HelperText } from 'react-native-paper'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../src/contexts/AuthContext'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    setError('')
    setLoading(true)
    try {
      await login({ email, password })
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { detail?: string } } }
        setError(axiosErr.response?.data?.detail || 'Login failed')
      } else {
        setError('Login failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <Text variant="headlineLarge" style={styles.title}>
          Coffee Exp
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Track your coffee brewings
        </Text>

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          mode="outlined"
        />

        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          mode="outlined"
        />

        {error ? (
          <HelperText type="error" visible>
            {error}
          </HelperText>
        ) : null}

        <Button
          mode="contained"
          onPress={handleLogin}
          loading={loading}
          disabled={loading}
          style={styles.button}
        >
          Log In
        </Button>

        <Button
          mode="text"
          onPress={() => router.push('/register')}
          style={styles.link}
        >
          Don&apos;t have an account? Register
        </Button>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    color: '#6F4E37',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
    color: '#888',
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 16,
    paddingVertical: 4,
  },
  link: {
    marginTop: 12,
  },
})
