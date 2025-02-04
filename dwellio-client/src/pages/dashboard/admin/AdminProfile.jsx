import { useContext } from "react";
import { AuthContext } from "../../../providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../../../hooks/axiosSecure";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

const AdminProfile = () => {
  const { user } = useContext(AuthContext);
  const axiosSecureInstance = axiosSecure();

  const { data: adminStats, isLoading } = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const res = await axiosSecureInstance.get(
        `https://dwellio-realestate.vercel.app/admin/profile/${user?.email}`
      );
      return res.data;
    },
  });

  const { data: adminStatsCount, isLoading: adminStatsCountLoading } = useQuery(
    {
      queryKey: ["adminStatsCount"],
      queryFn: async () => {
        const res = await axiosSecureInstance.get(
          `https://dwellio-realestate.vercel.app/admin/stats`
        );
        return res.data;
      },
    }
  );

  if (isLoading || adminStatsCountLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-4 md:p-8"
    >
      <Helmet>
        <title>Admin Profile | Dwellio</title>
      </Helmet>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 shadow-xl rounded-lg p-4 md:p-8 backdrop-blur-sm hover:shadow-primary/20 transition-all duration-300"
      >
        {/* Admin Info */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col md:flex-row items-center gap-4 md:gap-6 mb-8"
        >
          <motion.img
            whileHover={{ scale: 1.05 }}
            src={user?.photoURL}
            alt={user?.displayName}
            className="w-24 h-24 rounded-full object-cover border-4 border-primary hover:border-secondary transition-colors duration-300"
          />
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {user?.displayName}
            </h2>
            <p className="text-gray-600 hover:text-primary transition-colors duration-300">
              {user?.email}
            </p>
            <div className="badge bg-gradient-to-br from-primary to-secondary mt-2 hover:bg-gradient-to-br hover:from-secondary hover:to-accent transition-colors duration-300 text-white p-4 rounded-full">
              Admin
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="stat bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg hover:shadow-lg transition-all duration-300"
          >
            <div className="stat-title">Total Users</div>
            <div className="stat-value text-primary">
              {adminStatsCount?.users || 0}
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="stat bg-gradient-to-br from-secondary/20 to-accent/20 rounded-lg hover:shadow-lg transition-all duration-300"
          >
            <div className="stat-title">Total Properties</div>
            <div className="stat-value text-secondary">
              {adminStatsCount?.properties || 0}
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="stat bg-gradient-to-br from-accent/20 to-primary/20 rounded-lg hover:shadow-lg transition-all duration-300"
          >
            <div className="stat-title">Total Reviews</div>
            <div className="stat-value text-accent">
              {adminStatsCount?.reviews || 0}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default AdminProfile;
