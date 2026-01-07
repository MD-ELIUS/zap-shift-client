import React from "react";
import cardImg1 from "../../../assets/live-tracking.png";
import cardImg2 from "../../../assets/safe-delivery.png";

const cardData = [
  {
    title: "Live Parcel Tracking",
    description:
      "Easily track your parcel in real-time with our accurate tracking system. Stay updated throughout the delivery process.",
    image: cardImg1,
  },
  {
    title: "100% Safe Delivery",
    description:
      "Your parcels are handled with utmost care and delivered safely to the right recipient every time.",
    image: cardImg2,
  },
  {
    title: "24/7 Call Center Support",
    description:
      "Our support team is available round the clock to assist you with any queries or delivery issues.",
    image: cardImg2,
  },
];

const FeatureCards = () => {
  return (
    <section className="py-8 ">
      <div className="max-w-7xl mx-auto px-4 flex flex-col gap-6">
        {cardData.map((card, index) => (
          <div
            key={index}
            // items-stretch ensures the divider takes full height
            className="bg-white rounded-xl shadow-md flex flex-col md:flex-row items-stretch p-4 md:p-5 gap-10"
          >
            {/* Image - W-auto এবং justify-start দিয়ে একদম বামে সরানো হয়েছে */}
            <div className="flex-shrink-0 flex items-center justify-center md:justify-start md:pr-4">
              <img
                src={card.image}
                alt={card.title}
                className="w-32 h-32 md:w-40 md:h-40 object-contain rounded-xl"
              />
            </div>

            {/* Vertical Dashed Line */}
            <div className="hidden md:block py-4">
              <div className="border-l-2 border-dashed border-gray-300 h-full" />
            </div>

            {/* Title + Description - ml-4 থেকে বাড়িয়ে ml-6 বা pl-6 করা হয়েছে */}
            <div className="flex-1 flex flex-col justify-center text-center md:text-left mt-4 md:mt-0 md:pl-8">
              <h3 className="text-secondary text-lg md:text-xl font-semibold mb-2">
                {card.title}
              </h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                {card.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureCards;