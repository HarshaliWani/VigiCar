import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Bluetooth, X, RefreshCw } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const DeviceItem = ({ name, connected = false, onPress }: any) => (
  <TouchableOpacity onPress={onPress} style={styles.deviceItem}>
    <LinearGradient
      colors={['rgba(59, 130, 246, 0.1)', 'rgba(59, 130, 246, 0.05)']}
      style={styles.deviceGradient}>
      <Bluetooth size={24} color={connected ? '#22C55E' : '#3B82F6'} />
      <View style={styles.deviceInfo}>
        <Text style={styles.deviceName}>{name}</Text>
        <Text style={[styles.deviceStatus, { color: connected ? '#22C55E' : '#64748B' }]}>
          {connected ? 'Connected' : 'Available'}
        </Text>
      </View>
    </LinearGradient>
  </TouchableOpacity>
);

export default function BluetoothScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <BlurView intensity={100} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <X size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Connect Device</Text>
        <TouchableOpacity style={styles.refreshButton}>
          <RefreshCw size={24} color="#3B82F6" />
        </TouchableOpacity>
      </BlurView>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Connected Devices</Text>
        <DeviceItem name="OBD2 Scanner Pro" connected={true} />

        <Text style={styles.sectionTitle}>Available Devices</Text>
        <DeviceItem name="OBDII Reader" />
        <DeviceItem name="Car Scanner ELM327" />
        <DeviceItem name="Vgate iCar Pro" />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: 'rgba(17, 24, 39, 0.9)',
  },
  closeButton: {
    padding: 8,
  },
  refreshButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontFamily: 'SpaceGrotesk-SemiBold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
    marginTop: 24,
    marginBottom: 16,
  },
  deviceItem: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  deviceGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
  },
  deviceInfo: {
    marginLeft: 12,
  },
  deviceName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  deviceStatus: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
});