import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./axiosSecure";
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";

const useAdmin = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();

    const { data: isAdmin = false, isLoading, error } = useQuery({
        queryKey: [user?.email, "isAdmin"],
        queryFn: async () => {
            if (!user?.email) return false; // Return false if no user email
            try {
                const res = await axiosSecure.get(`/admin/check/${user.email}`);
                return res.data?.isAdmin || false; // Ensure a boolean is returned
            } catch (err) {
                console.error('Error fetching admin status:', err);
                return false; // Return false on error
            }
        }
    });

    return [isAdmin, isLoading, error];
};

export default useAdmin;