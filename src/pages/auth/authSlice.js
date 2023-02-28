import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AuthService from "../../services/AuthService";

export const authState = {
  user: {},
  isLogin: false,
  role: "NORMAL",
  accessToken: "",
};
///////////////////ACTIONS OF REDUX///////////////////////
export const signup = createAsyncThunk("auth/signup", async (user) => {
  delete user.confirm_password;
  const response = await AuthService.register(user);
  return response;
});

export const login = createAsyncThunk("auth/login", async (user) => {
  const response = await AuthService.login(user);
  return response;
});
///////////////////////////////////////////////////////////

export const authSlice = createSlice({
  name: "auth",
  initialState: authState,
  reducers: {
    setUser: (state, action) => {
      console.log("Log ~ Running in set User action.payload", action.payload);
      state.user = action.payload.user;
      state.role = action.payload.user.role.name;
      state.isLogin = true;
      state.accessToken = action.payload.accessToken;
      return state;
    },
    removeUser: (state) => {
      state.user = {};
      state.role = "NORMAL";
      state.accessToken = "";
      state.isLogin = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, async (state, action) => {})
      .addCase(signup.fulfilled, (action) => {});
  },
});

export const { setUser, removeUser } = authSlice.actions;
export const selectIsLogin = (state) => state.auth.isLogin;
export const selectRole = (state) => state.auth.role;
export default authSlice.reducer;
