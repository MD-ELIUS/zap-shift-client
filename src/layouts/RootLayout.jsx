import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../pages/Shared/Navbar/Navbar';
import Footer from '../pages/Shared/Footer/Footer';

const RootLayout = () => {
    return (
        <div className='max-w-[1400px] mx-auto bg-[#C3DFE2]/20 px-4 '>
           <section className='pt-5'> 
             <Navbar></Navbar>
           </section>
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
    );
};

export default RootLayout;