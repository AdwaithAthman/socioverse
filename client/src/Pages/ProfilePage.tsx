// import { useEffect } from "react";
import Profile from "../Components/Profile";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { StoreType } from "../Redux/Store";

const ProfilePage = () => {
  // const user = useSelector((state: StoreType) => state.auth.isAuthenticated);
  // const navigate = useNavigate();
  // useEffect(() => {
  //   if (!user) {
  //     localStorage.setItem("lastLocation", window.location.pathname);
  //     // navigate("/login");
  //   }
  // }, [navigate, user]);
  return (
    <>
      <Profile />
    </>
  );
};

export default ProfilePage;
