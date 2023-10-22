import { createBrowserRouter, Navigate } from "react-router-dom";

//imports from Pages
import App from "./App";
import AuthenticationPage from "./Pages/AuthenticationPage";
import MainPage from "./Pages/MainPage";
import ProfilePage from "./Pages/ProfilePage";
import ErrorPage from "./Pages/ErrorPage";

//imports from Components
import Settings from "./Components/Profile/SubSections/Settings";
import EditProfile from "./Components/Profile/SubSections/EditProfile";

export const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <App />,
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
          element: <ProfilePage />,
          children: [
            {
              path: "settings",
              element: <Settings />
            },
            {
              path: "edit-profile",
              element: <EditProfile />
            }
          ]
        },
        {
          path: "error",
          element: <ErrorPage />
        }
      ],
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
    
  ]);