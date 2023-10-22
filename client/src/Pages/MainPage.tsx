import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";
import HomePage from "./HomePage";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { StoreType } from "../Redux/Store";

const MainPage = () => {
  const user = useSelector((state: StoreType) => state.auth.isAuthenticated);
  const navigate = useNavigate();
  useEffect(() => {
    if(!user){
        navigate("/login");
    }
  },[navigate, user])
  const section = useParams().section || "home";
  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.6, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          {section === "home" && <HomePage />}
          {section === "message" && <div>Message</div>}
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default MainPage;
