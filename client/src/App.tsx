import { Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
//import { useNavigate, useLocation } from "react-router-dom";

//imports from Components
import ComplexNavbar from "./Components/Header";
import Footer from "./Components/Footer";

const App = () => {
  // const location = useLocation();
  // const navigate = useNavigate();
  // useEffect(() => {
  //   if(location.pathname === "/") {
  //     navigate("/home");
  //   }
  // },[]);
  // const token = localStorage.getItem("token");
  // (!token)? navigate("/login") : navigate("/home");
  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.6, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="flex flex-col items-center"
        >
          <ComplexNavbar />
          <div className="my-5 lg:pt-20 pt-16 pb-16 lg:pb-0 max-w-[1480px] w-full mx-auto px-4 lg:px-10 no-scollbar">
          <Outlet />
          </div>
          <Footer />
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default App;
