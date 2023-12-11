import HomeLarge from "./HomeLarge";

//importing types
import { User } from "../../Types/loginUser";
import { Socket } from "socket.io-client";

const Home = ({user, socket} : {user: User, socket: Socket}) => {
  return (
    <>
        <HomeLarge user={user} socket={socket} />
    </>
  )
}

export default Home