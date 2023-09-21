import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  allExpenseList: [],
};

export const allExpenseListSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    saveAllExpenseList: (state = initialState, action) => {
      const data = action.payload;
      return {allExpenseList: data};
    },
    removeAllExpenseList: (state = initialState, action) => {
      return {allExpenseList: []};
    },
  },
});

export const {saveAllExpenseList, removeAllExpenseList} =
  allExpenseListSlice.actions;

export default allExpenseListSlice.reducer;
