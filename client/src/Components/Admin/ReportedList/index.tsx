import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Tabs,
  TabsHeader,
  Tab,
} from "@material-tailwind/react";
import { Outlet, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { setSearchTextForComments, setSearchTextForReplies } from "../../../Redux/AdminSlice";
import { StoreType } from "../../../Redux/Store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

const TABS = [
  {
    label: "Comments",
    value: "comments",
  },
  {
    label: "Replies",
    value: "replies",
  },
];

const ReportedList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { searchTextForComments, searchTextForReplies } = useSelector((store: StoreType) => store.admin)

  const handleTab = (value: string) => {
    if (value === "replies") {
      navigate("/admin/reported-list/replies");
    } else {
      navigate("/admin/reported-list/comments");
    }
  };

  useEffect(() => {
    console.log("searcgTextForComments from redux: ", searchTextForComments)
  }, [searchTextForComments])

  const handleSearch = (value: string) => {
    if (location.pathname === "/admin/reported-list/comments") {
      dispatch(setSearchTextForComments(value));
    } else {
      dispatch(setSearchTextForReplies(value));
    }
  };

  return (
    <Card className=" w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className=" flex items-center justify-between gap-8">
          <div className="flex flex-col gap-2">
            <Typography variant="h5" color="blue-gray">
              Reports list
            </Typography>
            <Tabs value="comments" className="w-full md:w-max">
              <TabsHeader>
                {TABS.map(({ label, value }) => (
                  <Tab
                    key={value}
                    value={value}
                    onClick={() => handleTab(value)}
                  >
                    &nbsp;&nbsp;{label}&nbsp;&nbsp;
                  </Tab>
                ))}
              </TabsHeader>
            </Tabs>
          </div>
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="w-full md:w-72">
              <Input
                label="Search"
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                onChange={(e) => handleSearch(e.target.value)}
                value={
                  location.pathname === "/admin/reported-list/comments"
                    ? searchTextForComments
                    : searchTextForReplies
                }
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <Outlet />
    </Card>
  );
};

export default ReportedList;
