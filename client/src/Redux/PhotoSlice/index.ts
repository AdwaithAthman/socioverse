import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    coverPhoto: null,
    profilePhoto: null
}

const photoSlice = createSlice({
    name: 'image',
    initialState,
    reducers: {
        setCoverPhoto: (state, action) => {
            state.coverPhoto = action.payload;
        },
        setProfilePhoto: (state, action) => {
            state.profilePhoto = action.payload;
        }
    }
})

export const { setCoverPhoto, setProfilePhoto } = photoSlice.actions;
export default photoSlice.reducer;