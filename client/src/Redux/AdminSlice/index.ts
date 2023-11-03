import { createSlice } from "@reduxjs/toolkit";

interface AdminState {
    accessToken: string | null;
    isAuthenticated: boolean;
}

const initialState: AdminState = {
    accessToken: null,
    isAuthenticated: false,
}

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        setAdminCredentials: (state, action) => {
            const { accessToken }: {accessToken: string} = action.payload;
            state.accessToken = accessToken;
            state.isAuthenticated = true;
        },
        adminLogout: (state) => {
            state.isAuthenticated = false;
            state.accessToken = null;
        },
    },
})

export const { setAdminCredentials, adminLogout } = adminSlice.actions;
export default adminSlice.reducer;