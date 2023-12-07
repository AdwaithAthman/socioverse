import { useDispatch, useSelector } from "react-redux";
import People from "../Components/People"
import store, { StoreType } from "../Redux/Store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserInfo } from "../API/Profile";
import { isAxiosError } from "axios";
import { AxiosErrorData } from "../Types/axiosErrorData";
import { setCredentials } from "../Redux/AuthSlice";
import { Socket } from "socket.io-client";

const PeoplePage = ({socket} : {socket: Socket}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state: StoreType) => state.auth.user);

    useEffect(() => {
        if (!user) {
          const userData = userInfo();
          if (!userData) {
            navigate("/error");
          }
        }
      }, [user]);

      const userInfo = async () => {
        try {
          const { user } = await getUserInfo();
          const { accessToken } = store.getState().auth;
          dispatch(setCredentials({ user, accessToken }));
          return user;
        } catch (error) {
          if (isAxiosError(error)) {
            const err: AxiosErrorData = error as AxiosErrorData;
            if (
              err.response &&
              err.response.status >= 400 &&
              err.response.status <= 500
            ) {
              navigate("/login");
            }
          }
        }
      };
      
  return (
    <div className="lg:hidden block">
        <People socket={socket} />
    </div>
  )
}

export default PeoplePage