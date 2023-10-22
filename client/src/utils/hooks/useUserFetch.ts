import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../../Redux/AuthSlice";
import store from "../../Redux/Store";
import { getUserInfo } from "../../API/Profile";

//importing types
import { StoreType } from "../../Redux/Store";
import { User } from "../../Types/loginUser";

export const useUserFetch = () => {
    const userData = useSelector((store: StoreType) => store?.auth?.user);
    const [userInfo, setUserInfo] = useState<User|null>(null);
    const dispatch = useDispatch();
  
    useEffect(() => {
      
      const fetchUser = async () => {
        if (!userData) {
          const user = await userInfo();
          setUserInfo(user);
      }
      else{
        setUserInfo(userData);
      }
    }
  
      const userInfo = async () => {
        const { user } = await getUserInfo();
        const { accessToken } = store.getState().auth;
        dispatch(setCredentials({ user, accessToken }));
        return user;
      };
  
      fetchUser();
    }, [dispatch, userData]);

    return userInfo;
}