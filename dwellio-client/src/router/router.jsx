import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/user/Home";
import Login from "../components/shared/Login";
import Register from "../components/shared/Register";
import DashboardLayout from "../layouts/DashboardLayout";
import AdminProfile from "../pages/dashboard/admin/AdminProfile";
import AgentProfile from "../pages/dashboard/agent/AgentProfile";
import AddProperty from "../pages/dashboard/agent/AddProperty";
import MyAddedProperties from "../pages/dashboard/agent/MyAddedProperties";
import ManageProperties from "../pages/dashboard/admin/ManageProperties";
import ManageUser from "../pages/dashboard/admin/ManageUser";
import MyProfile from "../pages/dashboard/user/MyProfile";
import PropertyDetails from "../pages/user/PropertyDetails";
import AllProperties from "../pages/user/AllProperties";
import Wishlist from "../pages/dashboard/user/Wishlist";
import MakeOffer from "../pages/dashboard/user/MakeOffer";
import PropertyBought from "../pages/dashboard/user/PropertyBought";
import RequestedProperties from "../pages/dashboard/agent/RequestedProperties";
import SoldProperties from "../pages/dashboard/agent/SoldProperties";
import ManageReview from "../pages/dashboard/admin/ManageReview";
import MyReviews from "../pages/dashboard/user/MyReviews";
import AdvertiseProperties from "../pages/dashboard/admin/AdvertiseProperties";
import PrivateRoute from "./PrivateRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/all-properties",
    element: <PrivateRoute><AllProperties /></PrivateRoute>,
  },
  {
    path: "/property/:id",
    element: <PrivateRoute><PropertyDetails /></PrivateRoute>,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "admin-profile",
        element: (
            <AdminProfile />
        ),
      },
      {
        path: "manage-properties",
        element: <ManageProperties />,
      },
      {
        path: "agent-profile",
        element: <AgentProfile />,
      },
      {
        path: "add-property",
        element: <AddProperty />,
      },
      {
        path: "my-profile",
        element: <MyProfile />,
      },
      {
        path: "my-added-properties",
        element: <MyAddedProperties />,
      },
      {
        path: "my-reviews",
        element: <MyReviews />,
      },
      {
        path: "manage-users",
        element: <ManageUser />,
      },
      {
        path: "wishlist",
        element: <Wishlist />,
      },
      {
        path: "make-offer",
        element: <MakeOffer />,
      },
      {
        path: "property-bought",
        element: <PropertyBought />,
      },
      {
        path: "requested-properties",
        element: <RequestedProperties />,
      },
      {
        path: "sold-properties",
        element: <SoldProperties />,
      },
      {
        path: "manage-reviews",
        element: <ManageReview />,
      },	
      {
        path: "advertise-properties",
        element: <AdvertiseProperties />,
      },
    ],
  },
]);
