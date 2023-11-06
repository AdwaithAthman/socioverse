import { useState } from "react";
import ProfileHeader from "./ProfileHeader";
import ProfileAside from "./ProfileAside";
import PostTabs from "./PostTabs";
import Settings from "./SubSections/Settings";
import EditProfile from "./SubSections/EditProfile";
import { useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

//importing types
import { StoreType } from "../../Redux/Store";

const Profile = () => {
  const location = useLocation();
  const userInfo = useSelector((state: StoreType) => state?.auth?.user);
  const { userId } = useParams()
  const [otherUser, setOtherUser] = useState<boolean>(false);
  const ifOtherUser = (boolValue: boolean) => {
    setOtherUser(boolValue);
  }
  return (
    <>
      <div className="flex flex-col justify-evenly items-start lg:mx-5 h-[100vh]">
        <div className=" no-scrollbar overflow-y-hidden h-[45vh] w-full">
        <ProfileHeader id={userId? userId : null} ifOtherUser={ifOtherUser}/>
        </div>
        <div className="flex items-start w-full gap-5 h-[55vh] ">
          <div className="flex flex-col px-10 w-4/12 mt-14 sticky overflow-y-hidden h-[85vh]"> 
            <ProfileAside id={userId? userId : null} otherUser={otherUser} />
          </div>
          <div className="flex flex-col pr-10 w-8/12 mt-14 sticky overflow-y-auto h-[90vh]">
            {( location.pathname === `/profile/${userInfo?._id}/settings` && userInfo )? (
              <Settings />
            ) : ( location.pathname === `/profile/${userInfo?._id}/edit-profile` && userInfo ) ? (
              <div className="mb-10 overflow-y-hidden">
              <EditProfile />
              </div>
            ) : (
              <div className="overflow-y-hidden no-scrollbar">
              <PostTabs userId={userId} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
//mt-28