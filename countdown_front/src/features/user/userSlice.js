import { createSlice} from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        alertCheck: false,
    },
    reducers: {
        setUser: (state,action) => {
            state.user = action.payload;
        },
        clearUser: (state) => {
            state.user = null;
        },
        setAlertCheck: (state,action) => {
            state.alertCheck = action.payload;
    },
}
});

export const { setUser,clearUser,setAlertCheck}
= userSlice.actions;
export default userSlice.reducer;