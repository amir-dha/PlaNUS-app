// CalendarGridScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CalendarGridScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Calendar Grid Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  text: {
    fontSize: 20,
    color: 'black',
  },
});

export default CalendarGridScreen;
