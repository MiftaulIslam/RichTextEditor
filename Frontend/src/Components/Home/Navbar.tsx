
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Bell, Edit, ChevronDown, X, User, ArrowRight } from 'lucide-react'
import { Link } from "react-router-dom"
import Logo from "../Logo"
import { useQuery } from "@tanstack/react-query"
import BounceLoader from "../BounchLoader"
import { IUser } from "@/Interfaces/AuthInterfaces"
import Alert from "@/widgets/Icons/Alert"

export default function Navbar() {

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
      count: 5, //ei baler number ashbe dynamically
      items: [
        {
          author: {
            name: "Miftaul Islam Ariyan",
            image: "https://i.ibb.co.com/Wsj077d/597e9d22564b.jpg",
          },
          title: "Veganism",
          content: "Veganism faltu jinis, jottosov",
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
      count: 5, //ei baler number ashbe dynamically
      items: [
        {
          author: {
            name: "Miftaul Islam Ariyan",
            image: "https://i.ibb.co.com/Wsj077d/597e9d22564b.jpg",
          },
          title: "Veganism",
          content: "Veganism amar cheter bal. Eda amar dhoner niyom",
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
      count: 5, //ei baler number ashbe dynamically
      items: [
        {
          author: {
            name: "Miftaul Islam Ariyan",
            image: "https://i.ibb.co.com/Wsj077d/597e9d22564b.jpg",
          },
          title: "Veganism",
          content: "Veganism amar cheter bal. Eda amar dhoner niyom",
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
                    {notificationDropDownItems.map((item, index) => (
                      <div key={index} className="relative">
                        <div
                          onClick={() => toggleCategory(item.category)}
                          className="flex justify-between items-center hover:bg-gray-50 px-4 py-2 text-gray-700 text-sm cursor-pointer"
                        >
                          <p className="flex items-start">
                            {item.category}
                            {item.count > 0 && (
                              <span className="inline-block bg-red-700 ml-2 rounded-full w-2 h-2"></span>
                            )}
                          </p>
                          {expandedCategory === item.category ? <X onClick={() => {
                            setIsNotificationDropDownOpen(!isNotificationDropDownOpen)
                          }} size={16} /> : <ArrowRight size={16} />}
                        </div>
                        <AnimatePresence>
                          {expandedCategory === item.category && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              {item.items.map((notification, idx) => (
                                <a
                                  key={idx}
                                  href={notification.urlTo}
                                  className={`block px-4 py-3 text-sm border-l-4 ${
                                    notification.highlight 
                                      ? 'bg-blue-50 border-blue-500 hover:bg-blue-100' 
                                      : 'bg-white border-transparent hover:bg-blue-100'
                                  } transition-colors duration-150`}
                                >
                                  <div className="flex items-start space-x-3">
                                    <img
                                      src={notification.author.image || "/placeholder.svg"}
                                      alt={notification.author.name}
                                      className="rounded-full w-8 h-8"
                                    />
                                    <div>
                                      <Link to={notification.urlTo} className="text-gray-600" >
                                        <span className="font-semibold">{notification.author.name} </span>posted a new article titled <span className="font-bold"> {notification.title}
                                        </span>
                                      </Link>

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
              <Bell onClick={() => {
                setIsNotificationDropDownOpen(!isNotificationDropDownOpen)
              }}
                className="w-5 h-5 text-gray-500" />
              <span className="-top-1 -right-1 absolute bg-green-500 rounded-full w-2 h-2" />
            </motion.button>
            <AnimatePresence>
              {isNotificationDropDownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="top-8 -right-20 2xl:-right-40 z-40 absolute border-gray-200 bg-white shadow-lg border rounded-md w-80"
                >
                  <div className="py-2">
                    {notificationDropDownItems.map((item, index) => (
                      <div key={index} className="relative">
                        <div
                          onClick={() => toggleCategory(item.category)}
                          className="flex justify-between items-center hover:bg-gray-50 px-4 py-2 text-gray-700 text-sm cursor-pointer"
                        >
                          <p className="flex items-start">
                            {item.category}
                            {item.count > 0 && (
                              <span className="inline-block bg-red-700 ml-2 rounded-full w-2 h-2"></span>
                            )}
                          </p>
                          {expandedCategory === item.category ? <X onClick={() => {
                            setIsNotificationDropDownOpen(!isNotificationDropDownOpen)
                          }} size={16} /> : <ArrowRight size={16} />}
                        </div>
                        <AnimatePresence>
                          {expandedCategory === item.category && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              {item.items.map((notification, idx) => (
                                <a
                                  key={idx}
                                  href={notification.urlTo}
                                  className={`block px-4 py-3 text-sm border-l-4 ${
                                    notification.highlight 
                                      ? 'bg-blue-50 border-blue-500 hover:bg-blue-100' 
                                      : 'bg-white border-transparent hover:bg-blue-100'
                                  } transition-colors duration-150`}
                                >
                                  <div className="flex items-start space-x-3">
                                    <img
                                      src={notification.author.image || "/placeholder.svg"}
                                      alt={notification.author.name}
                                      className="rounded-full w-8 h-8"
                                    />
                                    <div>
                                      <Link to={notification.urlTo} className="text-gray-600" >
                                        <span className="font-semibold">{notification.author.name} </span>posted a new article titled <span className="font-bold"> {notification.title}
                                        </span>
                                      </Link>

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
            </div>

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