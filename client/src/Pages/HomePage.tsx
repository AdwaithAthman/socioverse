// import { motion, AnimatePresence } from "framer-motion";
// import { Card, Typography } from "@material-tailwind/react";
import { useEffect } from "react";
import Home from "../Components/Home";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { StoreType } from "../Redux/Store";

//importing types
import { User } from "../Types/loginUser";
import { Socket } from "socket.io-client";

const HomePage = ({ socket }: { socket: Socket }) => {
  const user = useSelector((state: StoreType) => state.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user.isAuthenticated) {
      navigate("/login");
    }
  }, [navigate, user]);
  return (
    <>
      <Home user={user.user as User} socket={socket} />
    </>
  );
};

export default HomePage;
