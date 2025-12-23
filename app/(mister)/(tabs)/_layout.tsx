// app/(mister)/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Settings, ChartBar as BarChart3, Shield } from 'lucide-react-native';

// Layout delle tab per il ruolo "mister" (gestione team)
export default function MisterTabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#22c55e',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          backgroundColor: '#ffffff', 
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb', 
          paddingBottom: 5,
          paddingTop: 5,
          height: 60, 
        },
        headerStyle: {
          backgroundColor: '#22c55e', 
        },
        headerTintColor: '#ffffff', 
        headerTitleStyle: {
          fontWeight: 'bold', 
        },
      }}
    >
      {/* Tab Dashboard */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          headerTitle: 'Gestione Multe',
          tabBarIcon: ({ size, color }) => (
            <BarChart3 size={size} color={color} /> // Icona grafico
          ),
        }}
      />

      {/* Tab Gestione Squadre */}
      <Tabs.Screen
        name="teams"
        options={{
          title: 'Squadre',
          headerTitle: 'Gestione Squadre',
          tabBarIcon: ({ size, color }) => (
            <Shield size={size} color={color} /> // Icona scudo
          ),
        }}
      />

      {/* Tab Impostazioni */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Impostazioni',
          headerTitle: 'Impostazioni',
          tabBarIcon: ({ size, color }) => (
            <Settings size={size} color={color} /> // Icona ingranaggi
          ),
        }}
      />
    </Tabs>
  );
}