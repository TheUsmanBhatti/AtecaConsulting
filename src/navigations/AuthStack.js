//import liraries
import React, { } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

import { Login } from '../screens';

const AuthStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name='Login' component={Login} />
        </Stack.Navigator>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});


export default AuthStack;