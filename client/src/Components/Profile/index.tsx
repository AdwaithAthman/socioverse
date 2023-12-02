import { useState } from "react";
import ProfileHeader from "./ProfileHeader";
import ProfileAside from "./ProfileAside";
import PostTabs from "./PostTabs";
import Settings from "./SubSections/Settings";
import EditProfile from "./SubSections/EditProfile";
import { useLocation, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import classnames from "classnames";

//importing types
import { StoreType } from "../../Redux/Store";

const Profile = () => {
  const location = useLocation();
  const userInfo = useSelector((state: StoreType) => state?.auth?.user);
  const { userId } = useParams();
  const [otherUser, setOtherUser] = useState<boolean>(false);
  const ifOtherUser = (boolValue: boolean) => {
    setOtherUser(boolValue);
  };
  return (
    <>
      <div className="flex flex-col justify-evenly items-start lg:mx-5 ">
        <div className=" no-scrollbar overflow-y-hidden w-full lg:h-[26rem] md:h-80 h-64">
          <ProfileHeader
            id={userId ? userId : null}
            ifOtherUser={ifOtherUser}
          />
        </div>
        <div className="flex flex-col md:flex-row items-start w-full gap-5 md:h-[85vh] lg:h-[90vh]">
          <div
            className={classnames(
              "flex flex-col lg:px-10 px-2 w-full md:w-4/12 mt-8 sticky overflow-y-hidden md:h-[85vh]",
              {
                "hidden md:block":
                  location.pathname === `/profile/${userInfo?._id}/settings` ||
                  location.pathname ===
                    `/profile/${userInfo?._id}/edit-profile`,
              }
            )}
          >
            <ProfileAside id={userId ? userId : null} otherUser={otherUser} />
          </div>
          <div className={classnames("flex flex-col lg:pr-10 w-full md:w-8/12 mt-8 sticky overflow-y-auto",
          {"h-[55vh] md:h-[60vh]" : location.pathname === `/profile/${userInfo?._id}/settings`},
          {"h-[95vh] md:h-[90vh]" : location.pathname === `/profile/${userInfo?._id}/edit-profile`},
          {"h-[80vh]" : location.pathname === `/profile/${userInfo?._id}`},
          )}>
            {location.pathname === `/profile/${userInfo?._id}/settings` &&
            userInfo ? (
              <Settings />
            ) : location.pathname ===
                `/profile/${userInfo?._id}/edit-profile` && userInfo ? (
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
