
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Bell, Edit, ChevronDown, X } from 'lucide-react'
import { Link } from "react-router-dom"
import Logo from "../Logo"

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

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
    { label: "Profile", href: "/profile" },
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

  return (
    <header className="border-b border-gray-200 relative">
      <div className="max-w-[1600px] mx-auto">
        <div className="px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center">
            <Logo/>
            </Link>
            
            {/* Desktop Search */}
            <div className="hidden md:flex items-center bg-gray-50 rounded-full px-3 py-1">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none px-2 w-44 placeholder:text-gray-500"
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

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden md:flex items-center gap-2 text-gray-500 hover:text-gray-700"
            >
              <Edit className="w-5 h-5" />
              <Link to={"editor"}>Write</Link>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Bell className="w-5 h-5 text-gray-500" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <img src="https://simgbb.com/avatar/k2XfKcPYZJfb.jpg" className="w-8 h-8 rounded-full object-fill bg-gray-200" />
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </motion.button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-6 flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {navItems.map((item, index) => (
            <motion.button
              key={item}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 py-3 text-sm whitespace-nowrap ${
                index === 0 ? "text-black" : "text-gray-500"
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
            className="absolute inset-0 bg-white z-50 p-4"
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
                className="w-full border-none outline-none"
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
            className="absolute right-6 top-16 w-64 bg-white rounded-md shadow-lg border border-gray-200 z-40"
          >
            <div className="py-2">
              {dropdownItems.map((item, index) => (
                item.type === "divider" ? (
                  <div key={index} className="h-[1px] bg-gray-200 my-2" />
                ) : (
                  <Link
                    key={index}
                    to={item.href as string}
                    className={`block px-4 py-2 text-sm ${
                      item.highlight ? 'text-green-600 font-semibold' :
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
