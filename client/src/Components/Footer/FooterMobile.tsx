import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { HiHome } from "react-icons/hi";
import { BiSearchAlt } from "react-icons/bi";
import { TbMessages } from "react-icons/tb";
import { TbLogout } from "react-icons/tb";

const FooterMobile = () => {
    const [allTypes] = useState([
        {
          id: "home",
          icon: <HiHome />,
          name: "Home",
        },
        {
          id: "search",
          icon: <BiSearchAlt />,
          name: "Search",
        },
        {
          id: "message",
          icon: <TbMessages />,
          name: "Message",
        },
        {
          id: "logout",
          icon: <TbLogout />,
          name: "Logout",
        },
      ]);
    
      const { section } = useParams();
      return (
        <div className="lg:hidden bg-white shadow-lg px-3 fixed bottom-0 z-10 w-full flex items-center justify-between md:justify-evenly border ">
          {allTypes.map((item) => (
            <Link to={`/${item.id}`} key={item.id} className="w-1/4">
              <div
                className={
                  section === item.id
                    ? "flex flex-col items-center text-xl text-socioverse-400"
                    : "flex flex-col items-center text-xl text-gray-500"
                }
              >
                <div
                  className={
                    section === item.id
                      ? "flex justify-center items-center flex-col w-full py-3 border-t-2 border-socioverse-400"
                      : "flex justify-center items-center flex-col py-3 border-t-2 border-white"
                  }
                >
                  {item.icon}
                  <h5 className="text-sm">{item.name}</h5>
                </div>
              </div>
            </Link>
          ))}
        </div>
      );
}

export default FooterMobile