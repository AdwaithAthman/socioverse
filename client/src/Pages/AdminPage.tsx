import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Chip,
} from "@material-tailwind/react";

import { AnimatePresence, motion } from "framer-motion";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { FaUsersGear } from "react-icons/fa6";
import { MdReport } from "react-icons/md";
import { FaPowerOff } from "react-icons/fa";
import { BsFillPostcardFill } from "react-icons/bs";
import { HiPresentationChartBar } from "react-icons/hi";
import { BiSolidCommentError } from "react-icons/bi";
import { ToastContainer } from "react-toastify";
import { StoreType } from "../Redux/Store";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const AdminPage = () => {
  const navigate = useNavigate();
  const isAdminAuthenticated: boolean = useSelector((store: StoreType) => store.admin.isAuthenticated);
  useEffect(() => {
    if (!isAdminAuthenticated) {
     navigate("/admin-login");
    }
  }, [isAdminAuthenticated, navigate])
  return (
    <>
      <ToastContainer />
      <div className="flex items-between overflow-y-hidden">
        <Card className="h-[calc(100vh)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5">
          <div className="mb-2 p-4">
            {/* <Typography variant="h5" color="blue-gray">
            Sidebar
          </Typography> */}
            <h1 className="lg:text-4xl text-3xl font-extrabold font-logo text-center text-socioverse-400 inline pl-3 lg:pl-0">
              SOCIOVERSE
            </h1>
            <Typography variant="h5" color="blue-gray">
              Admin Panel
            </Typography>
          </div>
          <List>
            <Link to="/admin/dashboard">
              <ListItem>
                <ListItemPrefix>
                  <HiPresentationChartBar className="h-5 w-5" />
                </ListItemPrefix>
                Dashboard
              </ListItem>
            </Link>
            <Link to="/admin/users-list">
              <ListItem>
                <ListItemPrefix>
                  <FaUsersGear className="h-5 w-5" />
                </ListItemPrefix>
                Users List
              </ListItem>
            </Link>
            <Link to="/admin/posts-list">
              <ListItem>
                <ListItemPrefix>
                  <BsFillPostcardFill className="h-5 w-5" />
                </ListItemPrefix>
                Posts List
              </ListItem>
            </Link>
            <Link to="/admin/reported-list/comments">
              <ListItem>
                <ListItemPrefix>
                  <BiSolidCommentError className="h-5 w-5" />
                </ListItemPrefix>
                Reports List
              </ListItem>
            </Link>
            <ListItem>
              <ListItemPrefix>
                <FaPowerOff className="h-4 w-4" />
              </ListItemPrefix>
              Log Out
            </ListItem>
          </List>
        </Card>
        {/* <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="flex items-center justify-center lg:h-full w-full"
          > */}
            <div className="my-5 lg:pt-20 pt-16 pb-16 lg:pb-0 max-w-[1480px] w-full mx-auto px-4 lg:px-20">
              <Outlet />
            </div>
          {/* </motion.div>
        </AnimatePresence> */}
      </div>
    </>
  );
};

export default AdminPage;
