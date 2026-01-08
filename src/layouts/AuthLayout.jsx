import React from 'react';
import { Link, Outlet } from 'react-router';
import authImage from "../assets/authImage.png"

const AuthLayout = () => {
    return (
        <div className='bg-[#C3DFE2]/20 min-h-screen'>
            {/* Navbar */}
            <div className='navbar px-4 sm:px-6 lg:px-8'>
                <Link to="/" className="text-primary font-bold text-xl sm:text-2xl lg:text-3xl hover:bg-transparent">
                    Zap <span className='text-secondary'>Shift</span>
                </Link>
            </div>

            {/* Main content */}
            <div className='flex flex-col-reverse md:flex-row items-center px-4 sm:px-6 lg:px-8 gap-6 md:gap-12 max-w-7xl mx-auto'>
                {/* Form */}
                <div className='flex-1 w-full'>
                    <Outlet />
                </div>

                {/* Image */}
                <div className='flex-1 w-full'>
                    <img src={authImage} alt="Auth" className='w-full h-auto object-contain' />
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
