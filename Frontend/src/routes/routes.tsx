import About from "@/Components/profile/About";
import Home from "@/Components/profile/Home";
import Lists from "@/Components/profile/Lists";
import HomeLayout from "@/Layouts/HomeLayout";
import ProfileLayout from "@/Layouts/ProfileLayout";
import RootLayout from "@/Layouts/RootLayout";
import TextEditor from "@/Layouts/TextEditor";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";

import { createBrowserRouter } from 'react-router-dom';
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
        path: "editor",
        element: <TextEditor />,
      },
      {
        path: "profile",
        element: <ProfileLayout />,
        children: [
          {
            path: "",
            element: <Home/>,
          },
          {
            path: "about",
            element: <About/>,
          },
          {
            path: "lists",
            element: <Lists/>,
          },
        ]
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

])


export default router;