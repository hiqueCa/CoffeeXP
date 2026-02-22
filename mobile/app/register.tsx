import { useState } from 'react'
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import { TextInput, Button, Text, HelperText } from 'react-native-paper'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../src/contexts/AuthContext'

export default function RegisterScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const router = useRouter()

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setError('')
    setLoading(true)
    try {
      await register({ email, password })
      router.replace('/login')
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { detail?: string } } }
        setError(axiosErr.response?.data?.detail || 'Registration failed')
      } else {
        setError('Registration failed. Please try again.')
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
          Create Account
        </Text>
        <Text variant="bodyLarge" style={styles.subtitle}>
          Join Coffee Exp
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

        <TextInput
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
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
          onPress={handleRegister}
          loading={loading}
          disabled={loading}
          style={styles.button}
        >
          Register
        </Button>

        <Button
          mode="text"
          onPress={() => router.back()}
          style={styles.link}
        >
          Already have an account? Log in
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
