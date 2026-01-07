import React from "react";
import amazon_vector from "../../../assets/brands/amazon_vector.png";
import casio from "../../../assets/brands/casio.png";
import moonstar from "../../../assets/brands/moonstar.png";
import randstad from "../../../assets/brands/randstad.png";
import star from "../../../assets/brands/star.png";
import start_people from "../../../assets/brands/start_people.png";

const brands = [amazon_vector, casio, moonstar, randstad, star, start_people];

const Brands = () => {
  // Duplicate logos for seamless scroll
  const scrollingBrands = [...brands, ...brands];

  return (
    <section className="pt-12  pb-5 overflow-hidden">
      {/* Section Title */}
      <div className="text-center mb-8">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-secondary">
          We've helped thousands of sales teams
        </h2>
      </div>

      {/* Continuous Marquee */}
      <div className="relative w-full">
        <div className="flex animate-marquee whitespace-nowrap">
          {scrollingBrands.map((logo, index) => (
            <div
              key={index}
              className="inline-flex items-center justify-center w-24 sm:w-28 md:w-32 mx-5 flex-shrink-0"
            >
              <img
                src={logo}
                alt={`brand-${index}`}
                className="h-10 sm:h-12 md:h-16 object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom padding */}
      <div className="h-4 md:h-8"></div>

      {/* CSS for continuous scroll */}
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            display: flex;
            min-width: max-content;
            animation: marquee 25s linear infinite;
          }
        `}
      </style>
    </section>
  );
};

export default Brands;
