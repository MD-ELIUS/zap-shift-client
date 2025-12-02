import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import bannerImg1 from "../../../assets/banner/banner1.png"
import bannerImg2 from "../../../assets/banner/banner2.png"
import bannerImg3 from "../../../assets/banner/banner3.png"

const Banner = () => {
    return (
        <div className='my-10 relative' >
              <Carousel autoPlay={true} infiniteLoop={true} showThumbs={false} >
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

            {/* ONE button overlay for all slides */}
            <button className="absolute btn btn-secondary px-5 py-3  bottom-30 left-1/4  transform -translate-x-1/2  rounded-lg shadow-lg">
                Learn More
            </button>
        </div>
        
    );
};

export default Banner;