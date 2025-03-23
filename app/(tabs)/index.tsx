import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { Thermometer, Gauge, Battery, Droplet, Bluetooth, TriangleAlert as AlertTriangle, CircleGauge as GaugeCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const DataCard = ({ title, value, unit, Icon }: any) => (
  <View style={styles.cardContainer}>
    <LinearGradient
      colors={['rgba(59, 130, 246, 0.1)', 'rgba(59, 130, 246, 0.05)']}
      style={styles.cardGradient}>
      <Icon size={24} color="#3B82F6" style={styles.cardIcon} />
      <Text style={styles.cardTitle}>{title}</Text>
      <View style={styles.valueContainer}>
        <Text style={styles.cardValue}>{value}</Text>
        <Text style={styles.cardUnit}>{unit}</Text>
      </View>
    </LinearGradient>
  </View>
);

const BluetoothStatus = ({ connected = false }) => (
  <TouchableOpacity style={styles.bluetoothContainer}>
    <BlurView intensity={100} style={styles.bluetoothBlur}>
      <Bluetooth size={20} color={connected ? '#22C55E' : '#EF4444'} />
      <Text style={[styles.bluetoothText, { color: connected ? '#22C55E' : '#EF4444' }]}>
        {connected ? 'Connected' : 'Disconnected'}
      </Text>
    </BlurView>
  </TouchableOpacity>
);

const ErrorAlert = () => (
  <TouchableOpacity style={styles.alertContainer}>
    <LinearGradient
      colors={['rgba(239, 68, 68, 0.1)', 'rgba(239, 68, 68, 0.05)']}
      style={styles.alertGradient}>
      <AlertTriangle size={24} color="#EF4444" />
      <View style={styles.alertContent}>
        <Text style={styles.alertTitle}>Check Engine Light</Text>
        <Text style={styles.alertDescription}>Tap to view diagnostic details</Text>
      </View>
    </LinearGradient>
  </TouchableOpacity>
);

export default function Dashboard() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard</Text>
          <BluetoothStatus connected={false} />
        </View>

        <ErrorAlert />

        <View style={styles.grid}>
          <DataCard
            title="Engine Speed"
            value="3,500"
            unit="RPM"
            Icon={GaugeCircle}
          />
          <DataCard
            title="Temperature"
            value="195"
            unit="°F"
            Icon={Thermometer}
          />
          <DataCard
            title="Speed"
            value="65"
            unit="MPH"
            Icon={Gauge}
          />
          <DataCard
            title="Battery"
            value="12.6"
            unit="V"
            Icon={Battery}
          />
          <DataCard
            title="Oil Pressure"
            value="40"
            unit="PSI"
            Icon={Droplet}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 60 : 40,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontFamily: 'SpaceGrotesk-SemiBold',
    color: '#FFFFFF',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cardContainer: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
  },
  cardIcon: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginBottom: 4,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  cardValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginRight: 4,
  },
  cardUnit: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  bluetoothContainer: {
    overflow: 'hidden',
    borderRadius: 20,
  },
  bluetoothBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
  },
  bluetoothText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  alertContainer: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  alertGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
  },
  alertContent: {
    marginLeft: 12,
  },
  alertTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
    marginBottom: 2,
  },
  alertDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
});