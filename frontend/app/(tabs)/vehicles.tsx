import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Car, Calendar, PenTool as Tool, TriangleAlert as AlertTriangle, Plus } from 'lucide-react-native';
import { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { screens } from '../constants/screens';
import { Card } from '../components/ui/card';
import { ListItem } from '../components/ui/list-item';
import { OBDService, OBDData } from '../services/obd.service';

const VehicleCard = ({ name, model, year, image, nextService, alerts }: any) => (
  <TouchableOpacity style={styles.vehicleContainer}>
    <LinearGradient
      colors={['rgba(59, 130, 246, 0.1)', 'rgba(59, 130, 246, 0.05)']}
      style={styles.vehicleGradient}>
      <Image
        source={{ uri: image }}
        style={styles.vehicleImage}
      />
      <View style={styles.vehicleInfo}>
        <Text style={styles.vehicleName}>{name}</Text>
        <Text style={styles.vehicleModel}>{year} {model}</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Calendar size={16} color="#3B82F6" />
            <Text style={styles.statText}>Next Service: {nextService}</Text>
          </View>
          <View style={styles.statItem}>
            <AlertTriangle size={16} color="#EF4444" />
            <Text style={[styles.statText, { color: '#EF4444' }]}>{alerts} Alerts</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  </TouchableOpacity>
);

const MaintenanceReminder = ({ title, date, type }: any) => (
  <View style={styles.reminderContainer}>
    <LinearGradient
      colors={['rgba(59, 130, 246, 0.1)', 'rgba(59, 130, 246, 0.05)']}
      style={styles.reminderGradient}>
      <Tool size={20} color="#3B82F6" />
      <View style={styles.reminderInfo}>
        <Text style={styles.reminderTitle}>{title}</Text>
        <Text style={styles.reminderDate}>{date}</Text>
      </View>
      <Text style={styles.reminderType}>{type}</Text>
    </LinearGradient>
  </View>
);

export default function VehiclesScreen() {
  const [obdData, setObdData] = useState<OBDData | null>(null);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      const interval = setInterval(async () => {
        try {
          if (mounted) {
            const data = await OBDService.getData();
            setObdData(data);
          }
        } catch (err) {
          console.error('Error fetching OBD data:', err);
        }
      }, 3000);

      return () => {
        mounted = false;
        clearInterval(interval);
      };
    }, [])
  );

  return (
    <ScrollView style={screens.screen}>
      <View style={screens.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Vehicles</Text>
          <TouchableOpacity style={styles.addButton}>
            <Plus size={24} color="#3B82F6" />
          </TouchableOpacity>
        </View>

        <VehicleCard
          name="My Tesla"
          model="Model 3"
          year="2023"
          image="https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&w=800"
          nextService="In 2 weeks"
          alerts={2}
        />

        <VehicleCard
          name="Family SUV"
          model="RAV4"
          year="2022"
          image="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800"
          nextService="In 1 month"
          alerts={0}
        />

        <Text style={styles.sectionTitle}>Upcoming Maintenance</Text>

        <MaintenanceReminder
          title="Oil Change"
          date="March 28, 2024"
          type="Routine"
        />

        <MaintenanceReminder
          title="Brake Inspection"
          date="April 5, 2024"
          type="Safety"
        />

        <MaintenanceReminder
          title="Tire Rotation"
          date="April 15, 2024"
          type="Routine"
        />

        <Card>
          <Card.Header title="Engine Status" />
          <Card.Content>
            <ListItem 
              label="Speed" 
              value={obdData?.speed ? `${obdData.speed.toFixed(1)} km/h` : '-'} 
            />
            <ListItem 
              label="Engine RPM" 
              value={obdData?.rpm ? `${obdData.rpm.toFixed(0)} RPM` : '-'} 
            />
            <ListItem 
              label="Engine Load" 
              value={obdData?.engine_load ? `${obdData.engine_load.toFixed(1)}%` : '-'} 
            />
            <ListItem 
              label="Throttle Position" 
              value={obdData?.throttle_position ? `${obdData.throttle_position.toFixed(1)}%` : '-'} 
            />
            <ListItem 
              label="Timing Advance" 
              value={obdData?.timing_advance ? `${obdData.timing_advance.toFixed(1)}°` : '-'} 
            />
          </Card.Content>
        </Card>

        <Card>
          <Card.Header title="Temperature Sensors" />
          <Card.Content>
            <ListItem 
              label="Coolant" 
              value={obdData?.coolant_temp ? `${obdData.coolant_temp.toFixed(1)}°C` : '-'} 
            />
            <ListItem 
              label="Intake Air" 
              value={obdData?.intake_temp ? `${obdData.intake_temp.toFixed(1)}°C` : '-'} 
            />
            <ListItem 
              label="Catalyst B1S1" 
              value={obdData?.catalyst_temp_b1s1 ? `${obdData.catalyst_temp_b1s1.toFixed(1)}°C` : '-'} 
            />
            <ListItem 
              label="Catalyst B1S2" 
              value={obdData?.catalyst_temp_b1s2 ? `${obdData.catalyst_temp_b1s2.toFixed(1)}°C` : '-'} 
            />
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
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
    marginTop: 60,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontFamily: 'SpaceGrotesk-SemiBold',
    color: '#FFFFFF',
  },
  addButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    padding: 12,
    borderRadius: 12,
  },
  vehicleContainer: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  vehicleGradient: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderRadius: 16,
  },
  vehicleImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  vehicleInfo: {
    padding: 16,
  },
  vehicleName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  vehicleModel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 6,
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#94A3B8',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginTop: 24,
    marginBottom: 16,
  },
  reminderContainer: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  reminderGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
  },
  reminderInfo: {
    flex: 1,
    marginLeft: 12,
  },
  reminderTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  reminderDate: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  reminderType: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
});