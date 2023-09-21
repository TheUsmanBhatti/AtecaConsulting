import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  expenseList: [],
};

export const expenseListSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    saveExpenseList: (state = initialState, action) => {
      const data = action.payload;
      return {expenseList: data};
    },
    removeExpenseList: (state = initialState, action) => {
      return {expenseList: []};
    },
  },
});

export const {saveExpenseList, removeExpenseList} = expenseListSlice.actions;

export default expenseListSlice.reducer;
