import React from 'react';
import { FaShippingFast, FaGlobeAmericas, FaBoxOpen, FaMoneyBillWave, FaBuilding, FaUndo } from 'react-icons/fa';

const servicesData = [
  {
    icon: <FaShippingFast className="text-2xl text-secondary" />,
    title: "Express & Standard Delivery",
    description: "Fast and reliable delivery options for your parcels. Choose express or standard service based on your needs."
  },
  {
    icon: <FaGlobeAmericas className="text-2xl text-secondary" />,
    title: "Nationwide Delivery",
    description: "We cover the entire country. Send parcels anywhere with confidence and track every step of the way."
  },
  {
    icon: <FaBoxOpen className="text-2xl text-secondary" />,
    title: "Fulfillment Solution",
    description: "Complete order fulfillment services including packing, shipping, and inventory management for businesses."
  },
  {
    icon: <FaMoneyBillWave className="text-2xl text-secondary" />,
    title: "Cash on Home Delivery",
    description: "Convenient cash on delivery option. Customers can pay safely at the time of receiving their parcels."
  },
  {
    icon: <FaBuilding className="text-2xl text-secondary" />,
    title: "Corporate Service / Contract In Logistics",
    description: "Specialized services for corporate clients. Manage bulk shipments with dedicated logistics support."
  },
  {
    icon: <FaUndo className="text-2xl text-secondary" />,
    title: "Parcel Return",
    description: "Easy and secure parcel return service for customers and businesses. Track return status in real-time."
  }
];

const OurServices = () => {
  return (
    // p-16 কে পরিবর্তন করে রেসপন্সিভ প্যাডিং দেওয়া হয়েছে
    <section className="bg-secondary py-12 px-6 md:py-20 md:px-16 lg:px-24 rounded-2xl md:rounded-3xl">
      {/* Section Title */}
      <div className="text-center mb-10 md:mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-white">Our Services</h2>
        <p className="text-white text-opacity-80 mt-3 text-sm md:text-lg max-w-2xl mx-auto">
          Explore the wide range of services we offer for individuals and businesses
        </p>
      </div>

      {/* Services Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {servicesData.map((service, index) => (
          <div 
            key={index} 
            className="group bg-white hover:bg-orange-50 transition-all duration-300 rounded-2xl shadow-lg p-8 flex flex-col items-center text-center border border-transparent hover:border-white/20"
          >
            {/* Icon Container */}
            <div className="bg-gray-100 rounded-2xl w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              {service.icon}
            </div>

            {/* Title */}
            <h3 className="text-secondary font-bold text-xl mb-3 leading-tight">
                {service.title}
            </h3>

            {/* Description */}
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                {service.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OurServices;