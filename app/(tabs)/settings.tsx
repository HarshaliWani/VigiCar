import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Moon, Bell, Globe, Bluetooth, Gauge, Languages, CircleHelp as HelpCircle, LogOut } from 'lucide-react-native';

const SettingItem = ({ icon: Icon, title, value, onPress, isSwitch = false, isActive = false }: any) => (
  <TouchableOpacity onPress={onPress} style={styles.settingItem}>
    <View style={styles.settingIcon}>
      <Icon size={24} color="#3B82F6" />
    </View>
    <View style={styles.settingContent}>
      <Text style={styles.settingTitle}>{title}</Text>
      {value && <Text style={styles.settingValue}>{value}</Text>}
    </View>
    {isSwitch ? (
      <Switch
        value={isActive}
        onValueChange={onPress}
        trackColor={{ false: '#374151', true: '#3B82F6' }}
        thumbColor={isActive ? '#FFFFFF' : '#9CA3AF'}
      />
    ) : (
      <View style={styles.settingArrow} />
    )}
  </TouchableOpacity>
);

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Settings</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <LinearGradient
            colors={['rgba(59, 130, 246, 0.1)', 'rgba(59, 130, 246, 0.05)']}
            style={styles.sectionContent}>
            <SettingItem
              icon={Moon}
              title="Dark Mode"
              isSwitch
              isActive={true}
            />
          </LinearGradient>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <LinearGradient
            colors={['rgba(59, 130, 246, 0.1)', 'rgba(59, 130, 246, 0.05)']}
            style={styles.sectionContent}>
            <SettingItem
              icon={Bell}
              title="Notifications"
              isSwitch
              isActive={true}
            />
            <SettingItem
              icon={Globe}
              title="Units"
              value="Imperial (MPG, °F)"
            />
            <SettingItem
              icon={Languages}
              title="Language"
              value="English"
            />
          </LinearGradient>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connection</Text>
          <LinearGradient
            colors={['rgba(59, 130, 246, 0.1)', 'rgba(59, 130, 246, 0.05)']}
            style={styles.sectionContent}>
            <SettingItem
              icon={Bluetooth}
              title="OBD2 Device"
              value="Connected"
            />
            <SettingItem
              icon={Gauge}
              title="Auto-Connect"
              isSwitch
              isActive={true}
            />
          </LinearGradient>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <LinearGradient
            colors={['rgba(59, 130, 246, 0.1)', 'rgba(59, 130, 246, 0.05)']}
            style={styles.sectionContent}>
            <SettingItem
              icon={HelpCircle}
              title="Help & Support"
            />
          </LinearGradient>
        </View>

        <TouchableOpacity style={styles.logoutButton}>
          <LogOut size={24} color="#EF4444" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
    marginBottom: 12,
    paddingLeft: 4,
  },
  sectionContent: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingContent: {
    flex: 1,
    marginLeft: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  settingValue: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginTop: 2,
  },
  settingArrow: {
    width: 8,
    height: 8,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: '#64748B',
    transform: [{ rotate: '45deg' }],
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: 16,
    borderRadius: 16,
    marginTop: 8,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
    marginLeft: 8,
  },
});