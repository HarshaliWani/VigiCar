import { Tabs } from 'expo-router';
import { Platform, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Gauge as Gauge2, TriangleAlert as AlertTriangle, ChartLine as LineChart, Clock, Settings, Car, Compass as GasPump } from 'lucide-react-native';

const TabBarIcon = ({ Icon, focused }: { Icon: any; focused: boolean }) => (
  <Icon
    size={24}
    color={focused ? '#3B82F6' : '#64748B'}
    style={focused ? styles.activeIcon : styles.icon}
  />
);

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () =>
          Platform.OS === 'ios' ? (
            <BlurView intensity={100} style={StyleSheet.absoluteFill} />
          ) : undefined,
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#64748B',
        tabBarLabelStyle: styles.tabLabel,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ focused }) => <TabBarIcon Icon={Gauge2} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="diagnostics"
        options={{
          title: 'Diagnostics',
          tabBarIcon: ({ focused }) => <TabBarIcon Icon={AlertTriangle} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: 'Insights',
          tabBarIcon: ({ focused }) => <TabBarIcon Icon={LineChart} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="vehicles"
        options={{
          title: 'Vehicles',
          tabBarIcon: ({ focused }) => <TabBarIcon Icon={Car} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="fuel"
        options={{
          title: 'Fuel',
          tabBarIcon: ({ focused }) => <TabBarIcon Icon={GasPump} focused={focused} />,
        }}
      />
      <Tabs.Screen
  name="history"
  options={{
    href: null, // This hides it from the tab bar
  }}
/>

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => <TabBarIcon Icon={Settings} focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    backgroundColor: Platform.select({
      ios: 'transparent',
      android: 'rgba(17, 24, 39, 0.95)',
      default: 'rgba(17, 24, 39, 0.95)',
    }),
    borderTopWidth: 0,
    elevation: 0,
    height: 60,
  },
  tabLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    marginBottom: 8,
  },
  icon: {
    marginTop: 8,
  },
  activeIcon: {
    marginTop: 8,
    shadowColor: '#3B82F6',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
});