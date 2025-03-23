import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TriangleAlert as AlertTriangle, Wrench, Youtube, Calendar } from 'lucide-react-native';

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
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Diagnostics</Text>
          <TouchableOpacity style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Clear Codes</Text>
          </TouchableOpacity>
        </View>

        <ErrorCode
          code="P0420"
          title="Catalyst System Efficiency Below Threshold"
          description="The catalytic converter is not operating at maximum efficiency. This may lead to increased emissions and reduced fuel economy."
          severity="high"
        />

        <ErrorCode
          code="P0171"
          title="System Too Lean (Bank 1)"
          description="The fuel system is delivering too much air or too little fuel. This can cause rough idling and reduced performance."
          severity="medium"
        />

        <ErrorCode
          code="P0300"
          title="Random/Multiple Cylinder Misfire Detected"
          description="Engine misfires detected across multiple cylinders. This can cause rough running and increased emissions."
          severity="high"
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
});