import { createSlice } from "@reduxjs/toolkit";
import { ChatInterface, MessageInterface } from "../../Types/chat";

interface ChatState {
  selectedChat: ChatInterface | null;
  chats: ChatInterface[];
  notification: MessageInterface[];
  fetchUserChatsAgain: boolean;
}

const initialState: ChatState = {
  selectedChat: null,
  chats: [],
  notification: [],
  fetchUserChatsAgain: false,
};

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
    setNotification: (state, action: { payload: MessageInterface }) => {
      if (
        state.notification.some((message) => message._id === action.payload._id)
      )
        return;
      state.notification = [action.payload, ...state.notification];
    },
    setFetchUserChatsAgain: (state, action) => {
      state.fetchUserChatsAgain = action.payload;
    },
    deleteNotification: (state, action: { payload: MessageInterface }) => {
      if (
        state.notification.some((message) => message._id === action.payload._id)
      ) {
        state.notification = state.notification.filter(
          (message) => message._id !== action.payload._id
        );
      }
    },
  },
});

export const {
  setSelectedChat,
  setChats,
  setNotification,
  setFetchUserChatsAgain,
  deleteNotification,
} = chatSlice.actions;
export default chatSlice.reducer;
