import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Bell, Edit, ChevronDown, X } from 'lucide-react'
import { Link } from "react-router-dom"
import Logo from "../Logo"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import Alert from "@/widgets/Icons/Alert"
import socket from '@/socket/socketServer'
import useTokenStore from "@/store/TokenStore"
import { useFetchQuery } from "@/hooks/useFetchQuery"
    import Notification, { INotification, NotificationGroup } from "./Notification"
import { Button } from "../ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { useUserInfo } from "@/hooks/useUserInfo"

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

  // ===== Data Fetching =====
  // Fetch user information
  // const { data: userInfo, isLoading } = useQuery<{ data: IUser }>({
  //   queryKey: ['user'],
  //   enabled: false,
  // });
  const userInfo = useUserInfo();
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
      'New Likes': [],
      'Others':[],
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
          case 'other':
          groups['Others'].push(notification);
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

  // if (isLoading) return <BounceLoader />
  if(userInfo){
  // ===== Render Component =====
  return (
    <header className="relative border-gray-200 border-b">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex justify-between items-center px-6 py-3">
          {/* Logo and Search */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center">
              <Logo size={{dev_text:2,talks_text:2}} unit="rem" />
            </Link>

            {/* Desktop Search */}
            <div className="hidden md:flex items-center bg-gray-100 px-3 py-2 rounded-full">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent px-2 border-none w-44 placeholder:text-gray-500 outline-none text-sm"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Mobile Search Icon */}
            <button
              className="md:hidden"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="w-5 h-5 text-gray-500" />
            </button>

            {/* Alert */}
            {!userInfo.data.isActive && (
                  <Button className="hover:bg-transparent" variant="ghost" size="icon">
                    <Alert />
                  </Button>
            )}

            {/* Write Button */}
            <Link to="/editor" className="hidden md:flex items-center gap-2 text-gray-700 hover:text-gray-900">
              <Edit className="w-5 h-5" />
              <span className="text-sm font-medium">Write</span>
            </Link>

            {/* Notifications */}
            <div className="relative">
              <Button
                variant="ghost"
                className="hover:bg-transparent hover:scale-110"
                size="icon"
                onClick={() => {setIsNotificationDropDownOpen(!isNotificationDropDownOpen); setIsDropdownOpen(false);}}
              >
                <Bell className="w-5 h-5 text-gray-500" />
                {notificationsData?.data && notificationsData.data.some(n => !n.is_read) && (
                  <span className="absolute top-0 right-0 bg-green-500 rounded-full w-2 h-2" />
                )}
              </Button>

              <AnimatePresence>
                {isNotificationDropDownOpen && (
                  <Notification 
                    isOpen={isNotificationDropDownOpen}
                    onClose={() => {setIsNotificationDropDownOpen(false); setIsDropdownOpen(false);}}
                    notificationGroups={notificationGroups}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* User Menu */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"

                className="flex items-center gap-2 hover:bg-transparent"
                onClick={() => {setIsDropdownOpen(!isDropdownOpen);setIsNotificationDropDownOpen(false);}}
              >
                <img src={userInfo.data.avatar ?? ""} alt="User avatar" className="w-8 h-8 rounded-full object-cover" />
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </Button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50"
                  >
                    {dropdownItems.map((item, index) => (
                      item.type === "divider" ? (
                        <hr key={index} className="my-1 border-gray-200" />
                      ) : (
                        <Link
                          key={item.label}
                          to={`${item.href}`}
                          className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${item.highlight ? 'font-semibold text-green-600' : ''}`}
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          {item.label}
                        </Link>
                      )
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-1 px-6 overflow-x-auto scrollbar-hide">
          {navItems.map((item, index) => (
            <Button
              key={item}
              variant="ghost"
              size="sm"
              className={`whitespace-nowrap ${index === 0 ? "text-black" : "text-gray-500"} hover:text-black hover:bg-transparent`}
            >
              {item}
            </Button>
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
            className="absolute inset-0 bg-white p-4 z-50"
          >
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </Button>
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-gray-100 px-4 py-2 rounded-full outline-none"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
  else{
    return (
      <header className="mx-auto max-w-[1600px] p-2 z-10 relative">
        <nav className="flex_between_center">
          
        <Link to="/" className="flex_start_center">
              <Logo size={{dev_text:2,talks_text:2}} unit="rem" />
            </Link>
          <div className="space-x-4">
            
      <Dialog >
        
      <DialogTrigger asChild>
        <Button variant="outline"><Edit className="w-5 h-5"/> Write</Button>
      </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join Our Community</DialogTitle>
            <DialogDescription>
              You need to be a member of our community to start writing. Sign up now to share your thoughts and stories
              with the world!
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-4 mt-4">
            <Button><Link to={"/signup"}> Sign Up</Link></Button>
          </div>
        </DialogContent>
      </Dialog>

            <Button variant={'ghost'}><Link to={"/login"} >
              Log in
            </Link></Button>
            
            <Button><Link to={"/signup"}>Get started</Link></Button>


          </div>
        </nav>
      </header>
    )
  }
}