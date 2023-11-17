import {
  Card,
  CardHeader,
  Typography,
  CardBody,
  Avatar,
} from "@material-tailwind/react";
import { ReportInfoInterface } from "../../../Types/admin";
import { useEffect, useState } from "react";
import common from "../../../Constants/common";
 
 
const TABLE_HEAD = ["Reported By", "Reason"];
 
const ReportInfo = ({report} : {report: ReportInfoInterface[]}) => {
 const [reportData, setReportData] = useState<ReportInfoInterface[]>([]);

 useEffect(() => {
  if(report.length > 0){
    setReportData(report)
  }
 }, [report])

 console.log("reportInfo at ReportInfo.tsx: ", reportData)

  return (
    <Card className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none mb-4">
        <div className="mb-4">
          <div>
            <Typography variant="h5" color="blue-gray">
              Report Info
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              See information about all reports
            </Typography>
          </div>
        </div>
      </CardHeader>
      <CardBody className="px-0 pb-6 pt-0 overflow-y-scroll overflow-x-hidden">
        <table className=" w-full min-w-max table-auto text-left">
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
            {reportData.map(
              (report, index) => {
                const isLast = index === reportData.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";
 
                return (
                  <tr key={index}>
                    <td className={classes}>
                      <div className="flex items-center gap-3">
                        <Avatar src={report.reports.user?.dp ? report.reports.user?.dp : common.DEFAULT_IMG} alt={report.reports.user?.name} size="sm" />
                        <div className="flex flex-col">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            {report.reports.user?.name}
                          </Typography>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-normal opacity-70"
                          >
                            @{report.reports.user?.username}
                          </Typography>
                        </div>
                      </div>
                    </td>
                    <td className={classes}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                       {report.reports.label}
                      </Typography>
                    </td>
                  </tr>
                );
              },
            )}
          </tbody>
        </table>
      </CardBody>
    </Card>
  );
}

export default ReportInfo