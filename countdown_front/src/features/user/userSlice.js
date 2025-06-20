
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    alertCheck: false, 
    alertCheckPoint: "",  
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.username = action.payload.username;
      state.adminYn = action.payload.adminYn; // 이 줄 필요
    },
    clearUser: (state) => {
      state.user = null;
      state.alertCheck = false;
      state.alertCheckPoint = "";
    },
    setAlertCheck: (state, action) => {
      state.alertCheck = action.payload; 
    },
    setAlertCheckPoint: (state, action) => {
      state.alertCheckPoint = action.payload; 
    }
  }
});

export const { setUser, clearUser, setAlertCheck, setAlertCheckPoint } = userSlice.actions;
export default userSlice.reducer;
