import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosSecure from "../../../hooks/axiosSecure";
import { Helmet } from "react-helmet-async";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

const ManageReview = () => {
  const axiosSecureInstance = axiosSecure();
  const queryClient = useQueryClient();

  const { data: reviews, isLoading } = useQuery({
    queryKey: ["all-reviews"],
    queryFn: async () => {
      const response = await axiosSecureInstance.get(
        "https://dwellio-realestate.vercel.app/reviews"
      );
      return response.data;
    },
  });

  // console.log(reviews);

  const deleteReviewMutation = useMutation({
    mutationFn: async (reviewId) => {
      return await axiosSecureInstance.delete(
        `https://dwellio-realestate.vercel.app/reviews/${reviewId}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["all-reviews"]);
      toast.success("Review deleted successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete review");
    },
  });

  const handleDeleteReview = (reviewId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this review?"
    );
    if (confirmed) {
      deleteReviewMutation.mutate(reviewId);
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
        <title>Manage Reviews | Dwellio</title>
      </Helmet>

      <motion.h2
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-2xl md:text-3xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
      >
        Manage Reviews
      </motion.h2>

      {reviews?.length === 0 ? (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center text-gray-500"
        >
          <p>No reviews found</p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          {reviews?.map((review, index) => (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              key={review._id}
              className="card bg-gradient-to-br from-base-100 via-primary/5 to-base-200 shadow-xl hover:shadow-primary/20 transition-all duration-300"
            >
              <div className="card-body">
                <div className="flex items-center gap-4 mb-4">
                  <div className="avatar">
                    <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                      <img
                        src={review.reviewerImage}
                        alt={review.reviewerName}
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      {review.reviewerName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {review.reviewerEmail}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 hover:text-gray-800 transition-colors duration-300">
                  {review.reviewText}
                </p>
                <div className="card-actions justify-end mt-4">
                  <button
                    onClick={() => handleDeleteReview(review._id)}
                    className="btn btn-error btn-sm hover:scale-105 transition-transform duration-300"
                  >
                    Delete Review
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default ManageReview;
