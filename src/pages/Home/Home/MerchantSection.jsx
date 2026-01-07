import React from "react";
import merchantImg from "../../../assets/location-merchant.png"; // replace with your image path
import bgImg from "../../../assets/be-a-merchant-bg.png"

const MerchantSection = () => {
  return (
    <section className="relative bg-secondary py-12 px-6 md:py-20 md:px-16 lg:px-24 rounded-2xl md:rounded-3xl overflow-hidden">
      {/* Optional background overlay image */}
     <div
  className="absolute inset-0 bg-no-repeat opacity-10 pointer-events-none"
  style={{
    backgroundImage: `url(${bgImg})`,
    backgroundPosition: "center 20%", // moves the bg a bit lower from top
    backgroundSize: "cover",          // ensures it covers the width nicely
  }}
></div>


      <div className="max-w-7xl mx-auto px-4 flex flex-col-reverse lg:flex-row items-center gap-8">
        
        {/* Left Content */}
        <div className="flex-1 text-center lg:text-left z-10">
          <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Merchant and Customer Satisfaction is Our First Priority
          </h2>
          <p className="text-white text-sm sm:text-base md:text-lg mb-6 leading-relaxed">
            We offer the lowest delivery charge with the highest value along with 100% safety of your product.
            Pathao courier delivers your parcels in every corner of Bangladesh right on time.
          </p>
          <button className="bg-primary text-black font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition">
            Become a Merchant
          </button>
        </div>

        {/* Right Image */}
        <div className="flex-1 z-10">
          <img
            src={merchantImg}
            alt="Merchant"
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default MerchantSection;
