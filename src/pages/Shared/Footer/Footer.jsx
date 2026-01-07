import React from "react";
import { Link } from "react-router";
import { FaLinkedinIn, FaXTwitter, FaFacebookF, FaYoutube } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-black py-14">
      <div className="max-w-6xl mx-auto px-4 text-center flex flex-col items-center gap-8">

        {/* Logo / Brand */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold">
            <span className="text-primary">Zap</span>
            <span className="text-white">Shift</span>
          </h2>
        </div>

        {/* Description */}
        <p className="text-gray-300 max-w-2xl text-sm sm:text-base leading-relaxed">
          Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle.
          From personal packages to business shipments — we deliver on time, every time.
        </p>

        {/* Nav Links */}
        <div className="w-full max-w-3xl">
          <div className="border-t border-dashed mb-4" style={{ borderColor: "#62ABB3" }}></div>

          <ul className="flex flex-col sm:flex-row justify-center gap-x-6 gap-y-3 text-sm sm:text-base text-gray-300">
            <li><Link className="hover:text-primary" to="/">Services</Link></li>
            <li><Link className="hover:text-primary" to="/coverage">Coverage</Link></li>
            <li><Link className="hover:text-primary" to="/about">About Us</Link></li>
            <li><Link className="hover:text-primary" to="/pricing">Pricing</Link></li>
            <li><Link className="hover:text-primary" to="/blog">Blog</Link></li>
            <li><Link className="hover:text-primary" to="/contact">Contact</Link></li>
          </ul>

          <div className="border-b border-dashed mt-4" style={{ borderColor: "#62ABB3" }}></div>
        </div>

        {/* Social Icons */}
        <div className="flex gap-4">
          <a
            href="#"
            className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-600 hover:bg-secondary hover:text-primary text-white transition"
          >
            <FaLinkedinIn />
          </a>
          <a
            href="#"
            className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-600 hover:bg-secondary hover:text-primary text-white transition"
          >
            <FaXTwitter />
          </a>
          <a
            href="#"
            className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-600 hover:bg-secondary hover:text-primary text-white transition"
          >
            <FaFacebookF />
          </a>
          <a
            href="#"
            className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-600 hover:bg-secondary hover:text-primary text-white transition"
          >
            <FaYoutube />
          </a>
        </div>

        {/* Copyright */}
        <p className="text-xs sm:text-sm text-gray-500 mt-4">
          © {new Date().getFullYear()} ZapShift. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
