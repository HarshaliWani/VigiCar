import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { MessageSquare } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function ChatButton() {
  const router = useRouter();

  const handlePress = () => {
    router.push('/chat');
  };

  return (
    <Pressable style={styles.button} onPress={handlePress}>
      <MessageSquare color="#fff" size={24} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#0066cc',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});