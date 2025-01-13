import { motion } from "motion/react";
import { NavLink, Outlet } from "react-router-dom"

const ProfileLayout = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
    <header className="flex flex-col items-center mb-8">
      {/* Profile Section */}
      <div className="flex items-center justify-between mb-6 w-full">
        {/* Image with name */}
        <div className="flex gap-4 items-center">
        <img
          src="https://simgbb.com/avatar/k2XfKcPYZJfb.jpg"
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover mb-2"
        />
        <h1 className="text-2xl font-bold mb-2">Miftaulislam</h1>
        </div>
        <button className="text-green-600 text-sm hover:underline">
          Edit profile
        </button>
      </div>

      {/* Navigation Tabs */}
      <nav className="w-full border-b pb-3">
        <ul className="flex gap-8">
          <NavItem to="">Home</NavItem>
          <NavItem to="lists">Lists</NavItem>
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