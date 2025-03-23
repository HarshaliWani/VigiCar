import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Trophy, Leaf, Gauge } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const ScoreCard = ({ title, score, Icon }: any) => (
  <View style={styles.scoreContainer}>
    <LinearGradient
      colors={['rgba(59, 130, 246, 0.1)', 'rgba(59, 130, 246, 0.05)']}
      style={styles.scoreGradient}>
      <Icon size={24} color="#3B82F6" style={styles.scoreIcon} />
      <Text style={styles.scoreTitle}>{title}</Text>
      <Text style={styles.scoreValue}>{score}</Text>
    </LinearGradient>
  </View>
);

export default function InsightsScreen() {
  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [25, 28, 32, 30, 35, 27, 29],
        color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Insights</Text>

        <View style={styles.scoreGrid}>
          <ScoreCard title="Driving Score" score="85" Icon={Trophy} />
          <ScoreCard title="Eco Score" score="92" Icon={Leaf} />
          <ScoreCard title="Safety Score" score="88" Icon={Gauge} />
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Fuel Efficiency (MPG)</Text>
          <LineChart
            data={chartData}
            width={Dimensions.get('window').width - 32}
            height={220}
            chartConfig={{
              backgroundColor: 'rgba(30, 41, 59, 0.7)',
              backgroundGradientFrom: 'rgba(30, 41, 59, 0.7)',
              backgroundGradientTo: 'rgba(30, 41, 59, 0.7)',
              decimalPlaces: 0,
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

        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>Driving Tips</Text>
          <View style={styles.tipCard}>
            <LinearGradient
              colors={['rgba(59, 130, 246, 0.1)', 'rgba(59, 130, 246, 0.05)']}
              style={styles.tipGradient}>
              <Text style={styles.tipTitle}>Smooth Acceleration</Text>
              <Text style={styles.tipDescription}>
                Gradual acceleration can improve fuel efficiency by up to 20%. Try to accelerate smoothly
                and avoid sudden changes in speed.
              </Text>
            </LinearGradient>
          </View>
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
  title: {
    fontSize: 32,
    fontFamily: 'SpaceGrotesk-SemiBold',
    color: '#FFFFFF',
    marginTop: 60,
    marginBottom: 24,
  },
  scoreGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  scoreContainer: {
    width: '31%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  scoreGradient: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
  },
  scoreIcon: {
    marginBottom: 8,
  },
  scoreTitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginBottom: 4,
    textAlign: 'center',
  },
  scoreValue: {
    fontSize: 24,
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
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  tipsContainer: {
    marginBottom: 24,
  },
  tipsTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  tipCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  tipGradient: {
    padding: 16,
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
  },
  tipTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  tipDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    lineHeight: 20,
  },
});