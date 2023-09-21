import moment from 'moment';
import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../configs/constants/colors';

const TimeSheetCard = ({
  onPress,
  projectTitle,
  taskCode,
  hours,
  date,
  status,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.timeSheetCard}>
      {status && (
        <Text style={styles.timeSheetStatus}>{status?.slice(2, 30)}</Text>
      )}

      <Text style={styles.projectTitle}>{projectTitle?.split(' - ')[0]}</Text>

      <View style={styles.descCont}>
        <View style={[styles.descCont2, {marginRight: 10}]}>
          <MIcon name="sticker-check-outline" size={20} color={'#fff'} />
          <Text style={{fontSize: 16, color: '#fff', paddingLeft: 8}}>
            {taskCode}
          </Text>
        </View>

        <View
          style={[
            styles.descCont2,
            {
              marginRight: 10,
            },
          ]}>
          <MIcon name="clock-time-three-outline" size={20} color={'#fff'} />
          <Text style={{fontSize: 16, color: '#fff', paddingLeft: 8}}>
            {hours?.toFixed(2)}
          </Text>
        </View>

        <View style={[styles.descCont2, {flex: 1}]}>
          <MIcon name="calendar" size={20} color={'#fff'} />
          <Text style={{fontSize: 16, color: '#fff', paddingLeft: 8}}>
            {moment(date).format('MMM DD, YYYY')}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  timeSheetCard: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    elevation: 3,
  },
  timeSheetStatus: {
    fontSize: 13,
    backgroundColor: '#b9edbb',
    color: 'green',
    padding: 5,
    borderRadius: 30,
    paddingHorizontal: 10,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    position: 'absolute',
    right: 10,
    top: 10,
  },
  projectTitle: {
    color: '#444444',
    fontSize: 18,
    marginBottom: 10,
    fontWeight: '600',
  },
  descCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    columnGap: 10,
  },
  descCont2: {
    flexDirection: 'row',
    backgroundColor: COLORS.tertiary_lg[1],
    flex: 0.7,
    justifyContent: 'center',
    padding: 7,
    alignItems: 'center',
    borderRadius: 7,
  },
});

export default TimeSheetCard;
