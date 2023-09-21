import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  rateList: [],
};

export const rateListSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    saveRateList: (state = initialState, action) => {
      const data = action.payload;
      return {rateList: data};
    },
    removeRateList: (state = initialState, action) => {
      return {rateList: []};
    },
  },
});

export const {saveRateList, removeRateList} = rateListSlice.actions;

export default rateListSlice.reducer;
