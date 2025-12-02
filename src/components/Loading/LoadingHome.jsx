import React from "react";
import { Link } from "react-router";
import Logo from "../Logo/Logo";

const LoadingHome = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center animate-fade-in-center">
      {/* Spinner */}
      <div className="w-16 h-16 border-4 border-dashed rounded-full border-primary border-t-transparent animate-spin mb-6"></div>

      {/* Loading text */}
      <p className="text-lg font-semibold text-secondary ">
        Preparing your page...
      </p>
      <p className="text-base text-base-300 mb-2">
        Thank you for your patience.
      </p>
      <div className="flex items-center gap-2 text-xl font-bold">
                    
                     <Logo></Logo>
                    
                </div>
    </div>
  );
};

export default LoadingHome;
