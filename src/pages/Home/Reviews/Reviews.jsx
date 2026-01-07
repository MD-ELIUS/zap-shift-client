import React, { use } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";

import ReviewCard from "./ReviewCard";
// 👉 title er uporer image (example)
import reviewTitleImg from "../../../assets/customer-top.png";

const Reviews = ({ reviewsPromise }) => {
  const reviews = use(reviewsPromise);

  return (
    <section className="py-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">

        {/* ===== Title Section (NEW) ===== */}
        <div className="text-center mb-10">
          <img
            src={reviewTitleImg}
            alt="reviews"
            className="mx-auto mb-4 h-12 sm:h-16 object-contain"
          />

          <h2 className="text-2xl sm:text-3xl font-semibold text-secondary mb-3">
            What our customers are sayings
          </h2>

          <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base">
            Enhance posture, mobility, and well-being effortlessly with Posture Pro.
            Achieve proper alignment, reduce pain, and strengthen your body with ease!
          </p>
        </div>
        {/* ===== Title Section End ===== */}

        <Swiper
          grabCursor={true}
          loop={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          slidesPerView={1}
          centeredSlides={true}
          spaceBetween={10}
          breakpoints={{
            320: {
              slidesPerView: 1.2,
              centeredSlides: true,
              spaceBetween: 10,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 15,
              centeredSlides: false,
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
            1024: {
              slidesPerView: 3,
              spaceBetween: 20,
              centeredSlides: true,
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
          className="mySwiper !pb-12"
        >
          {reviews.map((review) => (
            <SwiperSlide key={review.id} className="!h-auto flex">
              <div className="w-full flex">
                <ReviewCard review={review} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    </section>
  );
};

export default Reviews;
