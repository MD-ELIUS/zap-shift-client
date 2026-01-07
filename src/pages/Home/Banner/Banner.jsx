import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import { FaBoxOpen, FaMotorcycle } from "react-icons/fa";
import bannerImg1 from "../../../assets/banner/banner1.png"
import bannerImg2 from "../../../assets/banner/banner2.png"
import bannerImg3 from "../../../assets/banner/banner3.png"

const Banner = () => {
    return (
        <div className='my-10 relative'>
            <Carousel 
                autoPlay={true} 
                infiniteLoop={true} 
                showThumbs={false} 
                showStatus={false}
            >
                <div>
                    <img src={bannerImg1} />
                </div>
                <div>
                    <img src={bannerImg2} />
                </div>
                <div>
                    <img src={bannerImg3} />
                </div>
            </Carousel>

            {/* Buttons overlay */}
           {/* Left button */}
<button className="
  absolute bottom-2 md:bottom-4 left-4
  flex items-center gap-1 sm:gap-2
  bg-secondary text-white
  px-3 py-1.5 sm:px-5 sm:py-3
  rounded-full shadow-lg
  text-xs sm:text-base
">
  <FaBoxOpen className="text-xs sm:text-base" />
  Track Your Parcel
</button>

{/* Right button */}
<button className="
  absolute bottom-2  md:bottom-4 right-4
  flex items-center gap-1 sm:gap-2
  bg-secondary text-white
  px-3 py-1.5 sm:px-5 sm:py-3
  rounded-full shadow-lg
  text-xs sm:text-base
">
  <FaMotorcycle className="text-xs sm:text-base" />
  Be A Rider
</button>


        </div>
    );
};

export default Banner;
