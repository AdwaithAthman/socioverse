import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import store from "../Redux/Store";
import { getUserInfo } from "../API/Profile";
import { useDispatch } from "react-redux";
import { setCredentials } from "../Redux/AuthSlice";

interface TokenCheckMiddlewareProps {
  children: React.JSX.Element;
}

const TokenCheckMiddleware = ({
  children
}: TokenCheckMiddlewareProps): React.JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const { accessToken } = store.getState().auth;
    if (accessToken) {
      navigate("/home");
    }
    else{

      const fetchUser = async () => {
        const { user } = await getUserInfo();
        dispatch(setCredentials({ user }));
        return user
      }

      fetchUser().then((user) => (
        user ? navigate("/home") : ""
      ))
    }
  }, [dispatch, navigate]);

  return children;
};

export default TokenCheckMiddleware;
