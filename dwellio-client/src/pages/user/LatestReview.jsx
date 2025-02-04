import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../../hooks/axiosSecure";
import { Helmet } from "react-helmet-async";
import Navbar from "../../components/shared/Navbar";
import { motion } from "framer-motion";
const LatestReview = () => {
  const axiosSecureInstance = axiosSecure();

  const { data: reviews, isLoading } = useQuery({
    queryKey: ["latestReviews"],
    queryFn: async () => {
      const response = await axiosSecureInstance.get(
        "https://dwellio-realestate.vercel.app/reviews"
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Helmet>
        <title>Latest Reviews | Dwellio</title>
      </Helmet>

      <Navbar />

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 my-24">
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
        >
          Latest Reviews
        </motion.h2>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {reviews?.slice(0, 3).map((review, index) => (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 * (index + 1) }}
              key={index}
              className="card bg-base-100/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 border border-primary/10 hover:border-primary/30"
            >
              <div className="card-body">
                <div className="flex items-center gap-4 mb-4">
                  <div className="avatar">
                    <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                      <img
                        src={
                          review.reviewerImage ||
                          "https://i.ibb.co/MgsTCcv/avater.jpg"
                        }
                        alt={review.reviewerName}
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      {review.reviewerName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(review.reviewTime).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <h4 className="font-medium bg-gradient-to-r from-primary/80 to-secondary/80 bg-clip-text text-transparent mb-2">
                  {review.propertyTitle}
                </h4>
                <p className="text-gray-600">{review.reviewText}</p>

                <div className="flex items-center mt-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-orange-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LatestReview;
