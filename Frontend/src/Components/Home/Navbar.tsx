import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Bell, Edit, ChevronDown, X, User, ArrowRight } from 'lucide-react'
import { Link } from "react-router-dom"
import Logo from "../Logo"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import BounceLoader from "../BounchLoader"
import { IUser } from "@/Interfaces/AuthInterfaces"
import Alert from "@/widgets/Icons/Alert"
import socket from '@/socket/socketServer'
import useTokenStore from "@/store/TokenStore"
import { base_url } from "@/static/data"

interface NotificationSender {
  name: string;
  avatar: string;
}

interface INotification {
  id: string;
  recipient_id: string;
  sender_id: string;
  type: 'follow' | 'comment' | 'like' | 'article';
  title: string;
  content: string;
  url_to: string;
  is_read: boolean;
  highlight: boolean;
  created_at: string;
  sender: NotificationSender;
}

interface NotificationGroup {
  category: string;
  count: number;
  items: INotification[];
}

export default function Navbar() {

  const token = useTokenStore((state) => state.token);
  const { data: userInfo, isLoading } = useQuery<{ data: IUser }>({
    queryKey: ['user'],
    enabled: false,
  });
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isNotificationDropDownOpen, setIsNotificationDropDownOpen] = useState(false)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };
  // const [isWatchingArticles, setIsWatchingArticles] = useState(false)
  const [isHover, setIsHover] = useState(false)

  const navItems = [
    "For you",
    "Following",
    "TypeScript",
    "Node.js",
    "React",
    "Coding",
    "Web Development",
  ]

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


  const notificationDropDownItems = [
    {
      category: "New Articles",
      count: 5, 
      items: [
        {
          author: {
            name: "Miftaul Islam Ariyan",
            image: "https://i.ibb.co.com/Wsj077d/597e9d22564b.jpg",
          },
          title: "Veganism",
          content: "Veganism amar ....",
          urlTo: "eda-test-url-1",
          highlight: true,
        },
        {
          author: {
            name: "Nayef Mohammad Farhan Nisar",
            image: "https://i.ibb.co/Vw8tBqr/824bd5800350.png",
          },
          title: "Suffocation",
          content: "Suffocation occurs due to the lack of oxygen",
          urlTo: "eda-test-url-2",
          highlight: true
        },
        {
          author: {
            name: "Nayef Mohammad Farhan Nisar 2",
            image: "https://i.ibb.co/Vw8tBqr/824bd5800350.png",
          },
          title: "Suffocation 2",
          content: "Suffocation occurs due to the lack of oxygen 2",
          urlTo: "eda-test-url-3",
          highlight: false,
        },
      ],
    },

    {
      category: "New Comments",
      count: 5, 
      items: [
        {
          author: {
            name: "Miftaul Islam Ariyan",
            image: "https://i.ibb.co.com/Wsj077d/597e9d22564b.jpg",
          },
          title: "Veganism",
          content: "Veganism amar ....",
          urlTo: "eda-test-url-1",
          highlight: true,
        },
        {
          author: {
            name: "Nayef Mohammad Farhan Nisar",
            image: "https://i.ibb.co/Vw8tBqr/824bd5800350.png",
          },
          title: "Suffocation",
          content: "Suffocation occurs due to the lack of oxygen",
          urlTo: "eda-test-url-2",
          highlight: true
        },
        {
          author: {
            name: "Nayef Mohammad Farhan Nisar 2",
            image: "https://i.ibb.co/Vw8tBqr/824bd5800350.png",
          },
          title: "Suffocation 2",
          content: "Suffocation occurs due to the lack of oxygen 2",
          urlTo: "eda-test-url-3",
          highlight: false,
        },
      ],
    },
    {
      category: "Others",
      count: 5, 
      items: [
        {
          author: {
            name: "Miftaul Islam Ariyan",
            image: "https://i.ibb.co.com/Wsj077d/597e9d22564b.jpg",
          },
          title: "Veganism",
          content: "Veganism amar ....",
          urlTo: "eda-test-url-1",
          highlight: true,
        },
        {
          author: {
            name: "Nayef Mohammad Farhan Nisar",
            image: "https://i.ibb.co/Vw8tBqr/824bd5800350.png",
          },
          title: "Suffocation",
          content: "Suffocation occurs due to the lack of oxygen",
          urlTo: "eda-test-url-2",
          highlight: true
        },
        {
          author: {
            name: "Nayef Mohammad Farhan Nisar 2",
            image: "https://i.ibb.co/Vw8tBqr/824bd5800350.png",
          },
          title: "Suffocation 2",
          content: "Suffocation occurs due to the lack of oxygen 2",
          urlTo: "eda-test-url-3",
          highlight: false,
        },
      ],
    },
  ];

  const queryClient = useQueryClient();

  useEffect(() => {
    socket.on('new-notification', (notification) => {
      queryClient.setQueryData(['notifications'], (oldData: any) => {
        if (!oldData) return [notification];
        return [notification, ...oldData];
      });
    });

    return () => {
      socket.off('new-notification');
    };
  }, [queryClient]);

  const { data: notificationsData } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await fetch(`${base_url}/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      return data.data as INotification[];
    },
    enabled: !!token
  });

  // Group notifications by type
  const notificationGroups: NotificationGroup[] = useMemo(() => {
    if (!notificationsData) return [];

    const groups: Record<string, INotification[]> = {
      'New Followers': [],
      'New Comments': [],
      'New Articles': [],
      'New Likes': []
    };

    notificationsData.forEach(notification => {
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
      .filter(([_, items]) => items.length > 0)
      .map(([category, items]) => ({
        category,
        count: items.filter(item => !item.is_read).length,
        items
      }));
  }, [notificationsData]);

  if (isLoading) return <BounceLoader />
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
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="top-12 right-0 z-40 absolute border-gray-200 bg-white shadow-lg border rounded-md w-80"
                >
                  <div className="py-2">
                    {notificationGroups.map((group, index) => (
                      <div key={index} className="relative">
                        <div
                          onClick={() => toggleCategory(group.category)}
                          className="flex justify-between items-center hover:bg-gray-50 px-4 py-2 text-gray-700 text-sm cursor-pointer"
                        >
                          <p className="flex items-start">
                            {group.category}
                            {group.count > 0 && (
                              <span className="inline-block bg-green-700 ml-2 rounded-full w-2 h-2"></span>
                            )}
                          </p>
                          {expandedCategory === group.category ? (
                            <X onClick={() => setIsNotificationDropDownOpen(false)} size={16} />
                          ) : (
                            <ArrowRight size={16} />
                          )}
                        </div>
                        <AnimatePresence>
                          {expandedCategory === group.category && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              {group.items.map((notification) => (
                                <a
                                  key={notification.id}
                                  href={notification.url_to}
                                  onClick={async (e) => {
                                    e.preventDefault();
                                    // Mark as read
                                    await fetch(`${base_url}/notifications/${notification.id}/read`, {
                                      method: 'PUT',
                                      headers: {
                                        Authorization: `Bearer ${token}`
                                      }
                                    });
                                    queryClient.invalidateQueries(['notifications']);
                                    window.location.href = notification.url_to;
                                  }}
                                  className={`block px-4 py-3 text-sm border-l-4 ${
                                    !notification.is_read
                                      ? 'bg-blue-50 border-blue-500 hover:bg-blue-100'
                                      : 'bg-white border-transparent hover:bg-blue-100'
                                  } transition-colors duration-150`}
                                >
                                  <div className="flex items-start space-x-3">
                                    <img
                                      src={notification.sender.avatar || "/placeholder.svg"}
                                      alt={notification.sender.name}
                                      className="rounded-full w-8 h-8"
                                    />
                                    <div>
                                      <span className="font-semibold">
                                        {notification.sender.name}{' '}
                                      </span>
                                      <span className="text-gray-600">
                                        {notification.content}
                                      </span>
                                    </div>
                                  </div>
                                </a>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </motion.div>
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
              {notificationsData?.some(n => !n.is_read) && (
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