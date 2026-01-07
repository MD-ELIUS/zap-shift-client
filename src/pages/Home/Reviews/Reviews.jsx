import React, { use } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";

import ReviewCard from "./ReviewCard";

const Reviews = ({ reviewsPromise }) => {
  const reviews = use(reviewsPromise);

  return (
    <section className="py-12 ">
      <div className="max-w-7xl mx-auto px-4">
        <Swiper
          grabCursor={true}
          loop={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          centeredSlides={true}
          slidesPerView={1} // Default mobile
          spaceBetween={0}  // Remove gaps on mobile
          breakpoints={{
            640: { // sm screens
              slidesPerView: 1,
              spaceBetween: 0,
              centeredSlides: true,
            },
            768: { // md screens
              slidesPerView: 2,
              spaceBetween: 15,
              effect: "coverflow",
              coverflowEffect: {
                rotate: 0,
                stretch: 20,
                depth: 120,
                modifier: 1,
                scale: 0.85,
                slideShadows: true,
              },
            },
            1024: { // lg screens
              slidesPerView: 3,
              spaceBetween: 20,
              effect: "coverflow",
              coverflowEffect: {
                rotate: 0,
                stretch: 30,
                depth: 120,
                modifier: 1,
                scale: 0.8,
                slideShadows: true,
              },
            },
          }}
          modules={[EffectCoverflow, Autoplay]}
          className="mySwiper"
        >
          {reviews.map((review) => (
            <SwiperSlide key={review.id} className="flex justify-center">
              <ReviewCard review={review} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Reviews;
