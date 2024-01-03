import { createSlice } from "@reduxjs/toolkit";

//types
import { User } from "../../Types/loginUser";

interface AuthState {
    user: User | null; 
    accessToken: string | null;
    isAuthenticated?: boolean;
  }

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    accessToken: null,
  };
  

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { user, accessToken }: AuthState = action.payload;
            state.user = user;
            state.accessToken = accessToken
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.accessToken = null; 
        },
        removeFollower: (state, action) => {
           state.user?.following?.splice(state.user?.following?.indexOf(action.payload), 1);
        },
        addFollower: (state, action) => {
            if (!state.user?.following?.includes(action.payload)) {
                state.user?.following?.push(action.payload);
            }
        },
        updateUsername: (state, action) => {
            state.user && (state.user.username = action.payload);
        },

    },
})

export const { setCredentials, logout, removeFollower, addFollower, updateUsername } = authSlice.actions;
export default authSlice.reducer;


