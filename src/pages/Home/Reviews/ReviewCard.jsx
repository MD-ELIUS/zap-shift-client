import React from 'react';
import { FaQuoteLeft } from "react-icons/fa";

const ReviewCard = ({ review }) => {
  const { review: reviewText, userName, user_photoURL } = review;

  return (
    // h-full এবং flex flex-col নিশ্চিত করবে কার্ডটি পুরো স্লাইডারের হাইট নিবে
    <div className="bg-white shadow-md rounded-xl p-8 w-full h-full flex flex-col">
      
      {/* Quote Icon */}
      <FaQuoteLeft className="text-primary text-4xl mb-4 flex-shrink-0" />

      {/* Text - flex-grow ব্যবহার করা হয়েছে যাতে টেক্সট কম হলেও সে নিচের অংশকে ধাক্কা দিয়ে নিচে নামিয়ে দেয় */}
      <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
        {reviewText}
      </p>

      {/* নিচের অংশটুকু (Separator + Profile) সবসময় কার্ডের নিচে থাকবে */}
      <div className="mt-auto">
        {/* Separator */}
        <div className="border-t border-dashed border-secondary my-4"></div>

        {/* Profile */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full flex-shrink-0">
            <img 
              className='w-full h-full rounded-full object-cover border border-gray-100' 
              src={user_photoURL} 
              alt={userName} 
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-secondary leading-tight">{userName}</h3>
            <p className="text-gray-500 text-sm">Satisfied Customer</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;