import HomeLarge from "./HomeLarge";
import HomeMobile from "./HomeMobile";

//importing types
import { User } from "../../Types/loginUser";

const Home = ({user} : {user: User}) => {
  return (
    <>
        <HomeMobile />
        <HomeLarge user={user} />
    </>
  )
}

export default Home