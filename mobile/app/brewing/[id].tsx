import { View, ScrollView, StyleSheet } from 'react-native'
import { Text, Card, Chip, Divider, ActivityIndicator } from 'react-native-paper'
import { useLocalSearchParams } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { brewingsApi } from '../../src/api/brewings'

function RatingRow({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.ratingRow}>
      <Text variant="bodyMedium" style={styles.ratingLabel}>
        {label}
      </Text>
      <View style={styles.ratingStars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Text
            key={star}
            style={[
              styles.star,
              { color: star <= value ? '#FFD700' : '#DDD' },
            ]}
          >
            ★
          </Text>
        ))}
      </View>
      <Text variant="bodySmall" style={styles.ratingValue}>
        {value}
      </Text>
    </View>
  )
}

export default function BrewingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()

  const { data: brewing, isLoading } = useQuery({
    queryKey: ['brewing', id],
    queryFn: async () => {
      const response = await brewingsApi.get(Number(id))
      return response.data
    },
    enabled: !!id,
  })

  if (isLoading || !brewing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Title
          title={brewing.coffee?.name || 'Unknown Coffee'}
          subtitle={brewing.coffee?.brand?.name || ''}
        />
        <Card.Content>
          <View style={styles.row}>
            <Chip icon="coffee" style={styles.chip}>
              {brewing.method}
            </Chip>
            <Chip icon="scale" style={styles.chip}>
              {brewing.grams}g
            </Chip>
            <Chip icon="water" style={styles.chip}>
              {brewing.ml}ml
            </Chip>
          </View>

          {brewing.location ? (
            <View style={styles.section}>
              <Text variant="labelLarge">Location</Text>
              <Text variant="bodyMedium">{brewing.location}</Text>
              {brewing.latitude && brewing.longitude ? (
                <Text variant="bodySmall" style={styles.coords}>
                  {brewing.latitude.toFixed(6)}, {brewing.longitude.toFixed(6)}
                </Text>
              ) : null}
            </View>
          ) : null}

          {brewing.notes ? (
            <View style={styles.section}>
              <Text variant="labelLarge">Notes</Text>
              <Text variant="bodyMedium">{brewing.notes}</Text>
            </View>
          ) : null}

          <Text variant="bodySmall" style={styles.date}>
            Brewed on {new Date(brewing.created_at).toLocaleDateString()}
          </Text>
        </Card.Content>
      </Card>

      {brewing.rating ? (
        <Card style={styles.card}>
          <Card.Title title="Rating" />
          <Card.Content>
            <RatingRow label="Flavor" value={brewing.rating.flavor} />
            <RatingRow label="Aroma" value={brewing.rating.aroma} />
            <RatingRow label="Acidity" value={brewing.rating.acidic} />
            <RatingRow label="Appearance" value={brewing.rating.appearance} />
            <RatingRow label="Bitterness" value={brewing.rating.bitter} />
            <Divider style={styles.divider} />
            <View style={styles.overallRow}>
              <Text variant="titleMedium">Overall</Text>
              <Text variant="titleMedium" style={styles.overallValue}>
                {brewing.rating.overall.toFixed(1)} / 5
              </Text>
            </View>
          </Card.Content>
        </Card>
      ) : null}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    height: 32,
  },
  section: {
    marginTop: 12,
  },
  coords: {
    color: '#999',
    marginTop: 2,
  },
  date: {
    color: '#999',
    marginTop: 12,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingLabel: {
    flex: 1,
  },
  ratingStars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  star: {
    fontSize: 18,
    marginHorizontal: 1,
  },
  ratingValue: {
    width: 20,
    textAlign: 'right',
    color: '#666',
  },
  divider: {
    marginVertical: 12,
  },
  overallRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overallValue: {
    color: '#6F4E37',
    fontWeight: 'bold',
  },
})
