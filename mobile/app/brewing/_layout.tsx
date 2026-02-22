import { Stack } from 'expo-router'

export default function BrewingLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#6F4E37' },
        headerTintColor: '#fff',
      }}
    >
      <Stack.Screen name="[id]" options={{ title: 'Brewing Detail' }} />
      <Stack.Screen name="new" options={{ title: 'New Brewing' }} />
    </Stack>
  )
}
