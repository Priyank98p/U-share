// client/src/redux/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

// 🚀 Async Thunk: Handles the API request for logging in
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/users/login", credentials);
      // Assuming your backend returns { data: { user: {...} } }
      return response.data.data.user;
    } catch (error) {
      // Passes the backend error message to the UI
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to log in",
      );
    }
  },
);
 
const storedUser = localStorage.getItem("u-shareUser")
const parsedUser = storedUser ? JSON.parse(storedUser) : null;
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: parsedUser,
    isAuthenticated: !!parsedUser,
    isLoading: false,
    error: null,
  },
  reducers: {
    // We can use this later for the logout button
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("u-shareUser")
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload; // Saves the user data to global state
        localStorage.setItem("u-shareUser", JSON.stringify(action.payload));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
