import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../AuthSlice";
import photoReducer from "../PhotoSlice";
import postReducer from "../PostSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        photo: photoReducer,
        post: postReducer,
    }
})

export default store;
export type StoreType = ReturnType<typeof store.getState>;