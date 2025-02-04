import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import axios from "axios";

const AdvertiseProperties = () => {
  const { data: properties = [], refetch } = useQuery({
    queryKey: ["verifiedProperties"],
    queryFn: async () => {
      const res = await axios.get(
        "https://dwellio-realestate.vercel.app/properties"
      );
      return res.data;
    },
  });

  //  handle advertise
  const handleAdvertise = async (property) => {
    try {
      const advertiseProperty = {
        propertyUid: property._id,
        propertyImage: property.image,
        propertyTitle: property.title,
        propertyLocation: property.location,
        priceRange: {
          min: property.priceRange.min,
          max: property.priceRange.max,
        },
        agentName: property.agentName,
        agentImage: property.agentImage,
        agentEmail: property.agentEmail,
        status: property.status,
        verificationStatus: property.verificationStatus,
      };

      const res = await axios.post(
        "https://dwellio-realestate.vercel.app/advertise",
        advertiseProperty
      );
      if (res.data.insertedId) {
        // Show success toast/alert
        alert("Property added to advertise collection successfully!");
        // Refetch the properties to update UI
        refetch();
      }
    } catch (error) {
      console.error("Error advertising property:", error);
      alert("Failed to advertise property");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <Helmet>
        <title>Advertise Properties | Dwellio Admin</title>
      </Helmet>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-gradient-to-br from-base-100 via-primary/5 to-base-200 shadow-xl rounded-2xl p-4 md:p-8"
      >
        <motion.h2
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
        >
          Advertise Properties
        </motion.h2>

        {properties.length === 0 ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center text-gray-500 p-8 bg-base-100/50 backdrop-blur-sm rounded-xl"
          >
            <p className="text-lg">
              No verified properties available for advertising
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="overflow-x-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-base-200"
          >
            <table className="table w-full bg-base-100/50 backdrop-blur-sm rounded-xl">
              <thead>
                <tr className="bg-gradient-to-r from-primary/10 to-secondary/10">
                  <th className="text-primary font-semibold text-base">
                    Property Image
                  </th>
                  <th className="text-primary font-semibold text-base">
                    Property Title
                  </th>
                  <th className="text-primary font-semibold text-base">
                    Price Range
                  </th>
                  <th className="text-primary font-semibold text-base">
                    Agent Name
                  </th>
                  <th className="text-primary font-semibold text-base">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {properties.map((property) => (
                  <motion.tr
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    key={property._id}
                    className="hover:bg-base-200/50 transition-colors duration-200"
                  >
                    <td>
                      <div className="avatar">
                        <div className="w-20 h-16 rounded-lg overflow-hidden">
                          <img
                            src={property.image}
                            alt={property.title}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      </div>
                    </td>
                    <td className="font-medium text-base">{property.title}</td>
                    <td className="font-medium text-base">
                      <span className="text-primary">
                        ${property.priceRange.min}
                      </span>
                      <span className="mx-2">-</span>
                      <span className="text-secondary">
                        ${property.priceRange.max}
                      </span>
                    </td>
                    <td className="font-medium text-base">
                      {property.agentName}
                    </td>
                    <td>
                      <button
                        onClick={() => handleAdvertise(property)}
                        className={`btn ${
                          property.isAdvertised
                            ? "btn-disabled"
                            : "bg-gradient-to-r from-primary to-secondary text-white hover:from-secondary hover:to-primary"
                        } btn-sm hover:scale-105 transition-all duration-300`}
                        disabled={property.isAdvertised}
                      >
                        {property.isAdvertised ? "Advertised" : "Advertise"}
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default AdvertiseProperties;
