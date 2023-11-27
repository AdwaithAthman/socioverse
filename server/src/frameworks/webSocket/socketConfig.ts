import { Server } from "socket.io";
import { UserDataInterface } from "../../types/userInterface";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { RecievedMessageInterface } from "../../types/messageInterface";

const socketConfig = (io: Server<DefaultEventsMap>) => {
  io.on("connection", (socket) => {
    console.log("connected to socket.io");

    socket.on("setup", (userData: UserDataInterface) => {
      if (userData) {
        socket.join(userData._id as string);
        socket.emit("connected");
      }
    });

    socket.on("join room", (room: string) => {
      socket.join(room);
      console.log("user joined the room " + room);
    });

    socket.on("typing", (room: string) => {
      socket.broadcast.to(room).emit("typing", room);
    });

    socket.on("stop typing", (room: string) => {
      socket.broadcast.to(room).emit("stop typing");
    });

    socket.on("new message", (newMessageRecieved: RecievedMessageInterface) => {
      const chat = newMessageRecieved.chat;
      if (!chat.users) return console.log("chat.users is not defined");
      chat.users.forEach((userId) => {
        if (userId === newMessageRecieved.sender._id) return;
        socket.in(userId).emit("message recieved", newMessageRecieved);
      });
    });

    socket.off("setup", (userData: UserDataInterface) => {
      socket.leave(userData._id as string);
    });

    socket.on("group updation", (newChat: any) => {
      newChat.users.forEach((userId: string) => {
        if(userId === newChat.groupAdmin._id) return;
        socket.in(userId).emit("group updated");
      });
    });

    socket.on('join-video-room', (roomId: string, userId: string) => {
      console.log("user joined the roomId " + roomId)
      console.log("user joined the video room " + userId)
      socket.join(roomId)
      socket.to(roomId).emit('user-connected', userId)
  
      socket.on('disconnect', () => {
        socket.to(roomId).emit('user-disconnected', userId)
      })
    })

    
  });

};

export default socketConfig;
