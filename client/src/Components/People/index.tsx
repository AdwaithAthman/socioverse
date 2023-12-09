import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  useSelect,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { BiSolidMessageDetail } from "react-icons/bi";
import { MdVideoCall } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { fetchOtherUserChat } from "../../API/Chat";
import { useDispatch, useSelector } from "react-redux";
import { setOpenVideoCall, setSelectedChat } from "../../Redux/ChatSlice";
import { StoreType } from "../../Redux/Store";
import { Socket } from "socket.io-client";
import { ReactComponent as NoDataAvailableSvg } from "../../assets/NoDataAvailable.svg";
import { User } from "../../Types/loginUser";
import common from "../../Constants/common";
import { getFollowers, getFollowing, getSuggestions } from "../../API/User";

const People = ({ socket }: { socket: Socket }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: StoreType) => state.auth.user);
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [suggested, setSuggested] = useState<User[]>([]);

  useEffect(() => {
    getFollowing().then((data) => {
      setFollowing(data.following);
    });
    getFollowers().then((data) => {
      setFollowers(data.followers);
    });
    getSuggestions().then((data) => {
      setSuggested(data.suggestions);
    });
  }, []);

  const data = [
    {
      label: "Followers",
      value: "followers",
      desc: followers.length > 0 ? followers : "No followers yet...",
    },
    {
      label: "Following",
      value: "following",
      desc: following.length > 0 ? following : "No following yet...",
    },

    {
      label: "Suggested",
      value: "suggested",
      desc: suggested.length > 0 ? suggested : "No suggestions available...",
    },
  ];

  const handleMessageClick = async (userId: string) => {
    const response = await fetchOtherUserChat(userId);
    dispatch(setSelectedChat(response.chat));
    if (location.pathname !== "/message") {
      navigate("/message");
    }
  };

  const handleVideoCall = async (userId: string) => {
    const response = await fetchOtherUserChat(userId);
    dispatch(setSelectedChat(response.chat));
    if (socket) {
      socket.emit("call-user", user, response.chat);
    }
    dispatch(setOpenVideoCall(true));
    if (location.pathname !== "/message") {
      navigate("/message");
    }
  };

  return (
    <Tabs id="custom-animation" value="followers">
      <TabsHeader className="sticky">
        {data.map(({ label, value }) => (
          <Tab key={value} value={value}>
            {label}
          </Tab>
        ))}
      </TabsHeader>
      <TabsBody
        animate={{
          initial: { y: 250 },
          mount: { y: 0 },
          unmount: { y: 250 },
        }}
        className="overflow-y-auto h-[75vh] md:no-scrollbar"
      >
          {data.map(({ value, desc }) => (
            <TabPanel key={value} value={value}>
              {typeof desc === "string" ? (
                <div className="flex flex-col items-center justify-center mt-4">
                    <div className="w-80 mx-auto">
                      <NoDataAvailableSvg />
                    </div>
                    <h1>{desc}</h1>
                </div>
              ) : (
                <div className="flex flex-col gap-4 max-w-[24rem] mx-auto mt-4">
                  {
                    desc.map((userProfile) => (
                      <div
                    className="flex bg-gray-100 rounded-lg p-2 items-center justify-between transition duration-100 ease-in-out shadow-md "
                    key={userProfile._id}
                  >
                    <Link to={`/profile/${userProfile._id}`}>
                      <div className="mt-3 flex items-center space-x-2">
                        <img
                          className="inline-block h-10 w-10 rounded-full"
                          src={userProfile.dp ? userProfile.dp : common.DEFAULT_IMG}
                          alt="user dp"
                        />
                        <span className="flex flex-col">
                          <span className="text-[14px] font-medium text-gray-900">
                            {userProfile?.name}
                          </span>
                          <span className="text-[11px] font-medium text-gray-500">
                            {userProfile.username
                              ? `@${userProfile.username}`
                              : "@ -"}
                          </span>
                        </span>
                      </div>
                    </Link>
                    <div className="flex items-center gap-2">
                      <div
                        className="flex justify-center items-center w-8 h-8 transition duration-300 ease-in-out bg-blue-gray-100 rounded-full cursor-pointer border-2 border-blue-gray-500 hover:border-green-500 hover:bg-white hover:border-3 group"
                        onClick={() =>
                          handleMessageClick(userProfile._id as string)
                        }
                      >
                        <BiSolidMessageDetail className="text-md text-socioverse-500 group-hover:text-green-500" />
                      </div>
                      <div
                        className="flex justify-center items-center w-8 h-8 transition duration-300 ease-in-out bg-blue-gray-100 rounded-full cursor-pointer border-2 border-blue-gray-500 hover:border-green-500 hover:bg-white hover:border-3 group"
                        onClick={() => handleVideoCall(userProfile._id as string)}
                      >
                        <MdVideoCall className="text-xl text-socioverse-500  group-hover:text-green-500" />
                      </div>
                    </div>
                  </div>
                    )
                    )
                  }
                </div>
              )}
            </TabPanel>
          ))}
      </TabsBody>
    </Tabs>
  );
};

export default People;

