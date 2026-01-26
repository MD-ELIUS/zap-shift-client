import React, { useState } from "react";
import { NavLink, Outlet } from "react-router";
import useTitle from "../hooks/useTitle";
import {
  FaHome,
  FaTasks,
  FaUsers,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";
import { LiaCubeSolid } from "react-icons/lia";
import { MdOutlineDirectionsBike, MdPayment } from "react-icons/md";
import { RiEBikeFill } from "react-icons/ri";
import { SiGoogletasks } from "react-icons/si";
import { CgProfile } from "react-icons/cg";
import useAuth from "../hooks/useAuth";
import useRole from "../hooks/useRole";
import { AiFillDashboard } from "react-icons/ai";

import Loading from "../components/Loading/Loading";

const NAVBAR_HEIGHT = "64px";

const DashboardLayout = () => {
  useTitle("Dashboard");
  const { logOut, user,  } = useAuth();
  const { role } = useRole();
  // Sidebar always expanded on Desktop by default
  const [collapsed, setCollapsed] = useState(false);



  const showText = !collapsed;

  const linkClass = collapsed
    ? "flex items-center justify-center p-2 rounded-lg transition-all"
    : "flex items-center justify-start gap-3 p-3 rounded-lg transition-all";

  const activeClass = "bg-primary text-white font-semibold";
  const hoverClass = "hover:bg-base-300";

  const getLinkClass = (isActive) =>
    `${linkClass} ${isActive ? activeClass : hoverClass}`;

  // Helper for Mobile Horizontal Links
  const getMobileLinkClass = (isActive) =>
    `flex flex-col items-center justify-center p-2 min-w-[70px] text-xs text-center rounded-lg transition-all ${isActive ? "bg-primary text-white" : "hover:bg-base-200"}`

  const dashboardLinks = (
    <>
      <li className="mb-2 border-b pb-2 border-base-300 md:block hidden">
        <NavLink
          to="/"
          className={collapsed ? `${linkClass} w-full custom-tooltip` : linkClass}
          data-tooltip={collapsed ? "Home" : undefined}
        >
          <FaHome size={collapsed ? 20 : 20} />
          {showText && <span>Home</span>}
        </NavLink>
      </li>

      <li>
        <NavLink
          end
          to="/dashboard"
          className={({ isActive }) => collapsed ? `${getLinkClass(isActive)} w-full custom-tooltip` : getLinkClass(isActive)}
          data-tooltip={collapsed ? "Dashboard" : undefined}
        >
          <AiFillDashboard size={collapsed ? 20 : 20} />
          {showText && <span>Dashboard</span>}
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/dashboard/profile"
          className={({ isActive }) => collapsed ? `${getLinkClass(isActive)} w-full custom-tooltip` : getLinkClass(isActive)}
          data-tooltip={collapsed ? "My Profile" : undefined}
        >
          <CgProfile size={collapsed ? 20 : 20} />
          {showText && <span>My Profile</span>}
        </NavLink>
      </li>

      {/* Admin Only Links */}
      {role === 'admin' && (
        <>
          <li>
            <NavLink
              to="/dashboard/approve-riders"
              className={({ isActive }) => collapsed ? `${getLinkClass(isActive)} w-full custom-tooltip` : getLinkClass(isActive)}
              data-tooltip={collapsed ? "Approve Riders" : undefined}
            >
              <MdOutlineDirectionsBike size={collapsed ? 20 : 20} />
              {showText && <span>Approve Riders</span>}
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/dashboard/assign-riders"
              className={({ isActive }) => collapsed ? `${getLinkClass(isActive)} w-full custom-tooltip` : getLinkClass(isActive)}
              data-tooltip={collapsed ? "Assign Riders" : undefined}
            >
              <RiEBikeFill size={collapsed ? 20 : 20} />
              {showText && <span>Assign Riders</span>}
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/dashboard/users-management"
              className={({ isActive }) => collapsed ? `${getLinkClass(isActive)} w-full custom-tooltip` : getLinkClass(isActive)}
              data-tooltip={collapsed ? "Users Management" : undefined}
            >
              <FaUsers size={collapsed ? 20 : 20} />
              {showText && <span>Users Management</span>}
            </NavLink>
          </li>
        </>
      )}

      {/* Rider Only Links */}
      {role === 'rider' && (
        <>
          <li>
            <NavLink
              to="/dashboard/assigned-deliveries"
              className={({ isActive }) => collapsed ? `${getLinkClass(isActive)} w-full custom-tooltip` : getLinkClass(isActive)}
              data-tooltip={collapsed ? "Assigned Deliveries" : undefined}
            >
              <FaTasks size={collapsed ? 20 : 20} />
              {showText && <span>Assigned Deliveries</span>}
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/dashboard/completed-deliveries"
              className={({ isActive }) => collapsed ? `${getLinkClass(isActive)} w-full custom-tooltip` : getLinkClass(isActive)}
              data-tooltip={collapsed ? "Completed Deliveries" : undefined}
            >
              <SiGoogletasks size={collapsed ? 20 : 20} />
              {showText && <span>Completed Deliveries</span>}
            </NavLink>
          </li>
        </>
      )}

      {/* User Only Links */}
      {role === 'user' && (
        <>
          <li>
            <NavLink
              to="/dashboard/my-parcels"
              className={({ isActive }) => collapsed ? `${getLinkClass(isActive)} w-full custom-tooltip` : getLinkClass(isActive)}
              data-tooltip={collapsed ? "My Parcels" : undefined}
            >
              <LiaCubeSolid size={collapsed ? 20 : 20} />
              {showText && <span>My Parcels</span>}
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/dashboard/payment-history"
              className={({ isActive }) => collapsed ? `${getLinkClass(isActive)} w-full custom-tooltip` : getLinkClass(isActive)}
              data-tooltip={collapsed ? "Payment History" : undefined}
            >
              <MdPayment size={collapsed ? 20 : 20} />
              {showText && <span>Payment History</span>}
            </NavLink>
          </li>
        </>
      )}
    </>
  );

  // Mobile Horizontal Menu Links
  const mobileDashboardLinks = (
    <div className="flex gap-2 overflow-x-auto p-2 bg-base-100 border-b border-base-300 w-full no-scrollbar">
      <NavLink to="/" className={({ isActive }) => getMobileLinkClass(isActive)}>
        <FaHome size={18} />
        <span className="mt-1">Home</span>
      </NavLink>

      <NavLink to="/dashboard" end className={({ isActive }) => getMobileLinkClass(isActive)}>
        <AiFillDashboard size={18} />
        <span className="mt-1">Dash</span>
      </NavLink>

      <NavLink to="/dashboard/profile" className={({ isActive }) => getMobileLinkClass(isActive)}>
        <CgProfile size={18} />
        <span className="mt-1">Profile</span>
      </NavLink>

      {/* Admin Mobile Links */}
      {role === 'admin' && (
        <>
          <NavLink to="/dashboard/approve-riders" className={({ isActive }) => getMobileLinkClass(isActive)}>
            <MdOutlineDirectionsBike size={18} />
            <span className="mt-1">Riders</span>
          </NavLink>
          <NavLink to="/dashboard/assign-riders" className={({ isActive }) => getMobileLinkClass(isActive)}>
            <RiEBikeFill size={18} />
            <span className="mt-1">Assign</span>
          </NavLink>
          <NavLink to="/dashboard/users-management" className={({ isActive }) => getMobileLinkClass(isActive)}>
            <FaUsers size={18} />
            <span className="mt-1">Users</span>
          </NavLink>
        </>
      )}

      {/* Rider Mobile Links */}
      {role === 'rider' && (
        <>
          <NavLink to="/dashboard/assigned-deliveries" className={({ isActive }) => getMobileLinkClass(isActive)}>
            <FaTasks size={18} />
            <span className="mt-1">Assigned</span>
          </NavLink>
          <NavLink to="/dashboard/completed-deliveries" className={({ isActive }) => getMobileLinkClass(isActive)}>
            <SiGoogletasks size={18} />
            <span className="mt-1">Done</span>
          </NavLink>
        </>
      )}

      {/* User Mobile Links */}
      {role === 'user' && (
        <>
          <NavLink to="/dashboard/my-parcels" className={({ isActive }) => getMobileLinkClass(isActive)}>
            <LiaCubeSolid size={18} />
            <span className="mt-1">Parcels</span>
          </NavLink>
          <NavLink to="/dashboard/payment-history" className={({ isActive }) => getMobileLinkClass(isActive)}>
            <MdPayment size={18} />
            <span className="mt-1">Payments</span>
          </NavLink>
        </>
      )}

      <button onClick={logOut} className="flex flex-col items-center justify-center p-2 min-w-[70px] text-xs text-center rounded-lg text-error hover:bg-base-200">
        <FaSignOutAlt size={18} />
        <span className="mt-1">Logout</span>
      </button>
    </div>
  );


  return (
    <div className="min-h-screen bg-base-100 max-w-[1440px] mx-auto w-full flex flex-col shadow-2xl">
      {/* ================= NAVBAR ================= */}
      <nav
        className="navbar bg-base-300 sticky top-0 z-50 px-2"
        style={{ height: NAVBAR_HEIGHT }}
      >
        {/* Toggle Button only on Desktop */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="btn btn-ghost btn-square hidden md:flex"
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <FaBars size={20} />
        </button>

        <h2 className="font-bold text-xl text-secondary ml-2 flex-1">
          <span className="text-primary">Zap</span><span className="text-secondary">Shift</span> Dashboard
        </h2>

        {/* User Profile */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col text-right">
            <p className="text-secondary font-bold text-sm leading-tight">{user?.displayName || "User"}</p>
            <p className="text-xs text-secondary font-semibold uppercase">{role || "Guest"}</p>
          </div>

          <div className="w-10 h-10 rounded-full border border-primary overflow-hidden">
            <img
              alt="User Profile"
              className="w-full h-full object-cover"
              src={user?.photoURL || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
            />
          </div>
        </div>
      </nav>

      {/* ================= MOBILE MENU (Visible only on mobile) ================= */}
      <div className="md:hidden sticky top-[64px] z-40">
        {mobileDashboardLinks}
      </div>

      <div className="flex flex-1">
        {/* ================= DESKTOP SIDEBAR ================= */}
        <aside
          className={`
            hidden md:flex flex-col bg-base-200 z-[100]
            transition-all duration-300 sticky top-[64px]
            h-[calc(100vh-64px)]
            ${collapsed ? "w-16" : "w-64"}
          `}
        >
          <ul className="flex flex-col flex-1 p-2 gap-2 overflow-y-auto overflow-x-hidden">
            {dashboardLinks}
          </ul>

          <div className="p-2 border-t">
            <button
              onClick={logOut}
              className="btn btn-outline w-full text-red-500 flex items-center gap-2"
            >
              <FaSignOutAlt />
              {showText && <span>Log Out</span>}
            </button>
          </div>
        </aside>

        {/* ================= MAIN CONTENT ================= */}
        <main className="flex-1 p-4 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
