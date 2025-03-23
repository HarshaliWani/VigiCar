import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart } from 'react-native-chart-kit';
import { Compass as GasPump, TrendingUp, DollarSign, MapPin, Plus } from 'lucide-react-native';

const FuelEntry = ({ date, gallons, price, location }: any) => (
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
          <Text style={styles.entryStatLabel}>Gallons</Text>
          <Text style={styles.entryStatValue}>{gallons}</Text>
        </View>
        <View style={styles.entryStat}>
          <Text style={styles.entryStatLabel}>Price/Gal</Text>
          <Text style={styles.entryStatValue}>${price}</Text>
        </View>
        <View style={styles.entryStat}>
          <Text style={styles.entryStatLabel}>Total</Text>
          <Text style={styles.entryStatValue}>${(gallons * price).toFixed(2)}</Text>
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
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [3.45, 3.52, 3.48, 3.65, 3.59, 3.49],
        color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Fuel Tracking</Text>
          <TouchableOpacity style={styles.addButton}>
            <Plus size={24} color="#3B82F6" />
          </TouchableOpacity>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <LinearGradient
              colors={['rgba(59, 130, 246, 0.1)', 'rgba(59, 130, 246, 0.05)']}
              style={styles.statGradient}>
              <GasPump size={24} color="#3B82F6" />
              <Text style={styles.statLabel}>Last Fill-up</Text>
              <Text style={styles.statValue}>$3.49/gal</Text>
            </LinearGradient>
          </View>
          <View style={styles.statCard}>
            <LinearGradient
              colors={['rgba(59, 130, 246, 0.1)', 'rgba(59, 130, 246, 0.05)']}
              style={styles.statGradient}>
              <TrendingUp size={24} color="#3B82F6" />
              <Text style={styles.statLabel}>Monthly Avg</Text>
              <Text style={styles.statValue}>$3.52/gal</Text>
            </LinearGradient>
          </View>
          <View style={styles.statCard}>
            <LinearGradient
              colors={['rgba(59, 130, 246, 0.1)', 'rgba(59, 130, 246, 0.05)']}
              style={styles.statGradient}>
              <DollarSign size={24} color="#3B82F6" />
              <Text style={styles.statLabel}>Monthly Spent</Text>
              <Text style={styles.statValue}>$245.30</Text>
            </LinearGradient>
          </View>
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Price Trends</Text>
          <LineChart
            data={chartData}
            width={Dimensions.get('window').width - 32}
            height={220}
            chartConfig={{
              backgroundColor: 'rgba(30, 41, 59, 0.7)',
              backgroundGradientFrom: 'rgba(30, 41, 59, 0.7)',
              backgroundGradientTo: 'rgba(30, 41, 59, 0.7)',
              decimalPlaces: 2,
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

        <FuelEntry
          date="Today, 2:30 PM"
          gallons={12.5}
          price={3.49}
          location="Shell - Main Street"
        />

        <FuelEntry
          date="Mar 10, 2024"
          gallons={10.8}
          price={3.52}
          location="Costco Gas"
        />

        <FuelEntry
          date="Mar 3, 2024"
          gallons={11.2}
          price={3.48}
          location="Chevron - Highway 101"
        />
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
});