import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TriangleAlert as AlertTriangle, Wrench, Youtube, Calendar } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';

const BASE_URL = "http://localhost:8000"; // Replace with your backend URL if running on a different machine

const ErrorCode = ({ code, title, description, severity }: any) => (
  <TouchableOpacity style={styles.errorContainer}>
    <LinearGradient
      colors={[
        severity === 'high' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)',
        severity === 'high' ? 'rgba(239, 68, 68, 0.05)' : 'rgba(59, 130, 246, 0.05)',
      ]}
      style={styles.errorGradient}>
      <View style={styles.errorHeader}>
        <AlertTriangle
          size={24}
          color={severity === 'high' ? '#EF4444' : '#3B82F6'}
        />
        <View style={styles.errorTitleContainer}>
          <Text style={styles.errorCode}>{code}</Text>
          <Text style={styles.errorTitle}>{title}</Text>
        </View>
      </View>
      <Text style={styles.errorDescription}>{description}</Text>
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton}>
          <Wrench size={20} color="#3B82F6" />
          <Text style={styles.actionButtonText}>Fix Guide</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Youtube size={20} color="#3B82F6" />
          <Text style={styles.actionButtonText}>Watch Tutorial</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Calendar size={20} color="#3B82F6" />
          <Text style={styles.actionButtonText}>Schedule Service</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  </TouchableOpacity>
);

export default function DiagnosticsScreen() {
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDiagnostics = async () => {
    try {
      setError(null); // Clear any previous errors
      const response = await fetch(`${BASE_URL}/ai/diagnostics`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDiagnostics(data);
      } else {
        console.error("Failed to fetch diagnostics:", response.statusText);
        setError("Failed to fetch diagnostics.");
      }
    } catch (err) {
      console.error("Error fetching diagnostics:", err);
      setError("Error fetching diagnostics.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      // Fetch diagnostics immediately when the tab is focused
      fetchDiagnostics();

      // Set up polling to fetch diagnostics every 30 seconds
      const interval = setInterval(fetchDiagnostics, 30000);

      // Cleanup interval when the tab is unfocused
      return () => clearInterval(interval);
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading Diagnostics...</Text>
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

  if (!diagnostics || !diagnostics.warnings) {
    return (
      <View style={styles.errorContainer}>
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
            code={warning.code || "N/A"}
            title={warning.title || "Unknown Issue"}
            description={warning.description || "No details available."}
            severity={warning.severity || "medium"}
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
  errorContainer: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  errorGradient: {
    padding: 16,
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
  },
  errorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  errorTitleContainer: {
    marginLeft: 12,
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
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  actionButtonText: {
    color: '#3B82F6',
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    marginLeft: 6,
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