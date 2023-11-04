import { createSlice } from "@reduxjs/toolkit";

interface AdminState {
  accessToken: string | null;
  isAuthenticated: boolean;
  searchTextForComments: string;
  searchTextForReplies: string;
}

const initialState: AdminState = {
  accessToken: null,
  isAuthenticated: false,
  searchTextForComments: "",
  searchTextForReplies: "",
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdminCredentials: (state, action) => {
      const { accessToken }: { accessToken: string } = action.payload;
      state.accessToken = accessToken;
      state.isAuthenticated = true;
    },
    adminLogout: (state) => {
      state.isAuthenticated = false;
      state.accessToken = null;
    },
    setSearchTextForComments: (state, action) => {
      state.searchTextForComments = action.payload;
    },
    setSearchTextForReplies: (state, action) => {
      state.searchTextForReplies = action.payload;
    },
  },
});

export const {
  setAdminCredentials,
  adminLogout,
  setSearchTextForComments,
  setSearchTextForReplies,
} = adminSlice.actions;
export default adminSlice.reducer;
