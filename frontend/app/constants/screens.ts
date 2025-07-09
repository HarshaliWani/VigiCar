import { StyleSheet } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

export const screens = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#111827',
  },
  content: {
    padding: 16,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120, // Large bottom padding to account for tab bar
  }
});
