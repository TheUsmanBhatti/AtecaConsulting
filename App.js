import React, {Component} from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';

import {Provider} from 'react-redux';
import {store} from './src/redux/store';

import persistStore from 'redux-persist/es/persistStore';
import {PersistGate} from 'redux-persist/integration/react';
let persistor = persistStore(store);

import MainStack from './src/navigations/MainStack';
import FlashMessage from 'react-native-flash-message';

import {StatusBar} from 'react-native';
import {COLORS} from './src/configs/constants/colors';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <StatusBar backgroundColor={COLORS.secondary_lg[1]} />
        <SafeAreaView style={styles.container}>
          <MainStack />
        </SafeAreaView>
        <FlashMessage position="top" style={{borderRadius: 10, margin: 10, backgroundColor: COLORS.secondary}} />
      </PersistGate>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;
