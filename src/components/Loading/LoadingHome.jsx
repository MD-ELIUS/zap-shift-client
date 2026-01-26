import { Link } from "react-router";
import Logo from "../Logo/Logo";
import Lottie from "lottie-react";
import loadingAnimation from "../../assets/json/loading.json";

const LoadingHome = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-base-100 p-4">
      {/* Restored Lottie Animation with EXACT Primary Color (#CAEB66) Filter */}
      <div className="max-w-[250px] mb-4 relative">
        <div style={{ filter: 'invert(93%) sepia(35%) saturate(543%) hue-rotate(27deg) brightness(101%) contrast(89%)' }}>
          <Lottie
            animationData={loadingAnimation}
            loop={true}
          />
        </div>
      </div>

      {/* Loading text with Primary Color */}
      <h2 className="text-3xl font-bold text-primary mb-2 animate-pulse">
        System Initializing...
      </h2>
      <p className="text-lg font-medium text-secondary">
        Preparing your ZapShift experience
      </p>
      <p className="text-sm text-gray-400 mb-8 font-medium">
        Thank you for your patience
      </p>

      {/* Brand Identity */}
      <div className="flex items-center gap-2 transform scale-110">
        <Logo />
      </div>
    </div>
  );
};

export default LoadingHome;
