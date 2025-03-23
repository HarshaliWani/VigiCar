import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Clock, Calendar, Download, Search } from 'lucide-react-native';

const TripCard = ({ date, distance, duration, avgSpeed, fuelUsed }: any) => (
  <TouchableOpacity style={styles.tripContainer}>
    <LinearGradient
      colors={['rgba(59, 130, 246, 0.1)', 'rgba(59, 130, 246, 0.05)']}
      style={styles.tripGradient}>
      <View style={styles.tripHeader}>
        <Text style={styles.tripDate}>{date}</Text>
        <TouchableOpacity>
          <Download size={20} color="#3B82F6" />
        </TouchableOpacity>
      </View>
      <View style={styles.tripStats}>
        <View style={styles.tripStat}>
          <Text style={styles.tripStatLabel}>Distance</Text>
          <Text style={styles.tripStatValue}>{distance}</Text>
        </View>
        <View style={styles.tripStat}>
          <Text style={styles.tripStatLabel}>Duration</Text>
          <Text style={styles.tripStatValue}>{duration}</Text>
        </View>
        <View style={styles.tripStat}>
          <Text style={styles.tripStatLabel}>Avg Speed</Text>
          <Text style={styles.tripStatValue}>{avgSpeed}</Text>
        </View>
        <View style={styles.tripStat}>
          <Text style={styles.tripStatLabel}>Fuel Used</Text>
          <Text style={styles.tripStatValue}>{fuelUsed}</Text>
        </View>
      </View>
    </LinearGradient>
  </TouchableOpacity>
);

export default function HistoryScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>History</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.headerButton}>
              <Calendar size={20} color="#3B82F6" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Search size={20} color="#3B82F6" />
            </TouchableOpacity>
          </View>
        </View>

        <TripCard
          date="Today, 9:30 AM"
          distance="28.5 mi"
          duration="45 min"
          avgSpeed="38 mph"
          fuelUsed="1.2 gal"
        />

        <TripCard
          date="Yesterday, 5:45 PM"
          distance="12.3 mi"
          duration="25 min"
          avgSpeed="29 mph"
          fuelUsed="0.6 gal"
        />

        <TripCard
          date="Mar 15, 2024"
          distance="156.8 mi"
          duration="2h 45m"
          avgSpeed="57 mph"
          fuelUsed="5.8 gal"
        />

        <View style={styles.summaryContainer}>
          <LinearGradient
            colors={['rgba(59, 130, 246, 0.1)', 'rgba(59, 130, 246, 0.05)']}
            style={styles.summaryGradient}>
            <Text style={styles.summaryTitle}>Monthly Summary</Text>
            <View style={styles.summaryStats}>
              <View style={styles.summaryStat}>
                <Text style={styles.summaryStatValue}>1,245 mi</Text>
                <Text style={styles.summaryStatLabel}>Total Distance</Text>
              </View>
              <View style={styles.summaryStat}>
                <Text style={styles.summaryStatValue}>45.2 gal</Text>
                <Text style={styles.summaryStatLabel}>Fuel Used</Text>
              </View>
              <View style={styles.summaryStat}>
                <Text style={styles.summaryStatValue}>27.5 mpg</Text>
                <Text style={styles.summaryStatLabel}>Avg Efficiency</Text>
              </View>
            </View>
          </LinearGradient>
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
    marginTop: 60,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontFamily: 'SpaceGrotesk-SemiBold',
    color: '#FFFFFF',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  headerButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    padding: 8,
    borderRadius: 12,
    marginLeft: 8,
  },
  tripContainer: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  tripGradient: {
    padding: 16,
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tripDate: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  tripStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tripStat: {
    alignItems: 'center',
  },
  tripStatLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginBottom: 4,
  },
  tripStatValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  summaryContainer: {
    marginTop: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  summaryGradient: {
    padding: 16,
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
  },
  summaryTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryStat: {
    alignItems: 'center',
  },
  summaryStatValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  summaryStatLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
});