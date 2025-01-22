/* eslint-disable react-hooks/exhaustive-deps */
import BounceLoader from "@/Components/BounchLoader";
import { useFetchQuery } from "@/hooks/useFetchQuery";
import useTokenStore from "@/store/TokenStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { Link, NavLink, Outlet, useParams } from "react-router-dom"
import {Plus, User, Check} from "lucide-react"
import TextLoader from "@/widgets/Icons/textLoader";
import { IProfileResponse } from "@/Interfaces/ResponseInterface";
import { IFollow, IUser } from "@/Interfaces/EntityInterface";


const ProfileLayout = () => {
  const { domain } = useParams();
  const token = useTokenStore((state) => state.token);
  const queryClient = useQueryClient();
  const { fetchRequest } = useFetchQuery();

  // Get cached current user data
  const { data: userInfo } = useQuery<{ data: IUser }>({
    queryKey: ['user'],
    enabled: !!token,
  });

  // Check if viewing own profile
  const isOwnProfile = userInfo?.data.domain === domain;

  // Fetch other user's profile only if not viewing own profile
  const { data: profileData, isLoading: profileLoading } = useQuery<IProfileResponse>({
    queryKey: ['profile', domain],
    queryFn: async () => {
      const response = await fetchRequest(`user/getUserByDomain/${domain}`, 'GET', null, {
        headers: { Authorization: `Bearer ${token}` }
      }) as IProfileResponse;
      return response;
    },
    enabled: !!domain && !!token && !isOwnProfile, // Only fetch if not own profile
  });
  let isFollowing = profileData?.data.follows_follows_following_idToUser.some((f:IFollow)=>f.follower_id == userInfo?.data.id.toString())
  const followUser = async ()=>{
  await fetchRequest(`followers/${profileData?.data.id}/follow`, 'POST', null, {
    headers: { Authorization: `Bearer ${token}` }
  })
  isFollowing = true;
}
const unfollowUser = async ()=>{
  await fetchRequest(`followers/${profileData?.data.id}/unfollow`, 'DELETE', null, {
    headers: { Authorization: `Bearer ${token}` }
  })
  isFollowing = false;
}
 // Follow/Unfollow mutations (only needed for other profiles)
  const followMutation = useMutation({
    mutationFn: async () => {
      return followUser();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', domain] });

    }
  });

  const unfollowMutation = useMutation({
    mutationFn: async () => {
      return unfollowUser();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', domain] });
    },
  });

  const handleFollowToggle = async () => {
    if (isFollowing) {
      await unfollowMutation.mutateAsync();
    } else {
      await followMutation.mutateAsync();
    }
  };
  const userId = isOwnProfile ? userInfo?.data.id : profileData?.data.id;
  // Show loader only when loading other user's profile
  if (!isOwnProfile && profileLoading) return <BounceLoader />;

  // Get the correct data to display
  const displayData = isOwnProfile ? userInfo?.data : profileData?.data;
 return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <header className="flex flex-col items-center mb-8">
        {/* Profile Section */}
        <div className="flex items-center justify-between mb-6 w-full">
          {/* Image with name */}
          <div className="flex gap-4 items-center">
            {
              !displayData?.avatar ? (<span className="border  rounded-full w-20 h-20 flex justify-center items-center"> <User size={60} className="text-gray-600"/></span>):(
                <img
                src={displayData?.avatar ?? ""}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover mb-2"
              />
              )
            }
          <h1 className="text-2xl font-bold mb-2">{displayData?.name}</h1>
          </div>
          {
            domain == userInfo?.data.domain ? (

              <Link to={"/settings"} className="text-green-600 text-sm hover:underline">
              Edit profile
            </Link>
            ):(
              
              <button
                onClick={handleFollowToggle}
                disabled={followMutation.isPending || unfollowMutation.isPending}
                className={`flex rounded items-center gap-2 px-4 py-2 transition-colors ${
                  isFollowing
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {followMutation.isPending || unfollowMutation.isPending ? (
                  <TextLoader/>
                ):(isFollowing ? (
                  <>
                    <Check size={17} />
                    Following
                  </>
                ) : (
                  <>
                    <Plus size={17} />
                    Follow
                  </>
                ))}
                
              </button>
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
        <Outlet context={{userId:userId}}/>
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