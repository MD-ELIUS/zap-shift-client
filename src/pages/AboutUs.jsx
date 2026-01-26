import React, { useState } from "react";
import useTitle from "../hooks/useTitle";

const sections = {
  story: {
    label: "Story",
    content: [
      "We started with a simple promise — to make parcel delivery fast, reliable, and stress-free. Over the years, our commitment to real-time tracking, efficient logistics, and customer-first service has made us a trusted partner for thousands.",
      "From humble beginnings, we focused on solving real delivery problems faced by individuals and businesses. Every challenge helped us refine our systems and strengthen our operations nationwide.",
      "Whether it's a personal gift or a time-sensitive business delivery, we ensure it reaches its destination — on time, every time.",
    ],
  },
  mission: {
    label: "Mission",
    content: [
      "Our mission is to simplify logistics through technology-driven solutions that ensure speed, transparency, and reliability.",
      "We aim to empower businesses of all sizes with affordable delivery services while maintaining the highest standards of safety and efficiency.",
      "By continuously innovating and listening to our customers, we strive to set new benchmarks in the logistics industry.",
    ],
  },
  success: {
    label: "Success",
    content: [
      "Thousands of successful deliveries every day reflect the trust our customers place in us.",
      "Our growth is driven by consistent performance, operational excellence, and a relentless focus on customer satisfaction.",
      "Each milestone achieved motivates us to scale further and serve more regions with the same dedication.",
    ],
  },
  team: {
    label: "Team & Others",
    content: [
      "Behind every successful delivery is a passionate team working tirelessly across operations, technology, and customer support.",
      "Our riders, coordinators, and engineers collaborate to ensure seamless parcel movement nationwide.",
      "Together with our partners and stakeholders, we continue building a delivery ecosystem that people can rely on.",
    ],
  },
};

const AboutUs = () => {
  useTitle("About Us");
  const [active, setActive] = useState("story");

  return (
    <section className=" p-4 sm:p-8 md:p-10 lg:p-12 xl:p-14 2xl:p-16 max-w-7xl mx-auto bg-white rounded-2xl shadow-lg my-10">
      <div className="max-w-7xl mx-auto px-4">

        {/* Title */}
        <h2 className="text-4xl font-semibold text-secondary mb-4">
          About Us
        </h2>

        <p className="text-gray-500 max-w-2xl mb-12">
          Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle.
          From personal packages to business shipments — we deliver on time, every time.
        </p>

        {/* Tabs */}
        <div className="flex gap-5 border-b pb-4 mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {Object.keys(sections).map((key) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`transition-all whitespace-nowrap
  text-base sm:text-lg
  ${active === key
                  ? "font-bold text-black"
                  : "text-gray-500 hover:text-black"}
`}

            >
              {sections[key].label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="max-w-4xl">
          {sections[active].content.map((para, index) => (
            <p
              key={index}
              className="text-gray-600 leading-relaxed mb-5"
            >
              {para}
            </p>
          ))}
        </div>

      </div>
    </section>
  );
};

export default AboutUs;
