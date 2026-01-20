import React from 'react';
import Logo from '../../../components/Logo/Logo';
import { Link, NavLink } from 'react-router';
import useAuth from '../../../hooks/useAuth';
import LoadingHome from '../../../components/Loading/LoadingHome';
import avatarImg from "../../../assets/avatar.png"
import {
  FaSignInAlt,
  FaUserPlus,
  FaTachometerAlt,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";

import useRole from '../../../hooks/useRole';

const Navbar = () => {
  const { user, logOut, loading } = useAuth();
  const { role } = useRole();
  console.log(user);

  const links = <>
    <li>
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive
            ? "px-4 py-2 rounded-2xl bg-primary text-black font-semibold"
            : "px-4 py-2 rounded-2xl hover:bg-base-200"
        }
      >
        Home
      </NavLink>
    </li>

    <li>
      <NavLink
        to="/about"
        className={({ isActive }) =>
          isActive
            ? "px-4 py-2 rounded-2xl bg-primary text-black font-semibold"
            : "px-4 py-2 rounded-2xl hover:bg-base-200"
        }
      >
        About Us
      </NavLink>
    </li>

    {role === 'user' && (
      <>
        <li>
          <NavLink
            to="/send-parcel"
            className={({ isActive }) =>
              isActive
                ? "px-4 py-2 rounded-2xl bg-primary text-black font-semibold"
                : "px-4 py-2 rounded-2xl hover:bg-base-200"
            }
          >
            Send Parcel
          </NavLink>
        </li>
      </>
    )}

    <li>
      <NavLink
        to="/coverage"
        className={({ isActive }) =>
          isActive
            ? "px-4 py-2 rounded-2xl bg-primary text-black font-semibold"
            : "px-4 py-2 rounded-2xl hover:bg-base-200"
        }
      >
        Coverage
      </NavLink>
    </li>

    {role === 'user' && (
      <li>
        <NavLink
          to="/rider"
          className={({ isActive }) =>
            isActive
              ? "px-4 py-2 rounded-2xl bg-primary text-black font-semibold"
              : "px-4 py-2 rounded-2xl hover:bg-base-200"
          }
        >
          Be a Rider
        </NavLink>
      </li>
    )}

    {user && (
      <li>
        <NavLink
          to="/pricing"
          className={({ isActive }) =>
            isActive
              ? "px-4 py-2 rounded-2xl bg-primary text-black font-semibold"
              : "px-4 py-2 rounded-2xl hover:bg-base-200"
          }
        >
          Pricing
        </NavLink>
      </li>
    )}
  </>;


  const handleLogOut = () => {
    logOut()
      .then()
      .catch(error => console.log(error));
  }

  if (loading) return <LoadingHome />;

  return (
    <div className="max-w-7xl mx-auto navbar bg-base-100 shadow-sm rounded-xl px-4">

      {/* Logo left */}
      <div className="navbar-start">
        <div className="dropdown lg:hidden">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <FaBars className="h-5 w-5" />
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[50] p-2 shadow bg-base-100 rounded-box w-52 space-y-1">
            {links}
          </ul>
        </div>
        <Link to="/" className="flex text-primary items-center font-bold text-xl sm:text-2xl lg:text-3xl hover:bg-transparent ml-2 lg:ml-0">
          Zap <span className='text-secondary'>Shift</span>
        </Link>
      </div>

      {/* Menu links visible on Desktop only */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 space-x-2 font-medium">
          {links}
        </ul>
      </div>

      {/* Right side */}
      <div className="navbar-end flex items-center gap-3">

        {/* If NOT logged in */}
        {!user && (
          <>
            <Link
              to="/login"
              className="btn flex items-center gap-2 px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-2 text-xs sm:text-sm md:text-base"
            >
              <FaSignInAlt />
              Sign In
            </Link>

            <Link
              to="/register"
              className="btn btn-primary text-black flex items-center gap-2 px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-2 text-xs sm:text-sm md:text-base"
            >
              <FaUserPlus />
              Sign Up
            </Link>
          </>
        )}

        {/* If logged in */}
        {user && (
          <div className="dropdown dropdown-end">

            {/* Avatar */}
            <label tabIndex={0} className="cursor-pointer">
              <img
                src={user.photoURL || avatarImg}
                alt="User"
                className="w-10 h-10 rounded-full border border-primary object-cover"
              />
            </label>

            {/* Dropdown menu */}
            <ul
              tabIndex={0}
              className="dropdown-content z-[50] menu p-3 shadow bg-base-100 rounded-2xl w-52 mt-3"
            >
              {/* User name */}
              <li className="text-sm text-gray-500 mb-2 px-2">
                {user?.displayName || "User"}
              </li>

              {/* Dashboard */}
              <li>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 rounded-2xl px-3 py-2 hover:bg-base-200 transition"
                >
                  <FaTachometerAlt />
                  Dashboard
                </Link>
              </li>

              {/* Sign Out */}
              <li>
                <button
                  onClick={handleLogOut}
                  className="flex items-center gap-2 rounded-2xl px-3 py-2 text-red-500 hover:bg-base-200 transition w-full text-left"
                >
                  <FaSignOutAlt />
                  Sign Out
                </button>
              </li>
            </ul>

          </div>
        )}
      </div>

    </div>

  );
};

export default Navbar;
