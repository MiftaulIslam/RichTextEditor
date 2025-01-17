import Navbar from "@/Components/Home/Navbar";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  
  return (
    <>
      {/* Navbar always visible */}
      <Navbar />
      {/* Outlet for rendering child routes */}
      <Outlet />

      {/* //footer */}
    </>
  );
};

export default RootLayout;
