import { useContext, useState } from "react";
import { AuthContext } from "../../../providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../../../hooks/axiosSecure";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const AddProperty = () => {
  const { user } = useContext(AuthContext);
  const axiosSecureInstance = axiosSecure();
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Check if agent is marked as fraud
  const { data: agentData, isLoading: agentLoading } = useQuery({
    queryKey: ['agent', user?.email],
    queryFn: async () => {
      const response = await axiosSecureInstance.get(`/agent/profile/${user.email}`);
      return response.data;
    }
  });

  // console.log(agentData);

  if (agentLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // Prevent fraud agents from adding properties
  if (agentData?.status === 'fraud') {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-base-100 shadow-xl rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-error mb-4">Access Denied</h2>
          <p>Your account has been marked as fraud. You cannot add new properties.</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First upload image to imgbb
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData
      });
      const imgbbData = await imgbbResponse.json();

      const propertyData = {
        title: e.target.title.value,
        location: e.target.location.value,
        image: imgbbData.data.url,
        agentName: user.displayName,
        agentEmail: user.email,
        agentPhoto: agentData.photo,
        agentId: user.uid,
        priceRange: {
          min: parseFloat(e.target.minPrice.value),
          max: parseFloat(e.target.maxPrice.value)
        },
        status: 'available',
        verificationStatus: 'pending',
        addedDate: new Date()
      };

      const response = await axiosSecureInstance.post('/properties', propertyData);
      
      if (response.data.insertedId) {
        navigate('/dashboard/my-added-properties');
      }
    } catch (error) {
      console.error('Error adding property:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-4 md:p-8"
    >
      <Helmet>
        <title>Add Property | Dwellio</title>
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
          className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
        >
          Add New Property
        </motion.h2>

        <motion.form 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          onSubmit={handleSubmit} 
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Property Title</span>
              </label>
              <input
                type="text"
                name="title"
                placeholder="Enter property title"
                className="input input-bordered bg-base-100/50 backdrop-blur-sm"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Location</span>
              </label>
              <input
                type="text"
                name="location"
                placeholder="Enter property location"
                className="input input-bordered bg-base-100/50 backdrop-blur-sm"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Property Image</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="file-input file-input-bordered w-full bg-base-100/50 backdrop-blur-sm"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Agent Name</span>
              </label>
              <input
                type="text"
                value={user?.displayName}
                className="input input-bordered bg-base-100/50 backdrop-blur-sm"
                readOnly
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Agent Email</span>
              </label>
              <input
                type="email"
                value={user?.email}
                className="input input-bordered bg-base-100/50 backdrop-blur-sm"
                readOnly
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Minimum Price ($)</span>
              </label>
              <input
                type="number"
                name="minPrice"
                placeholder="Enter minimum price"
                className="input input-bordered bg-base-100/50 backdrop-blur-sm"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Maximum Price ($)</span>
              </label>
              <input
                type="number"
                name="maxPrice"
                placeholder="Enter maximum price"
                className="input input-bordered bg-base-100/50 backdrop-blur-sm"
                required
              />
            </div>
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            className="btn btn-primary w-full bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary transition-all duration-300"
            disabled={loading}
          >
            {loading ? 
              <span className="loading loading-spinner"></span> 
              : 'Add Property'
            }
          </motion.button>
        </motion.form>
      </motion.div>
    </motion.div>
  );
};

export default AddProperty;
