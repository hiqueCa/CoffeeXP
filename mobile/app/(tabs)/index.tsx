import { View, FlatList, StyleSheet, RefreshControl } from 'react-native'
import { Card, Text, FAB, Chip, ActivityIndicator } from 'react-native-paper'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { brewingsApi, Brewing } from '../../src/api/brewings'
import { useAuth } from '../../src/contexts/AuthContext'

function BrewingCard({ brewing }: { brewing: Brewing }) {
  const router = useRouter()

  return (
    <Card
      style={styles.card}
      onPress={() => router.push(`/brewing/${brewing.id}`)}
    >
      <Card.Title
        title={brewing.coffee?.name || 'Unknown Coffee'}
        subtitle={brewing.method}
      />
      <Card.Content>
        <View style={styles.row}>
          <Chip icon="scale" style={styles.chip}>
            {brewing.grams}g
          </Chip>
          <Chip icon="water" style={styles.chip}>
            {brewing.ml}ml
          </Chip>
          {brewing.rating ? (
            <Chip icon="star" style={styles.chip}>
              {brewing.rating.overall.toFixed(1)}
            </Chip>
          ) : null}
        </View>
        {brewing.location ? (
          <Text variant="bodySmall" style={styles.location}>
            {brewing.location}
          </Text>
        ) : null}
        <Text variant="bodySmall" style={styles.date}>
          {new Date(brewing.created_at).toLocaleDateString()}
        </Text>
      </Card.Content>
    </Card>
  )
}

export default function BrewingListScreen() {
  const router = useRouter()
  const { logout } = useAuth()

  const {
    data: brewings,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['brewings'],
    queryFn: async () => {
      const response = await brewingsApi.list()
      return response.data
    },
  })

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={brewings}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <BrewingCard brewing={item} />}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text variant="bodyLarge">No brewings yet</Text>
            <Text variant="bodyMedium" style={styles.emptyHint}>
              Tap + to add your first brewing
            </Text>
          </View>
        }
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/brewing/new')}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    height: 32,
  },
  location: {
    color: '#666',
    marginTop: 4,
  },
  date: {
    color: '#999',
    marginTop: 4,
  },
  emptyHint: {
    color: '#888',
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#6F4E37',
  },
})
