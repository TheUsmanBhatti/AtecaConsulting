import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  value: 0,
};

export const countSlice = createSlice({
  name: 'count',
  initialState,
  reducers: {
    incCount: state => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1;
    },
    decCount: state => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
});

export const {incCount, decCount} = countSlice.actions;

export default countSlice.reducer;
