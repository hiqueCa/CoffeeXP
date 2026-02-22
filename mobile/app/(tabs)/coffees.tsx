import { View, FlatList, StyleSheet, RefreshControl } from 'react-native'
import { Card, Text, ActivityIndicator, Button } from 'react-native-paper'
import { useQuery } from '@tanstack/react-query'
import { coffeesApi, CoffeeDetail } from '../../src/api/coffees'
import { useAuth } from '../../src/contexts/AuthContext'

function CoffeeCard({ coffee }: { coffee: CoffeeDetail }) {
  return (
    <Card style={styles.card}>
      <Card.Title title={coffee.name} subtitle={`$${coffee.price}`} />
    </Card>
  )
}

export default function CoffeeListScreen() {
  const { logout } = useAuth()

  const {
    data: coffees,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['coffees'],
    queryFn: async () => {
      const response = await coffeesApi.list()
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
        data={coffees}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <CoffeeCard coffee={item} />}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text variant="bodyLarge">No coffees yet</Text>
          </View>
        }
        ListFooterComponent={
          <Button mode="text" onPress={logout} style={styles.logoutButton}>
            Log out
          </Button>
        }
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
  logoutButton: {
    marginTop: 16,
    marginBottom: 32,
  },
})
