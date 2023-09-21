//import liraries
import React, {Component, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {apiRequest} from '../../../utils/api';
import {useDispatch, useSelector} from 'react-redux';
import {saveProjectList} from '../../../redux/slices/projectListSlice';
import {saveTaskList} from '../../../redux/slices/taskListSlice';
import {saveRateList} from '../../../redux/slices/rateListSlice';
import TimeInput from '../../../components/input/TimeInput';
import SearchDropdown from '../../../components/dropdown/SearchDropdown';
import LoaderButton from '../../../components/buttons/LoaderButton';
import SimpleLoader from '../../../components/loader/SimpleLoader';
import Error from '../../../components/error/Error';
import {COLORS} from '../../../configs/constants/colors';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import IIcon from 'react-native-vector-icons/Ionicons';
import FlashMessage, {showMessage} from 'react-native-flash-message';
import TimePicker from '../../../components/input/TimePicker';
import {formatTime, timeToFractionalHours} from '../../../utils/formatTime';
import {saveTimesheetList} from '../../../redux/slices/timesheetListSlice';
import {getApi} from '../../../services/getApi';
import {saveAllTimesheetList} from '../../../redux/slices/allTimesheetListSlice';

// create a component
const AddEditTimesheet = ({navigation, route}) => {
  const {authUser} = useSelector(state => state?.auth);
  const {user} = useSelector(state => state?.user);

  const {timeSheet} = route?.params;

  const [team, setTeam] = useState([]);
  const {projectList} = useSelector(state => state?.projects);
  const {rateList} = useSelector(state => state?.rates);
  const {taskList} = useSelector(state => state?.tasks);
  const dispatch = useDispatch();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const projectListReq = apiRequest('post', 'specific_project_record', {
        uid: authUser?.uid,
      });

      const taskListReq = apiRequest('post', 'specific_task_record', {
        uid: authUser?.uid,
      });

      const rateLisReq = apiRequest('post', 'get/rate', {});

      const [response1, response2, response3] = await Promise.all([
        projectListReq,
        taskListReq,
        rateLisReq,
      ]);

      if (
        response1?.data?.result?.response &&
        response2?.data?.result?.response &&
        response3?.data?.result?.response
      ) {
        dispatch(saveProjectList(response1?.data?.result?.response));
        dispatch(saveTaskList(response2?.data?.result?.response));
        dispatch(saveRateList(response3?.data?.result?.response));
      } else {
        if (!response1?.data?.result?.response) {
          console.log(response1?.data?.result);
          throw Error(response1?.data?.result);
        } else {
          throw Error(response2?.data?.result);
        }
      }
    } catch (error) {
      console.log('error ', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeam = async () => {
    setLoading(true);
    setError(null);
    try {
      const resTeam = await apiRequest('post', 'get/team', {
        uid: authUser?.uid,
      });

      if (resTeam.data?.result?.response) {
        setTeam(resTeam.data?.result?.response);
      } else {
        if (!resTeam?.data?.result?.response) {
          throw Error(resTeam?.data?.result);
        }
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      projectList?.length == 0 ||
      taskList?.length == 0 ||
      rateList?.length == 0
    ) {
      fetchData();
    }
    user?.user_type !== 'worker' && fetchTeam();
  }, []);

  const [workerId, setWorkerId] = useState(timeSheet?.employee_id || user?.id);
  const [projectId, setProjectId] = useState(timeSheet?.project_id || null);
  const [taskId, setTaskId] = useState(timeSheet?.task_id || null);
  const [rate, setRate] = useState(
    rateList.find(i => i?.id == timeSheet?.rate_id) || null,
  );
  const [startTime, setStartTime] = useState(timeSheet?.start_time || 0);
  const [breakTime, setBreakTime] = useState(timeSheet?.break_time || 0);
  const [endTime, setEndTime] = useState(timeSheet?.stop_time || 0);
  const [loadingReq, setLoadingReq] = useState(false);

  const [timeSheetDate, setTimeSheetDate] = useState(
    new Date(timeSheet?.date || new Date()),
  );
  const [showD, setShowD] = useState(false);

  const onDateChange = (event, selectedValue) => {
    const currentDate = selectedValue || new Date();
    setTimeSheetDate(currentDate);
  };

  const calculateTotalHours = () => {
    if (parseFloat(startTime) < parseFloat(endTime)) {
      return endTime - startTime - breakTime;
    } else if (parseFloat(startTime) > parseFloat(endTime)) {
      return 24 + parseFloat(endTime) - parseFloat(startTime) - breakTime;
    } else {
      return 0;
    }
  };

  const createTimeSheet = async status => {
    if (projectId == null || taskId == null || rate == null) {
      return showMessage('Please fill complete form');
    }
    if (user?.user_type !== 'worker' && workerId == null) {
      return showMessage('Please select an employee');
    }

    setLoadingReq(true);
    try {
      const resp = await apiRequest(
        'post',
        timeSheet?.date ? 'update_timesheet' : 'create_timesheet',
        {
          date: timeSheetDate,
          employee_id: workerId,
          project_id: projectId,
          task_id: taskId,
          rate_name_id: rate?.id,
          start_time: startTime,
          break_time: breakTime,
          stop_time: endTime,
          state: status,
          ...(timeSheet && {id: timeSheet?.id}),
        },
      );

      if (
        resp?.data?.result?.message == 'Record created successfully' ||
        resp?.data?.result?.response == 'Record Updated'
      ) {
        let url =
          workerId == user?.id
            ? 'employee_data'
            : 'get/worker/timesheet';

        const response = await getApi(url, {
          uid: authUser?.uid,
        });
        if (response) {
          dispatch(
            workerId == user?.id
              ? saveTimesheetList(response)
              : saveAllTimesheetList(response),
          );
        }
        navigation.goBack();
        return showMessage(
          `Timesheet ${timeSheet ? 'updated' : 'created'} successfully`,
        );
      }
    } catch (error) {
      return showMessage(error?.message ?? 'Something went wrong!');
    } finally {
      setLoadingReq(false);
    }
  };

  return (
    <>
      {projectList?.length > 0 &&
        taskList?.length > 0 &&
        rateList?.length > 0 && (
          <ScrollView
            nestedScrollEnabled
            keyboardShouldPersistTaps="always"
            contentContainerStyle={{
              padding: 10,
            }}>
            <View>
              {user?.user_type == 'worker' ? (
                <Text style={styles.hardData}>{user?.name}</Text>
              ) : (
                <>
                  {team.length > 0 && (
                    <SearchDropdown
                      data={team}
                      placeholder="Select Employee"
                      inputBoxStyle={styles.inputBoxStyle}
                      searchContainerStyle={styles.searchContainerStyle}
                      searchListContainerStyle={styles.searchListContainerStyle}
                      searchListStyle={styles.searchListStyle}
                      searchListTextStyle={{color: '#444'}}
                      value={team?.find(i => i?.id == workerId)}
                      onPressList={item => {
                        setWorkerId(item?.id);
                      }}
                    />
                  )}
                </>
              )}

              <TouchableOpacity
                onPress={() => setShowD(true)}
                style={styles.searchContainerStyle}>
                <Text style={styles.inputBoxStyle}>
                  {moment(timeSheetDate).format('MMM DD, YYYY')}
                </Text>
                <IIcon
                  name="calendar"
                  size={20}
                  color="#0098d9"
                  style={{position: 'absolute', right: 10}}
                />
              </TouchableOpacity>
              {showD && (
                <RNDateTimePicker
                  value={timeSheetDate}
                  display="default"
                  mode={'date'}
                  onChange={(e, s) => {
                    setShowD(false);
                    onDateChange(e, s);
                  }}
                />
              )}

              <SearchDropdown
                data={projectList}
                placeholder="Select Project"
                inputBoxStyle={styles.inputBoxStyle}
                searchContainerStyle={styles.searchContainerStyle}
                searchListContainerStyle={styles.searchListContainerStyle}
                searchListStyle={styles.searchListStyle}
                searchListTextStyle={{color: '#444'}}
                value={projectList.find(i => i?.id == projectId)}
                onPressList={item => {
                  setProjectId(item?.id);
                }}
              />

              <SearchDropdown
                data={taskList.filter(i => i.project_id == projectId)}
                placeholder="Select Task"
                inputBoxStyle={styles.inputBoxStyle}
                searchContainerStyle={styles.searchContainerStyle}
                searchListContainerStyle={styles.searchListContainerStyle}
                searchListStyle={styles.searchListStyle}
                searchListTextStyle={{color: '#444'}}
                value={taskList.find(i => i?.id == taskId)}
                onPressList={item => {
                  setTaskId(item?.id);
                }}
              />
              <SearchDropdown
                data={rateList}
                placeholder="Select Rate Name"
                inputBoxStyle={styles.inputBoxStyle}
                searchContainerStyle={styles.searchContainerStyle}
                searchListContainerStyle={styles.searchListContainerStyle}
                searchListStyle={styles.searchListStyle}
                searchListTextStyle={{color: '#444'}}
                value={rateList.find(i => i?.id == rate?.id)}
                onPressList={item => {
                  setRate(item);
                }}
              />

              <Text style={[styles.hardData, {marginTop: 10}]}>
                Pay Rate: {user?.basic_pay_rate + (rate?.rate || 0)}{' '}
                {user?.currency_name}
              </Text>

              <View style={{flexDirection: 'row'}}>
                <TimePicker
                  label="Start Time"
                  selectedTime={formatTime(startTime)}
                  onSelect={time => setStartTime(timeToFractionalHours(time))}
                />

                <View style={{paddingHorizontal: 10, flex: 1}}>
                  <TimePicker
                    label="Break Time"
                    selectedTime={formatTime(breakTime)}
                    onSelect={time => setBreakTime(timeToFractionalHours(time))}
                  />
                </View>
                <TimePicker
                  label="End Time"
                  selectedTime={formatTime(endTime)}
                  onSelect={time => setEndTime(timeToFractionalHours(time))}
                />
              </View>

              <View style={{flexDirection: 'row', marginTop: 10}}>
                <Text style={[styles.hardData, {flex: 1}]}>
                  Total Hours: {calculateTotalHours()?.toFixed(2)}
                </Text>

                <Text style={[styles.hardData, {flex: 1, marginLeft: 10}]}>
                  Total Pay:{' '}
                  {(
                    calculateTotalHours() *
                    (user?.basic_pay_rate + (rate?.rate || 0))
                  )?.toFixed(2)}{' '}
                  {user?.currency_name}
                </Text>
              </View>

              <View style={{flexDirection: 'row', marginTop: 10}}>
                <LoaderButton
                  label={timeSheet ? 'Update' : 'Save'}
                  loading={loadingReq}
                  onPress={() => createTimeSheet('1_draft')}
                  style={{flex: 1}}
                />

                {/* <LoaderButton
                    label={'Save and Submit'}
                    loading={loadingReq}
                    onPress={() => createTimeSheet('3_unauthorized')}
                    style={{
                      backgroundColor: COLORS.secondary_lg[1],
                      marginLeft: 10,
                      flex: 1.4,
                    }}
                  /> */}
              </View>
            </View>
          </ScrollView>
        )}
      {loading && <SimpleLoader />}
      {error && <Error error={error} onPress={() => fetchData()} />}
    </>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000080',
    padding: 10,
  },
  modalInnerContainer: {
    width: '100%',
    minHeight: '50%',
    maxHeight: '85%',
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#444444',
  },
  modalCloseBtn: {
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.secondary_lg[0],
    borderRadius: 50,
  },
  heading: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444444',
  },
  hardData: {
    padding: 10,
    backgroundColor: '#e5e5e5',
    color: '#444',
    borderRadius: 10,
  },
  searchContainerStyle: {
    marginTop: 10,
    borderWidth: 1.5,
    height: 40,
    borderRadius: 10,
    flexDirection: 'row',
    overflow: 'hidden',
    alignItems: 'center',
    borderColor: COLORS.secondary_lg[0],
  },
  inputBoxStyle: {
    padding: 5,
    marginTop: -2,
    paddingHorizontal: 10,
    fontSize: 14,
    flex: 1,
    color: '#444444',
  },
  searchListStyle: {
    backgroundColor: '#f1f1f1',
    padding: 5,
  },
  searchListContainerStyle: {
    borderRadius: 10,
    maxHeight: 150,
  },
  btn: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    // marginRight: 10,
  },
});
//make this component available to the app
export default AddEditTimesheet;
