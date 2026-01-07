import React from 'react';
import { FaTruck, FaMoneyBillWave, FaWarehouse, FaBuilding } from 'react-icons/fa';

const cardData = [
  {
    icon: <FaTruck className="text-4xl text-secondary mx-auto mb-4" />,
    title: "Booking Pick & Drop",
    description: "Schedule your parcel pickup and drop-off easily. Our drivers are fast and reliable. Track your shipment in real-time on the app or website."
  },
  {
    icon: <FaMoneyBillWave className="text-4xl text-secondary mx-auto mb-4" />,
    title: "Cash On Delivery",
    description: "Pay only when you receive your parcel. Secure and convenient payment options. Trusted by thousands of customers across the country."
  },
  {
    icon: <FaWarehouse className="text-4xl text-secondary mx-auto mb-4" />,
    title: "Delivery Hub",
    description: "Our delivery hubs ensure parcels are sorted quickly. Parcels are handled safely and efficiently. Experience faster delivery with our hub network."
  },
  {
    icon: <FaBuilding className="text-4xl text-secondary mx-auto mb-4" />,
    title: "Booking SME & Corporate",
    description: "Special services for businesses and SMEs. Manage bulk shipments easily with dedicated support. Streamline your logistics with our corporate solutions."
  }
];

const HowItWorks = () => {
  return (
    <section className="max-w-7xl mx-auto  py-12">
      {/* Section Title */}
      <h2 className="text-2xl md:text-3xl font-semibold text-secondary mb-8">
        How it Works
      </h2>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ">
        {cardData.map((card, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center">
            {/* Icon */}
            {card.icon}

            {/* Title */}
            <h3 className="text-secondary font-semibold text-lg mb-2">{card.title}</h3>

            {/* Description */}
            <p className="text-gray-600 text-sm">{card.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
