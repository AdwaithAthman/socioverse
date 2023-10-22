import { createSlice } from "@reduxjs/toolkit";
// import { loginUser, loginUsingGoogle, refreshAccessToken } from "../../API/Auth";
// import END_POINTS from "../../Constants/endpoints";

//types
import { User } from "../../Types/loginUser";
// import { LoginUserInterface } from "../../Types/loginUser";
// import { GoogleLoginInterface } from "../../Types/loginUser";

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
            state.user?.following?.push(action.payload);
        },
    },
})

export const { setCredentials, logout, removeFollower, addFollower } = authSlice.actions;
export default authSlice.reducer;


// Async thunks
// export const login = createAsyncThunk(
//     END_POINTS.LOGIN_USER,
//     async (credentials: LoginUserInterface) => {
//       const response = await loginUser(credentials);
//       return {
//         accessToken: response.accessToken,
//         refreshToken: response.refreshToken  
//       };
//     }
//   );

//   export const loginWithGoogle = createAsyncThunk(
//     END_POINTS.LOGIN_GOOGLE,
//     async (credentials: GoogleLoginInterface ) => {
//       const response = await loginUsingGoogle(credentials);
//       return {
//         accessToken: response.accessToken,
//         refreshToken: response.refreshToken
//       };
//     }  
//   );

//   export const refresh = createAsyncThunk(
//     END_POINTS.REFRESH_TOKEN,
//     async (refreshToken: string) => {
//       const accessToken = await refreshAccessToken(refreshToken);
//       return { accessToken }; 
//     }
//   );
  
  

