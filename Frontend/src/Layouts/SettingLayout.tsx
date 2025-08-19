import { motion } from "motion/react";
import { NavLink, Outlet } from "react-router-dom";

const SettingLayout = () => {
  return (
<div className="max-w-6xl mx-auto px-4 py-6">
    <header className="flex flex-col mb-8">
      {/* Profile Section */}
       <h1 className="text-3xl mb-8">Setting</h1>

      {/* Navigation Tabs */}
      <nav className="w-full border-b pb-3">
        <ul className="flex gap-8">
          <NavItem to="">Account</NavItem>
          <NavItem to="publishing-settings">Publishing</NavItem>
          <NavItem to="notification-settings">Notifications</NavItem>
          <NavItem to="membership-settings">Membership and payment</NavItem>
          <NavItem to="security-settings">Security</NavItem>
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
            `relative  pb-[14px] text-sm text-gray-600 hover:text-gray-900 ${
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
export default SettingLayout