import { useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../../providers/AuthProvider";
import axiosSecure from "../../../hooks/axiosSecure";
import { Helmet } from "react-helmet-async";
import { toast, Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

const RequestedProperties = () => {
  const { user } = useContext(AuthContext);
  const axiosSecureInstance = axiosSecure();
  const queryClient = useQueryClient();

  const { data: offers, isLoading } = useQuery({
    queryKey: ["agent-offers", user?.email],
    queryFn: async () => {
      const response = await axiosSecureInstance.get(
        `https://dwellio-realestate.vercel.app/offers`
      );
      return response.data;
    },
  });

  const updateOfferStatusMutation = useMutation({
    mutationFn: async ({ offerId, status, propertyTitle }) => {
      return await axiosSecureInstance.patch(
        `https://dwellio-realestate.vercel.app/offers/${offerId}`,
        {
          status,
          propertyTitle,
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["agent-offers"]);
      toast.success("Offer status updated successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update offer status");
    },
  });

  const handleStatusUpdate = (offerId, status, propertyTitle) => {
    if (status === "accepted") {
      // Show confirmation dialog before accepting
      const confirmed = window.confirm(
        "Accepting this offer will automatically reject all other offers for this property. Are you sure?"
      );
      if (!confirmed) return;
    }
    updateOfferStatusMutation.mutate({ offerId, status, propertyTitle });
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
      <Toaster position="top-center" reverseOrder={false} />
      <Helmet>
        <title>Requested Properties | Dwellio</title>
      </Helmet>

      <motion.h2
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-2xl md:text-3xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
      >
        Property Offers
      </motion.h2>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="overflow-x-auto bg-gradient-to-br from-base-100 via-primary/5 to-base-200 shadow-xl rounded-lg p-4 md:p-8"
      >
        <table className="table w-full bg-base-100/50 backdrop-blur-sm">
          <thead>
            <tr className="bg-gradient-to-r from-primary/10 to-secondary/10">
              <th className="text-primary">Property Title</th>
              <th className="text-primary hidden md:table-cell">Location</th>
              <th className="text-primary hidden lg:table-cell">Buyer Email</th>
              <th className="text-primary">Buyer Name</th>
              <th className="text-primary">Offered Price</th>
              <th className="text-primary">Status</th>
              <th className="text-primary">Actions</th>
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
                <td className="hidden md:table-cell">
                  {offer.propertyLocation}
                </td>
                <td className="hidden lg:table-cell">{offer.buyerEmail}</td>
                <td>{offer.buyerName}</td>
                <td className="font-semibold">${offer.offerAmount}</td>
                <td>
                  <span
                    className={`badge ${
                      offer.status === "accepted"
                        ? "badge-success"
                        : offer.status === "rejected"
                        ? "badge-error"
                        : "badge-warning"
                    }`}
                  >
                    {offer.status || "pending"}
                  </span>
                </td>
                <td>
                  {offer.status === "pending" && (
                    <div className="flex flex-col md:flex-row gap-2">
                      <button
                        onClick={() =>
                          handleStatusUpdate(
                            offer._id,
                            "accepted",
                            offer.propertyTitle
                          )
                        }
                        className="btn bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 btn-sm hover:scale-105 transition-transform"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() =>
                          handleStatusUpdate(
                            offer._id,
                            "rejected",
                            offer.propertyTitle
                          )
                        }
                        className="btn bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 btn-sm hover:scale-105 transition-transform"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </motion.div>
  );
};

export default RequestedProperties;
