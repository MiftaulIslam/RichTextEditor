import About from "@/Components/profile/About";
import Home from "@/Components/profile/Home";
import Lists from "@/Components/profile/Lists";
import AccountSetting from "@/Components/Setting/AccountSetting";
import MembershipAndPaymentSetting from "@/Components/Setting/MembershipAndPaymentSetting";
import NotificationSetting from "@/Components/Setting/NotificationSetting";
import PublishingSetting from "@/Components/Setting/PublishingSetting";
import SecuritySetting from "@/Components/Setting/SecuritySetting";
// import Articles from "@/Layouts/Articles";
import HomeLayout from "@/Layouts/HomeLayout";
import ProfileLayout from "@/Layouts/ProfileLayout";
import RootLayout from "@/Layouts/RootLayout";
import SettingLayout from "@/Layouts/SettingLayout";
import TextEditor from "@/Layouts/TextEditor";
import Login from "@/pages/Login";
import PublishArticle from "@/pages/PublishArticle";
import Signup from "@/pages/Signup";
import Article from "@/pages/Article";

import { createBrowserRouter } from "react-router-dom";
import ActivationPage from "@/pages/ActivationPage";
import Editor from "@/pages/editor/editor";
// import RichTextEditor from "@/pages/Editor/SlateEditor";
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />, // Root layout wraps all routes
    children: [
      {
        path: "",
        element: <HomeLayout />,
      },
      {
        path: "activate/:token",
        element: <ActivationPage />,
      },
      {
        path: "editor",
        element: <TextEditor />,
      },
      {
        path: "editor/publish/p/:articleId",
        element: <PublishArticle />,
      },
      {
        path: "test/editor",
        element: <Editor />,
      },
      {
        path: ":domain/:slug",
        element: <Article />,
      },
      {
        path: "profile/:domain",
        element: <ProfileLayout />,
        children: [
          {
            path: "",
            element: <Home />,
          },
          {
            path: "about",
            element: <About />,
          },
          {
            path: "lists",
            element: <Lists />,
          },
        ],
      },
      {
        path: "settings",
        element: <SettingLayout />,
        children: [
          {
            path: "",
            element: <AccountSetting />,
          },
          {
            path: "publishing-settings",
            element: <PublishingSetting />,
          },
          {
            path: "notification-settings",
            element: <NotificationSetting />,
          },
          {
            path: "membership-settings",
            element: <MembershipAndPaymentSetting />,
          },
          {
            path: "security-settings",
            element: <SecuritySetting />,
          },
        ],
      },
    ],
  },

  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
]);

export default router;
