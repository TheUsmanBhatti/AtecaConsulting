import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  user: {},
};

export const userSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    saveUserProfile: (state = initialState, action) => {
      const data = action.payload;
      return {user: data};
    },
    removeUserProfile: (state = initialState, action) => {
      return {user: {}};
    },
  },
});

export const {saveUserProfile, removeUserProfile} = userSlice.actions;

export default userSlice.reducer;
