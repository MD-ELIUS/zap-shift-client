import React, { useState } from "react";
import { NavLink, Outlet } from "react-router";
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
import { AiFillDashboard } from "react-icons/ai";

const NAVBAR_HEIGHT = "64px";

const DashboardLayout = () => {
  const { logOut } = useAuth();
  const [collapsed, setCollapsed] = useState(true);

  const showText = !collapsed;

  const linkClass =
    "flex items-center gap-3 p-3 rounded-lg hover:bg-base-300 transition-all";

  const activeClass = "bg-primary text-white font-semibold";

  const dashboardLinks = (
    <>
      <li>
        <NavLink
        end
          to="/dashboard"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <AiFillDashboard size={20} />
          {showText && <span>Dashboard</span>}
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/dashboard/profile"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <CgProfile size={20} />
          {showText && <span>My Profile</span>}
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/dashboard/my-parcels"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <LiaCubeSolid size={20} />
          {showText && <span>My Parcels</span>}
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/dashboard/payment-history"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <MdPayment size={20} />
          {showText && <span>Payment History</span>}
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/dashboard/assigned-deliveries"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <FaTasks size={20} />
          {showText && <span>Assigned Deliveries</span>}
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/dashboard/completed-deliveries"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <SiGoogletasks size={20} />
          {showText && <span>Completed Deliveries</span>}
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/dashboard/approve-riders"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <MdOutlineDirectionsBike size={20} />
          {showText && <span>Approve Riders</span>}
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/dashboard/assign-riders"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <RiEBikeFill size={20} />
          {showText && <span>Assign Riders</span>}
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/dashboard/users-management"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          <FaUsers size={20} />
          {showText && <span>Users Management</span>}
        </NavLink>
      </li>
    </>
  );

  return (
    <div className="min-h-screen bg-base-100 max-w-[1400px] mx-auto relative">
      {/* ================= NAVBAR ================= */}
      <nav
        className="navbar bg-base-300 sticky top-0 z-50 px-2"
        style={{ height: NAVBAR_HEIGHT }}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="btn btn-ghost btn-square"
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <FaBars size={20} />
        </button>

        <h2 className="font-bold text-xl text-secondary ml-2">
          <span className="text-primary">Zap</span><span className="text-secondary">Shift</span> Dashboard
        </h2>
      </nav>

      {/* Wrapper for Sidebar and Content to keep sidebar relative to 1400px container */}
      <div className="relative flex">
        {/* ================= MOBILE OVERLAY ================= */}
        {!collapsed && (
          <div
            onClick={() => setCollapsed(true)}
            className="fixed inset-0 bg-black/40 z-30 md:hidden"
          />
        )}

        {/* ================= SIDEBAR ================= */}
        {/* Changed 'fixed' to 'absolute' so it respects the max-w container */}
        <aside
          className={`
            absolute left-0 bg-base-200 z-40
            transition-all duration-300 flex flex-col
            h-[calc(100vh-64px)]
            ${
              collapsed
                ? "w-16 -translate-x-full md:translate-x-0"
                : "w-64 translate-x-0"
            }
          `}
        >
          <ul className="menu flex-1 p-2">{dashboardLinks}</ul>

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
        <main
          className={`
            flex-1
            transition-all duration-300
            pt-4
            md:ml-16
            ${!collapsed && "md:ml-64"}
          `}
        >
          <div className="p-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;