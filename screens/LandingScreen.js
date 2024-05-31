import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const LandingScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to MyApp!</Text>
      <Button
        title="Go Sale Entry Screen"
        onPress={() => navigation.navigate('Sale-Entry-Screen')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default LandingScreen;