//import liraries
import React, {Component, useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import Fontisto from 'react-native-vector-icons/Fontisto';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Fontisto';
import {COLORS} from '../../../configs/constants/colors';
import LoaderButton from '../../../components/buttons/LoaderButton';
import {useDispatch, useSelector} from 'react-redux';
import {saveTimesheetList} from '../../../redux/slices/timesheetListSlice';
import {showMessage} from 'react-native-flash-message';
import {getApi} from '../../../services/getApi';
import {apiRequest} from '../../../utils/api';
import {saveAllTimesheetList} from '../../../redux/slices/allTimesheetListSlice';

// create a component
const TimeSheetView = ({route, navigation}) => {
  const timeSheetData = route.params?.timeSheet;
  const {timesheetList} = useSelector(state => state?.timesheetList);
  const {allTimesheetList} = useSelector(state => state?.allTimesheetList);
  const {authUser} = useSelector(state => state?.auth);
  const {user} = useSelector(state => state?.user);
  const timeSheet =
    timeSheetData?.employee_id == user?.id
      ? timesheetList.find(i => i?.id == timeSheetData?.id)
      : allTimesheetList.find(i => i?.id == timeSheetData?.id);

  const dispatch = useDispatch();
  const [loadingReq, setLoadingReq] = useState(false);

  const formatTime = time => {
    const parts = parseFloat(time)?.toFixed(2).split('.');

    const hrs = parts[0] > 24 ? 24 : parts[0];
    let min = Math.floor(parseInt(parts[1])?.toFixed(2) * 0.6);

    if (!isNaN(hrs) && hrs >= 0 && hrs <= 24) {
      return `${hrs.toString().padStart(2, '0')}:${min
        .toString()
        .padStart(2, '0')}`;
    }

    return time; // If input is invalid, keep the current value
  };

  const updateStatus = async state => {
    try {
      setLoadingReq(true);
      const res = await apiRequest('post', 'update_timesheet_status', {
        id: timeSheet?.id,
        state: state,
      });

      if (res?.data?.result) {
        let url =
          timeSheetData?.employee_id == user?.id
            ? 'employee_data'
            : 'get/worker/timesheet';

        const response = await getApi(url, {
          uid: authUser?.uid,
        });
        if (response) {
          dispatch(
            timeSheetData?.employee_id == user?.id
              ? saveTimesheetList(response)
              : saveAllTimesheetList(response),
          );
          if (state == '4_approved') {
            navigation.goBack();
            return showMessage('Timesheet approved');
          }
          if (state == '2_rejected') {
            navigation.goBack();
            return showMessage('TImesheet rejected');
          } else {
            showMessage('Timesheet submitted');
          }
        }
      }
    } catch (error) {
      showMessage(error?.message || 'Something went wrong');
    } finally {
      setLoadingReq(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text style={{fontSize: 15, fontWeight: 'bold', color: '#444'}}>
          {moment(timeSheet?.date).format('MMM DD, YYYY')}
        </Text>

        {timeSheet?.state && (
          <Text style={styles.timeSheetStatus}>
            {timeSheet?.state?.slice(2, 30)}
          </Text>
        )}
      </View>

      <Text
        style={{
          fontSize: 16,
          fontWeight: 'bold',
          marginVertical: 10,
          color: COLORS.secondary,
        }}>
        {timeSheet?.employee}
      </Text>

      <View>
        <Text style={{color: 'gray', fontWeight: 'bold'}}>Project Name</Text>
        <Text
          style={{
            color: COLORS.secondary_lg[0],
            fontSize: 17,
            fontWeight: 'bold',
          }}>
          {timeSheet?.project}
        </Text>
      </View>

      <View style={{marginTop: 10}}>
        <Text style={{color: 'gray', fontWeight: 'bold'}}>Task Name</Text>
        <Text
          style={{
            color: '#444',
            fontSize: 15,
            fontWeight: 'bold',
          }}>
          {timeSheet?.task_code} {timeSheet?.task}
        </Text>
      </View>

      <View style={styles.detailCont}>
        <HorizontalText text1={'Rate Name'} text2={timeSheet?.rate} />
        <Divider />

        <HorizontalText text1={'Pay Rate'} text2={timeSheet?.project_pay} />
        <Divider />

        <HorizontalText
          text1={'Start Time'}
          text2={formatTime(timeSheet?.start_time)}
        />
        <Divider />

        <HorizontalText
          text1={'Break Time'}
          text2={formatTime(timeSheet?.break_time)}
        />
        <Divider />
        {/* in format of time 00:00 */}
        <HorizontalText
          text1={'End Time'}
          text2={formatTime(timeSheet?.stop_time)}
        />
        <Divider />

        <HorizontalText
          text1={'Total Hours'}
          text2={formatTime(timeSheet?.unit_amount)}
        />
        <Divider />

        <HorizontalText
          text1={'Total Pay'}
          text2={timeSheet?.total_pay?.toFixed(2)}
        />
      </View>

      {timeSheet?.state == '1_draft' && timeSheet?.employee_id == user?.id && (
        <View style={{flexDirection: 'row', marginTop: 10}}>
          <LoaderButton
            label={'Edit'}
            onPress={() =>
              navigation.navigate('AddEditTimesheet', {
                timeSheet,
                name: 'Update Timesheet',
              })
            }
            loading={false}
            style={{backgroundColor: COLORS.secondary_lg[1], flex: 1}}
          />

          <LoaderButton
            label={'Submit'}
            loading={loadingReq}
            style={{marginLeft: 10, flex: 1}}
            onPress={() => updateStatus('3_unauthorized')}
          />
        </View>
      )}

      {timeSheet?.state == '3_unauthorized' &&
        user?.user_type !== 'worker' &&
        timeSheet?.employee_id !== user?.id && (
          <View style={{flexDirection: 'row', marginTop: 10}}>
            <LoaderButton
              label={'Reject'}
              onPress={() => updateStatus('2_rejected')}
              loading={loadingReq}
              style={{backgroundColor: 'red', flex: 1}}
            />
            <LoaderButton
              label={'Approve'}
              loading={loadingReq}
              style={{marginLeft: 10, flex: 1}}
              onPress={() => updateStatus('4_approved')}
            />
          </View>
        )}

      {timeSheet?.state == '2_rejected' &&
        timeSheet?.employee_id == user?.id && (
          <LoaderButton
            label={'Convert to draft'}
            onPress={() => updateStatus('1_draft')}
            loading={loadingReq}
          />
        )}
    </ScrollView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  detailCont: {
    backgroundColor: '#fff',
    marginTop: 10,
    borderRadius: 10,
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
  },
});

//make this component available to the app
export default TimeSheetView;

const Divider = () => {
  return (
    <View
      style={{
        width: '90%',
        height: 1,
        alignSelf: 'center',
        backgroundColor: 'gray',
      }}
    />
  );
};

const HorizontalText = ({text1, text2}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        alignItems: 'center',
      }}>
      <Text style={{color: '#444', fontSize: 15}}>{text1}</Text>
      <Text
        style={{color: '#444', fontSize: 15, width: '60%', textAlign: 'right'}}>
        {text2}
      </Text>
    </View>
  );
};
