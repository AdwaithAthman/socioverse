import React, { useEffect } from "react";
import {
  Navbar,
  Typography,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Input,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  ChevronDownIcon,
  PowerIcon,
} from "@heroicons/react/24/outline";

import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../Redux/AuthSlice";
import classnames from "classnames";

import { HiHome } from "react-icons/hi";
import { TbMessages } from "react-icons/tb";
import { IoNotifications } from "react-icons/io5";
import { useSelector } from "react-redux";
import { StoreType } from "../../Redux/Store";
import { logoutUser } from "../../API/Auth";
import { toast } from "react-toastify";
import common, { TOAST_ACTION } from "../../Constants/common";
import SearchInputDialog from "../Search";
import { enableSearchMode, disableSearchMode } from "../../Redux/PostSlice";
import Notification from "./Notification";

// profile menu component
const profileMenuItems = [
  {
    label: "My Profile",
    icon: UserCircleIcon,
  },
  {
    label: "Sign Out",
    icon: PowerIcon,
  },
];

function ProfileMenu() {
  const userInfo = useSelector((state: StoreType) => state.auth.user);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [notificationPanelOpen, setNotificationPanelOpen] =
    React.useState<boolean>(false);

  const dispatch = useDispatch();

  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    if (userInfo && userInfo.isBlock) {
      userIsBlocked();
    }
  }, [userInfo]);

  const userIsBlocked = async () => {
    toast.dismiss();
    toast.error("You are blocked by admin!", TOAST_ACTION);
    const response = await logoutUser();
    if (response.status === "success") {
      dispatch(logout());
      navigate("/login");
    }
  };

  const navBarIcons = [
    {
      id: "home",
      icon: <HiHome />,
      name: "Home",
    },
    {
      id: "message",
      icon: <TbMessages />,
      name: "Message",
    },
    {
      id: "notification",
      icon: <IoNotifications />,
      name: "Notification",
    },
  ];

  const section = useParams().section || "";
  const location = useLocation();
  const navigate = useNavigate();

  const handleProfileMenuItems = async (label: string) => {
    if (label === "My Profile") {
      navigate(`/profile/${userInfo?._id}`);
    }
    if (label === "Sign Out") {
      try {
        const response = logoutUser();
        await toast.promise(
          response,
          {
            pending: "Logging out...",
            success: "Logged out successfully",
            error: "Error logging out",
          },
          TOAST_ACTION
        );
        dispatch(logout());
        navigate("/login");
      } catch (err) {
        console.log(err);
      }
    }
    return closeMenu;
  };

  const handleNotificationPanel = () => {
    setNotificationPanelOpen((prev) => !prev);
  };

  return (
    <div className="flex gap-3 md:gap-4 lg:gap-6 items-center">
      <div className=" lg:flex lg:gap-6">
        {navBarIcons.map((item) => (
          <div key={item.id}>
            {item.id === "notification" ? (
                <Notification
                handleNotificationPanel={handleNotificationPanel}
                notificationPanelOpen={notificationPanelOpen}
              />
            ) : (
              <Link to={`/${item.id}`} >
                <div
                  className={classnames(
                    "hidden lg:flex justify-center items-center w-8 h-8 rounded-full hover:bg-blue-gray-100 transition duration-100 ease-in-out group",
                    { "bg-blue-gray-100": section == item.id },
                    { "bg-black": section != item.id }
                  )}
                >
                  <div
                    className={classnames(
                      "text-2xl transition duration-100 ease-in-out group-hover:text-socioverse-500",
                      { "text-socioverse-500": section === item.id },
                      { "text-blue-gray-500": section != item.id }
                    )}
                  >
                    {item.icon}
                  </div>
                </div>
              </Link>
            )}
          </div>
        ))}
      </div>
      <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
        <MenuHandler>
          <Button
            variant="text"
            color="blue-gray"
            className={classnames(
              "flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto transition duration-100 ease-in-out  hover:bg-gray-300 active:bg-gray-100 focus:bg-gray-100",
              { "bg-gray-300": location.pathname === "/profile" }
            )}
          >
            <Avatar
              variant="circular"
              size="sm"
              alt="user dp"
              className="border border-blue-500 p-0.5"
              src={userInfo?.dp ? userInfo.dp : common.DEFAULT_IMG}
            />
            <ChevronDownIcon
              strokeWidth={2.5}
              className={`h-3 w-3 transition-transform  hover:bg-gray-300 active:bg-gray-100 focus:bg-gray-100 ${
                isMenuOpen ? "rotate-180" : ""
              }`}
            />
          </Button>
        </MenuHandler>
        <MenuList className="p-1">
          {profileMenuItems.map(({ label, icon }, key) => {
            const isLastItem = key === profileMenuItems.length - 1;
            return (
              <MenuItem
                key={label}
                onClick={() => handleProfileMenuItems(label)}
                className={`flex items-center gap-2 rounded ${
                  isLastItem
                    ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                    : ""
                }`}
              >
                {React.createElement(icon, {
                  className: `h-4 w-4 ${isLastItem ? "text-red-500" : ""}`,
                  strokeWidth: 2,
                })}
                <Typography
                  as="span"
                  variant="small"
                  className="font-normal"
                  color={isLastItem ? "red" : "inherit"}
                >
                  {label}
                </Typography>
              </MenuItem>
            );
          })}
        </MenuList>
      </Menu>
    </div>
  );
}

