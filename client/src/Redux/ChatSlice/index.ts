import { createSlice } from "@reduxjs/toolkit";
import { ChatInterface } from "../../Types/chat";

interface ChatState {
    selectedChat: ChatInterface | null,
    chats: ChatInterface[],
}

const initialState: ChatState = {
    selectedChat: null,
    chats: [],
}

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setSelectedChat: (state, action) => {
            state.selectedChat = action.payload;
        },
        setChats: (state, action) => {
            state.chats = action.payload;
        },
    }
});

export const { setSelectedChat, setChats } = chatSlice.actions;
export default chatSlice.reducer;