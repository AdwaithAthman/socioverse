import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { PencilIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Tabs,
  TabsHeader,
  Tab,
  Avatar,
  IconButton,
  Tooltip,
  Switch,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { blockUser, getAllUsers, unblockUser } from "../../../API/Admin";
import moment from "moment";
import { toast } from "react-toastify";

//importing types
import { User } from "../../../Types/loginUser";
import { TOAST_ACTION } from "../../../Constants/common";

// const TABS = [
//   {
//     label: "All",
//     value: "all",
//   },
//   {
//     label: "Monitored",
//     value: "monitored",
//   },
//   {
//     label: "Unmonitored",
//     value: "unmonitored",
//   },
// ];

const TABLE_HEAD = [
  "User",
  "Contact",
  "Created At",
  "Status",
  "Block / Unblock",
];

const UsersList = () => {
  const [usersList, setUsersList] = useState<User[]>([]);
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await getAllUsers();
      setUsersList(response.users);
    };
    fetchUsers();
  }, []);

  const handleToggleChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    userId: string
  ) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      const response = await blockUser(userId);
      if (response.status === "success") {
        toast.dismiss();
        toast.success("User blocked successfully...!", TOAST_ACTION);
        setUsersList((prev) => {
          if (prev) {
            return prev.map((user) => {
              if (user._id === userId) {
                return {
                  ...user,
                  isBlock: true,
                };
              }
              return user;
            });
          }
          return [];
        });
      }
    } else {
      const response = await unblockUser(userId);
      if (response.status === "success") {
        toast.dismiss();
        toast.success("User unblocked successfully...!", TOAST_ACTION);
        setUsersList((prev) => {
          if (prev) {
            return prev.map((user) => {
              if (user._id === userId) {
                return {
                  ...user,
                  isBlock: false,
                };
              }
              return user;
            });
          }
          return [];
        });
      }
    }
  };

  return (
    <Card className=" w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className=" flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray">
              Users list
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              See information about all users
            </Typography>
          </div>
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="w-full md:w-72">
              <Input
                label="Search"
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardBody className=" px-0 overflow-y-scroll h-[35rem]">
        <table className="mt-4 w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {usersList.map(
              (
                {
                  dp,
                  name,
                  username,
                  email,
                  phoneNumber,
                  createdAt,
                  isBlock,
                  _id,
                },
                index
              ) => {
                const isLast = index === usersList.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={_id}>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        {dp ? (
                          <Avatar src={dp} alt={name} size="sm" />
                        ) : (
                          <Avatar
                            src="https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png"
                            alt={name}
                            size="sm"
                          />
                        )}
                        <div className="flex flex-col">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {name}
                          </Typography>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal opacity-70"
                          >
                            @{username}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className={classes}>
                      <div className="flex flex-col">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {email}
                        </Typography>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal opacity-70"
                        >
                          {phoneNumber ? phoneNumber : "N/A"}
                        </Typography>
                      </div>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {moment(createdAt).format("L")}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <div className="w-max">
                        <Chip
                          variant="ghost"
                          size="sm"
                          value={!isBlock ? "Active" : "Inactive"}
                          color={!isBlock ? "green" : "blue-gray"}
                        />
                      </div>
                    </td>
                    <td className={classes}>
                      {!isBlock ? (
                        <Tooltip content="Block user">
                          <Switch
                            color="red"
                            onChange={(e) => _id && handleToggleChange(e, _id)}
                          />
                        </Tooltip>
                      ) : (
                        <Tooltip content="Unblock user">
                          <Switch
                            checked
                            color="red"
                            onChange={(e) => _id && handleToggleChange(e, _id)}
                          />
                        </Tooltip>
                      )}
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <Typography variant="small" color="blue-gray" className="font-normal">
          Page 1 of 10
        </Typography>
        <div className="flex gap-2">
          <Button variant="outlined" size="sm">
            Previous
          </Button>
          <Button variant="outlined" size="sm">
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default UsersList;
