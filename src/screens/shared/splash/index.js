//import liraries
import React, {Component} from 'react';
import {View, Image, StyleSheet, ActivityIndicator} from 'react-native';
import {COLORS} from '../../../configs/constants/colors';

// create a component
const Splash = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/images/ateca_logo_2.png')}
        style={{width: '50%', height: '50%', resizeMode: 'contain'}}
      />

      <ActivityIndicator size={'large'} color={COLORS.secondary_lg[1]} />
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
export default Splash;
