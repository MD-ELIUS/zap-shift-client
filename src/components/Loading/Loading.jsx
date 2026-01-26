import React from "react";
import Lottie from "lottie-react";
import loadingAnimation from "../../assets/json/loading.json";

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-2 min-h-[200px] w-full">
      {/* Restored Lottie Animation with EXACT Primary Color (#CAEB66) Filter */}
      <div className="max-w-[200px] relative">
        <div style={{ filter: 'invert(93%) sepia(35%) saturate(543%) hue-rotate(27deg) brightness(101%) contrast(89%)' }}>
          <Lottie
            animationData={loadingAnimation}
            loop={true}
          />
        </div>
      </div>
      <p className="text-secondary font-medium animate-pulse">Loading data...</p>
    </div>
  );
};

export default Loading;