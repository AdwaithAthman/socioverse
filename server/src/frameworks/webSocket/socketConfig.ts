import { Server } from "socket.io";
import { UserDataInterface } from "../../types/userInterface";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { RecievedMessageInterface } from "../../types/messageInterface";

const socketConfig = (io: Server<DefaultEventsMap>) => {

    io.on('connection', (socket) => {
        console.log("connected to socket.io");

        socket.on('setup', (userData: UserDataInterface) => {
            socket.join(userData._id as string)
            socket.emit('connected')
        });

        socket.on('join room', (room: string) => {
            socket.join(room);
            console.log("user joined the room " + room);
        })

        socket.on('new message', (newMessageRecieved: RecievedMessageInterface) => {
            const chat = newMessageRecieved.chat
            if(!chat.users) return console.log("chat.users is not defined");
            chat.users.forEach(userId => {
                if(userId === newMessageRecieved.sender._id) return;
                socket.in(userId).emit('message recieved', newMessageRecieved)
            })
        })

    })
}

export default socketConfig;