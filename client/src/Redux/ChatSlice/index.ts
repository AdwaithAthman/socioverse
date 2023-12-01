import { createSlice } from "@reduxjs/toolkit";
import { ChatInterface, MessageInterface } from "../../Types/chat";

interface ChatState {
  selectedChat: ChatInterface | null;
  chats: ChatInterface[];
  notification: MessageInterface[];
  fetchUserChatsAgain: boolean;
  openVideoCall: boolean;
  joinedVideoRoom: boolean;
}

const initialState: ChatState = {
  selectedChat: null,
  chats: [],
  notification: [],
  fetchUserChatsAgain: false,
  openVideoCall: false,
  joinedVideoRoom: false,
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
    initializeNotification: (state, action) => {
      state.notification = action.payload;
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
    setOpenVideoCall: (state, action: { payload: boolean}) => {
      state.openVideoCall = action.payload;
    },
    setJoinVideoRoom: (state, action: { payload: boolean}) => {
      state.joinedVideoRoom = action.payload;
    }
  },
  });

export const {
  setSelectedChat,
  setChats,
  setNotification,
  setFetchUserChatsAgain,
  deleteNotification,
  initializeNotification,
  setOpenVideoCall,
  setJoinVideoRoom,
} = chatSlice.actions;
export default chatSlice.reducer;
