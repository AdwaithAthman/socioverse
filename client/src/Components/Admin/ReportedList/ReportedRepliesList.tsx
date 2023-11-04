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
  blockReply,
  getReplyReportedUsers,
  getAllReportedReplies,
  unblockReply,
  getAllReportedRepliesCount,
  getReportedRepliesCountOnSearch,
  getReportedRepliesOnSearch,
} from "../../../API/Admin";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

//importing types
import { User } from "../../../Types/loginUser";
import { TOAST_ACTION } from "../../../Constants/common";
import { ReplyInterface } from "../../../Types/post";
import { StoreType } from "../../../Redux/Store";

const TABLE_HEAD = [
  "Reported By",
  "Reported Against",
  "Reply",
  "Reports",
  "Status",
  "Block / Unblock",
];

interface ReplyListInterface {
  page: number;
  replies: ReplyInterface[];
}

const ReportedRepliesList = () => {
  const [reportedReplies, setReportedReplies] = useState<ReplyInterface[]>([]);
  const [reportedRepliesPage, setReportedRepliesPage] = useState<
    ReplyListInterface[]
  >([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [reportInfo, setReportInfo] = useState<User[]>([]);
  const [searchModeOn, setSearchModeOn] = useState<boolean>(false);
  const { searchTextForReplies } = useSelector(
    (store: StoreType) => store.admin
  );

  useEffect(() => {
    fetchReportedRepliesCount();
  }, []);

  useEffect(() => {
    const isPageExist = reportedRepliesPage.find(
      (page) => page.page === currentPage
    );
    if (isPageExist) {
      setReportedReplies(isPageExist.replies);
    } else {
      searchModeOn
        ? fetchReportedRepliesOnSearch(searchTextForReplies)
        : fetchReportedReplies();
    }
  }, [currentPage, searchModeOn, reportedRepliesPage]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const performSearch = async () => {
      const repliesCount = await getReportedRepliesCountOnSearch(
        searchTextForReplies
      );
      if (repliesCount.status === "success" && repliesCount.count > 0) {
        setReportedRepliesPage([]);
        setTotalPages(Math.ceil(repliesCount.count / 10));
        setCurrentPage(1);
        setSearchModeOn(true);
      } else {
        toast.error("No user found...!", TOAST_ACTION);
      }
    };

    if (searchTextForReplies.length > 0) {
      timer = setTimeout(performSearch, 800);
    } else if (searchTextForReplies.length === 0 && searchModeOn) {
      setSearchModeOn(false);
      setCurrentPage(1);
      fetchReportedRepliesCount();
      setReportedRepliesPage([]);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [searchTextForReplies]);

  const fetchReportedRepliesCount = async () => {
    const response = await getAllReportedRepliesCount();
    if (response.status === "success") {
      setTotalPages(Math.ceil(response.count / 10));
    }
  };

  const fetchReportedReplies = async () => {
    const response = await getAllReportedReplies(currentPage);
    setReportedRepliesPage((prev) => [
      ...prev,
      { page: currentPage, replies: response.reportedReplies },
    ]);
    setReportedReplies(response.reportedReplies);
  };

  const fetchReportedRepliesOnSearch = async (searchQuery: string) => {
    const response = await getReportedRepliesOnSearch(searchQuery, currentPage);
    setReportedRepliesPage((prev) => [
      ...prev,
      { page: currentPage, replies: response.reportedReplies },
    ]);
    setReportedReplies(response.reportedReplies);
  };

  const handleToggleChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    replyId: string,
    commentId: string
  ) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      const response = await blockReply(replyId, commentId);
      if (response.status === "success") {
        toast.dismiss();
        toast.success("Reply blocked successfully...!", TOAST_ACTION);
        setReportedReplies((prev) => {
          if (prev) {
            return prev.map((reply) => {
              if (reply._id === replyId) {
                return {
                  ...reply,
                  isBlock: true,
                };
              }
              return reply;
            });
          }
          return [];
        });
      }
    } else {
      const response = await unblockReply(replyId, commentId);
      if (response.status === "success") {
        toast.dismiss();
        toast.success("Reply unblocked successfully...!", TOAST_ACTION);
        setReportedReplies((prev) => {
          if (prev) {
            return prev.map((reply) => {
              if (reply._id === replyId) {
                return {
                  ...reply,
                  isBlock: false,
                };
              }
              return reply;
            });
          }
          return [];
        });
      }
    }
  };

  const handleGetReportInfo = async (replyId: string, commentId: string) => {
    const users = await getReplyReportedUsers(replyId, commentId);
    setReportInfo(users.reportedUsers);
  };

  const handlePrevious = () => {
    setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    setCurrentPage((prev) => prev + 1);
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
            {reportedReplies.map(
              (
                {
                  _id,
                  userId,
                  reply,
                  report,
                  isBlock,
                  createdAt,
                  updatedAt,
                  user,
                  commentId,
                },
                index
              ) => {
                const isLast = index === reportedReplies.length - 1;
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
                            View Reply
                          </Button>
                        </PopoverHandler>
                        <PopoverContent className="z-[999] w-[28rem] overflow-hidden p-0">
                          <div className="p-4 bg-black bg-opacity-20">
                            <div className="p-6 bg-white w-full h-full rounded-lg">
                              {reply}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </td>
                    <td
                      className={classes}
                      onClick={() =>
                        commentId && handleGetReportInfo(_id, commentId)
                      }
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
                                <div className="flex items-center gap-7">
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
                        <Tooltip content="Block Reply">
                          <Switch
                            color="red"
                            onChange={(e) =>
                              commentId && handleToggleChange(e, _id, commentId)
                            }
                          />
                        </Tooltip>
                      ) : (
                        <Tooltip content="Unblock Reply">
                          <Switch
                            checked
                            color="red"
                            onChange={(e) =>
                              commentId && handleToggleChange(e, _id, commentId)
                            }
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
          Page {currentPage} of {totalPages}
        </Typography>
        <div className="flex gap-2">
          <Button
            variant="outlined"
            size="sm"
            onClick={handlePrevious}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outlined"
            size="sm"
            onClick={handleNext}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </CardFooter>
    </>
  );
};

export default ReportedRepliesList;
