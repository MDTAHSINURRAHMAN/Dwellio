import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../providers/AuthProvider";
import axiosSecure from "../../../hooks/axiosSecure";
import { Helmet } from "react-helmet-async";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MakeOffer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { property } = location.state || {};
  const { user } = useContext(AuthContext);
  const [offerAmount, setOfferAmount] = useState("");
  const axiosSecureInstance = axiosSecure();

  if (!property) {
    return navigate("/dashboard/wishlist");
  }

  // Get user role
  const { data: userData } = useQuery({
    queryKey: ["user", user?.email],
    queryFn: async () => {
      const response = await axiosSecureInstance.get(
        `https://dwellio-realestate.vercel.app/user/profile/${user?.email}`
      );
      return response.data;
    },
  });

  // Validate if user is not admin or agent
  if (userData?.role === "admin" || userData?.role === "agent") {
    toast.error("Only users can make offers");
    return navigate("/dashboard");
  }

  const makeOfferMutation = useMutation({
    mutationFn: async (offerData) => {
      return await axiosSecureInstance.post(
        "https://dwellio-realestate.vercel.app/offers",
        offerData
      );
    },
    onSuccess: () => {
      toast.success("Offer submitted successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit offer");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const amount = parseFloat(offerAmount);
    if (amount < property.priceRange.min || amount > property.priceRange.max) {
      toast.error(
        `Offer must be between $${property.priceRange.min} and $${property.priceRange.max}`
      );
      return;
    }

    const offerData = {
      propertyId: property._id,
      propertyTitle: property.title,
      propertyLocation: property.location,
      agentName: property.agentName,
      agentEmail: property.agentEmail,
      offerAmount: amount,
      buyerEmail: user.email,
      buyerName: user.displayName,
      buyingDate: new Date().toISOString(),
      status: "pending",
    };

    makeOfferMutation.mutate(offerData);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <Helmet>
        <title>Make an Offer | Dwellio</title>
      </Helmet>
      <ToastContainer />

      <h2 className="text-4xl md:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hover:scale-105 transform transition-all duration-300">
        Make an Offer
      </h2>

      <div className="card hover:scale-[1.01] transition-all duration-300 bg-gradient-to-br from-primary/5 via-secondary/10 to-primary/5 backdrop-blur-sm shadow-xl hover:shadow-primary/20 p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control group">
              <label className="label">
                <span className="label-text font-medium group-hover:text-primary transition-colors duration-300">
                  Property Title
                </span>
              </label>
              <input
                type="text"
                value={property.title}
                className="input input-bordered bg-base-200/50 hover:bg-base-200 transition-colors duration-300 focus:border-primary"
                readOnly
              />
            </div>

            <div className="form-control group">
              <label className="label">
                <span className="label-text font-medium group-hover:text-primary transition-colors duration-300">
                  Property Location
                </span>
              </label>
              <input
                type="text"
                value={property.location}
                className="input input-bordered bg-base-200/50 hover:bg-base-200 transition-colors duration-300 focus:border-primary"
                readOnly
              />
            </div>

            <div className="form-control group">
              <label className="label">
                <span className="label-text font-medium group-hover:text-primary transition-colors duration-300">
                  Agent Name
                </span>
              </label>
              <input
                type="text"
                value={property.agentName}
                className="input input-bordered bg-base-200/50 hover:bg-base-200 transition-colors duration-300 focus:border-primary"
                readOnly
              />
            </div>

            <div className="form-control group">
              <label className="label">
                <span className="label-text font-medium group-hover:text-primary transition-colors duration-300">
                  Offer Amount ($)
                </span>
              </label>
              <input
                type="number"
                value={offerAmount}
                onChange={(e) => setOfferAmount(e.target.value)}
                className="input input-bordered bg-base-200/50 hover:bg-base-200 transition-colors duration-300 focus:border-primary"
                required
                placeholder={`Enter amount between $${property.priceRange.min} - $${property.priceRange.max}`}
              />
              <label className="label">
                <span className="label-text-alt text-info hover:text-primary transition-colors duration-300">
                  Price range: ${property.priceRange.min} - $
                  {property.priceRange.max}
                </span>
              </label>
            </div>

            <div className="form-control group">
              <label className="label">
                <span className="label-text font-medium group-hover:text-primary transition-colors duration-300">
                  Buyer Email
                </span>
              </label>
              <input
                type="email"
                value={user.email}
                className="input input-bordered bg-base-200/50 hover:bg-base-200 transition-colors duration-300 focus:border-primary"
                readOnly
              />
            </div>

            <div className="form-control group">
              <label className="label">
                <span className="label-text font-medium group-hover:text-primary transition-colors duration-300">
                  Buyer Name
                </span>
              </label>
              <input
                type="text"
                value={user.displayName}
                className="input input-bordered bg-base-200/50 hover:bg-base-200 transition-colors duration-300 focus:border-primary"
                readOnly
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn bg-primary text-white w-full mt-8 hover:scale-[1.02] transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
            disabled={makeOfferMutation.isLoading}
          >
            {makeOfferMutation.isLoading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Submit Offer"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MakeOffer;
