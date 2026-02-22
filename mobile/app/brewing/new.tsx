import { useState } from 'react'
import {
  View,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native'
import {
  TextInput,
  Button,
  Text,
  HelperText,
  Menu,
  Divider,
  ActivityIndicator,
} from 'react-native-paper'
import { useRouter } from 'expo-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as Location from 'expo-location'
import { brewingsApi, CreateBrewingRequest } from '../../src/api/brewings'
import { coffeesApi, CoffeeDetail } from '../../src/api/coffees'

function StarRating({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (v: number) => void
}) {
  return (
    <View style={styles.ratingContainer}>
      <Text variant="bodyMedium" style={styles.ratingLabel}>
        {label}
      </Text>
      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => onChange(star)}>
            <Text
              style={[
                styles.star,
                { color: star <= value ? '#FFD700' : '#DDD' },
              ]}
            >
              ★
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

export default function NewBrewingScreen() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const [coffeeId, setCoffeeId] = useState<number | null>(null)
  const [coffeeName, setCoffeeName] = useState('')
  const [menuVisible, setMenuVisible] = useState(false)
  const [method, setMethod] = useState('')
  const [grams, setGrams] = useState('')
  const [ml, setMl] = useState('')
  const [notes, setNotes] = useState('')
  const [latitude, setLatitude] = useState<number | null>(null)
  const [longitude, setLongitude] = useState<number | null>(null)
  const [locationName, setLocationName] = useState('')
  const [locationLoading, setLocationLoading] = useState(false)
  const [error, setError] = useState('')

  // Rating fields
  const [flavor, setFlavor] = useState(3)
  const [aroma, setAroma] = useState(3)
  const [acidic, setAcidic] = useState(3)
  const [appearance, setAppearance] = useState(3)
  const [bitter, setBitter] = useState(3)

  const { data: coffees, isLoading: coffeesLoading } = useQuery({
    queryKey: ['coffees'],
    queryFn: async () => {
      const response = await coffeesApi.list()
      return response.data
    },
  })

  const createMutation = useMutation({
    mutationFn: (data: CreateBrewingRequest) => brewingsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brewings'] })
      router.back()
    },
    onError: (err: unknown) => {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { detail?: string } } }
        setError(axiosErr.response?.data?.detail || 'Failed to create brewing')
      } else {
        setError('Failed to create brewing')
      }
    },
  })

  const captureLocation = async () => {
    setLocationLoading(true)
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setError('Location permission denied')
        setLocationLoading(false)
        return
      }

      const location = await Location.getCurrentPositionAsync({})
      setLatitude(location.coords.latitude)
      setLongitude(location.coords.longitude)

      const [address] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      })
      if (address) {
        setLocationName(
          [address.city, address.region, address.country]
            .filter(Boolean)
            .join(', ')
        )
      }
    } catch {
      setError('Failed to get location')
    } finally {
      setLocationLoading(false)
    }
  }

  const handleSubmit = () => {
    if (!coffeeId) {
      setError('Please select a coffee')
      return
    }
    if (!method) {
      setError('Please enter a brewing method')
      return
    }
    if (!grams || !ml) {
      setError('Please enter grams and ml')
      return
    }

    setError('')
    const data: CreateBrewingRequest = {
      coffee_id: coffeeId,
      method,
      grams: parseFloat(grams),
      ml: parseFloat(ml),
      notes: notes || undefined,
      latitude: latitude ?? undefined,
      longitude: longitude ?? undefined,
      location: locationName || undefined,
      rating: { flavor, acidic, aroma, appearance, bitter },
    }

    createMutation.mutate(data)
  }

  const selectCoffee = (coffee: CoffeeDetail) => {
    setCoffeeId(coffee.id)
    setCoffeeName(coffee.name)
    setMenuVisible(false)
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="headlineSmall" style={styles.title}>
          New Brewing
        </Text>

        {/* Coffee selector */}
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setMenuVisible(true)}
              style={styles.input}
              loading={coffeesLoading}
            >
              {coffeeName || 'Select Coffee'}
            </Button>
          }
        >
          {coffees?.map((coffee) => (
            <Menu.Item
              key={coffee.id}
              title={coffee.name}
              onPress={() => selectCoffee(coffee)}
            />
          ))}
        </Menu>

        <TextInput
          label="Method (e.g. Pour Over, French Press)"
          value={method}
          onChangeText={setMethod}
          style={styles.input}
          mode="outlined"
        />

        <View style={styles.row}>
          <TextInput
            label="Grams"
            value={grams}
            onChangeText={setGrams}
            keyboardType="numeric"
            style={[styles.input, styles.halfInput]}
            mode="outlined"
          />
          <TextInput
            label="Water (ml)"
            value={ml}
            onChangeText={setMl}
            keyboardType="numeric"
            style={[styles.input, styles.halfInput]}
            mode="outlined"
          />
        </View>

        <TextInput
          label="Notes"
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
          style={styles.input}
          mode="outlined"
        />

        {/* Location */}
        <Divider style={styles.divider} />
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Location
        </Text>
        <Button
          mode="outlined"
          icon="map-marker"
          onPress={captureLocation}
          loading={locationLoading}
          disabled={locationLoading}
          style={styles.input}
        >
          {locationName || 'Capture GPS Location'}
        </Button>
        {latitude && longitude ? (
          <Text variant="bodySmall" style={styles.coords}>
            {latitude.toFixed(6)}, {longitude.toFixed(6)}
          </Text>
        ) : null}

        {/* Ratings */}
        <Divider style={styles.divider} />
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Rating
        </Text>
        <StarRating label="Flavor" value={flavor} onChange={setFlavor} />
        <StarRating label="Aroma" value={aroma} onChange={setAroma} />
        <StarRating label="Acidity" value={acidic} onChange={setAcidic} />
        <StarRating
          label="Appearance"
          value={appearance}
          onChange={setAppearance}
        />
        <StarRating label="Bitterness" value={bitter} onChange={setBitter} />

        {error ? (
          <HelperText type="error" visible>
            {error}
          </HelperText>
        ) : null}

        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={createMutation.isPending}
          disabled={createMutation.isPending}
          style={styles.submitButton}
        >
          Save Brewing
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 24,
    paddingBottom: 48,
  },
  title: {
    marginBottom: 20,
    color: '#6F4E37',
  },
  input: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  divider: {
    marginVertical: 16,
  },
  sectionTitle: {
    marginBottom: 12,
    color: '#6F4E37',
  },
  coords: {
    color: '#999',
    marginBottom: 8,
    textAlign: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingLabel: {
    flex: 1,
  },
  stars: {
    flexDirection: 'row',
  },
  star: {
    fontSize: 28,
    marginHorizontal: 2,
  },
  submitButton: {
    marginTop: 24,
    paddingVertical: 4,
    backgroundColor: '#6F4E37',
  },
})
