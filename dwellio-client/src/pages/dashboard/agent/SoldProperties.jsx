import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../../providers/AuthProvider";
import axiosSecure from "../../../hooks/axiosSecure";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

const SoldProperties = () => {
  const { user } = useContext(AuthContext);
  const axiosSecureInstance = axiosSecure();

  const { data: offers, isLoading } = useQuery({
    queryKey: ["sold-properties", user?.email],
    queryFn: async () => {
      const response = await axiosSecureInstance.get(
        `https://dwellio-realestate.vercel.app/offers`
      );
      // Filter for accepted offers where the agent email matches
      return response.data.filter(
        (offer) =>
          offer.status === "accepted" && offer.agentEmail === user?.email
      );
    },
  });

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // Calculate total sold amount
  const totalSoldAmount = offers?.reduce(
    (total, offer) => total + Number(offer.offerAmount),
    0
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto p-4 md:p-8"
    >
      <Helmet>
        <title>Sold Properties | Dwellio</title>
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
          className="text-2xl md:text-3xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
        >
          Sold Properties
        </motion.h2>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-8 p-6 bg-base-100/50 backdrop-blur-sm rounded-lg shadow-lg border border-primary/20"
        >
          <h3 className="text-xl font-semibold text-center text-primary mb-2">
            Total Sales
          </h3>
          <p className="text-3xl font-bold text-center text-success">
            ${totalSoldAmount?.toLocaleString()}
          </p>
        </motion.div>

        {offers?.length === 0 ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center text-gray-500 p-8 bg-base-100/50 backdrop-blur-sm rounded-lg"
          >
            <p>No properties have been sold yet</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="overflow-x-auto"
          >
            <table className="table w-full bg-base-100/50 backdrop-blur-sm">
              <thead>
                <tr className="bg-gradient-to-r from-primary/10 to-secondary/10">
                  <th className="text-primary">Property Title</th>
                  <th className="text-primary">Location</th>
                  <th className="text-primary">Buyer Name</th>
                  <th className="text-primary">Buyer Email</th>
                  <th className="text-primary">Sold Price</th>
                </tr>
              </thead>
              <tbody>
                {offers?.map((offer) => (
                  <motion.tr
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    key={offer._id}
                    className="hover:bg-base-200/50"
                  >
                    <td>{offer.propertyTitle}</td>
                    <td>{offer.propertyLocation}</td>
                    <td>{offer.buyerName}</td>
                    <td>{offer.buyerEmail}</td>
                    <td className="text-success font-semibold">
                      ${offer.offerAmount}
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

export default SoldProperties;
