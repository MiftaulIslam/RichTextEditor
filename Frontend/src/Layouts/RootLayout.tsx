import Navbar from "@/Components/Home/Navbar";
import { Toaster } from "@/Components/ui/sonner";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  
  return (
    <>
    <div className="min-h-screen">

      {/* Navbar always visible */}
      <Navbar />
      {/* Outlet for rendering child routes */}
      <Outlet />
      <Toaster />
      {/* //footer */}
    </div>
    </>
  );
};

export default RootLayout;
