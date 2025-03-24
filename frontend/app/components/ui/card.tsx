import { View, Text, StyleSheet } from 'react-native';

interface CardProps {
  children: React.ReactNode;
}

interface CardHeaderProps {
  title: string;
}

interface CardContentProps {
  children: React.ReactNode;
}

export function Card({ children }: CardProps) {
  return <View style={styles.card}>{children}</View>;
}

Card.Header = function CardHeader({ title }: CardHeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

Card.Content = function CardContent({ children }: CardContentProps) {
  return <View style={styles.content}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  content: {
    padding: 16,
  },
});
