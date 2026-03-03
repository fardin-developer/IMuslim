import { createSlice } from "@reduxjs/toolkit";

export const alertSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
  },
  reducers: {
    showLoading: (state) => {
      state.loading = true;
    },
    hideLoading: (state) => {
      state.loading = false;
    },
  },
});

export const { showLoading, hideLoading } = alertSlice.actions;

// export default userSlice.reducer;
