import React, { useRef } from 'react';
import useTitle from '../../hooks/useTitle';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useLoaderData } from 'react-router';

const Coverage = () => {
  useTitle("Coverage");
  const position = [23.6850, 90.3563];
  const serviceCenters = useLoaderData();
  const mapRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    const location = e.target.location.value;
    const district = serviceCenters.find(c =>
      c.district.toLowerCase().includes(location.toLowerCase())
    );
    if (district) {
      const coord = [district.latitude, district.longitude];
      mapRef.current.flyTo(coord, 11);
    }
  };

  return (
    <div className="p-4 sm:p-8 md:p-10 lg:p-12 xl:p-14 2xl:p-16 max-w-7xl mx-auto bg-white rounded-2xl shadow-lg my-10">
      {/* Title */}
      <h2 className="text-4xl sm:text-5xl md:text-5xl font-bold text-secondary mb-6">
        We are available in 64 districts
      </h2>

      {/* Search section */}
      <div className="flex flex-col sm:flex-col md:flex-row items-start gap-3 mb-4 max-w-xl">
        <form onSubmit={handleSearch} className="w-full flex">
          <div className="flex w-full rounded-2xl overflow-hidden border border-gray-300">
            {/* Search icon inside input */}
            <div className="flex items-center px-3 bg-white">
              <svg
                className="h-5 w-5 opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.3-4.3"></path>
                </g>
              </svg>
            </div>

            {/* Input */}
            <input
              type="search"
              name="location"
              placeholder="Search here"
              className="flex-grow px-3 py-2 sm:py-3 border-none focus:outline-none text-sm sm:text-base"
            />

            {/* Button */}
            <button
              type="submit"
              className="bg-primary text-black px-6 py-2 sm:py-3 rounded-r-2xl font-semibold"
            >
              Search
            </button>
          </div>
        </form>


      </div>

      {/* Subtitle below input */}
      <p className="text-secondary text-lg sm:text-xl md:text-2xl font-semibold mt-2 mb-4">
        We deliver almost all over Bangladesh
      </p>

      {/* Map */}
      <div className="w-full h-[400px] sm:h-[450px] md:h-[520px] lg:h-[600px] rounded-xl overflow-hidden">
        <MapContainer
          center={position}
          zoom={8}
          scrollWheelZoom={false}
          className="h-full w-full"
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {serviceCenters.map((center, index) => (
            <Marker key={index} position={[center.latitude, center.longitude]}>
              <Popup>
                <strong>{center.district}</strong> <br />
                Service Area: {center.covered_area.join(', ')}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default Coverage;
