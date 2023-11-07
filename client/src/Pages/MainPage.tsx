import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";
import HomePage from "./HomePage";
import ChatPage from "./ChatPage";

const MainPage = () => {
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
          {section === "message" && <ChatPage />}
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default MainPage;
