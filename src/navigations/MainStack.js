import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import HomeStack from './HomeStack';
import AuthStack from './AuthStack';
import {useDispatch, useSelector} from 'react-redux';
import {Splash} from '../screens';
import {getUserData} from '../services/user';
import {saveUserProfile} from '../redux/slices/userSlice';
import {showMessage} from 'react-native-flash-message';

const MainStack = () => {
  const {authUser} = useSelector(state => state?.auth);
  const {user} = useSelector(state => state?.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await getUserData(authUser?.uid);
        if (res?.response) {
          dispatch(saveUserProfile(res?.response));
        }
      } catch (error) {
        showMessage(error?.message);
      }
    };

    getUser();
  }, []);

  if (Object.keys(user).length === 0 && authUser?.isLoggedIn === true) {
    return <Splash />;
  }

  return (
    <NavigationContainer>
      {authUser?.isLoggedIn ? <HomeStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default MainStack;
