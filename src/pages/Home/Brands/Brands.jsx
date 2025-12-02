import React from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import { Autoplay, Pagination } from 'swiper/modules';
import amazon from "../../../assets/brands/amazon.png" ;
import amazon_vector from "../../../assets/brands/amazon_vector.png" ;
import casio from "../../../assets/brands/casio.png" ;
import moonstar from "../../../assets/brands/moonstar.png" ;
import randstad from "../../../assets/brands/randstad.png" ;
import star from "../../../assets/brands/star.png" ;
import start_people from "../../../assets/brands/start_people.png" ;

const brandLogos = [amazon, amazon_vector, casio, moonstar, randstad, star, start_people] ;
const Brands = () => {
    return (
       <Swiper   
       slidesPerView={4}
        centeredSlides={true}
        spaceBetween={30}
        grabCursor={true}
        loop={true}
        autoplay={{
            delay: 2500 ,
            disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        modules={[Autoplay, Pagination]}
        className="mySwiper"
       >

        {
            brandLogos.map((logo,index) => <SwiperSlide key={index}><img src={logo} alt="" /></SwiperSlide> )
        }
        
        
       </Swiper>
    );
};

export default Brands;