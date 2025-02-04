import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../../hooks/axiosSecure";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navbar from "../../components/shared/Navbar";
import { motion } from "framer-motion";
import Footer from "../../components/Footer";
import { useState } from "react";

const AllProperties = () => {
  const axiosSecureInstance = axiosSecure();
  const [searchLocation, setSearchLocation] = useState("");
  const [sortOrder, setSortOrder] = useState("none"); // 'none', 'asc', 'desc'

  const { data: properties, isLoading } = useQuery({
    queryKey: ["properties"],
    queryFn: async () => {
      const response = await axiosSecureInstance.get(
        "https://dwellio-realestate.vercel.app/properties"
      );
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const filteredAndSortedProperties = properties
    ?.filter((property) =>
      property.location.toLowerCase().includes(searchLocation.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "none") return 0;
      const priceA = (a.priceRange.min + a.priceRange.max) / 2;
      const priceB = (b.priceRange.min + b.priceRange.max) / 2;
      return sortOrder === "asc" ? priceA - priceB : priceB - priceA;
    });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Helmet>
        <title>All Properties | Dwellio</title>
      </Helmet>

      <Navbar />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 my-24">
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-16 mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-center"
        >
          All Properties
        </motion.h2>

        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8 flex flex-col md:flex-row items-center justify-center gap-4 max-w-4xl mx-auto"
        >
          <div className="relative w-full md:w-2/3">
            <input
              type="text"
              placeholder="Search by location..."
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="w-full p-4 pl-12 border border-primary/30 rounded-2xl focus:outline-none focus:border-primary bg-base-100/80 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-all duration-300"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 absolute left-4 top-1/2 transform -translate-y-1/2 text-primary/60"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full md:w-1/3 p-4 border border-primary/30 rounded-2xl focus:outline-none focus:border-primary bg-base-100/80 backdrop-blur-sm shadow-lg hover:shadow-primary/20 transition-all duration-300 cursor-pointer appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml;charset=UTF-8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/></svg>")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center right 1rem",
            }}
          >
            <option value="none">Sort by Price</option>
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
          </select>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {filteredAndSortedProperties?.map((property, index) => (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 * (index + 1) }}
              key={property._id}
              className="card bg-base-100/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border border-primary/10 hover:border-primary/30"
            >
              <figure className="relative overflow-hidden group">
                <img
                  src={property.image}
                  alt={property.title}
                  className="h-48 w-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </figure>
              <div className="card-body bg-gradient-to-b from-base-100/50 to-base-100/90">
                <h3 className="card-title text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {property.title}
                </h3>
                <p className="text-gray-600 font-medium">{property.location}</p>
                <div className="flex flex-col gap-2 mt-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-primary">Agent:</span>
                    <span>{property.agentName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-primary">Email:</span>
                    <span>{property.agentEmail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-primary">Status:</span>
                    <span
                      className={`badge ${
                        property.status === "available"
                          ? "bg-gradient-to-r from-green-400 to-green-600"
                          : "bg-gradient-to-r from-red-400 to-red-600"
                      } text-white badge-lg`}
                    >
                      {property.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-primary">
                      Price Range:
                    </span>
                    <span>
                      ${property.priceRange.min} - ${property.priceRange.max}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-primary">Added:</span>
                    <span>
                      {new Date(property.addedDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="card-actions justify-end mt-4">
                  <Link
                    to={`/property/${property._id}`}
                    className="btn bg-gradient-to-r from-primary to-secondary text-white hover:from-secondary hover:to-primary transition-all duration-300 rounded-lg"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <Footer></Footer>
    </motion.div>
  );
};

export default AllProperties;
