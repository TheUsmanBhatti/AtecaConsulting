import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    authUser: {}
};


export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        saveUserData: (state = initialState, action) => {
            const data = action.payload
            return {authUser: data}
        },
        removeUserData: (state = initialState, action) => {
            return {authUser: {}}
        }
    }
})

export const { saveUserData, removeUserData } = authSlice.actions

export default authSlice.reducer