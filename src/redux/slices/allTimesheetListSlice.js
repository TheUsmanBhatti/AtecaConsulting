import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  allTimesheetList: [],
};

export const allTimesheetListSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    saveAllTimesheetList: (state = initialState, action) => {
      const data = action.payload;
      return {allTimesheetList: data};
    },
    removeAllTimesheetList: (state = initialState, action) => {
      return {allTimesheetList: []};
    },
  },
});

export const {saveAllTimesheetList, removeAllTimesheetList} =
  allTimesheetListSlice.actions;

export default allTimesheetListSlice.reducer;
