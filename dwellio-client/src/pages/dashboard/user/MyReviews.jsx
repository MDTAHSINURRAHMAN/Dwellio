import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../../providers/AuthProvider";
import axiosSecure from "../../../hooks/axiosSecure";
import { Helmet } from "react-helmet-async";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { motion } from "framer-motion";

const MyReviews = () => {
  const { user } = useContext(AuthContext);
  const axiosSecureInstance = axiosSecure();

  const {
    data: reviews,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["myReviews", user?.email],
    queryFn: async () => {
      const response = await axiosSecureInstance.get(
        `https://dwellio-realestate.vercel.app/reviews/user/${user?.email}`
      );
      return response.data;
    },
    enabled: !!user?.email,
  });

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-error">
        Error loading reviews: {error.message}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <Helmet>
        <title>My Reviews | Dwellio</title>
      </Helmet>

      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent hover:scale-105 transform transition-all duration-300"
      >
        My Reviews
      </motion.h2>

      {reviews?.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center text-gray-500 p-12 bg-gradient-to-br from-base-200/50 via-primary/5 to-base-300/50 rounded-xl shadow-lg backdrop-blur-sm transition-transform transform hover:scale-105"
        >
          <p className="text-xl font-medium">
            You haven't posted any reviews yet
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {reviews?.map((review, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              key={review._id}
              className="card group hover:scale-[1.02] transition-all duration-300 overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 backdrop-blur-sm shadow-xl hover:shadow-secondary/20"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="card-body p-6"
              >
                <h3 className="card-title text-xl md:text-2xl text-titleText group-hover:text-primary transition-colors duration-300">
                  {review.propertyTitle}
                </h3>
                <div className="flex items-center gap-2 my-4 p-3 rounded-lg bg-gradient-to-r from-base-200/50 to-base-300/50 group-hover:from-primary/10 group-hover:to-secondary/10 transition-all duration-300">
                  <Rating
                    style={{ maxWidth: 140 }}
                    value={review.rating}
                    readOnly
                  />
                  <span className="text-primary font-semibold group-hover:text-secondary transition-colors duration-300">
                    ({review.rating})
                  </span>
                </div>
                <p className="text-gray-600 group-hover:text-secondary transition-colors duration-300 p-3 rounded-lg bg-gradient-to-r from-base-200/50 to-base-300/50 group-hover:from-primary/10 group-hover:to-secondary/10">
                  {review.reviewText}
                </p>
                <div className="mt-4 flex justify-end">
                  <p className="text-sm text-gray-500 italic group-hover:text-primary transition-colors duration-300">
                    Posted on:{" "}
                    {new Date(review.reviewTime).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default MyReviews;
