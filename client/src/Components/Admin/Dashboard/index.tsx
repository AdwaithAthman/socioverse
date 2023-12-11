import Tables from "./Tables";
import StaticsticsCard from "./StatisticsCard";
import { ImUserMinus, ImUserCheck } from "react-icons/im";
import { RiUserFill, RiFileUserLine } from "react-icons/ri";
import { Typography } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import {
  getAllPostsCount,
  getAllUsersCount,
  getBlockedUsersCount,
} from "../../../API/Admin";

const Dashboard = () => {
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [activeUsers, setActiveUsers] = useState<number>(0);
  const [blockedUsers, setBlockedUsers] = useState<number>(0);
  const [totalPosts, setTotalPosts] = useState<number>(0);

  useEffect(() => {
    const fetchTotalUsers = async () => {
      const result = await getAllUsersCount();
      setTotalUsers(result.count);
    };
    const fetchBlockedUsers = async () => {
      const result = await getBlockedUsersCount();
      setBlockedUsers(result.count);
    };
    const fetchTotalPosts = async () => {
      const result = await getAllPostsCount();
      setTotalPosts(result.count);
    };
    fetchTotalUsers();
    fetchBlockedUsers();
    fetchTotalPosts();
  }, []);

  useEffect(() => {
    setActiveUsers(totalUsers - blockedUsers);
  }, [totalUsers, blockedUsers]);

  const StaticticsInfo = [
    {
      IconComponent: RiUserFill,
      iconColor: "orange",
      colorIntensity: "500",
      header: "Total Users",
      count: totalUsers,
    },
    {
      IconComponent: ImUserCheck,
      iconColor: "green",
      colorIntensity: "500",
      header: "Active Users",
      count: activeUsers,
    },
    {
      IconComponent: ImUserMinus,
      iconColor: "socioverse",
      colorIntensity: "500",
      header: "Blocked",
      count: blockedUsers,
    },
    {
      IconComponent: RiFileUserLine,
      iconColor: "blue",
      colorIntensity: "500",
      header: "Total Posts",
      count: totalPosts,
    },
  ];

  return (
    <div className="flex flex-col w-full h-full gap-10">
      <div className="flex items-center justify-between">
        {StaticticsInfo.map((info) => (
          <StaticsticsCard
            IconComponent={info.IconComponent}
            iconColor={info.iconColor}
            colorIntensity={info.colorIntensity}
            header={info.header}
            count={info.count}
            key={info.header}
          />
        ))}
      </div>
      <div>
        <Typography
          variant="small"
          className="font-mono font-extrabold text-lg text-blue-gray-600 text-center"
        >
          Monthly Users and Posts
        </Typography>
        <div className="px-5">
          <Tables />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
