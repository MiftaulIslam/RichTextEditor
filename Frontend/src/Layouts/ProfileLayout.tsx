/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { Plus, User, Check } from "lucide-react";
import { toast } from "sonner";
import { useFetchQuery } from "@/hooks/useFetchQuery";
import useTokenStore from "@/store/TokenStore";
import TextLoader from "@/widgets/Icons/TextLoader";
import { IProfileResponse } from "@/Interfaces/ResponseInterface";
import { IFollow } from "@/Interfaces/EntityInterface";
import { useUserInfo } from "@/hooks/useUserInfo";
import { Skeleton } from "@/Components/ui/skeleton";

const ProfileLayout: React.FC = () => {
  const navigate = useNavigate();
  const { domain } = useParams();
  const token = useTokenStore((state) => state.token);
  const queryClient = useQueryClient();
  const { fetchRequest } = useFetchQuery();

  const userInfo = useUserInfo();
  const isOwnProfile = userInfo?.data.domain === domain;

  const { data: profileData, isLoading: profileLoading } = useQuery<IProfileResponse>({
    queryKey: ['profile', domain],
    queryFn: () => fetchRequest(`user/getUserByDomain/${domain}`, 'GET', null, {
      headers: { Authorization: `Bearer ${token}` }
    })as Promise<IProfileResponse>,
    enabled: !!domain && !!token && !isOwnProfile,
  });

  const isFollowing = profileData?.data.follows_follows_following_idToUser.some(
    (f: IFollow) => f.follower_id === userInfo?.data.id.toString()
  );

  const toggleFollowMutation = useMutation({
    mutationFn: () => fetchRequest(`followers/${profileData?.data.id}/follow`, 'POST', null, {
      headers: { Authorization: `Bearer ${token}` }
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', domain] });
    }
  });

  const handleFollowToggle = () => {
    toggleFollowMutation.mutate();
  };

  const userId = isOwnProfile ? userInfo?.data.id : profileData?.data.id;

  useEffect(() => {
    if (!userInfo) {
      toast("Unauthorized action detected", {
        description: "Please login to access this feature.",
        cancel: {
          label: "Close",
          onClick: () => console.log("close"),
        },
      });
      navigate('/');
    }
  }, [userInfo, navigate]);

  if (!isOwnProfile && profileLoading) return <ProfileSkeleton />;

  const displayData = isOwnProfile ? userInfo?.data : profileData?.data;

  return (
    userInfo && (
      <div className="max-w-6xl mx-auto px-4 py-8 ">
        <ProfileHeader 
          displayData={displayData} 
          isOwnProfile={isOwnProfile}
          isFollowing={isFollowing}
          onFollowToggle={handleFollowToggle}
          isLoading={toggleFollowMutation.isPending}
        />
        <main>
          <Outlet context={{userId: userId}}/>
        </main>
      </div>
    )
  );
};

const ProfileHeader: React.FC<{
  displayData: any,
  isOwnProfile: boolean,
  isFollowing: boolean | undefined,
  onFollowToggle: () => void,
  isLoading: boolean
}> = ({ displayData, isOwnProfile, isFollowing, onFollowToggle, isLoading }) => (
  <header className="flex flex-col items-center mb-8">
    <div className="flex items-center justify-between mb-6 w-full">
      <ProfileImage avatar={displayData?.avatar} name={displayData?.name} />
      {isOwnProfile ? (
        <Link to="/settings" className="text-green-600 text-sm hover:underline">
          Edit profile
        </Link>
      ) : (
        <FollowButton 
          isFollowing={isFollowing} 
          onFollowToggle={onFollowToggle} 
          isLoading={isLoading} 
        />
      )}
    </div>
    <ProfileNavigation />
  </header>
);

const ProfileImage: React.FC<{ avatar: string | undefined, name: string }> = ({ avatar, name }) => (
  <div className="flex gap-4 items-center">
    {avatar ? (
      <img src={avatar} alt="Profile" className="w-24 h-24 rounded-full object-cover mb-2" />
    ) : (
      <span className="border rounded-full w-20 h-20 flex justify-center items-center">
        <User size={60} className="text-gray-600"/>
      </span>
    )}
    <h4 className="text-2xl mb-2">{name}</h4>
  </div>
);

const FollowButton: React.FC<{
  isFollowing: boolean | undefined,
  onFollowToggle: () => void,
  isLoading: boolean
}> = ({ isFollowing, onFollowToggle, isLoading }) => (
  <button
    onClick={onFollowToggle}
    disabled={isLoading}
    className={`flex_start_center rounded gap-1 px-4 py-2 transition-colors ${
      isFollowing ? 'text-green-600' : 'text-green-600'
    } text-sm hover:underline`}
  >
    {isLoading ? (
      <TextLoader />
    ) : isFollowing ? (
      <>
        <Check size={17} />
        Following
      </>
    ) : (
      <>
        <Plus size={17} />
        Follow
      </>
    )}
  </button>
);

const ProfileNavigation: React.FC = () => (
  <nav className="w-full border-b pb-3">
    <ul className="flex gap-8">
      <NavItem to="">Home</NavItem>
      <NavItem to="about">About</NavItem>
    </ul>
  </nav>
);

const NavItem: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
  <li>
    <NavLink
      to={to}
      className={({ isActive }) =>
        `relative pb-[14px] text-gray-600 hover:text-gray-900 ${
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
);

const ProfileSkeleton: React.FC = () => (
  <div className="max-w-6xl mx-auto px-4 py-8">
    <header className="flex flex-col items-center mb-8">
      <div className="flex items-center justify-between mb-6 w-full">
        <div className="flex gap-4 items-center">
          <Skeleton className="w-24 h-24 rounded-full" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-10 w-24" />
      </div>
      <div className="w-full">
        <Skeleton className="h-10 w-full mb-4" />
      </div>
    </header>
    <main>
      <Skeleton className="h-64 w-full" />
    </main>
  </div>
);

export default ProfileLayout;