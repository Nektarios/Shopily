import { Tabs } from 'expo-router';
import { ListPlus, Home, ListChecks } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0073FF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 12,
        },
        tabBarStyle: {
          borderTopColor: '#E5E5EA',
          height: 85,
          paddingBottom: 30,
          paddingTop: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Create',
          tabBarIcon: ({ color, size }) => (
            <ListPlus color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Home color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="lists/index"
        options={{
          title: 'Lists',
          tabBarIcon: ({ color, size }) => (
            <ListChecks color={color} size={size} strokeWidth={2.5} />
          ),
        }}
      />
    </Tabs>
  );
}