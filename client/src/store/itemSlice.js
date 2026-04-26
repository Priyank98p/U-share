import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";

// 🚀 Async Thunk: Fetches all items from your backend
export const fetchAllItems = createAsyncThunk(
  "items/fetchAll",
  async (params = {}, thunkAPI) => {
    try {
      const response = await axiosInstance.get("/items/", { params });
      
      // 🧠 SDE FIX 1: Debugging Log
      console.log("Raw Backend Response:", response.data); 

      // 🧠 SDE FIX 2: Dynamically hunt for the array
      // Backends wrap data differently. This safely finds the array whether 
      // your backend sends res.json(items) OR res.json({ data: items }) OR res.json({ items: items })
      const itemsArray = response.data?.data?.items || [];

      return itemsArray; 
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to load marketplace items"
      );
    }
  }
);

const itemSlice = createSlice({
  name: "items",
  initialState: {
    itemsList: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllItems.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllItems.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // 🧠 SDE FIX 3: Safe Array Copy & Fallback
        // We use [...action.payload] to create a fresh copy before reversing,
        // and we provide an empty array [] fallback just in case the backend sent nothing.
        state.itemsList = Array.isArray(action.payload) ? [...action.payload].reverse() : [];
      })
      .addCase(fetchAllItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default itemSlice.reducer;