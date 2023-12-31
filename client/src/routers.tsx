import { createBrowserRouter, Navigate } from "react-router-dom";
import { Suspense } from "react";

//imports from Pages
import App from "./App";
import AuthenticationPage from "./Pages/AuthenticationPage";
import MainPage from "./Pages/MainPage";
import ErrorPage from "./Pages/ErrorPage";
import AdminLoginPage from "./Pages/AdminLoginPage";
import AdminPage from "./Pages/AdminPage";

//imports from Components
import Settings from "./Components/Profile/SubSections/Settings";
import EditProfile from "./Components/Profile/SubSections/EditProfile";
import UsersList from "./Components/Admin/UsersList";
import PostList from "./Components/Admin/PostsList";
import ReportedList from "./Components/Admin/ReportedList";
import ReportedCommentsList from "./Components/Admin/ReportedList/ReportedCommentsList";
import ReportedRepliesList from "./Components/Admin/ReportedList/ReportedRepliesList";
import Dashboard from "./Components/Admin/Dashboard";
import loader from "./assets/Loader.svg";
import PostCardLoading from "./Components/Skeletons/PostCardLoading";

//lazy loading components
import { ProfilePage, SharedPostPage } from "./lazyComponents";

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Navigate to="/home" />,
      },
      {
        path: "/:section",
        element: <MainPage />,
      },
      {
        path: "profile/:userId",
        element: (
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-[80vh] w-full">
                <img src={loader} className="w-20 h-20 mx-auto mt-2 lg:mt-4" />
              </div>
            }
          >
            <ProfilePage />
          </Suspense>
        ),
        children: [
          {
            path: "settings",
            element: <Settings />,
          },
          {
            path: "edit-profile",
            element: <EditProfile />,
          },
          {
            path: "*",
            element: <Navigate to="/error" />,
          },
        ],
      },
      {
        path: "share/:postId",
        element: (
          <Suspense
            fallback={
              <div className="mt-5 md:mt-8 w-full md:mx-2 ">
                <div className="max-w-[21rem] md:max-w-[30rem] mx-auto">
                  <PostCardLoading />
                </div>
              </div>
            }
          >
            <SharedPostPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "error",
    element: <ErrorPage />,
  },
  {
    path: "login",
    element: <AuthenticationPage />,
  },
  {
    path: "signup",
    element: <AuthenticationPage />,
  },
  {
    path: "forgot-password",
    element: <AuthenticationPage />,
  },
  {
    path: "admin-login",
    element: <AdminLoginPage />,
  },
  {
    path: "/admin",
    element: <AdminPage />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/admin",
        element: <Navigate to="/admin/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "users-list",
        element: <UsersList />,
      },
      {
        path: "posts-list",
        element: <PostList />,
      },
      {
        path: "reported-list",
        element: <ReportedList />,
        children: [
          {
            path: "",
            element: <Navigate to="/admin/reported-list/comments" />,
          },
          {
            path: "comments",
            element: <ReportedCommentsList />,
          },
          {
            path: "replies",
            element: <ReportedRepliesList />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/error" />,
  },
]);
