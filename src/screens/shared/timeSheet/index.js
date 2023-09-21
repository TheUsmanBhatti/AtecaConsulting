import React, {Component, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  FlatList,
  Modal,
  ScrollView,
  LogBox,
} from 'react-native';

import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import IIcon from 'react-native-vector-icons/Ionicons';

import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import moment from 'moment';
import TimeSheetCard from '../../../components/cards/TimeSheetCard';
import {getApi} from '../../../services/getApi';
import Error from '../../../components/error/Error';
import Loader from '../../../components/loader/SimpleLoader';
import {COLORS} from '../../../configs/constants/colors';
import {
  removeTimesheetList,
  saveTimesheetList,
} from '../../../redux/slices/timesheetListSlice';

const TimeSheet = ({navigation}) => {
  const {authUser} = useSelector(state => state?.auth);
  const {user} = useSelector(state => state?.user);
  const {timesheetList} = useSelector(state => state?.timesheetList);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchValue, setSearchValue] = useState('');
  const filteredTimeSheet = timesheetList?.filter(t =>
    t?.project?.toLowerCase().includes(searchValue.toLowerCase()),
  );

  const [currentWeek, setCurrentWeek] = useState(moment());
  const getWeekStartDate = () => {
    return moment(currentWeek).startOf('isoWeek');
  };

  const getWeekEndDate = () => {
    return moment(currentWeek).endOf('isoWeek');
  };

  const filterDataByWeek = () => {
    const startDate = getWeekStartDate();
    const endDate = getWeekEndDate();
    const filteredData = timesheetList?.filter(item => {
      const itemDate = moment(item.date);
      return itemDate.isBetween(startDate, endDate, null, '[]');
    });
    return filteredData;
  };

  const handleForwardClick = () => {
    setCurrentWeek(moment(currentWeek).add(1, 'weeks'));
  };

  const handleBackwardClick = () => {
    setCurrentWeek(moment(currentWeek).subtract(1, 'weeks'));
  };

  const filteredData = filterDataByWeek();

  const getTimeSheet = async () => {
    setError(null);
    try {
      let url =
        user?.user_type == 'worker' ? 'employee_data' : 'get/worker/timesheet';
      const response = await getApi('employee_data', {
        uid: authUser?.uid,
      });
      if (response) {
        dispatch(saveTimesheetList(response));
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTimeSheet();

    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

    return () => {
      setError(null);
      setLoading(false);
      dispatch(removeTimesheetList());
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* ====================================  Header  ==================================== */}
      <View style={styles.headerContainer}>
        <View style={styles.searchBar}>
          <TextInput
            value={searchValue}
            onChangeText={setSearchValue}
            placeholder="Search"
            placeholderTextColor={'gray'}
            style={styles.listSearch}
          />

          {searchValue ? (
            <TouchableOpacity
              onPress={() => setSearchValue('')}
              style={{position: 'absolute', right: 10}}>
              <IIcon name="close" size={20} color="#444444" />
            </TouchableOpacity>
          ) : (
            <IIcon
              name="search"
              size={20}
              color="#444444"
              style={{position: 'absolute', right: 10}}
            />
          )}
        </View>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('AddEditTimesheet', {
              timeSheet: null,
              name: 'Create Timesheet',
            })
          }
          disabled={loading}
          style={styles.btnIcon}>
          <Text style={{color: '#fff', fontSize: 16, padding: 10}}>Add New</Text>
          {/* <MIcon name="plus" size={25} color="#fff" /> */}
        </TouchableOpacity>
      </View>

      {timesheetList && (
        <>
          {/* =================================  Week Filter Container  ============================== */}
          {!searchValue && (
            <View style={styles.weekFilterCont}>
              <TouchableOpacity onPress={handleBackwardClick}>
                <IIcon
                  name="chevron-back-outline"
                  size={30}
                  color={COLORS.secondary_lg[0]}
                />
              </TouchableOpacity>

              <Text style={styles.weekText}>
                {moment(getWeekStartDate()).format('MMM DD')} -{' '}
                {moment(getWeekEndDate()).format('MMM DD')}
              </Text>

              <TouchableOpacity onPress={handleForwardClick}>
                <IIcon
                  name="chevron-forward-outline"
                  size={30}
                  color={COLORS.secondary_lg[0]}
                />
              </TouchableOpacity>
            </View>
          )}

          {/* ----------------------------------  List of Timesheet */}
          <FlatList
            data={!!searchValue ? filteredTimeSheet : filteredData}
            contentContainerStyle={{padding: 10}}
            renderItem={({item}) => (
              <TimeSheetCard
                onPress={() => {
                  navigation.navigate('TimeSheetView', {
                    timeSheet: item,
                  });
                }}
                status={item?.state}
                projectTitle={item?.project}
                taskCode={item?.task_code}
                hours={item?.unit_amount}
                date={item?.date}
              />
            )}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={<View style={{height: 10}} />}
          />
        </>
      )}

      {loading && <Loader />}
      {error && (
        <Error
          error={error}
          onPress={() => {
            setLoading(true);
            getTimeSheet();
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.secondary_lg[1],
  },
  searchBar: {
    flex: 1,
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listSearch: {
    backgroundColor: '#fff',
    borderRadius: 10,
    flex: 1,
    fontSize: 16,
    color: '#444444',
    padding: 5,
    paddingHorizontal: 10,
  },
  btnIcon: {
    // width: 43,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weekFilterCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    alignItems: 'center',
  },
  weekText: {
    fontSize: 18,
    color: COLORS.secondary_lg[0],
    fontWeight: '600',
  },
});

export default TimeSheet;
