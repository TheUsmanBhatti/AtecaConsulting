import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';

import {COLORS} from '../../../configs/constants/colors';

const {width, height} = Dimensions.get('window');

import InputField from '../../../components/input/InputField';

import {useDispatch} from 'react-redux';

import {loginValidation} from '../../../utils/loginValidation';
import {apiRequest} from '../../../utils/api';
import axios from 'axios';
import LoaderButton from '../../../components/buttons/LoaderButton';

import {saveUserData} from '../../../redux/slices/authSlice';
import {BASE_URL} from '../../../configs/constants/baseUrl';
import {getUserData} from '../../../services/user';
import {saveUserProfile} from '../../../redux/slices/userSlice';

const Login = () => {
  const dispatch = useDispatch();

  const [userEmail, setUserEmail] = useState(
    __DEV__ ? 'ub22444@gmail.com' : '',
  );
  const [userPassword, setUserPassword] = useState(__DEV__ ? 'password' : '');

  const [loading, setloading] = useState(false);

  const handleLogin = async () => {
    const email = userEmail.toLowerCase().trim();
    const password = userPassword.trim();

    if (loginValidation(email, password)) {
      setloading(true);

      try {
        const res = await apiRequest('post', 'web/session/authenticate', {
          db: 'Ateca_Consultant',
          login: email,
          password: password,
        });

        if (res?.data?.result) {
          const res1 = await getUserData(res?.data?.result?.uid);
          if (res1?.response) {
            if (
              res1?.response?.user_type == 'worker' ||
              res1?.response?.user_type == 'supervisor' ||
              res1?.response?.user_type == 'worker_and_supervisor'
            ) {
              dispatch(saveUserProfile(res1?.response));
              dispatch(saveUserData({...res?.data?.result, isLoggedIn: true}));
            } else {
              alert('This app is only for supervisors and workers');
            }
          }
        } else {
          console.log(res?.data);
          alert('Username or Password not correct');
        }
      } catch (error) {
        alert(
          error?.response?.data?.message ??
            error?.response?.data ??
            error?.message,
        );
      } finally {
        setloading(false);
      }
    }
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      contentContainerStyle={styles.container}>
      <View>
        <Image
          source={require('../../../assets/images/ateca_logo_2.png')}
          style={styles.logo}
        />

        <Text style={styles.heading}>Login</Text>

        <InputField
          title="Email"
          placeholder="Enter your email"
          onChangeText={setUserEmail}
        />

        <InputField
          title="Password"
          placeholder="Enter your password"
          secureTextEntry
          onChangeText={setUserPassword}
        />

        <LoaderButton
          label={'Login'}
          onPress={handleLogin}
          style={{marginTop: 10}}
          loading={loading}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: height * 0.96,
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
  },
  logo: {
    width: width * 0.5,
    height: width * 0.5,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  heading: {
    // fontFamily: FONTS.msb,
    fontSize: 25,
    color: COLORS.primary,
    alignSelf: 'center',
  },
});

export default Login;
