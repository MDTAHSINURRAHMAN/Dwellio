import { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  deleteUser,
} from "firebase/auth";
import app from "../firebase/firebase.config";
import Loading from "../components/shared/Loading";
import axiosPublic from "../hooks/axiosPublic";
import axios from "axios";

export const AuthContext = createContext();

const auth = getAuth(app);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const googleProvider = new GoogleAuthProvider();

  const createNewUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const userLogin = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logOut = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      localStorage.removeItem("access-token");
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = (updatedData) => {
    return updateProfile(auth.currentUser, updatedData);
  };

  const resetPassword = (email) => {
    setLoading(true);
    return sendPasswordResetEmail(auth, email)
      .then(() => {
        return "Password reset email sent successfully!";
      })
      .catch((err) => {
        throw err;
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Delete user from Firebase
  const deleteUserAccount = async (password) => {
    setLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        await deleteUser(currentUser);
        localStorage.removeItem("access-token");
        setUser(null);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Save JWT token after login/register
  const saveToken = async (user) => {
    try {
      const response = await axios.post(
        "https://dwellio-realestate.vercel.app/jwt",
        {
          email: user.email,
        }
      );
      localStorage.setItem("access-token", response.data.token);
    } catch (error) {
      console.error("Error saving token:", error);
    }
  };

  // Update signIn function
  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      await saveToken(result.user);
      return result;
    } finally {
      setLoading(false);
    }
  };

  // Update createUser function
  const createUser = async (email, password) => {
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await saveToken(result.user);
      return result;
    } finally {
      setLoading(false);
    }
  };

  const authInfo = {
    user,
    setUser,
    createNewUser,
    signInWithGoogle,
    userLogin,
    loading,
    logOut,
    updateUserProfile,
    resetPassword,
    signIn,
    createUser,
    deleteUserAccount,
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userInfo = { email: currentUser.email };
        axiosPublic
          .post("/jwt", userInfo)
          .then((res) => {
            if (res.data.token) {
              localStorage.setItem("access-token", res.data.token);
            }
          })
          .catch((err) => console.log(err));
      } else {
        localStorage.removeItem("access-token");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [axiosPublic]);

  return (
    <AuthContext.Provider value={authInfo}>
      {loading ? <Loading></Loading> : children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
