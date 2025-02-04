import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../../providers/AuthProvider";
import axiosSecure from "../../../hooks/axiosSecure";
import { Helmet } from "react-helmet-async";

const PropertyBought = () => {
  const { user } = useContext(AuthContext);
  const axiosSecureInstance = axiosSecure();

  const { data: offers, isLoading } = useQuery({
    queryKey: ["offers", user?.email],
    queryFn: async () => {
      const response = await axiosSecureInstance.get(
        `https://dwellio-realestate.vercel.app/offers/${user?.email}`
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
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <Helmet>
        <title>My Offered Properties | Dwellio</title>
      </Helmet>

      <h2 className="text-4xl md:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hover:scale-105 transform transition-all duration-300">
        My Offered Properties
      </h2>

      {offers?.length === 0 ? (
        <div className="text-center text-gray-500 p-12 bg-gradient-to-br from-base-200/50 to-base-300/50 rounded-xl shadow-lg backdrop-blur-sm">
          <p className="text-xl font-medium">You haven't made any offers yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offers?.map((offer) => (
            <div
              key={offer._id}
              className="card hover:scale-[1.02] transition-all duration-300 overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/5 to-primary/10 backdrop-blur-sm shadow-xl hover:shadow-primary/20"
            >
              <div className="card-body p-6">
                <h3 className="card-title text-xl md:text-2xl text-titleText hover:text-primary transition-colors duration-300">
                  {offer.propertyTitle}
                </h3>
                <p className="text-gray-600 hover:text-secondary transition-colors duration-300">
                  {offer.propertyLocation}
                </p>

                <div className="mt-4 p-3 rounded-lg bg-base-200/50 hover:bg-base-200 transition-colors duration-300">
                  <p className="font-medium text-titleText">Agent Name:</p>
                  <p className="text-gray-700 hover:text-primary transition-colors duration-300">
                    {offer.agentName}
                  </p>
                </div>

                <div className="mt-4 p-3 rounded-lg bg-base-200/50 hover:bg-base-200 transition-colors duration-300">
                  <p className="font-medium text-titleText">Offered Amount:</p>
                  <p className="text-primary text-lg font-bold hover:text-secondary transition-colors duration-300">
                    ${offer.offerAmount}
                  </p>
                </div>

                <div className="mt-4 flex justify-end">
                  <span
                    className={`badge ${
                      offer.status === "accepted"
                        ? "badge-success"
                        : offer.status === "rejected"
                        ? "badge-error"
                        : "badge-warning"
                    } badge-lg capitalize hover:scale-105 transition-transform duration-300`}
                  >
                    {offer.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyBought;
