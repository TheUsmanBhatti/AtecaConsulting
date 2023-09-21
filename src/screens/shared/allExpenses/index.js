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
import {getApi} from '../../../services/getApi';
import Error from '../../../components/error/Error';
import Loader from '../../../components/loader/SimpleLoader';
import {COLORS} from '../../../configs/constants/colors';
import {useIsFocused} from '@react-navigation/native';
import {
  removeAllExpenseList,
  saveAllExpenseList,
} from '../../../redux/slices/allExpenseListSlice';

const AllExpense = ({navigation}) => {
  const {authUser} = useSelector(state => state?.auth);
  const {user} = useSelector(state => state?.user);
  const {allExpenseList} = useSelector(state => state?.allExpenseList);
  const dispatch = useDispatch();

  // const [expenseList, setExpenseList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchValue, setSearchValue] = useState('');
  const filteredExpense = allExpenseList?.filter(t => {
    let obj = `${t?.name} ${t?.product} ${t?.state} ${t?.payment_mode}`;
    return obj.toLowerCase().includes(searchValue.toLowerCase());
  });

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
    const filteredData = allExpenseList?.filter(item => {
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

  const getExpense = async () => {
    setError(null);
    try {
      const response = await getApi('get/worker/expense', {
        uid: authUser?.uid,
      });
      // response && setExpenseList(response);
      if (response) {
        dispatch(saveAllExpenseList(response));
      }
      console.log(']]]]]] ', response);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getExpense();

    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

    return () => {
      setError(null);
      setLoading(false);
      dispatch(removeAllExpenseList());
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

        {user?.user_type !== 'supervisor' && (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('AddEditExpense', {
                expense: null,
                name: 'Create Expense',
              })
            }
            disabled={loading}
            style={styles.btnIcon}>
              <Text style={{color: '#fff', fontSize: 16, padding: 10}}>Add New</Text>
            {/* <MIcon name="plus" size={25} color="#fff" /> */}
          </TouchableOpacity>
        )}
      </View>

      {allExpenseList && (
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

          {/* ----------------------------------  List of Expense */}
          <FlatList
            data={!!searchValue ? filteredExpense : filteredData}
            contentContainerStyle={{padding: 10}}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('ExpenseView', {
                    expense: item,
                  });
                }}
                style={{
                  backgroundColor: '#fff',
                  padding: 10,
                  borderRadius: 10,
                }}>
                <Text style={{fontSize: 16, fontWeight: 'bold', color: '#444'}}>
                  {item?.product}
                </Text>
                <Text style={{color: '#444'}}>{item?.name}</Text>

                <Text style={{color: 'gray'}}>Project: {item?.project}</Text>
                <Text style={{color: 'gray'}}>
                  Total: {item?.currency_symbol} {item?.total_amount}{' '}
                  {item?.currency}
                </Text>

                <Text style={styles.timeSheetStatus}>{item?.state}</Text>
              </TouchableOpacity>
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
            getExpense();
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
});

export default AllExpense;
