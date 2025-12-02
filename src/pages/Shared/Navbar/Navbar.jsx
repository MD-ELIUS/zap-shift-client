import React from 'react';
import Logo from '../../../components/Logo/Logo';
import { Link, NavLink } from 'react-router';
import useAuth from '../../../hooks/useAuth';
import LoadingHome from '../../../components/Loading/LoadingHome';

const Navbar = () => {
    const {user, logOut, loading} = useAuth() ;
    const links = <>
        <li><NavLink to="/">Services</NavLink></li>
        <li><NavLink to="/">About Us</NavLink></li>
        <li><NavLink to="/send-parcel">Send Parcel</NavLink></li>
        <li><NavLink to="/coverage">Coverage</NavLink></li>
        <li><NavLink to='/rider'>Be a Rider</NavLink></li>

        {
            user && <>
                <li><NavLink to="/dashboard/my-parcels">My Parcels</NavLink></li>
            </>
        }
    </>

    
    const handleLogOut = () => {
        logOut()
        .then()
        .catch(error => {
            console.log(error)
        })
    }
    if(loading) return <LoadingHome></LoadingHome>
    return (
        <div className="navbar bg-base-100 shadow-sm rounded-xl my-5">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                    </div>
                    <ul
                        tabIndex="-1"
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        {links}
                    </ul>
                </div>
                <button className="btn btn-ghost text-xl"><Logo></Logo></button>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                   {links}
                </ul>
            </div>
            <div className="navbar-end">
               {
                user ?  <a onClick={handleLogOut} className="btn">Sign Out</a> : 
                 <Link to='/login' className="btn ">Sign In</Link>
               }
                <Link to='/register' className="btn btn-primary text-black mx-4">Sign Up</Link>
            </div>
        </div>
    );
};

export default Navbar;