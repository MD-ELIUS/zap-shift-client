import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home/Home/Home";
import Coverage from "../pages/Coverage/Coverage";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import PrivateRoute from "./PrivateRoute";
import Rider from "../pages/Rider/Rider";
import SendParcel from "../pages/sendparcel/SendParcel";
import DashboardLayout from "../layouts/DashboardLayout";
import MyParcels from "../pages/dashboard/MyParcels/MyParcels";
import Payment from "../pages/dashboard/Payment/Payment";
import PaymentSuccess from "../pages/dashboard/Payment/PaymentSuccess";
import PaymentCancelled from "../pages/dashboard/Payment/PaymentCancelled";
import PaymentHistory from "../pages/dashboard/PaymentHistory/PaymentHistory";
import ApproveRiders from "../pages/dashboard/Riders/ApproveRiders";
import UsersManagement from "../pages/dashboard/UsersManagement/UsersManagement";
import AdminRoute from "./AdminRoute";
import RiderRoute from "./RiderRoute";
import UserRoute from "./UserRoute";
import AssignRiders from "../pages/dashboard/AssignRiders/AssignRiders";
import AssignedDeliveries from "../pages/dashboard/AssignedDeliveries/AssignedDeliveries";
import CompletedDeliveries from "../pages/dashboard/CompletedDeliveries/CompletedDeliveries";
import ParcelTrack from "../pages/ParcelTrack/ParcelTrack";
import AboutUs from "../pages/AboutUs";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import PricingCalculator from "../pages/PricingCalculator";
import ErrorPage from "../components/Error/ErrorPage";
import MyProfile from "../pages/dashboard/Profile/MyProfile";
import Statistics from "../pages/dashboard/Statistics/Statistics";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        index: true,
        Component: Home
      },
      {
        path: "/about",
        Component: AboutUs,
      },
      {
        path: '/coverage',
        loader: () => fetch('/serviceCenters.json').then(res => res.json()),
        Component: Coverage
      },
      {
        path: '/rider',
        loader: () => fetch('/serviceCenters.json').then(res => res.json()),
        element: <PrivateRoute><Rider></Rider></PrivateRoute>
      },
      {
        path: '/send-parcel',
        loader: () => fetch('/serviceCenters.json').then(res => res.json()),
        element: <PrivateRoute><SendParcel></SendParcel></PrivateRoute>
      },
      {
        path: '/pricing',
        loader: () => fetch('/serviceCenters.json').then(res => res.json()),
        Component: PricingCalculator,
      },
      {
        path: 'parcel-track/:trackingId',
        Component: ParcelTrack
      }
    ]

  },

  {
    path: '/',
    Component: AuthLayout,
    children: [
      {
        path: "/login",
        Component: Login
      },
      {
        path: '/register',
        Component: Register
      },
      {
        path: 'forgot-password',
        Component: ForgotPassword,
      }
    ]
  },


  {
    path: '/dashboard',
    element: <PrivateRoute><DashboardLayout></DashboardLayout></PrivateRoute>,
    children: [
      {
        index: true,
        Component: Statistics
      },
      {
        path: 'profile',
        Component: MyProfile
      },
      {
        path: 'my-parcels',
        loader: () => fetch('/serviceCenters.json').then(res => res.json()),
        element: <UserRoute><MyParcels /></UserRoute>

      },
      {
        path: 'payment-history',
        element: <UserRoute><PaymentHistory /></UserRoute>
      },
      {
        path: 'approve-riders',
        element: <AdminRoute><ApproveRiders /></AdminRoute>
      },
      {
        path: 'assign-riders',
        element: <AdminRoute><AssignRiders /></AdminRoute>
      },

      // rider only routes
      {
        path: 'assigned-deliveries',
        element: <RiderRoute><AssignedDeliveries /></RiderRoute>
      },

      {
        path: 'completed-deliveries',
        element: <RiderRoute><CompletedDeliveries /></RiderRoute>
      },

      {
        path: 'users-management',
        element: <AdminRoute><UsersManagement /></AdminRoute>
      },
      {
        path: 'payment/:parcelId',
        Component: Payment

      },
      {
        path: 'payment-success',
        Component: PaymentSuccess
      },
      {
        path: 'payment-cancelled',
        Component: PaymentCancelled
      }
    ]
  }


]);