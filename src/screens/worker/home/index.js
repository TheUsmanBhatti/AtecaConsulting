//import liraries
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import {
  Team,
  TimeSheetIcon,
  TimeSheetIcon1,
  expensesIcon,
  expensesIcon1,
  userImage,
} from '../../../assets/images';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  IRangeDateSelectorItem,
  RangeDateSelector,
} from '@phankiet/react-native-week-selector';

import {useDispatch, useSelector} from 'react-redux';
import {COLORS} from '../../../configs/constants/colors';
import LoaderButton from '../../../components/buttons/LoaderButton';
import {removeUserData} from '../../../redux/slices/authSlice';

// create a component
const Home = ({navigation}) => {
  const {user} = useSelector(state => state?.user);
  const dispatch = useDispatch();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View
        style={{
          padding: 10,
          backgroundColor: '#fff',
          borderRadius: 10,
          elevation: 2,
        }}>
        <View style={{flexDirection: 'row'}}>
          <Image
            source={
              user?.image
                ? {uri: `data:image/png;base64,${user?.image}`}
                : require('../../../assets/images/profile1.jpg')
            }
            style={{
              height: 85,
              width: 85,
              borderRadius: 5,
              backgroundColor: '#d5d5d5'
            }}
          />

          <View style={{marginStart: 8}}>
            <Text style={{fontSize: 16, fontWeight: 'bold', color: '#444'}}>
              {user?.name}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Fontisto name="email" size={15} color={COLORS.choice[2]} />
              <Text
                style={{
                  fontSize: 14,
                  marginLeft: 10,
                  marginVertical: 10,
                  color: COLORS.choice[2],
                }}>
                {user?.work_email}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <MaterialCommunityIcons
                name="office-building-marker-outline"
                size={15}
                color={COLORS.choice[2]}
              />
              <Text
                style={{fontSize: 13, marginLeft: 10, color: COLORS.choice[2]}}>
                {user?.department}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.userType}>{user?.user_type}</Text>

        <View
          style={{
            height: 1,
            backgroundColor: COLORS.choice[2],
            marginVertical: 10,
          }}
        />

        <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
          <View
            style={{
              backgroundColor: COLORS.tertiary_lg[1],
              padding: 10,
              borderRadius: 10,
              width: '40%',
            }}>
            <Text
              style={{textAlign: 'center', color: '#fff', fontWeight: 'bold'}}>
              Supervisor
            </Text>
            <Text style={{textAlign: 'center', color: '#fff'}}>
              {user?.supervisor}
            </Text>
          </View>

          <View
            style={{
              backgroundColor: COLORS.tertiary_lg[1],
              padding: 10,
              borderRadius: 10,
              width: '40%',
            }}>
            <Text
              style={{textAlign: 'center', color: '#fff', fontWeight: 'bold'}}>
              Company
            </Text>
            <Text style={{textAlign: 'center', color: '#fff'}}>
              {user?.company}
            </Text>
          </View>
        </View>
      </View>

      <View
        style={{
          flex: 1,
          padding: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
        }}>
        {user?.user_type == 'worker_and_supervisor' ? (
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Timesheet');
              }}
              style={[styles.card, {margin: 10}]}>
              <Image source={TimeSheetIcon} style={styles.imgstyle} />
              <Text style={styles.lblStyle}>My Time Sheet</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.card, {margin: 10}]}
              onPress={() => {
                navigation.navigate('AllTimesheet');
              }}>
              <Image source={TimeSheetIcon1} style={styles.imgstyle} />
              <Text style={styles.lblStyle}>Team Time Sheet</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.card, {margin: 10}]}
              onPress={() => {
                navigation.navigate('Expense');
              }}>
              <Image source={expensesIcon} style={styles.imgstyle} />
              <Text style={styles.lblStyle}>My Expenses</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.card, {margin: 10}]}
              onPress={() => {
                navigation.navigate('AllExpense');
              }}>
              <Image source={expensesIcon1} style={styles.imgstyle} />
              <Text style={styles.lblStyle}>Team Expenses</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.card, {margin: 10}]}
              onPress={() => {
                navigation.navigate('Team');
              }}>
              <Image source={Team} style={styles.imgstyle} />
              <Text style={styles.lblStyle}>Team</Text>
            </TouchableOpacity>
          </View>
        ) : user?.user_type == 'worker' ? (
          <>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Timesheet');
              }}
              style={styles.card}>
              <Image source={TimeSheetIcon} style={styles.imgstyle} />
              <Text style={styles.lblStyle}>Time Sheet</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.card}
              onPress={() => {
                navigation.navigate('Expense');
              }}>
              <Image source={expensesIcon} style={styles.imgstyle} />
              <Text style={styles.lblStyle}>Expenses</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('AllTimesheet');
              }}
              style={styles.card}>
              <Image source={TimeSheetIcon} style={styles.imgstyle} />
              <Text style={styles.lblStyle}>Time Sheet</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.card}
              onPress={() => {
                navigation.navigate('AllExpense');
              }}>
              <Image source={expensesIcon} style={styles.imgstyle} />
              <Text style={styles.lblStyle}>Expenses</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.card, {margin: 10}]}
              onPress={() => {
                navigation.navigate('Team');
              }}>
              <Image source={Team} style={styles.imgstyle} />
              <Text style={styles.lblStyle}>Team</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
      <LoaderButton
        label={'Logout'}
        onPress={() => dispatch(removeUserData())}
      />
    </ScrollView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  userType: {
    color: '#fff',
    backgroundColor: COLORS.tertiary_lg[1],
    padding: 5,
    borderRadius: 5,
    textTransform: 'capitalize',
    marginTop: 10,
  },
  imgstyle: {
    width: '100%',
    height: '70%',
    resizeMode: 'contain',
  },
  lblStyle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#444',
    alignSelf: 'center',
    textAlign: 'center',
  },
  card: {
    width: 130,
    height: 130,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    elevation: 3,
  },
});

//make this component available to the app
export default Home;
