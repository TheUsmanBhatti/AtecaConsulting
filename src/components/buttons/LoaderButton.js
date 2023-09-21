//import liraries
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { COLORS } from '../../configs/constants/colors';
import { FONTS } from '../../configs/constants/fonts';


// create a component
const LoaderButton = ({
  label,
  color = '#fff',
  loading = false,
  startIcon,
  endIcon,
  style,
  onPress,
  labelStyle
}) => {
  const styles = StyleSheet.create({
    container: {
      backgroundColor: COLORS.secondary_lg[0],
      justifyContent: 'center',
      alignItems: 'center',
      height: 45,
      borderRadius: 10,
      opacity: loading ? 0.7 : 1,
      ...style
    },
    label: {
      fontSize: 17,
      color: color,
      marginHorizontal: 10,
      fontWeight: '600',
      fontFamily: FONTS.mssb,
      ...labelStyle
    },
    btnLabelCont: {
        flexDirection: 'row',
        alignItems: 'center'
    }
  });

  return (
    <TouchableOpacity onPress={onPress} disabled={loading} style={styles.container}>
      {loading ? (
        <ActivityIndicator size={25} color={color} />
      ) : (
        <View style={styles.btnLabelCont}>
          {startIcon && startIcon}
          <Text style={styles.label}>{label}</Text>
          {endIcon && endIcon}
        </View>
      )}
    </TouchableOpacity>
  );
};

//make this component available to the app
export default LoaderButton;
