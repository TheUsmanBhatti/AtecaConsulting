import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  taskList: [],
};

export const taskListSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    saveTaskList: (state = initialState, action) => {
      const data = action.payload;
      return {taskList: data};
    },
    removeTaskList: (state = initialState, action) => {
      return {taskList: []};
    },
  },
});

export const {saveTaskList, removeTaskList} = taskListSlice.actions;

export default taskListSlice.reducer;
