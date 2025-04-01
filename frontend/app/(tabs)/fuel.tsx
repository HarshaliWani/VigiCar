import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, TextInput, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart } from 'react-native-chart-kit';
import { Compass as GasPump, TrendingUp, DollarSign, MapPin, Plus } from 'lucide-react-native';
import { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { screens } from '../constants/screens';
import { Card } from '../components/ui/card';
import { ListItem } from '../components/ui/list-item';
import { OBDService, OBDData } from '../services/obd.service';
import { ActivityIndicator } from 'react-native';

const FuelEntry = ({ date, liters, price, location }: any) => (
  <View style={styles.entryContainer}>
    <LinearGradient
      colors={['rgba(59, 130, 246, 0.1)', 'rgba(59, 130, 246, 0.05)']}
      style={styles.entryGradient}>
      <View style={styles.entryHeader}>
        <GasPump size={20} color="#3B82F6" />
        <Text style={styles.entryDate}>{date}</Text>
      </View>
      <View style={styles.entryStats}>
        <View style={styles.entryStat}>
          <Text style={styles.entryStatLabel}>Liters</Text>
          <Text style={styles.entryStatValue}>{liters}</Text>
        </View>
        <View style={styles.entryStat}>
          <Text style={styles.entryStatLabel}>Price/L</Text>
          <Text style={styles.entryStatValue}>₹{price}</Text>
        </View>
        <View style={styles.entryStat}>
          <Text style={styles.entryStatLabel}>Total</Text>
          <Text style={styles.entryStatValue}>₹{(liters * price).toFixed(2)}</Text>
        </View>
      </View>
      <View style={styles.locationContainer}>
        <MapPin size={16} color="#94A3B8" />
        <Text style={styles.locationText}>{location}</Text>
      </View>
    </LinearGradient>
  </View>
);

export default function FuelScreen() {
  const [timeSeriesData, setTimeSeriesData] = useState({
    labels: [] as string[],
    mafData: [] as number[], // Mass Air Flow correlates with fuel consumption
  });

  const chartData = {
    labels: timeSeriesData.labels,
    datasets: [
      {
        data: timeSeriesData.mafData,
        color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const [obdData, setObdData] = useState<OBDData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [newFilling, setNewFilling] = useState({
    place: '',
    liters: '',
    amount: '',
  });
  const [fillings, setFillings] = useState([]);

  const handleAddFilling = () => {
    const filling = {
      date: new Date().toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }),
      liters: parseFloat(newFilling.liters).toFixed(1),
      price: (parseFloat(newFilling.amount) / parseFloat(newFilling.liters)).toFixed(2),
      location: newFilling.place,
      id: Date.now()
    };
    setFillings([filling, ...fillings]);
    setNewFilling({ place: '', liters: '', amount: '' });
    setIsDialogVisible(false);
  };

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      const interval = setInterval(async () => {
        try {
          if (mounted) {
            const data = await OBDService.getData();
            setObdData(data);
            setError(null); // Clear any previous error
            
            const now = new Date();
            const timeStr = now.toLocaleTimeString('en-US', { hour12: false }).split(':').slice(1).join(':');
            
            setTimeSeriesData(prev => ({
              labels: [...prev.labels.slice(-5), timeStr],
              mafData: [...prev.mafData.slice(-5), data.maf || 0],
            }));
          }
        } catch (err: any) {
          if (mounted) {
            setError(
              `Error: ${err.response?.data?.detail || err.message}\n` +
              `Status: ${err.response?.status || 'Unknown'}`
            );
            console.error('Detailed error:', {
              message: err.message,
              status: err.response?.status,
              statusText: err.response?.statusText,
              details: err.response?.data
            });
          }
        }
      }, 2000);

      return () => {
        mounted = false;
        clearInterval(interval);
      };
    }, [])
  );

  // Add error display at the top of the component
  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Debug Information</Text>
        <Text style={styles.errorDetails}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => setError(null)}>
          <Text style={styles.retryButtonText}>Retry Connection</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={screens.screen}>
      <View style={screens.content}>
        <Card>
          <Card.Header title="Fuel Consumption" />
          <Card.Content>
            <ListItem 
              label="Mass Air Flow" 
              value={obdData?.maf ? `${obdData.maf.toFixed(2)} g/s` : '-'} 
            />
            <ListItem 
              label="Short Fuel Trim" 
              value={obdData?.short_fuel_trim_1 ? `${obdData.short_fuel_trim_1.toFixed(1)}%` : '-'} 
            />
            <ListItem 
              label="Long Fuel Trim" 
              value={obdData?.long_fuel_trim_1 ? `${obdData.long_fuel_trim_1.toFixed(1)}%` : '-'} 
            />
            <ListItem 
              label="Commanded Ratio" 
              value={obdData?.commanded_equiv_ratio ? `${obdData.commanded_equiv_ratio.toFixed(2)}` : '-'} 
            />
          </Card.Content>
        </Card>
        <Card>
          <Card.Header title="Fuel System" />
          <Card.Content>
            <ListItem 
              label="Mass Air Flow" 
              value={obdData?.maf ? `${obdData.maf.toFixed(2)} g/s` : '-'} 
            />
            <ListItem 
              label="Short Fuel Trim" 
              value={obdData?.short_fuel_trim_1 ? `${obdData.short_fuel_trim_1.toFixed(1)}%` : '-'} 
            />
            <ListItem 
              label="Long Fuel Trim" 
              value={obdData?.long_fuel_trim_1 ? `${obdData.long_fuel_trim_1.toFixed(1)}%` : '-'} 
            />
            <ListItem 
              label="Commanded Ratio" 
              value={obdData?.commanded_equiv_ratio ? `${obdData.commanded_equiv_ratio.toFixed(2)}` : '-'} 
            />
            <ListItem 
              label="Engine Load" 
              value={obdData?.engine_load ? `${obdData.engine_load.toFixed(1)}%` : '-'} 
            />
            <ListItem 
              label="Absolute Load" 
              value={obdData?.absolute_load ? `${obdData.absolute_load.toFixed(1)}%` : '-'} 
            />
          </Card.Content>
        </Card>
      </View>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Fuel History</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setIsDialogVisible(true)}>
              <Plus size={24} color="#3B82F6" />
            </TouchableOpacity>
          </View>

          {/* Add Dialog */}
          <Modal
            visible={isDialogVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setIsDialogVisible(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.dialogContainer}>
                <Text style={styles.dialogTitle}>Add Fuel Fill-up</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Place"
                  placeholderTextColor="#94A3B8"
                  value={newFilling.place}
                  onChangeText={(text) => setNewFilling({...newFilling, place: text})}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Liters"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={newFilling.liters}
                  onChangeText={(text) => setNewFilling({...newFilling, liters: text})}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Amount"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={newFilling.amount}
                  onChangeText={(text) => setNewFilling({...newFilling, amount: text})}
                />
                <View style={styles.dialogButtons}>
                  <TouchableOpacity 
                    style={[styles.dialogButton, styles.cancelButton]}
                    onPress={() => setIsDialogVisible(false)}>
                    <Text style={styles.dialogButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.dialogButton, styles.addButton]}
                    onPress={handleAddFilling}>
                    <Text style={styles.dialogButtonText}>Add</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <LinearGradient
                colors={['rgba(59, 130, 246, 0.1)', 'rgba(59, 130, 246, 0.05)']}
                style={styles.statGradient}>
                <GasPump size={24} color="#3B82F6" />
                <Text style={styles.statLabel}>Fuel Level</Text>
                <Text style={styles.statValue}>{obdData?.fuel_level ? `${obdData.fuel_level.toFixed(1)}%` : '-'}</Text>
              </LinearGradient>
            </View>
            <View style={styles.statCard}>
              <LinearGradient
                colors={['rgba(59, 130, 246, 0.1)', 'rgba(59, 130, 246, 0.05)']}
                style={styles.statGradient}>
                <TrendingUp size={24} color="#3B82F6" />
                <Text style={styles.statLabel}>Consumption</Text>
                <Text style={styles.statValue}>{obdData?.maf ? `${(obdData.maf * 0.28).toFixed(1)} L/h` : '-'}</Text>
              </LinearGradient>
            </View>
            <View style={styles.statCard}>
              <LinearGradient
                colors={['rgba(59, 130, 246, 0.1)', 'rgba(59, 130, 246, 0.05)']}
                style={styles.statGradient}>
                <DollarSign size={24} color="#3B82F6" />
                <Text style={styles.statLabel}>Est. Range</Text>
                <Text style={styles.statValue}>{obdData?.fuel_level ? `${(obdData.fuel_level * 4).toFixed(0)}km` : '-'}</Text>
              </LinearGradient>
            </View>
          </View>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <LinearGradient
                colors={['rgba(59, 130, 246, 0.1)', 'rgba(59, 130, 246, 0.05)']}
                style={styles.statGradient}>
                <GasPump size={24} color="#3B82F6" />
                <Text style={styles.statLabel}>Engine Load</Text>
                <Text style={styles.statValue}>{obdData?.engine_load ? `${obdData.engine_load.toFixed(1)}%` : '-'}</Text>
              </LinearGradient>
            </View>
            <View style={styles.statCard}>
              <LinearGradient
                colors={['rgba(59, 130, 246, 0.1)', 'rgba(59, 130, 246, 0.05)']}
                style={styles.statGradient}>
                <TrendingUp size={24} color="#3B82F6" />
                <Text style={styles.statLabel}>MAF Rate</Text>
                <Text style={styles.statValue}>{obdData?.maf ? `${obdData.maf.toFixed(1)} g/s` : '-'}</Text>
              </LinearGradient>
            </View>
            <View style={styles.statCard}>
              <LinearGradient
                colors={['rgba(59, 130, 246, 0.1)', 'rgba(59, 130, 246, 0.05)']}
                style={styles.statGradient}>
                <DollarSign size={24} color="#3B82F6" />
                <Text style={styles.statLabel}>Efficiency</Text>
                <Text style={styles.statValue}>{obdData?.commanded_equiv_ratio ? `${(obdData.commanded_equiv_ratio * 100).toFixed(0)}%` : '-'}</Text>
              </LinearGradient>
            </View>
          </View>

          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Fuel Consumption Rate (L/h)</Text>
            <LineChart
              data={{
                ...chartData,
                datasets: [{
                  ...chartData.datasets[0],
                  data: chartData.datasets[0].data.map(maf => maf * 0.28) // Convert MAF to L/h
                }]
              }}
              width={Dimensions.get('window').width - 32}
              height={220}
              chartConfig={{
                backgroundColor: 'rgba(30, 41, 59, 0.7)',
                backgroundGradientFrom: 'rgba(30, 41, 59, 0.7)',
                backgroundGradientTo: 'rgba(30, 41, 59, 0.7)',
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#3B82F6',
                },
              }}
              bezier
              style={styles.chart}
            />
          </View>

          <Text style={styles.sectionTitle}>Recent Fill-ups</Text>
          {fillings.map((filling) => (
            <FuelEntry
              key={filling.id}
              date={filling.date}
              liters={filling.liters}
              price={filling.price}
              location={filling.location}
            />
          ))}

          <FuelEntry
            date="Today, 2:30 PM"
            liters={47.3}
            price={102.5}
            location="HP - Ring Road"
          />

          <FuelEntry
            date="10 Mar, 2024"
            liters={40.9}
            price={102.7}
            location="Indian Oil"
          />

          <FuelEntry
            date="3 Mar, 2024"
            liters={42.4}
            price={102.3}
            location="Bharat Petroleum"
          />
        </ScrollView>
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
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '31%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  statGradient: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginTop: 8,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  chartContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderRadius: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  entryContainer: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  entryGradient: {
    padding: 16,
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  entryDate: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  entryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  entryStat: {
    alignItems: 'center',
  },
  entryStatLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginBottom: 4,
  },
  entryStatValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    marginLeft: 6,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#EF4444',
    marginBottom: 12,
  },
  errorDetails: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#3B82F6',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogContainer: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  dialogTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    color: '#FFFFFF',
    fontFamily: 'Inter-Regular',
  },
  dialogButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  dialogButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#4B5563',
  },
  addButton: {
    backgroundColor: '#3B82F6',
  },
  dialogButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
});