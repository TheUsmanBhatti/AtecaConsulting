import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {COLORS} from '../../configs/constants/colors';
import { timeToFractionalHours } from '../../utils/formatTime';
import moment from 'moment';

const TimePicker = ({selectedTime, onSelect, label}) => {
  const [isPickerVisible, setPickerVisible] = useState(false);

  const showPicker = () => {
    setPickerVisible(true);
  };

  const hidePicker = () => {
    setPickerVisible(false);
  };

  const handleConfirm = time => {
    hidePicker();
    onSelect(time);
  };

  return (
    <View style={styles.container}>
      <Text style={{color: '#444'}}>{label}</Text>
      <TouchableOpacity style={styles.input} onPress={showPicker}>
        <Text style={styles.selectedTime}>{selectedTime}</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isPickerVisible}
        mode="time"
        locale="en_GB"
        is24Hour
        date={moment(selectedTime, 'HH:mm').toDate()}
        onCancel={hidePicker}
        onConfirm={handleConfirm}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 10,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width: '100%',
    textAlign: 'center',
    borderColor: COLORS.secondary_lg[0],
  },
});

export default TimePicker;
