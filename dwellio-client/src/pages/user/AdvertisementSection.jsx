import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../../hooks/axiosSecure";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const AdvertisementSection = () => {
  const axiosSecureInstance = axiosSecure();

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["advertisedProperties"],
    queryFn: async () => {
      const response = await axiosSecureInstance.get(
        "https://dwellio-realestate.vercel.app/advertised"
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

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 my-24">
      <motion.h2
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
      >
        Featured Properties
      </motion.h2>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        {properties.slice(0, 4).map((property, index) => (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 * (index + 1) }}
            key={property._id}
            className="card bg-base-100/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border border-primary/10 hover:border-primary/30"
          >
            <figure className="relative overflow-hidden group">
              <img
                src={property.propertyImage}
                alt={property.propertyTitle}
                className="h-48 w-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </figure>
            <div className="card-body bg-gradient-to-b from-base-100/50 to-base-100/90">
              <h3 className="card-title text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {property.propertyTitle}
              </h3>
              <p className="text-gray-600 flex items-center gap-2">
                <i className="fas fa-map-marker-alt text-primary"></i>{" "}
                {property.propertyLocation}
              </p>
              <p className="font-semibold bg-gradient-to-r from-primary/80 to-secondary/80 bg-clip-text text-transparent">
                ${property.priceRange.min} - ${property.priceRange.max}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Status:</span>
                <span
                  className={`badge ${
                    property.status === "available"
                      ? "bg-gradient-to-r from-green-400 to-green-600"
                      : property.status === "sold"
                      ? "bg-gradient-to-r from-red-400 to-red-600"
                      : "bg-gradient-to-r from-yellow-400 to-yellow-600"
                  } text-white badge-sm`}
                >
                  {property.status}
                </span>
              </div>
              <div className="card-actions justify-end mt-4">
                <Link
                  to={`/property/${property.propertyUid}`}
                  className="btn bg-gradient-to-r from-primary to-secondary text-white hover:from-secondary hover:to-primary transition-all duration-300"
                >
                  View Details
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default AdvertisementSection;
