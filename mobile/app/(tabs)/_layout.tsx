import { Tabs } from 'expo-router'
import { MaterialCommunityIcons } from '@expo/vector-icons'

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#6F4E37',
        headerStyle: { backgroundColor: '#6F4E37' },
        headerTintColor: '#fff',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Brewings',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="coffee" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="coffees"
        options={{
          title: 'Coffees',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="coffee-maker"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  )
}