export function InputWithButton() {
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [showSearchDialog, setShowSearchDialog] =
    React.useState<boolean>(false);
  const hashtagSearchOn: boolean =
    useSelector((state: StoreType) => state.post.hashtagSearchOn) || false;

  const dispatch = useDispatch();
  const onChange = (e: { target: { value: React.SetStateAction<string> } }) =>
    setSearchQuery(e.target.value);

  useEffect(() => {
    if (hashtagSearchOn) {
      setShowSearchDialog(true);
    }
  }, [hashtagSearchOn]);

  const handleSearchDialog = () => {
    setShowSearchDialog((prev) => !prev);
  };

  useEffect(() => {
    if (showSearchDialog) {
      dispatch(enableSearchMode());
    } else {
      dispatch(disableSearchMode());
    }
  }, [dispatch, showSearchDialog]);

  return (
    <>
      <div className="hidden relative lg:flex w-full max-w-[24rem]">
        <Input
          type="text"
          label="#SocioverseExplore"
          value={searchQuery}
          onChange={onChange}
          className={classnames(
            "pr-20",
            { "text-white": searchQuery },
            { "bg-blue-gray-500": !searchQuery }
          )}
          containerProps={{
            className: "min-w-0",
          }}
          onClick={handleSearchDialog}
        />
        <Button
          size="sm"
          disabled={!searchQuery}
          className={classnames(
            "!absolute right-1 top-1 rounded",
            { "bg-socioverse-500": searchQuery },
            { "bg-blue-gray-700": !searchQuery }
          )}
        >
          Search
        </Button>
      </div>
      <SearchInputDialog
        handleSearchDialog={handleSearchDialog}
        showSearchDialog={showSearchDialog}
        hashtagSearchOn={hashtagSearchOn}
      />
    </>
  );
}

export function ComplexNavbar() {
  return (
    <Navbar className="fixed top-0 z-50 mx-auto mb-2 lg:mt-2 p-2 lg:rounded-full lg:pl-6 max-w-[1480px] bg-black bg-opacity-100">
      <div className="relative mx-auto flex items-center text-blue-gray-900 justify-between">
        <Typography className="mr-4 ml-2 cursor-pointer font-extrabold py-1.5 text-white text-2xl font-logo">
          SOCIOVERSE
        </Typography>
        <InputWithButton />
        <div className="flex items-center justify-between">
          <ProfileMenu />
        </div>
      </div>
    </Navbar>
  );
}

export default ComplexNavbar;
