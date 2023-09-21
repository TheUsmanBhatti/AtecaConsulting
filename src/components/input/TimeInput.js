import React, {useState, useRef, useEffect} from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import moment from 'moment';
import { COLORS } from '../../configs/constants/colors';

// import PropTypes from 'prop-types';

const TimeInput = ({label, value, onChange}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [formattedValue, setFormattedValue] = useState(value);

  const formatTime = time => {
    const parts = parseFloat(time)?.toFixed(2).split('.');

    const hrs = parts[0] > 24 ? 24 : parts[0];
    let min = Math.floor(parseInt(parts[1])?.toFixed(2) * 0.6);

    if (!isNaN(hrs) && hrs >= 0 && hrs <= 24) {
      onChange(parseFloat(`${hrs}.${parts[1]}`)?.toFixed(2));
      setFormattedValue(
        `${hrs.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`,
      );
      return `${hrs.toString().padStart(2, '0')}:${min
        .toString()
        .padStart(2, '0')}`;
    }

    return time; // If input is invalid, keep the current value
  };

  const handleBlur = () => {
    setIsFocused(false);
    formatTime(formattedValue);
  };

  const handleTextChange = text => {
    setFormattedValue(text);
    setTimeout(() => {
      formatTime(text);
    }, 1000);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  return (
    <View style={styles.container}>
      <Text style={{color: '#444'}}>{label}</Text>
      <TextInput
        style={styles.input}
        value={formattedValue}
        onChangeText={handleTextChange}
        placeholder='00:00'
        keyboardType="number-pad"
        maxLength={5}
        onBlur={handleBlur}
        onFocus={handleFocus}
      />
    </View>
  );
};

// TimeInput.propTypes = {
//   label: PropTypes.string.isRequired,
//   value: PropTypes.string.isRequired,
//   onChange: PropTypes.func.isRequired,
// };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 10,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 10,
    height: 40,
    width: '100%',
    textAlign: 'center',
    borderColor: COLORS.secondary_lg[0],
  },
});

export default TimeInput;
