import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import axiosSecure from "../../hooks/axiosSecure";
import Navbar from "../../components/shared/Navbar";
import { Helmet } from "react-helmet-async";
import { toast, Toaster } from "react-hot-toast"; // Added Toaster component
import { useState, useContext } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import { motion } from "framer-motion";
import Footer from "../../components/Footer";
const PropertyDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const axiosSecureInstance = axiosSecure();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);

  // console.log(user);

  // user details
  const { data: userDetails, isLoading: userDetailsLoading } = useQuery({
    queryKey: ["userDetails", user?.email],
    queryFn: async () => {
      const res = await axiosSecureInstance.get(
        `https://dwellio-realestate.vercel.app/user/details/${user?.email}`
      );
      return res.data;
    },
  });

  // console.log(userDetails);

  const { data: property, isLoading } = useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      const response = await axiosSecureInstance.get(
        `https://dwellio-realestate.vercel.app/properties/${id}`
      );
      return response.data;
    },
  });

  const { data: reviews, refetch: refetchReviews } = useQuery({
    queryKey: ["reviews", id],
    queryFn: async () => {
      const response = await axiosSecureInstance.get(
        `https://dwellio-realestate.vercel.app/reviews/${id}`
      );
      return response.data;
    },
  });

  const addToWishlistMutation = useMutation({
    mutationFn: async (propertyData) => {
      const wishlistData = {
        ...propertyData,
        email: user?.email,
        userId: user?._id,
      };
      return await axiosSecureInstance.post(
        "https://dwellio-realestate.vercel.app/wishlist",
        wishlistData
      );
    },
    onSuccess: () => {
      toast.success("Added to wishlist successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add to wishlist");
    },
  });

  const addReviewMutation = useMutation({
    mutationFn: async (reviewData) => {
      return await axiosSecureInstance.post(
        "https://dwellio-realestate.vercel.app/reviews",
        reviewData
      );
    },
    onSuccess: () => {
      toast.success("Review added successfully!");
      setIsReviewModalOpen(false);
      setReviewText("");
      setRating(5);
      refetchReviews();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add review");
    },
  });

  console.log(property);

  const handleAddToWishlist = () => {
    if (property.status === "unavailable") {
      toast.error("This property is not available for adding to wishlist");
      return;
    }
    const wishlistItem = {
      propertyId: property._id,
      title: property.title,
      image: property.image,
      location: property.location,
      agentName: property.agentName,
      agentEmail: property.agentEmail,
      agentImage: property.agentPhoto,
      priceRange: property.priceRange,
      status: property.status,
    };
    addToWishlistMutation.mutate(wishlistItem);
  };

  const handleSubmitReview = () => {
    const reviewData = {
      propertyId: property._id,
      propertyTitle: property.title,
      agentName: property.agentName,
      rating,
      reviewText,
      reviewerName: userDetails?.name,
      reviewerEmail: userDetails?.email,
      reviewerImage: userDetails?.photo,
      reviewTime: new Date().toISOString(),
    };
    addReviewMutation.mutate(reviewData);
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
    >
      <Toaster position="top-center" reverseOrder={false} />{" "}
      {/* Added Toaster component */}
      <Helmet>
        <title>{property?.title} | Dwellio</title>
      </Helmet>
      <Navbar />
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 mt-32 mb-24">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-base-100/80 backdrop-blur-sm shadow-xl rounded-lg overflow-hidden border border-primary/20"
        >
          <div className="relative h-64 sm:h-80 lg:h-96">
            <img
              src="https://i.ibb.co.com/zFS9Y8r/beachfront-villa.jpg"
              alt="Luxury Beachfront Villa"
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-4 right-4">
              <span className="badge bg-gradient-to-r from-green-400 to-green-600 text-white badge-lg">
                available
              </span>
            </div>
          </div>

          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <motion.h1
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
              >
                {property?.title}
              </motion.h1>
              <div className="flex gap-2">
                <motion.button
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  onClick={handleAddToWishlist}
                  className="btn bg-gradient-to-r from-primary to-secondary text-white hover:from-secondary hover:to-primary transition-all duration-300"
                  disabled={
                    addToWishlistMutation.isLoading ||
                    property.status === "unavailable"
                  }
                >
                  {addToWishlistMutation.isLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    "Add to Wishlist"
                  )}
                </motion.button>
                <motion.button
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  onClick={() => setIsReviewModalOpen(true)}
                  className="btn bg-gradient-to-r from-secondary to-primary text-white hover:from-primary hover:to-secondary transition-all duration-300"
                >
                  Add a Review
                </motion.button>
              </div>
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6"
            >
              <div className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {property?.priceRange?.min} - {property?.priceRange?.max}
              </div>
              <div className="text-gray-600">
                <i className="fas fa-map-marker-alt"></i> Miami Beach, Florida
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-8">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <h2 className="text-xl sm:text-2xl font-semibold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Property Details
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {property?.location}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Posted on:{" "}
                  {new Date(property?.addedDate).toLocaleDateString()}
                </p>
              </motion.div>

              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="bg-base-200/50 backdrop-blur-sm p-6 rounded-lg border border-primary/10 hover:border-primary/30 transition-all duration-300"
              >
                <h2 className="text-xl sm:text-2xl font-semibold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Agent Information
                </h2>
                <div className="flex items-center gap-4">
                  <img
                    src={property?.agentPhoto}
                    alt="Agent"
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-primary/30"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">
                      {property?.agentName}
                    </h3>
                    <p className="text-gray-600">{property?.agentEmail}</p>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="mt-12"
            >
              <h2 className="text-2xl sm:text-3xl font-semibold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Reviews
              </h2>
              <div className="space-y-6">
                {reviews?.length > 0 ? (
                  reviews.map((review, index) => (
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 * index }}
                      key={index}
                      className="bg-base-200/50 backdrop-blur-sm p-6 rounded-lg border border-primary/10 hover:border-primary/30 transition-all duration-300"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="rating rating-sm">
                              {[...Array(5)].map((_, i) => (
                                <input
                                  key={i}
                                  type="radio"
                                  className={`mask mask-star-2 ${
                                    i < review.rating
                                      ? "bg-orange-400"
                                      : "bg-gray-300"
                                  }`}
                                  disabled
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(review.reviewTime).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600">{review.reviewText}</p>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center">
                    No reviews yet. Be the first to review!
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      <dialog className={`modal ${isReviewModalOpen ? "modal-open" : ""}`}>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="modal-box bg-base-100/95 backdrop-blur-sm border border-primary/20"
        >
          <h3 className="font-bold text-xl mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Add Your Review
          </h3>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Rating</span>
            </label>
            <select
              className="select select-bordered w-full focus:border-primary transition-colors duration-300"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num} Star{num > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">Your Review</span>
            </label>
            <textarea
              className="textarea textarea-bordered h-24 focus:border-primary transition-colors duration-300"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write your review here..."
            ></textarea>
          </div>
          <div className="modal-action">
            <button
              className="btn bg-gradient-to-r from-primary to-secondary text-white hover:from-secondary hover:to-primary transition-all duration-300"
              onClick={handleSubmitReview}
              disabled={addReviewMutation.isLoading}
            >
              {addReviewMutation.isLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Submit Review"
              )}
            </button>
            <button
              className="btn bg-gradient-to-r from-gray-500 to-gray-700 text-white hover:from-gray-700 hover:to-gray-500 transition-all duration-300"
              onClick={() => setIsReviewModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </dialog>
      <Footer></Footer>
    </motion.div>
  );
};

export default PropertyDetails;
