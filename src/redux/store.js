import AsyncStorage from '@react-native-async-storage/async-storage';
import {combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';

import persistReducer from 'redux-persist/es/persistReducer';

import authReducer from './slices/authSlice';
import countReducer from './slices/countSlice';
import userReducer from './slices/userSlice';
import projectListReducer from './slices/projectListSlice';
import taskListReducer from './slices/taskListSlice';
import rateListReducer from './slices/rateListSlice';
import expenseListReducer from './slices/expenseListSlice';
import timesheetListReducer from './slices/timesheetListSlice';
import allExpenseListReducer from './slices/allExpenseListSlice';
import allTimesheetListReducer from './slices/allTimesheetListSlice';

let persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth'],
};

const allReducers = combineReducers({
  auth: authReducer,
  count: countReducer,
  user: userReducer,
  projects: projectListReducer,
  rates: rateListReducer,
  tasks: taskListReducer,
  expenseList: expenseListReducer,
  timesheetList: timesheetListReducer,
  allExpenseList: allExpenseListReducer,
  allTimesheetList: allTimesheetListReducer,
});

let persistedReducer = persistReducer(persistConfig, allReducers);

export const store = configureStore(
  {
    reducer: persistedReducer,
    middleware: getDefaultMiddleware({
      serializableCheck: false,
    }),
  },
  {},
  applyMiddleware(thunk),
);
