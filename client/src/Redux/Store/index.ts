import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../AuthSlice";
import photoReducer from "../PhotoSlice";
import postReducer from "../PostSlice";
import adminReducer from "../AdminSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        photo: photoReducer,
        post: postReducer,
        admin: adminReducer,
    }
})

export default store;
export type StoreType = ReturnType<typeof store.getState>;