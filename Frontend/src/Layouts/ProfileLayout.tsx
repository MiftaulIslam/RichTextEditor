/* eslint-disable react-hooks/exhaustive-deps */
import BounceLoader from "@/Components/BounchLoader";
import { useFetchQuery } from "@/hooks/useFetchQuery";
import { IUser } from "@/Interfaces/AuthInterfaces";
import useTokenStore from "@/store/TokenStore";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useParams } from "react-router-dom"
import {Plus, User} from "lucide-react"
const ProfileLayout = () => {
  
  const token = useTokenStore((state) => state.token);
    const { fetchRequest } = useFetchQuery();
  const {domain} = useParams();
  const [data, setData] = useState<IUser | null>(null)
  const { data: userInfo, isLoading } = useQuery<{ data: IUser }>({
    queryKey: ['user'],
    enabled: false,  
  });

  useEffect(() => {
    if (userInfo?.data?.domain !== domain) {
      // Fetch user by domain if it doesn't match
      const fetchUser = async () => {
        try {
          const headers = { Authorization: `Bearer ${token}` };
          const response =  await fetchRequest(`user/getuserbydomain/${domain}`, "GET", null, { headers });
          setData((response as { data: IUser }).data);
        } catch (error) {
          console.error("Error fetching user:", error);
          setData(null);
        }
      };
      fetchUser();
    } else {
      // If domains match, clear any fetched data
      setData(null);
    }
  }, [domain]);
  
  const user = data ? data : userInfo?.data;

  if (isLoading) return <BounceLoader/>
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
    <header className="flex flex-col items-center mb-8">
      {/* Profile Section */}
      <div className="flex items-center justify-between mb-6 w-full">
        {/* Image with name */}
        <div className="flex gap-4 items-center">
          {
            !user?.avatar ? (<span className="border  rounded-full w-20 h-20 flex justify-center items-center"> <User size={60} className="text-gray-600"/></span>):(
              <img
              src={user?.avatar ?? ""}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover mb-2"
            />
            )
          }
        <h1 className="text-2xl font-bold mb-2">{userInfo?.data.name}</h1>
        </div>
        {
          domain == userInfo?.data.domain ? (

            <Link to={"/settings"} className="text-green-600 text-sm hover:underline">
            Edit profile
          </Link>
          ):(
            <button className="text-green-600 text-sm hover:underline flex  items-center ">Follow <Plus size={17}/></button>
          )
        }
      </div>

      {/* Navigation Tabs */}
      <nav className="w-full border-b pb-3">
        <ul className="flex gap-8">
          <NavItem to="">Home</NavItem>
          {domain == userInfo?.data.domain && (
          <NavItem to="lists">Lists</NavItem>)}
          <NavItem to="about">About</NavItem>
        </ul>
      </nav>
    </header>

    {/* Router Outlet */}
    <main>
      <Outlet />
    </main>
  </div>
  )
}

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
    return (
      <li>
        <NavLink
          to={to}
          className={({ isActive }) =>
            `relative  pb-[14px] text-gray-600 hover:text-gray-900 ${
              isActive ? 'text-gray-900' : ''
            }`
          }
        >
          {({ isActive }) => (
            <>
              {children}
              {isActive && (
                <motion.div
                  layoutId="underline"
                  className="absolute bottom-0 bg-gray-500 left-0 w-full h-[1px] "
                  initial={false}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </>
          )}
        </NavLink>
      </li>
    )
  }
export default ProfileLayout