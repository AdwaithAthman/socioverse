import { lazy } from "react";

export const HomePage = lazy(() => import ("./Pages/HomePage"));
export const ChatPage = lazy(() => import ("./Pages/ChatPage"));
export const PeoplePage = lazy(() => import ("./Pages/PeoplePage"));
export const ProfilePage = lazy(() => import("./Pages/ProfilePage"));
export const SharedPostPage = lazy(() => import("./Pages/SharedPostPage"));