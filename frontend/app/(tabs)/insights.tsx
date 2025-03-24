import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { Trophy, Leaf, Gauge } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { BASE_URL } from '../services/obd.service';

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
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = async () => {
    try {
      setError(null);
      const { data } = await axios.post(`${BASE_URL}/ai/insights`);
      setInsights(data);
    } catch (error) {
      console.error("Error fetching insights:", error);
      setError("Error fetching insights.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      // Fetch insights immediately when the tab is focused
      fetchInsights();

      // Set up polling to fetch insights every 30 seconds
      const interval = setInterval(fetchInsights, 30000);

      // Cleanup interval when the tab is unfocused
      return () => clearInterval(interval);
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading Insights...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!insights) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No insights available at the moment.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Insights</Text>

        {/* Score Grid */}
        <View style={styles.scoreGrid}>
          <ScoreCard title="Driving Score" score={insights.driving_score || "N/A"} Icon={Trophy} />
          <ScoreCard title="Eco Score" score={insights.eco_score || "N/A"} Icon={Leaf} />
          <ScoreCard title="Safety Score" score={insights.safety_score || "N/A"} Icon={Gauge} />
        </View>

        {/* Engine Health */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Engine Health</Text>
          <Text style={styles.chartValue}>{insights.engine_health || "N/A"}</Text>
        </View>

        {/* Driving Tips */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>Driving Tips</Text>
          {Array.isArray(insights.driving_tips) && insights.driving_tips.length > 0 ? (
            insights.driving_tips.map((tip: any, index: number) => (
              <View key={index} style={styles.tipCard}>
                <LinearGradient
                  colors={['rgba(59, 130, 246, 0.1)', 'rgba(59, 130, 246, 0.05)']}
                  style={styles.tipGradient}>
                  <Text style={styles.tipTitle}>{tip.tip || "No Tip Available"}</Text>
                  <Text style={styles.tipDescription}>{tip.details || "No Details Available"}</Text>
                </LinearGradient>
              </View>
            ))
          ) : (
            <Text style={styles.errorText}>No driving tips available at the moment.</Text>
          )}
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
  chartValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
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
    marginBottom: 16,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111827',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#FFFFFF',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111827',
  },
  errorText: {
    fontSize: 16,
    color: '#FF6B6B',
  },
});