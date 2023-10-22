import { useEffect, useState } from "react";
import { HiOutlineMail, HiPhone } from "react-icons/hi";
import { useSelector } from "react-redux";
import { getOtherUserInfo } from "../../API/Profile";

//importing types
import { StoreType } from "../../Redux/Store";
import { User } from "../../Types/loginUser";

const ProfileAside = ({id, otherUser} : {id: string | null, otherUser: boolean}) => {

  const profileInfo = useSelector((store: StoreType) => store?.auth?.user);
  const [otherUserInfo, setOtherUserInfo] = useState<User | null>(null);

  useEffect(() => {
    if(otherUser && id){
      getOtherUserInfo(id).then((res) => {
        setOtherUserInfo(res.otherUser);
      })
    }
  }, [id, otherUser])
 
  return (
    <>
      <div className="flex flex-col w-full h-fit justify-start shadow-lg rounded-lg px-5 py-5 border">
        <h2 className=" text-xl font-bold text-black inline">Bio</h2>
        <p className="text-sm font-light text-gray-600 mt-2">
          {(otherUser && otherUserInfo) ? otherUserInfo?.bio :  profileInfo?.bio }
        </p>
      </div>
      <div className="flex flex-col w-full h-fit justify-start shadow-lg rounded-lg px-5 py-5 border mt-8">
        <h2 className=" text-xl font-bold text-black inline mb-3">Contact</h2>
        <div className="flex flex-col items-start justify-start gap-4">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-gray-100/50 flex items-center justify-center">
              <HiOutlineMail className="text-xl text-socioverse-500" />
              </div>
              <p className="text-sm font-light text-gray-600">{(otherUser && otherUserInfo) ? otherUserInfo?.email :  profileInfo?.email }</p>
            </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-gray-100/50 flex items-center justify-center">
              <HiPhone className="text-xl text-socioverse-500" />
              </div>
              <p className="text-sm font-light text-gray-600">{(otherUser && otherUserInfo) ? otherUserInfo?.phoneNumber :  profileInfo?.phoneNumber }</p>
            </div>
          </div>
      </div>
      <div className="flex flex-col w-full h-fit justify-start shadow-lg rounded-lg px-5 py-5 gap-5 border mt-8">
        <h2 className=" text-xl font-bold text-black inline">
          Interactions
        </h2>
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-center justify-center gap-1">
              <h1 className="text-2xl font-bold text-socioverse-500">3</h1>
            <p className="text-sm font-light text-black">Total Posts</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-1">
              <h1 className="text-2xl font-bold text-socioverse-500">25</h1>
            <p className="text-sm font-light text-black">Total Likes</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-1">
              <h1 className="text-2xl font-bold text-socioverse-500">10</h1>
            <p className="text-sm font-light text-black">Total Comments</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileAside;
