import { Link, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import axiosPublic from "../hooks/axiosPublic";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import useAdmin from "../hooks/useAdmin";
import useAgent from "../hooks/useAgent";

const DashboardLayout = () => {
    const { user, logOut } = useContext(AuthContext);
    const [isAdmin] = useAdmin();
    const [isAgent] = useAgent();

    // console.log(isAdmin, isAgent);

    // const handleLogout = () => {
    //     logOut()
    //         .then(() => {
    //             // Successfully logged out
    //         })
    //         .catch(error => {
    //             console.error('Logout error:', error);
    //         });
    // };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-base-100 to-base-200"
        >
            {/* Sidebar */}
            <motion.div 
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-full md:w-64 bg-gradient-to-t from-primary to-secondary backdrop-blur-sm p-4 border-r border-primary/20"
            >
                <motion.ul 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="menu menu-lg gap-2 playfair"
                >
                    {/* Regular User Links */}
                    {!isAdmin && !isAgent && (
                        <>
                            <li>
                                <Link to="/dashboard/my-profile" className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-primary/20 hover:scale-105 transition-all duration-300 text-white text-2xl font-medium">
                                    My Profile
                                </Link>
                            </li>
                            <li>
                                <Link to="/dashboard/wishlist" className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-primary/20 hover:scale-105 transition-all duration-300 text-white text-2xl font-medium">
                                    Wishlist
                                </Link>
                            </li>
                            <li>
                                <Link to="/dashboard/property-bought" className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-primary/20 hover:scale-105 transition-all duration-300 text-white text-2xl font-medium">
                                    Property Bought
                                </Link>
                            </li>
                            <li>
                                <Link to="/dashboard/my-reviews" className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-primary/20 hover:scale-105 transition-all duration-300 text-white text-2xl font-medium">
                                    My Reviews
                                </Link>
                            </li>
                        </>
                    )}

                    {/* Agent Links */}
                    {isAgent && (
                        <>
                            <li>
                                <Link to="/dashboard/agent-profile" className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-primary/20 hover:scale-105 transition-all duration-300 text-white font-medium">
                                    Agent Profile
                                </Link>
                            </li>
                            <li>
                                <Link to="/dashboard/add-property" className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-secondary/20 hover:scale-105 transition-all duration-300 text-white font-medium">
                                    Add Property
                                </Link>
                            </li>
                            <li>
                                <Link to="/dashboard/my-added-properties" className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-primary/20 hover:scale-105 transition-all duration-300 text-white font-medium">
                                    My Added Properties
                                </Link>
                            </li>
                            <li>
                                <Link to="/dashboard/sold-properties" className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-secondary/20 hover:scale-105 transition-all duration-300 text-white font-medium">
                                    My Sold Properties
                                </Link>
                            </li>
                            <li>
                                <Link to="/dashboard/requested-properties" className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-primary/20 hover:scale-105 transition-all duration-300 text-white font-medium">
                                    Requested Properties
                                </Link>
                            </li>
                        </>
                    )}

                    {/* Admin Links */}
                    {isAdmin && (
                        <>
                            <li>
                                <Link to="/dashboard/admin-profile" className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-primary/20 hover:scale-105 transition-all duration-300 text-white text-xl
                                font-bold tracking-wider">
                                    Admin Profile
                                </Link>
                            </li>
                            <li>
                                <Link to="/dashboard/manage-properties" className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-secondary/20 hover:scale-105 transition-all duration-300 text-white text-xl
                                font-bold tracking-wider">
                                    Manage Properties
                                </Link>
                            </li>
                            <li>
                                <Link to="/dashboard/manage-users" className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-primary/20 hover:scale-105 transition-all duration-300 text-white text-xl
                                font-bold tracking-wider">
                                    Manage Users
                                </Link>
                            </li>
                            <li>
                                <Link to="/dashboard/manage-reviews" className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-secondary/20 hover:scale-105 transition-all duration-300 text-white text-xl
                                font-bold tracking-wider">
                                    Manage Reviews
                                </Link>
                            </li>
                            <li>
                                <Link to="/dashboard/advertise-properties" className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-primary/20 hover:scale-105 transition-all duration-300 text-white text-xl
                                font-bold tracking-wider">
                                    Advertise Properties
                                </Link>
                            </li>
                        </>
                    )}

                    {/* Common Links for All Users */}
                    <div className="divider divider-neutral">Common Menu</div>
                    <li>
                        <Link to="/" className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-primary/20 hover:scale-105 transition-all duration-300 text-white text-2xl font-medium">
                            Home
                        </Link>
                    </li>
                    {/* <li>
                        <button 
                            onClick={handleLogout}
                            className="flex w-full bg-white uppercase items-center gap-2 px-4 py-3 rounded-lg hover:bg-red-500/20 hover:scale-105 transition-all duration-300 text-red-500 text-2xl font-bold"
                        >
                            Logout
                        </button>
                    </li> */}
                </motion.ul>
            </motion.div>

            {/* Content Area */}
            <motion.div 
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex-1 p-4 md:p-8 bg-gradient-to-tr from-base-100 via-base-200 to-base-100"
            >
                <Outlet />
            </motion.div>
        </motion.div>
    );
};

export default DashboardLayout;
