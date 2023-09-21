import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  timesheetList: [],
};

export const timesheetListSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    saveTimesheetList: (state = initialState, action) => {
      const data = action.payload;
      return {timesheetList: data};
    },
    removeTimesheetList: (state = initialState, action) => {
      return {timesheetList: []};
    },
  },
});

export const {saveTimesheetList, removeTimesheetList} = timesheetListSlice.actions;

export default timesheetListSlice.reducer;
