import { useRouter } from 'expo-router';
import { StyleSheet, View, Text, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Animated, { FadeInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function Welcome() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(0,0,0,0.8)', '#000']}
        style={StyleSheet.absoluteFill}
      />
      
      <Image
        source={{ uri: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1000&auto=format&fit=crop' }}
        style={[StyleSheet.absoluteFill, { opacity: 0.5 }]}
      />

      <Animated.View 
        entering={FadeInDown.delay(500).springify()} 
        style={styles.content}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.title}>VigiCar</Text>
          <Text style={styles.subtitle}>Your Smart Car Diagnostic Solution</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.signInButton]}
            onPress={() => router.push('/sign-in')}
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.signUpButton]}
            onPress={() => router.push('/sign-up')}
          >
            <Text style={[styles.buttonText, styles.signUpText]}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 24,
    paddingBottom: 48,
  },
  titleContainer: {
    marginBottom: 48,
  },
  title: {
    fontSize: 48,
    fontFamily: 'SpaceGrotesk-SemiBold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: '#fff',
    textAlign: 'center',
    opacity: 0.8,
  },
  buttonContainer: {
    gap: 16,
    width: '100%',
  },
  button: {
    width: '100%',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInButton: {
    backgroundColor: '#0066FF',
  },
  signUpButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#fff',
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  signUpText: {
    opacity: 0.9,
  },
});