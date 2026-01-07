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
    <section className="bg-secondary p-16 rounded-xl">
      {/* Section Title */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white">Our Services</h2>
        <p className="text-white text-opacity-70 mt-2 text-sm md:text-base">
          Explore the wide range of services we offer for individuals and businesses
        </p>
      </div>

      {/* Services Cards */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {servicesData.map((service, index) => (
          <div key={index} className="bg-white hover:bg-primary transition-all rounded-xl shadow-lg p-6 flex flex-col items-center text-center">
            {/* Icon */}
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              {service.icon}
            </div>

            {/* Title */}
            <h3 className="text-secondary font-semibold text-lg mb-2">{service.title}</h3>

            {/* Description */}
            <p className="text-gray-600 text-sm">{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OurServices;
