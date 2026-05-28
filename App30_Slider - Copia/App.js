import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

export default function App() {
  const [value, setValue] = useState(50);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Slider App</Text>
      <Text style={styles.value}>Value: {Math.round(value)}</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={100}
        value={value}
        onValueChange={setValue}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  value: {
    fontSize: 18,
    marginBottom: 20,
  },
  slider: {
    width: 250,
    height: 40,
  },
});
