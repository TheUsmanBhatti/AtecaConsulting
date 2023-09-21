//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import { COLORS } from '../../configs/constants/colors';


// create a component
const SimpleLoader = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={'large'} color={COLORS.secondary_lg[0]} />
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

//make this component available to the app
export default SimpleLoader;
