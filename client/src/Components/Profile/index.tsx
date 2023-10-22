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
      <div className="flex flex-col justify-evenly items-start lg:mx-5">
        <ProfileHeader id={userId? userId : null} ifOtherUser={ifOtherUser}/>
        <div className="flex items-start w-full gap-5">
          <div className="flex flex-col px-10 w-4/12 mt-28">
            <ProfileAside id={userId? userId : null} otherUser={otherUser} />
          </div>
          <div className="flex flex-col pr-10 w-8/12 mt-28">
            {( location.pathname === `/profile/${userInfo?._id}/settings` && userInfo )? (
              <Settings />
            ) : ( location.pathname === `/profile/${userInfo?._id}/edit-profile` && userInfo ) ? (
              <EditProfile />
            ) : (
              <PostTabs userId={userId} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
