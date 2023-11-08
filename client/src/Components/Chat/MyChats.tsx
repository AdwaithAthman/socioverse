import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setChats } from "../../Redux/ChatSlice";
import { TOAST_ACTION } from "../../Constants/common";
import { toast } from "react-toastify";
import { fetchChats } from "../../API/Chat";
import classnames from "classnames";
import SideDrawer from "./SideDrawer";
import { BiSearchAlt } from "react-icons/bi";
import { Button } from "@material-tailwind/react";
import { AiOutlinePlusCircle } from "react-icons/ai";

const MyChats = ({ userId }: { userId: string }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    fetchUserChats();
  }, []);

  const fetchUserChats = async () => {
    try {
      const response = await fetchChats();
      dispatch(setChats(response.chats));
    } catch (err) {
      toast.dismiss();
      toast.error("Error fetching chats", TOAST_ACTION);
    }
  };
  return (
    <div className="flex flex-col justify-between p-4">
      <header className="flex items-center justify-between">
        <div className="flex items-center justify-between gap-2">
          <SideDrawer userId={userId} />
          <h1 className="font-bold text-2xl">My Chats</h1>
        </div>
        <div>
          <Button
            className="flex items-center justify-between rounded-full bg-socioverse-500 gap-1"
            // onClick={handleEditProfile}
          >
            <h1>Add Group</h1> 
            <AiOutlinePlusCircle className="font-extrabold text-lg" />
          </Button>
        </div>
      </header>
    </div>
  );
};

export default MyChats;
