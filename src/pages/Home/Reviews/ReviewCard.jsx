import React from 'react';
import { FaQuoteLeft } from "react-icons/fa";

const ReviewCard = ({review}) => {
    const {review:reviewText, userName, user_photoURL} = review
    return (
        <div className="bg-white shadow-md rounded-xl p-8 max-w-md">
      {/* Quote Icon */}
      <FaQuoteLeft className="text-primary text-4xl mb-4" />

      {/* Text */}
      <p className="text-gray-600 leading-relaxed mb-6">
       {reviewText}
      </p>

      {/* Separator */}
      <div className="border-t border-dashed border-secondary my-4"></div>

      {/* Profile */}
      <div className="flex items-center gap-4 mt-4">
        <div className="w-12 h-12 rounded-full">
            <img className='w-full h-full rounded-full' src={user_photoURL} alt="" />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-secondary">{userName}</h3>
          <p className="text-gray-500 text-sm">Senior Product Designer</p>
        </div>
      </div>
    </div>
    );
};

export default ReviewCard;