import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: false,
  userData: {},
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.status = true;
      state.userData = action.payload;
    },
    logout: (state, action) => {
      state.status = false;
      state.userData = {};
    },
    upgradeUser:(state,action)=>{
      state.userData.role = action.payload.newRole
      state.userData.roleData = action.payload.roleData
    }
  },
});


export const {login,logout,upgradeUser} = authSlice.actions
export default authSlice.reducer
