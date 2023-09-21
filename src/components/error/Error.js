//import liraries
import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import { COLORS } from '../../configs/constants/colors';

// create a component
const Error = ({error, showButton = true, onPress = () => {}}) => {
  return (
    <View style={styles.container}>
      {error?.message?.split(':')[1]?.trim() == 'Network Error' ? (
        <Text style={{fontSize: 15, color: '#000'}}>
          Make sure you are connect to internet
        </Text>
      ) : (
        <>
          <Text style={{fontSize: 15, color: '#000'}}>
            {error?.data?.message ??
              error?.data?.name ??
              error?.response?.data?.message ??
              error?.response?.data ??
              error?.message ?? error?.error ??
              'Something went wrong'}
          </Text>
        </>
      )}

      {showButton && (
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.5}
          style={{
            borderWidth: 1,
            paddingHorizontal: 20,
            paddingVertical: 7,
            borderRadius: 30,
            borderColor: COLORS.secondary_lg[0],
            marginTop: 10,
          }}>
          <Text style={{fontSize: 15, color: COLORS.secondary_lg[0]}}>
            Retry
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Error;
