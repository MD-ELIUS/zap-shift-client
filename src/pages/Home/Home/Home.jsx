import React from 'react';
import Banner from '../Banner/Banner';
import Brands from '../Brands/Brands';
import Reviews from '../Reviews/Reviews';
import HowItWorks from '../HowItWorks';
import OurServices from './OurServices';


const reviewsPromise = fetch('/reviews.json').then(res => res.json())

const Home = () => {
    return (
        <div className='max-w-7xl mx-auto'>
            <Banner></Banner>

            <HowItWorks></HowItWorks>
            <OurServices></OurServices>
            {/* <Brands></Brands> */}
            
            <Reviews reviewsPromise={reviewsPromise}></Reviews>
        </div>
    );
};

export default Home;