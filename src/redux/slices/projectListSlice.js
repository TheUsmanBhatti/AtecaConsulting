import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  projectList: [],
};

export const projectListSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    saveProjectList: (state = initialState, action) => {
      const data = action.payload;
      return {projectList: data};
    },
    removeProjectList: (state = initialState, action) => {
      return {projectList: []};
    },
  },
});

export const {saveProjectList, removeProjectList} = projectListSlice.actions;

export default projectListSlice.reducer;
