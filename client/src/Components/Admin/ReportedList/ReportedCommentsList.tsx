import {
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Avatar,
  Tooltip,
  Switch,
  Popover,
  PopoverHandler,
  PopoverContent,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import {
  blockComment,
  getAllReportedComments,
  getCommentReportedUsers,
  unblockComment,
} from "../../../API/Admin";
import moment from "moment";
import { toast } from "react-toastify";

//importing types
import { User } from "../../../Types/loginUser";
import { TOAST_ACTION } from "../../../Constants/common";
import { CommentInterface } from "../../../Types/post";

const TABLE_HEAD = [
  "Reported Against",
  "Comment",
  "Reported By",
  "Reports",
  "Status",
  "Block / Unblock",
];

const ReportedCommentsList = () => {
  const [reportedComments, setReportedComments] = useState<CommentInterface[]>(
    []
  );
  const [reportInfo, setReportInfo] = useState<User[]>([]);
  useEffect(() => {
    const fetchReportedComments = async () => {
      const response = await getAllReportedComments();
      setReportedComments(response.reportedComments);
    };
    fetchReportedComments();
  }, []);

  const handleToggleChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    commentId: string
  ) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      const response = await blockComment(commentId);
      if (response.status === "success") {
        toast.dismiss();
        toast.success("Comment blocked successfully...!", TOAST_ACTION);
        setReportedComments((prev) => {
          if (prev) {
            return prev.map((comment) => {
              if (comment._id === commentId) {
                return {
                  ...comment,
                  isBlock: true,
                };
              }
              return comment;
            });
          }
          return [];
        });
      }
    } else {
      const response = await unblockComment(commentId);
      if (response.status === "success") {
        toast.dismiss();
        toast.success("Comment unblocked successfully...!", TOAST_ACTION);
        setReportedComments((prev) => {
          if (prev) {
            return prev.map((comment) => {
              if (comment._id === commentId) {
                return {
                  ...comment,
                  isBlock: false,
                };
              }
              return comment;
            });
          }
          return [];
        });
      }
    }
  };

  const handleGetReportInfo = async (commentId: string) => {
    const users = await getCommentReportedUsers(commentId);
    setReportInfo(users.reportedUsers);
  };

  return (
    <>
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
            {reportedComments.map(
              (
                {
                  _id,
                  userId,
                  comment,
                  report,
                  isBlock,
                  createdAt,
                  updatedAt,
                  user,
                },
                index
              ) => {
                const isLast = index === reportedComments.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";

                return (
                  <tr key={_id}>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        {user?.dp ? (
                          <Avatar src={user.dp} alt={user.name} size="sm" />
                        ) : (
                          <Avatar
                            src="https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png"
                            alt={user?.name}
                            size="sm"
                          />
                        )}
                        <div className="flex flex-col">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {user?.name}
                          </Typography>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal opacity-70"
                          >
                            @{user?.username}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className={classes}>
                      <Popover
                        animate={{
                          mount: { scale: 1, y: 0 },
                          unmount: { scale: 0, y: 50 },
                        }}
                      >
                        <PopoverHandler>
                          <Button
                            size="sm"
                            variant="outlined"
                            className="rounded-full text-black border-black"
                          >
                            View Comment
                          </Button>
                        </PopoverHandler>
                        <PopoverContent className="z-[999] w-[28rem] overflow-hidden p-0">
                          <div className="p-4 bg-black bg-opacity-20">
                            <div className="p-6 bg-white w-full h-full rounded-lg">
                              {comment}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </td>
                    <td
                      className={classes}
                      onClick={() => handleGetReportInfo(_id)}
                    >
                      <Popover
                        animate={{
                          mount: { scale: 1, y: 0 },
                          unmount: { scale: 0, y: 50 },
                        }}
                      >
                        <PopoverHandler>
                          <Button
                            size="sm"
                            variant="outlined"
                            className="rounded-full text-black border-black"
                          >
                            Reports
                          </Button>
                        </PopoverHandler>
                        <PopoverContent className="z-[999] w-[20rem] max-h-[45rem] overflow-x-hidden overflow-y-scroll no-scrollbar p-0">
                          <div className="p-4 bg-black bg-opacity-20">
                            <div className="flex flex-col gap-2 p-6 bg-white">
                              {reportInfo.map((user) => (
                                <div className="flex items-center gap-3">
                                  <Avatar
                                    src={
                                      user?.dp
                                        ? user?.dp
                                        : "https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png"
                                    }
                                    alt={user?.name}
                                    size="sm"
                                  />
                                  <div className="flex flex-col">
                                    <Typography
                                      variant="small"
                                      color="blue-gray"
                                      className="font-normal"
                                    >
                                      {user?.name}
                                    </Typography>
                                    <Typography
                                      variant="small"
                                      color="blue-gray"
                                      className="font-normal opacity-70"
                                    >
                                      @{user?.username}
                                    </Typography>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </td>
                    <td className={classes}>
                      <span
                        className="inline-flex items-center justify-center px-2 py-1 mr-2 text-xs 
                        font-bold leading-none text-white bg-red-600 rounded-full"
                      >
                        {report && report.length}
                      </span>
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
                        <Tooltip content="Block Comment">
                          <Switch
                            color="red"
                            onChange={(e) => _id && handleToggleChange(e, _id)}
                          />
                        </Tooltip>
                      ) : (
                        <Tooltip content="Unblock Comment">
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
    </>
  );
};

export default ReportedCommentsList;
