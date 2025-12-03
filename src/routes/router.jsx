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



export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
             {
                index: true,
                Component: Home
             },
             {
              path: '/coverage',
              loader: () => fetch('/serviceCenters.json').then(res => res.json()),
              Component: Coverage
             },
             {
              path:'/rider',
               loader: () => fetch('/serviceCenters.json').then(res => res.json()),
              element: <PrivateRoute><Rider></Rider></PrivateRoute>
             },
             {
              path:'/send-parcel',
              loader: () => fetch('/serviceCenters.json').then(res => res.json()),
              element:<PrivateRoute><SendParcel></SendParcel></PrivateRoute>
             }
    ]

  },

  {
    path:'/',
    Component: AuthLayout,
    children: [
      {
        path:"/login",
        Component: Login
      },
      {
        path:'/register' ,
        Component: Register
      }
    ]
  },


{
  path:'/dashboard',
  element: <PrivateRoute><DashboardLayout></DashboardLayout></PrivateRoute>,
  children: [
    {
      path:'my-parcels',
      Component: MyParcels
      
    },
    {
      path:'payment-history',
      Component: PaymentHistory
    },
    {
      path: 'approve-riders',
      Component: ApproveRiders
    },
    {
      path:'payment/:parcelId',
      Component: Payment

    },
    {
      path:'payment-success',
      Component: PaymentSuccess
    },
    {
      path:'payment-cancelled',
      Component: PaymentCancelled
    }
  ]
}


]);