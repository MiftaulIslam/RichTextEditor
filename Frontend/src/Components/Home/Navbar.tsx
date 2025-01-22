import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Bell, Edit, ChevronDown, X, User } from 'lucide-react'
import { Link } from "react-router-dom"
import Logo from "../Logo"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import BounceLoader from "../BounchLoader"
import { IUser } from "@/Interfaces/AuthInterfaces"
import Alert from "@/widgets/Icons/Alert"
import socket from '@/socket/socketServer'
import useTokenStore from "@/store/TokenStore"
import { useFetchQuery } from "@/hooks/useFetchQuery"
import Notification, { INotification, NotificationGroup } from "./Notification"

interface INotificationResponse {
  data: INotification[];
  statusCode: number;
  message: string;
}
export default function Navbar() {
  // ===== State Management =====
  const token = useTokenStore((state) => state.token);
  const queryClient = useQueryClient();
  const { fetchRequest } = useFetchQuery<INotificationResponse>();

  // Local states for UI controls
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isNotificationDropDownOpen, setIsNotificationDropDownOpen] = useState(false)
  const [isHover, setIsHover] = useState(false)

  // ===== Data Fetching =====
  // Fetch user information
  const { data: userInfo, isLoading } = useQuery<{ data: IUser }>({
    queryKey: ['user'],
    enabled: false,
  });

  // Fetch notifications
  const fetchNotifications = async () => {
    if (token) {
      const headers = { Authorization: `Bearer ${token}` };
      return await fetchRequest("notifications", "GET", null, { headers });
    }
  };

  const { data: notificationsData, refetch: refetchNotifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    enabled: !!token
  });

  // ===== Socket Connection =====
  useEffect(() => {
    if (!socket.connected && token) {
      socket.connect();
    }

    // Handle new notifications
    const handleNewNotification = (notification: INotification) => {
      console.log('New notification received:', notification);
      queryClient.setQueryData(['notifications'], (oldData: INotificationResponse) => {
        const currentData = oldData?.data || [];
        return {
          ...oldData,
          data: [notification, ...currentData]
        };
      });
      // Force refetch to ensure data consistency
      refetchNotifications();
    };

    socket.on('new-notification', handleNewNotification);

    return () => {
      socket.off('new-notification', handleNewNotification);
    };
  }, [token, queryClient, refetchNotifications]);

  // ===== Helper Functions =====
  // Group notifications by type
  const notificationGroups: NotificationGroup[] = useMemo(() => {
    if (!notificationsData?.data || !Array.isArray(notificationsData.data)) return [];
    
    const groups: Record<string, INotification[]> = {
      'New Followers': [],
      'New Comments': [],
      'New Articles': [],
      'New Likes': []
    };

    notificationsData.data.forEach(notification => {
      switch (notification.type) {
        case 'follow':
          groups['New Followers'].push(notification);
          break;
        case 'comment':
          groups['New Comments'].push(notification);
          break;
        case 'article':
          groups['New Articles'].push(notification);
          break;
        case 'like':
          groups['New Likes'].push(notification);
          break;
      }
    });

    return Object.entries(groups)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, items]) => items.length > 0)
      .map(([category, items]) => ({
        category,
        count: items.filter(item => !item.is_read).length,
        items
      }));
  }, [notificationsData]);

  // ===== Navigation Items =====
  const navItems = [
    "For you",
    "Following",
    "TypeScript",
    "Node.js",
    "React",
    "Coding",
    "Web Development",
  ]

  // ===== Dropdown Menu Items =====
  const dropdownItems = [
    { label: "Profile", href: `/profile/${userInfo?.data.domain}` },
    { label: "Library", href: "/library" },
    { label: "Stories", href: "/stories" },
    { label: "Stats", href: "/stats" },
    { type: "divider" },
    { label: "Settings", href: "/settings" },
    { label: "Refine recommendations", href: "/recommendations" },
    { label: "Manage publications", href: "/publications" },
    { label: "Help", href: "/help" },
    { type: "divider" },
    { label: "Become a member", href: "/membership", highlight: true },
    { label: "Create a Mastodon account", href: "/mastodon" },
    { label: "Apply for author verification", href: "/verification" },
    { label: "Apply to the Partner Program", href: "/partner" },
    { label: "Gift a membership", href: "/gift" },
    { type: "divider" },
    { label: "Sign out", href: "/signout", action: true },
  ]

  if (isLoading) return <BounceLoader />

  // ===== Render Component =====
  return (
    <header className="relative border-gray-200 border-b">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex justify-between items-center px-6 py-3">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center">
              <Logo />
            </Link>

            {/* Desktop Search */}
            <div className="md:flex items-center hidden bg-gray-50 px-3 py-1 rounded-full">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent px-2 border-none w-44 placeholder:text-gray-500 outline-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6">
            {/* Mobile Search Icon */}
            <button
              className="md:hidden"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="w-5 h-5 text-gray-500" />
            </button>
            {/* Alert */}
            {
              (!userInfo?.data.isActive && userInfo) && (

                <div>
                  <Alert />
                </div>
              )
            }
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="md:flex items-center gap-2 hidden text-gray-500 hover:text-gray-700"
            >
              <Edit className="w-5 h-5" />
              <Link to={"editor"}>Write</Link>
            </motion.button>
            {/* Bell icon e hover korle jei notification er dropdown ashbe sheitar part */}
            <AnimatePresence>
              {isNotificationDropDownOpen && (
                <Notification 
                  isOpen={isNotificationDropDownOpen}
                  onClose={() => setIsNotificationDropDownOpen(false)}
                  notificationGroups={notificationGroups}
                />
              )}
            </AnimatePresence>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Bell
                onClick={() => setIsNotificationDropDownOpen(!isNotificationDropDownOpen)}
                className="w-5 h-5 text-gray-500"
              />
              {notificationsData?.data && notificationsData.data.some(n => !n.is_read) && (
                <span className="-top-1 -right-1 absolute bg-green-500 rounded-full w-2 h-2" />
              )}
            </motion.button>

            <div>
              {!userInfo ? (
                <div className="relative h-9"
                  onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}
                >
                  <motion.div >
                    <User size={30} className="text-gray-500 hover:text-gray-600" />
                  </motion.div>


                  <AnimatePresence>
                    {isHover && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="-left-20 absolute bg-white shadow-lg mt-2 px-4 py-2 rounded-lg w-[200px] max-w-[300px] text-center text-gray-800 text-sm"
                      >
                        <p className="text-center text-gray-600 text-sm">You haven't logged in yet</p>
                        <Link to={"/login"} className="mt-1 font-semibold text-center text-gray-500 text-xs underline cursor-pointer">Login</Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) :

                (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    {
                      userInfo ? (
                        <img src={userInfo?.data?.avatar ?? ""} className="bg-gray-200 rounded-full w-8 h-8 object-fill" />
                      ) : (
                        <User />
                      )
                    }
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </motion.button>
                )}
            </div>

          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-1 px-6 overflow-x-auto scrollbar-hide">
          {navItems.map((item, index) => (
            <motion.button
              key={item}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 py-3 text-sm whitespace-nowrap ${index === 0 ? "text-black" : "text-gray-500"
                } hover:text-black`}
            >
              {item}
            </motion.button>
          ))}
        </nav>
      </div>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="z-50 absolute inset-0 bg-white p-4"
          >
            <div className="flex items-center gap-4">
              <button onClick={() => setIsSearchOpen(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-none w-full outline-none"
                autoFocus
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="top-16 right-6 z-40 absolute border-gray-200 bg-white shadow-lg border rounded-md w-64"
          >
            <div className="py-2">
              {dropdownItems.map((item, index) => (
                item.type === "divider" ? (
                  <div key={index} className="bg-gray-200 my-2 h-[1px]" />
                ) : (
                  <Link
                    key={index}
                    to={item.href as string}
                    className={`block px-4 py-2 text-sm ${item.highlight ? 'text-green-600 font-semibold' :
                      item.action ? 'text-gray-700' : 'text-gray-600'
                      } hover:bg-gray-50`}
                  >
                    {item.label}
                  </Link>
                )
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}