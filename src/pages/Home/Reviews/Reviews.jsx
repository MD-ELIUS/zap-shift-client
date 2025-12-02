import React, { use } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// import required modules

import ReviewCard from './ReviewCard';
import { Autoplay, EffectCoverflow, Pagination } from 'swiper/modules';

const Reviews = ({reviewsPromise}) => {
  const reviews = use(reviewsPromise) ;
  console.log(reviews)
    return (
        <>
        
      
       <Swiper
       effect={'coverflow'}
        grabCursor={true}
        
        centeredSlides={true}
       loop={true}
        autoplay={{
            delay: 2500 ,
            disableOnInteraction: false,
        }}
        slidesPerView={3}
        coverflowEffect={{
          rotate: 0,
          stretch: "30%",
          depth: 120,
          modifier: 1,
          scale:0.8,
          slideShadows: true,
        }}
        pagination={true}
        modules={[EffectCoverflow, Pagination, Autoplay]}
        className="mySwiper my-10"
       >

        
              {
                reviews.map(review => <SwiperSlide> <ReviewCard key={review.id} review={review}></ReviewCard> </SwiperSlide>)
              }
        

       </Swiper>
         </>
    );
};

export default Reviews;