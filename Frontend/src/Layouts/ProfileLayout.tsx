/* eslint-disable react-hooks/exhaustive-deps */
import BounceLoader from "@/Components/BounchLoader";
import { useFetchQuery } from "@/hooks/useFetchQuery";
import { IUser } from "@/Interfaces/AuthInterfaces";
import useTokenStore from "@/store/TokenStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useParams } from "react-router-dom"
import {Plus, User} from "lucide-react"

const ProfileLayout = () => {
  const { domain } = useParams();
  const token = useTokenStore((state) => state.token);
  const queryClient = useQueryClient();
  const [isFollowing, setIsFollowing] = useState(false);
  const { fetchRequest } = useFetchQuery();

  const { data: userInfo, isLoading: userInfoLoading } = useQuery<{ data: IUser }>({
    queryKey: ['user'],
    enabled: !!token,
  });

  const { data: profileUser, isLoading: profileUserLoading } = useQuery<{ data: IUser }>({
    queryKey: ['profile', domain],
    queryFn: async () => {
      const response = await fetchRequest(`user/getUserByDomain/${domain}`, 'GET', null, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response;
    },
    enabled: !!domain && !!token,
  });

  const handleFollow = async () => {
    try {
      if (!profileUser?.data.id) return;

      if (!isFollowing) {
        // Follow user
        await fetchRequest(`followers/${profileUser.data.id}/follow`, 'POST', null, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setIsFollowing(true);
      } else {
        // Unfollow user
        await fetchRequest(`followers/${profileUser.data.id}/unfollow`, 'DELETE', null, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setIsFollowing(false);
      }

      // Invalidate relevant queries to refetch data
      queryClient.invalidateQueries(['profile', domain]);
      queryClient.invalidateQueries(['notifications']);
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
    }
  };

  if (userInfoLoading || profileUserLoading) return <BounceLoader />;
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="flex flex-col items-center mb-8">
        {/* Profile Section */}
        <div className="flex items-center justify-between mb-6 w-full">
          {/* Image with name */}
          <div className="flex gap-4 items-center">
            {
              !profileUser?.data.avatar ? (
                <span className="border rounded-full w-20 h-20 flex justify-center items-center">
                  <User size={60} className="text-gray-600"/>
                </span>
              ) : (
                <img
                  src={profileUser?.data.avatar ?? ""}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover mb-2"
                />
              )
            }
            <h1 className="text-2xl font-bold mb-2">{profileUser?.data.name}</h1>
          </div>
          {
            domain === userInfo?.data.domain ? (
              <Link to={"/settings"} className="text-green-600 text-sm hover:underline">
                Edit profile
              </Link>
            ) : (
              <button 
                onClick={handleFollow}
                className={`flex items-center gap-1 px-4 py-2 rounded-full ${
                  isFollowing 
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                } transition-colors`}
              >
                {isFollowing ? 'Following' : 'Follow'} 
                {!isFollowing && <Plus size={17}/>}
              </button>
            )
          }
        </div>

        {/* Navigation Tabs */}
        <nav className="w-full border-b pb-3">
          <ul className="flex gap-8">
            <NavItem to="">Home</NavItem>
            {domain === userInfo?.data.domain && (
              <NavItem to="lists">Lists</NavItem>
            )}
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
          `relative pb-[14px] text-sm text-gray-600 hover:text-gray-900 ${
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
                className="absolute bottom-0 bg-gray-500 left-0 w-full h-[1px]"
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