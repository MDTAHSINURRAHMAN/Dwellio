import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../../providers/AuthProvider";
import axiosSecure from "../../../hooks/axiosSecure";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";

const AgentProfile = () => {
  const { user } = useContext(AuthContext);
  const axiosSecureInstance = axiosSecure();

  const { data: agentInfo, isLoading } = useQuery({
    queryKey: ["agentInfo", user?.email],
    queryFn: async () => {
      const res = await axiosSecureInstance.get(
        `https://dwellio-realestate.vercel.app/user/details/${user?.email}`
      );
      return res.data;
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
      className="max-w-4xl mx-auto p-4 md:p-8"
    >
      <Helmet>
        <title>Agent Profile | Dwellio</title>
      </Helmet>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-gradient-to-br from-base-100 via-primary/5 to-base-200 shadow-xl rounded-lg p-6 md:p-8"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col items-center"
        >
          <motion.img
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            src={agentInfo?.image || user?.photoURL}
            alt={agentInfo?.name}
            className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover mb-4 ring-4 ring-primary/20"
          />
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
          >
            {agentInfo?.name}
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-gray-600 mt-2"
          >
            {agentInfo?.email}
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="mt-8 space-y-4"
        >
          <div className="flex items-center gap-2">
            <span className="font-medium min-w-[120px]">Role:</span>
            <span className="badge badge-primary badge-lg">
              {agentInfo?.role}
            </span>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default AgentProfile;
