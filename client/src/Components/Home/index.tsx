import HomeLarge from "./HomeLarge";
// import HomeMobile from "./HomeMobile";

//importing types
import { User } from "../../Types/loginUser";
import { Socket } from "socket.io-client";

const Home = ({user, socket} : {user: User, socket: Socket}) => {
  return (
    <>
        {/* <HomeMobile /> */}
        <HomeLarge user={user} socket={socket} />
    </>
  )
}

export default Home