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
import AssignRiders from "../pages/dashboard/AssignRiders/AssignRiders";
import AssignedDeliveries from "../pages/dashboard/AssignedDeliveries/AssignedDeliveries";
import CompletedDeliveries from "../pages/dashboard/CompletedDeliveries/CompletedDeliveries";
import ParcelTrack from "../pages/ParcelTrack/ParcelTrack";
import AboutUs from "../pages/AboutUs";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import PricingCalculator from "../pages/PricingCalculator";
import ErrorPage from "../components/Error/ErrorPage";
import MyProfile from "../pages/dashboard/Profile/MyProfile";




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
        path: 'profile',
        Component: MyProfile
      },
      {
        path: 'my-parcels',
        Component: MyParcels

      },
      {
        path: 'payment-history',
        Component: PaymentHistory
      },
      {
        path: 'approve-riders',
        Component: ApproveRiders
        // element: <AdminRoute> <ApproveRiders></ApproveRiders></AdminRoute>
      },
      {
        path: 'assign-riders',
        Component: AssignRiders
        // element: <AdminRoute><AssignRiders></AssignRiders></AdminRoute>
      },

      // rider only routes
      {
        path: 'assigned-deliveries',
        Component: AssignedDeliveries
        // element: <RiderRoute><AssignedDeliveries></AssignedDeliveries></RiderRoute>
      },

      {
        path: 'completed-deliveries',
        Component: CompletedDeliveries
        // element: <RiderRoute><CompletedDeliveries></CompletedDeliveries></RiderRoute>
      },

      {
        path: 'users-management',
        Component: UsersManagement
        // element: <AdminRoute> <UsersManagement></UsersManagement></AdminRoute>
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