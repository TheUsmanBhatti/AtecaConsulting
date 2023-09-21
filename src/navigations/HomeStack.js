import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  AddEditExpense,
  AddEditTimesheet,
  Expense,
  ExpenseView,
  SpvHome,
  SpvProfile,
  TimeSheet,
  TimeSheetView,
  WkrHome,
  WkrProfile,
} from '../screens';
import {useSelector} from 'react-redux';
import {COLORS} from '../configs/constants/colors';
import AllTimeSheet from '../screens/shared/allTimesheet';
import AllExpense from '../screens/shared/allExpenses';
import Team from '../screens/shared/team';

const Stack = createNativeStackNavigator();

const HomeStack = () => {
  const {user} = useSelector(state => state?.user);

  const headerStyle = title => {
    return {
      headerShown: true,
      title: title,
      headerStyle: {
        backgroundColor: COLORS.secondary_lg[1],
      },
      headerTintColor: '#fff',
    };
  };

  return (
    <Stack.Navigator>
      {/* {user?.user_type == 'worker' && ( */}
      <>
        <Stack.Screen
          name="WorkerHome"
          component={WkrHome}
          options={headerStyle('Dashboard')}
        />
        <Stack.Screen
          name="WorkerProfile"
          component={WkrProfile}
          options={headerStyle('Profile')}
        />
      </>
      {/* // )} */}
      {/* {user?.user_type == 'supervisor' && (
        <>
          <Stack.Screen
            name="SupervisorHome"
            component={SpvHome}
            options={headerStyle('Home')}
          />
          <Stack.Screen
            name="SupervisorProfile"
            component={SpvProfile}
            options={headerStyle('Profile')}
          />
        </>
      )} */}
      <Stack.Screen
        name="Timesheet"
        component={TimeSheet}
        options={headerStyle('Timesheet')}
      />
      <Stack.Screen
        name="TimeSheetView"
        component={TimeSheetView}
        options={headerStyle('Timesheet Detail')}
      />
      <Stack.Screen
        name="AddEditTimesheet"
        component={AddEditTimesheet}
        options={({route}) => headerStyle(route.params.name)}
      />
      <Stack.Screen
        name="Expense"
        component={Expense}
        options={headerStyle('Expense')}
      />
      <Stack.Screen
        name="ExpenseView"
        component={ExpenseView}
        options={headerStyle('Expense Detail')}
      />
      <Stack.Screen
        name="AddEditExpense"
        component={AddEditExpense}
        options={({route}) => headerStyle(route.params.name)}
      />
      <Stack.Screen
        name="AllTimesheet"
        component={AllTimeSheet}
        options={headerStyle('Team Timesheet')}
      />
      <Stack.Screen
        name="AllExpense"
        component={AllExpense}
        options={headerStyle('Team Expense')}
      />
      <Stack.Screen
        name="Team"
        component={Team}
        options={headerStyle('Team')}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default HomeStack;
