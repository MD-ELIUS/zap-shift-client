import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FiEdit } from 'react-icons/fi';
import { FaEye } from 'react-icons/fa';
import { FaTrashCan } from 'react-icons/fa6';
import Swal from 'sweetalert2';
import { Link } from 'react-router';

const MyParcels = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  console.log(user);

  const { data: parcels = [], refetch } = useQuery({
    queryKey: ['myParcels', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels?email=${user.email}`);
      return res.data;
    },
  });

  console.log(parcels);

  const handleParcelDelete = (id) => {
    console.log(id);
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`parcels/${id}`).then((res) => {
          console.log(res.data);
          if (res.data.deletedCount) {
            refetch();
            Swal.fire({
              title: 'Deleted!',
              text: 'Your parcel request has been deleted.',
              icon: 'success',
            });
          }
        });
      }
    });
  };

  const handlePayment = async (parcel) => {
    const paymentInfo = {
      cost: parcel.cost,
      parcelId: parcel._id,
      senderEmail: parcel.senderEmail,
      parcelName: parcel.parcelName,
      trackingId: parcel.trackingId,
    };
    const res = await axiosSecure.post('/payment-checkout-session', paymentInfo);
    window.location.assign(res.data.url);
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-secondary mb-4">
        All of my parcels: <span className="text-primary">{parcels.length}</span>
      </h2>

      <div className="overflow-x-auto shadow-lg rounded-lg border border-base-300">
        <table className="table table-zebra w-full">
          {/* head */}
          <thead className="bg-base-200">
            <tr>
              <th></th>
              <th>Sender Name</th>
              <th>Receiver Name</th>
              <th>Parcel Route</th>
              <th>Delivery Cost</th>
              <th>Payment Status</th>
              <th>Tracking Id</th>
              <th>Delivery Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {parcels.map((parcel, index) => (
              <tr key={parcel._id}>
                <th>{index + 1}</th>
                <td>{parcel.senderName}</td>
                <td>{parcel.receiverName}</td>
                <td>
                  {parcel.senderDistrict} → {parcel.receiverDistrict}
                </td>
                <td>${parcel.cost}</td>
                <td>
                  {parcel.paymentStatus === 'paid' ? (
                    <span className="badge badge-success">Paid</span>
                  ) : (
                    <button
                      onClick={() => handlePayment(parcel)}
                      className="btn btn-primary btn-sm text-black"
                    >
                      Pay
                    </button>
                  )}
                </td>
                <td>
                  <Link
                    to={`/parcel-track/${parcel.trackingId}`}
                    className="text-primary hover:underline"
                  >
                    {parcel.trackingId}
                  </Link>
                </td>
                <td>
                  <span
                    className={`badge ${
                      parcel.deliveryStatus === 'delivered'
                        ? 'badge-success'
                        : parcel.deliveryStatus === 'pending'
                        ? 'badge-warning'
                        : 'badge-info'
                    }`}
                  >
                    {parcel.deliveryStatus}
                  </span>
                </td>
                <td className="flex gap-2">
                  <button className="btn btn-square btn-sm hover:bg-primary hover:text-white">
                    <FiEdit />
                  </button>
                  <button className="btn btn-square btn-sm hover:bg-primary hover:text-white">
                    <FaEye />
                  </button>
                  <button
                    onClick={() => handleParcelDelete(parcel._id)}
                    className="btn btn-square btn-sm hover:bg-red-500 hover:text-white"
                  >
                    <FaTrashCan />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyParcels;
