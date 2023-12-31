import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";

import { Link, Outlet, useNavigate } from "react-router-dom";
import { FaUsersGear } from "react-icons/fa6";
import { FaPowerOff } from "react-icons/fa";
import { BsFillPostcardFill } from "react-icons/bs";
import { HiPresentationChartBar } from "react-icons/hi";
import { BiSolidCommentError } from "react-icons/bi";
import { ToastContainer} from "react-toastify";
import { StoreType } from "../Redux/Store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { adminLogout } from "../Redux/AdminSlice";
import { logoutAdmin } from "../API/Admin";


const AdminPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAdminAuthenticated: boolean = useSelector(
    (store: StoreType) => store.admin.isAuthenticated
  );

  useEffect(() => {
    if (!isAdminAuthenticated) {
      navigate("/admin-login");
    }
  }, [isAdminAuthenticated, navigate]);

  const handleLogout = async () => {
    const response = await logoutAdmin();
    if (response.status === "success") {
      dispatch(adminLogout());
      navigate("/admin-login");
    }
  };
  return (
    <>
      <ToastContainer />
      <div className="flex items-between overflow-y-hidden">
        <Card className="h-[calc(100vh)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5">
          <div className="mb-2 p-4">
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
            <ListItem onClick={handleLogout}>
              <ListItemPrefix>
                <FaPowerOff className="h-4 w-4" />
              </ListItemPrefix>
              Log Out
            </ListItem>
          </List>
        </Card>
        <div className="my-5 lg:pt-20 pt-16 pb-16 lg:pb-0 max-w-[1480px] w-full mx-auto px-4 lg:px-20">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AdminPage;
