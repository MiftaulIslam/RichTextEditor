import Navbar from "@/Components/Home/Navbar";
import { Toaster } from "@/Components/ui/sonner";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  
  return (
    <>
      {/* Navbar always visible */}
      <Navbar />
      {/* Outlet for rendering child routes */}
      <Outlet />
      <Toaster />
      {/* //footer */}
    </>
  );
};

export default RootLayout;
