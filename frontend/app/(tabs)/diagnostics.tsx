import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  TriangleAlert as AlertTriangle,
  Wrench,
  Youtube,
  Calendar,
} from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { BASE_URL } from '../services/obd.service';

const ErrorCode = ({ code, title, description, severity }: any) => (
  <TouchableOpacity style={styles.cardContainer}>
    <LinearGradient
      colors={[
        severity === 'high' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)',
        severity === 'high' ? 'rgba(239, 68, 68, 0.05)' : 'rgba(59, 130, 246, 0.05)',
      ]}
      style={styles.errorGradient}
    >
      <View style={styles.errorHeader}>
        <AlertTriangle
          size={24}
          color={severity === 'high' ? '#EF4444' : '#3B82F6'}
        />
        <View style={styles.errorTitleContainer}>
          <Text style={styles.errorCode}>{code}</Text>
          <Text style={styles.errorTitle} numberOfLines={1} ellipsizeMode="tail">
            {title}
          </Text>
        </View>
      </View>
      <Text style={styles.errorDescription} numberOfLines={3} ellipsizeMode="tail">
        {description}
      </Text>
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton}>
          <Wrench size={20} color="#3B82F6" />
          <Text style={styles.actionButtonText}>Fix Guide</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Youtube size={20} color="#3B82F6" />
          <Text style={styles.actionButtonText}>Watch</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Calendar size={20} color="#3B82F6" />
          <Text style={styles.actionButtonText}>Service</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  </TouchableOpacity>
);

export default function DiagnosticsScreen() {
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDiagnostics = async (mounted: boolean) => {
    try {
      setError(null);
      const { data } = await axios.post(`${BASE_URL}/ai/diagnostics`);
      if (mounted) {
        setDiagnostics(data);
      }
    } catch (error) {
      if (mounted) {
        console.error("Error fetching diagnostics:", error);
        setError('Error fetching diagnostics.');
      }
    } finally {
      if (mounted) {
        setLoading(false);
      }
    }
  };


  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      fetchDiagnostics(mounted);
      const interval = setInterval(() => fetchDiagnostics(mounted), 30000);
      
      return () => {
        mounted = false;
        clearInterval(interval);
      };
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.fullScreenCenter}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading Diagnostics...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.fullScreenCenter}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!diagnostics || !diagnostics.warnings) {
    return (
      <View style={styles.fullScreenCenter}>
        <Text style={styles.errorText}>No diagnostics available at the moment.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Diagnostics</Text>
          <TouchableOpacity style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Clear Codes</Text>
          </TouchableOpacity>
        </View>

        {diagnostics.warnings.map((warning: any, index: number) => (
          <ErrorCode
            key={index}
            code={warning.code || 'N/A'}
            title={warning.title || 'Unknown Issue'}
            description={warning.description || 'No details available.'}
            severity={warning.severity || 'medium'}
          />
        ))}
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
    paddingBottom: 40,
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
  clearButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  clearButtonText: {
    color: '#3B82F6',
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },

  // 🔧 Card Styles
  cardContainer: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  errorGradient: {
    padding: 16,
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    minHeight: 180,
    justifyContent: 'space-between',
    borderRadius: 16,
  },
  errorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  errorTitleContainer: {
    marginLeft: 12,
    flex: 1,
  },
  errorCode: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#94A3B8',
    marginBottom: 2,
  },
  errorTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  errorDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginBottom: 16,
  },

  // 🔧 Action Buttons
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingVertical: 10,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  actionButtonText: {
    color: '#3B82F6',
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    marginLeft: 6,
  },

  // 🔧 Loading & Error Screens
  fullScreenCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111827',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#FFFFFF',
  },
  errorText: {
    fontSize: 16,
    color: '#FF6B6B',
    textAlign: 'center',
  },
});
