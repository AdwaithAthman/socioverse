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
  Popover,
  PopoverHandler,
  PopoverContent,
} from "@material-tailwind/react";
import {
  CubeTransparentIcon,
  UserCircleIcon,
  CodeBracketSquareIcon,
  ChevronDownIcon,
  PowerIcon,
} from "@heroicons/react/24/outline";

import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../Redux/AuthSlice";
import classnames from "classnames";

import { HiHome } from "react-icons/hi";
import { TbMessages } from "react-icons/tb";
import { IoNotifications } from "react-icons/io5";
import { useSelector } from "react-redux";
import { StoreType } from "../Redux/Store";
import { logoutUser } from "../API/Auth";
import { toast } from "react-toastify";
import common, { TOAST_ACTION } from "../Constants/common";
import SearchInputDialog from "./Search";
import { enableSearchMode, disableSearchMode } from "../Redux/PostSlice";
import { deleteNotification, setSelectedChat } from "../Redux/ChatSlice";
import { MessageInterface } from "../Types/chat";

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
  const notification = useSelector(
    (state: StoreType) => state.chat.notification
  );
  console.log("notification from header: ", notification);
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
      console.log("signout is called");
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

  const handleNotificationOnClick = (notif: MessageInterface) => {
    dispatch(setSelectedChat(notif.chat));
    dispatch(deleteNotification(notif));
    closeNotificationPanel();
    if (location.pathname !== "/message") {
      navigate("/message");
    }
  };

  const closeNotificationPanel = () => {
    const bellButton = document.getElementById("bell-button");
    if (bellButton) {
      bellButton.click();
    }
  };

  return (
    <div className="flex gap-6 items-center">
      <div className="hidden lg:flex gap-6">
        {navBarIcons.map((item) => (
          <div key={item.id}>
            {item.id === "notification" ? (
              <Popover
                animate={{
                  mount: { scale: 1, y: 0 },
                  unmount: { scale: 0, y: 50 },
                }}
                placement="bottom-end"
                offset={20}
                dismiss={{ enabled: false }}
              >
                <PopoverHandler onClick={handleNotificationPanel}>
                  <div className="relative">
                    <div
                      className={classnames(
                        "flex justify-center items-center w-8 h-8 rounded-full hover:bg-blue-gray-100 transition duration-100 ease-in-out group hover:cursor-pointer",
                        { "bg-blue-gray-100": notificationPanelOpen },
                        { "bg-black": !notificationPanelOpen }
                      )}
                      id="bell-button"
                    >
                      <div
                        className={classnames(
                          "text-2xl transition duration-100 ease-in-out group-hover:text-socioverse-500",
                          { "text-socioverse-500": notificationPanelOpen },
                          { "text-blue-gray-500": !notificationPanelOpen }
                        )}
                      >
                        {item.icon}
                      </div>
                    </div>
                    {notification.length > 0 && (
                      <span
                        className="absolute bottom-5 left-5 inline-flex items-center justify-center px-1 py-1 mr-2 text-[0.5rem]
                         font-bold leading-none text-white bg-red-600 rounded-full"
                      >
                        {notification.length}
                      </span>
                    )}
                  </div>
                </PopoverHandler>
                <PopoverContent
                  className="z-[999] w-[26rem] max-h-[34rem] overflow-y-scroll 
                overflow-x-hidden no-scrollbar p-0"
                >
                  <div className="p-6 bg-black bg-opacity-20 flex flex-col gap-5 justify-center">
                    {notification.length > 0 ? (
                      notification.map((notif) => (
                        <div
                          className="w-full rounded-lg border shadow-lg bg-white hover:scale-95 cursor-pointer 
                          transition duration-100 ease-in-out group"
                          key={notif._id}
                          onClick={() => handleNotificationOnClick(notif)}
                        >
                          <div className=" flex flex-col justify-center w-full h-fit rounded-t-lg p-3 gap-3">
                            <div className="s) => setLimt-3 flex items-center space-x-2 ">
                              <img
                                className="inline-block h-12 w-12 rounded-full 
                                group-hover:scale-95 group-hover:p-[0.15rem] group-hover:ring group-hover:ring-blue-gray-500"
                                src={
                                  notif.chat.isGroupChat
                                    ? common.DEFAULT_IMG
                                    : notif.sender.dp
                                    ? notif.sender.dp
                                    : common.DEFAULT_IMG
                                }
                                alt="dp"
                              />
                              <span className="flex flex-col">
                                <span
                                  className={classnames(
                                    "text-[14px] group-hover:font-bold group-hover:scale-95"
                                  )}
                                >
                                  {notif.chat.isGroupChat
                                    ? notif.chat.chatName
                                    : notif.sender.name}
                                </span>
                                <span
                                  className={classnames(
                                    "text-[11px] group-hover:font-bold group-hover:scale-95"
                                  )}
                                >
                                  New unread message!
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="w-full rounded-lg border shadow-lg bg-white">
                        <div className=" flex flex-col justify-center w-full h-fit rounded-t-lg p-3 gap-3">
                          No new message.
                        </div>
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <Link to={`/${item.id}`}>
                <div
                  className={classnames(
                    "flex justify-center items-center w-8 h-8 rounded-full hover:bg-blue-gray-100 transition duration-100 ease-in-out group",
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
                    {/* <h5 className="text-sm">{item.name}</h5> */}
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
              src={
                userInfo?.dp
                  ? userInfo.dp
                  : common.DEFAULT_IMG
              }
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

// nav list menu
// const navListMenuItems = [
//   {
//     title: "@material-tailwind/html",
//     description:
//       "Learn how to use @material-tailwind/html, packed with rich components and widgets.",
//   },
//   {
//     title: "@material-tailwind/react",
//     description:
//       "Learn how to use @material-tailwind/react, packed with rich components for React.",
//   },
//   {
//     title: "Material Tailwind PRO",
//     description:
//       "A complete set of UI Elements for building faster websites in less time.",
//   },
// ];

// function NavListMenu() {
//   const [isMenuOpen, setIsMenuOpen] = React.useState(false);

//   const renderItems = navListMenuItems.map(({ title, description }) => (
//     <a href="#" key={title}>
//       <MenuItem>
//         <Typography variant="h6" color="blue-gray" className="mb-1">
//           {title}
//         </Typography>
//         <Typography variant="small" color="gray" className="font-normal">
//           {description}
//         </Typography>
//       </MenuItem>
//     </a>
//   ));

//   return (
//     <React.Fragment>
//       <Menu allowHover open={isMenuOpen} handler={setIsMenuOpen}>
//         <MenuHandler>
//           <Typography as="a" href="#" variant="small" className="font-normal">
//             <MenuItem className="hidden items-center gap-2 text-blue-gray-900 lg:flex lg:rounded-full">
//               <Square3Stack3DIcon className="h-[18px] w-[18px]" /> Pages{" "}
//               <ChevronDownIcon
//                 strokeWidth={2}
//                 className={`h-3 w-3 transition-transform ${
//                   isMenuOpen ? "rotate-180" : ""
//                 }`}
//               />
//             </MenuItem>
//           </Typography>
//         </MenuHandler>
//         <MenuList className="hidden w-[36rem] grid-cols-7 gap-3 overflow-visible lg:grid">
//           <Card
//             color="blue"
//             shadow={false}
//             variant="gradient"
//             className="col-span-3 grid h-full w-full place-items-center rounded-md"
//           >
//             <RocketLaunchIcon strokeWidth={1} className="h-28 w-28" />
//           </Card>
//           <ul className="col-span-4 flex w-full flex-col gap-1">
//             {renderItems}
//           </ul>
//         </MenuList>
//       </Menu>
//       <MenuItem className="flex items-center gap-2 text-blue-gray-900 lg:hidden">
//         <Square3Stack3DIcon className="h-[18px] w-[18px]" /> Pages{" "}
//       </MenuItem>
//       <ul className="ml-6 flex w-full flex-col gap-1 lg:hidden">
//         {renderItems}
//       </ul>
//     </React.Fragment>
//   );
// }

// nav list component
const navListItems = [
  {
    label: "Account",
    icon: UserCircleIcon,
  },
  {
    label: "Blocks",
    icon: CubeTransparentIcon,
  },
  {
    label: "Docs",
    icon: CodeBracketSquareIcon,
  },
];

// function NavList() {
//   return (
//     <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center">
//       {/* <NavListMenu /> */}
//       {navListItems.map(({ label, icon }, key) => (
//         <Typography
//           key={label}
//           as="a"
//           href="#"
//           variant="small"
//           color="blue-gray"
//           className="font-normal"
//         >
//           <MenuItem className="flex items-center gap-2 lg:rounded-full">
//             {React.createElement(icon, { className: "h-[18px] w-[18px]" })}{" "}
//             {label}
//           </MenuItem>
//         </Typography>
//       ))}
//     </ul>
//   );
// }

export function ComplexNavbar() {
  const [isNavOpen, setIsNavOpen] = React.useState(false);

  const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur);

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setIsNavOpen(false)
    );
  }, []);

  return (
    <Navbar className="fixed top-0 z-50 mx-auto mb-2 lg:mt-2 p-2 lg:rounded-full lg:pl-6 max-w-[1480px] bg-black bg-opacity-100">
      <div className="relative mx-auto flex items-center text-blue-gray-900 justify-between">
        <Typography className="mr-4 ml-2 cursor-pointer font-extrabold py-1.5 text-white text-2xl font-logo">
          SOCIOVERSE
        </Typography>
        {/* <div className="absolute top-2/4 left-2/4 hidden -translate-x-2/4 -translate-y-2/4 lg:block"> */}
        {/* <NavList /> */}
        {/* </div> */}
        <InputWithButton />
        <div className="flex items-center justify-between">
          <IoNotifications className="lg:hidden h-6 w-6 mr-2 md:mr-3 text-blue-gray-500" />
          <ProfileMenu />
        </div>
        {/* <IconButton
          size="sm"
          color="blue-gray"
          variant="text"
          onClick={toggleIsNavOpen}
          className="ml-auto mr-2 lg:hidden"
        >
        </IconButton> */}
      </div>
      {/* <Collapse open={isNavOpen} className="overflow-scroll">
         <NavList />
       </Collapse>  */}
    </Navbar>
  );
}

export default ComplexNavbar;
