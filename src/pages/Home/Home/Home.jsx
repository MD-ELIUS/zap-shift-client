import React from 'react';
import Banner from '../Banner/Banner';
import Brands from '../Brands/Brands';
import Reviews from '../Reviews/Reviews';
import HowItWorks from '../HowItWorks';
import OurServices from './OurServices';
import FeatureCards from './FeatureCards';


const reviewsPromise = fetch('/reviews.json').then(res => res.json())

const Home = () => {
    return (
        <div className='max-w-7xl mx-auto'>
            <Banner></Banner>

            <HowItWorks></HowItWorks>
            <OurServices></OurServices>
            <Brands></Brands> 
            {/* Horizontal Dashed Line */}
<div className="flex justify-center bg-gray-50"> 

  <div className="w-[80%] border-t-2 border-dashed border-gray-300"></div>
</div>
            <FeatureCards></FeatureCards>
            <Reviews reviewsPromise={reviewsPromise}></Reviews>
        </div>
    );
};

export default Home;