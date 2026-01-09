import React from 'react';
import Logo from '../../../components/Logo/Logo';
import { Link, NavLink } from 'react-router';
import useAuth from '../../../hooks/useAuth';
import LoadingHome from '../../../components/Loading/LoadingHome';

const Navbar = () => {
    const {user, logOut, loading} = useAuth();
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
      Services
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

    if(loading) return <LoadingHome />;

    return (
        <div className="max-w-7xl mx-auto navbar bg-base-100 shadow-sm rounded-xl px-4">

  {/* Logo left */}
  <div className="navbar-start">
    <Link to="/" className="flex text-primary items-center font-bold text-xl sm:text-2xl lg:text-3xl hover:bg-transparent">
      Zap <span className='text-secondary'>Shift</span>
    </Link>
  </div>

{/* Menu button center on small screens */}
<div className="navbar-center lg:hidden relative">
  <div className="dropdown relative z-50">
    <div tabIndex={0} role="button" className="btn btn-ghost">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </div>
    <ul
      tabIndex={0}
      className="menu menu-sm dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow z-50 space-y-2"
    >
      {links}
    </ul>
  </div>
</div>


  {/* Menu links for large screens */}
  <div className="navbar-center hidden lg:flex ">
    <ul className="menu menu-horizontal px-1 space-x-2">{links}</ul>
  </div>

  {/* Right side buttons */}
<div className="navbar-end flex items-center gap-2">
  {user ? (
    <button 
      onClick={handleLogOut} 
      className="btn px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-2 text-xs sm:text-sm md:text-base"
    >
      Sign Out
    </button>
  ) : (
    <>
      <Link 
        to="/login" 
        className="btn px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-2 text-xs sm:text-sm md:text-base"
      >
        Sign In
      </Link>
      <Link 
        to="/register" 
        className="btn btn-primary text-black px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-2 text-xs sm:text-sm md:text-base"
      >
        Sign Up
      </Link>
    </>
  )}
</div>

</div>

    );
};

export default Navbar;
