import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../../../hooks/axiosSecure";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

const ManageProperties = () => {
  const axiosSecureInstance = axiosSecure();

  const {
    data: properties = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["all-properties"],
    queryFn: async () => {
      const response = await axiosSecureInstance.get(
        "https://dwellio-realestate.vercel.app/properties"
      );
      return response.data;
    },
  });

  const handleVerificationStatus = async (propertyId, status) => {
    try {
      const updatedData = {
        verificationStatus: status,
        isPublished: status === "verified",
      };

      const response = await axiosSecureInstance.patch(
        `https://dwellio-realestate.vercel.app/properties/${propertyId}`,
        updatedData
      );

      if (response.data.modifiedCount > 0) {
        refetch();
      }
    } catch (error) {
      console.error("Error updating property status:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto p-4 md:p-8"
    >
      <Helmet>
        <title>Manage Properties | Dwellio</title>
      </Helmet>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-gradient-to-br from-base-100 via-primary/5 to-base-200 shadow-xl rounded-lg p-4 md:p-8"
      >
        <motion.h2
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
        >
          Manage Properties
        </motion.h2>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="overflow-x-auto"
        >
          <table className="table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Title</th>
                <th>Location</th>
                <th>Agent Info</th>
                <th>Price Range</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => (
                <tr key={property._id}>
                  <td>
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <img src={property.image} alt={property.title} />
                      </div>
                    </div>
                  </td>
                  <td>{property.title}</td>
                  <td>{property.location}</td>
                  <td>
                    <div>
                      <p className="font-semibold">{property.agentName}</p>
                      <p className="text-sm text-gray-500">
                        {property.agentEmail}
                      </p>
                    </div>
                  </td>
                  <td>
                    ${property.priceRange.min} - ${property.priceRange.max}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        property.verificationStatus === "verified"
                          ? "badge-success"
                          : property.verificationStatus === "rejected"
                          ? "badge-error"
                          : "badge-warning"
                      }`}
                    >
                      {property.verificationStatus}
                    </span>
                  </td>
                  <td>
                    {property.verificationStatus === "pending" ? (
                      <div className="flex flex-col md:flex-row gap-2">
                        <button
                          onClick={() =>
                            handleVerificationStatus(property._id, "verified")
                          }
                          className="btn btn-sm md:btn-md bg-gradient-to-r from-primary to-secondary text-white hover:from-secondary hover:to-primary transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                          Verify
                        </button>
                        <button
                          onClick={() =>
                            handleVerificationStatus(property._id, "rejected")
                          }
                          className="btn btn-sm md:btn-md bg-gradient-to-r from-red-500 to-red-700 text-white hover:from-red-700 hover:to-red-500 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span
                        className={`badge ${
                          property.verificationStatus === "verified"
                            ? "badge-success"
                            : "badge-error"
                        }`}
                      >
                        {property.verificationStatus}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {properties.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-8"
          >
            <p className="text-gray-500">No properties found</p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ManageProperties;
