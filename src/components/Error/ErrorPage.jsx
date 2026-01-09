import { Link, useRouteError } from "react-router";
import { FaHome } from "react-icons/fa";

import errorImg from "../../assets/error.png"
import Footer from "../../pages/Shared/Footer/Footer";
import Navbar from "../../pages/Shared/Navbar/Navbar";

const ErrorPage = () => {
  const error = useRouteError();

  return (
   <div className="flex flex-col min-h-screen bg-[#C3DFE2]/20">
  {/* Navbar */}
  <div className="pt-5">
    <Navbar />
  </div>

  {/* Main Content */}
  <main className="flex-grow flex flex-col justify-center items-center bg-base-100 px-4 py-12 my-10 w-full max-w-7xl mx-auto rounded-2xl">
    <img src={errorImg} alt="Error" className="w-72 md:w-96 mb-6" />
    <h2 className="text-3xl font-bold text-secondary mb-2">
      Oops! Something went wrong
    </h2>
    <p className="text-gray-600 mb-6 max-w-md">
      {error?.statusText || error?.message || "The page you are looking for does not exist."}
    </p>
    <Link to="/">
      <button className="btn btn-primary text-black flex items-center gap-2 px-6">
        <FaHome /> Go Home
      </button>
    </Link>
  </main>

  {/* Footer */}
  <div className="mt-auto w-full">
    <Footer />
  </div>
</div>

  );
};

export default ErrorPage;
