import { createSlice } from "@reduxjs/toolkit";
import { ChatInterface, MessageInterface } from "../../Types/chat";

interface ChatState {
    selectedChat: ChatInterface | null,
    chats: ChatInterface[],
    notification: MessageInterface[]
}

const initialState: ChatState = {
    selectedChat: null,
    chats: [],
    notification: []
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
        setNotification: (state, action) => {
            state.notification = action.payload;
        }
    }
});

export const { setSelectedChat, setChats, setNotification } = chatSlice.actions;
export default chatSlice.reducer;