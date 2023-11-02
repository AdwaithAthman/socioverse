import { useEffect, useState } from "react";
import { getMonthlyPosts, getMonthlyUserSignups } from "../../../API/Admin";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';


//importing types
import {
  MonthlyPostsInterface,
  MonthlyUsersInterface,
} from "../../../Types/admin";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Chart.js Bar Chart',
    },
  },
};

const labels = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const Tables = () => {
  const [monthlyUsers, setMonthlyUsers] = useState<MonthlyUsersInterface[]>([]);
  const [monthlyPosts, setMonthlyPosts] = useState<MonthlyPostsInterface[]>([]);
  // const [userData, setUserData] = useState<number[]>([]);
  // const [postData, setPostData] = useState<number[]>([]); 

  useEffect(() => {
    const fetchMonthlyUsers = async () => {
      const result = await getMonthlyUserSignups();
      setMonthlyUsers(result.monthlyUserSignups);
    };
    const fetchMonthlyPosts = async () => {
      const result = await getMonthlyPosts();
      setMonthlyPosts(result.monthlyPosts);
    };
    fetchMonthlyUsers();
    fetchMonthlyPosts();
  }, []);
  
  useEffect(() => {
    if(monthlyUsers){
      console.log("monthlyUsers: ",monthlyUsers);
    }
    if(monthlyPosts ){
      console.log("monthlyPosts: ",monthlyPosts);
    }
  }, [monthlyUsers, monthlyPosts])

  const data = {
    labels,
    datasets: [
      {
        label: "Users Created",
        data: labels.map((_, index) => (
          monthlyUsers.find((user) => user.month === index + 1)?.count || null
        )),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Posts Created",
        data: labels.map((_, index) => (
          monthlyPosts.find((post) => post.month === index + 1)?.count || null
        )),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  return (
    <>
      <Bar options={options} data={data} />
    </>
  );
};

export default Tables;
