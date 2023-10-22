import { createSlice } from "@reduxjs/toolkit";

interface PostState {
  description?: string | null;
  image?: string[] | null;
  hashtags?: string[] | null;
  createdAt: string | null;
  updatedAt: string | null;
  hashtagSearch?: string | null;
  hashtagSearchOn?: boolean;
  searchModeOn?: boolean;
}

const initialState: PostState = {
  description: null,
  image: null,
  hashtags: null,
  createdAt: null,
  updatedAt: null,
  hashtagSearch: null,
  hashtagSearchOn: false,
  searchModeOn: false,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setPost: (state, action) => {
      state.description = action.payload.description;
      state.image = action.payload.image;
      state.hashtags = action.payload.hashtags;
      state.createdAt = action.payload.createdAt;
      state.updatedAt = action.payload.updatedAt;
    },
    setTempPostImage: (state, action) => {
      state.image = state.image
        ? [...state.image, action.payload]
        : [action.payload];
    },
    deleteTempPostImage: (state, action) => {
      state.image = state.image?.filter((image) => image !== action.payload);
    },
    resetTempPostImage: (state) => {
      state.image = null;
    },
    setHashtagSearch: (state, action) => {
      state.hashtagSearch = action.payload;
      state.hashtagSearchOn = true;
    },
    resetHashtagSearch: (state) => {
      state.hashtagSearch = null;
      state.hashtagSearchOn = false;
    },
    enableSearchMode: (state) => {
      state.searchModeOn = true;
    },
    disableSearchMode: (state) => {
      state.searchModeOn = false;
    }
  },
});

export const {
  setPost,
  setTempPostImage,
  deleteTempPostImage,
  resetTempPostImage,
  setHashtagSearch,
  resetHashtagSearch,
  enableSearchMode,
  disableSearchMode
} = postSlice.actions;
export default postSlice.reducer;
