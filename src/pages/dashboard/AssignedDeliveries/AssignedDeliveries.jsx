import { useQuery } from '@tanstack/react-query';
import React from 'react';
import Swal from 'sweetalert2';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Loading from '../../../components/Loading/Loading';

const AssignedDeliveries = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const [page, setPage] = React.useState(1);
    const limit = 5;

    const { data: response = {}, refetch, isLoading, isFetching } = useQuery({
        queryKey: ['parcels', user.email, 'driver_assigned', page],
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels/rider?riderEmail=${user.email}&page=${page}&limit=${limit}`)
            return res.data;
        },
        keepPreviousData: true
    })



    const parcels = response.results || [];
    const totalCount = response.count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    const [filterStatus, setFilterStatus] = React.useState('');

    const filteredParcels = parcels.filter(parcel => {
        if (filterStatus && parcel.deliveryStatus !== filterStatus) return false;
        return true;
    });



    const handleDeliveryStatusUpdate = async (parcel, status) => {
        // এখানে parcel.riderId সবসময় পাঠাতে হবে, তা রিজেক্ট হোক বা ডেলিভারড
        const statusInfo = {
            deliveryStatus: status,
            trackingId: parcel.trackingId,
            riderId: parcel.riderId // এটা null করবেন না
        }

        // শুধুমাত্র পার্সেলের ভেতর থেকে রাইডারের নাম/ইমেইল মুছে ফেলার জন্য নিচের লজিক
        if (status === 'pending-pickup') {
            statusInfo.riderEmail = null;
            statusInfo.riderName = null;
        }

        try {
            const res = await axiosSecure.patch(`/parcels/${parcel._id}/status`, statusInfo);

            if (res.data.modifiedCount > 0) {
                refetch();
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: status === 'pending-pickup' ? "Rejected! You are now available." : "Status Updated!",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    }
    const handleReject = (parcel) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You will be free and this parcel will go back to pending!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, Reject!'
        }).then((result) => {
            if (result.isConfirmed) {
                // স্ট্যাটাস হিসেবে pending-pickup পাঠানো হচ্ছে
                handleDeliveryStatusUpdate(parcel, 'pending-pickup');
            }
        })
    }

    return (
        <div className="w-full">
            <h2 className="text-2xl font-bold text-secondary mb-4">
                My Delivery List: <span className="text-primary">{totalCount}</span>
            </h2>

            {/* Filter Dropdown */}
            <div className="mb-4">
                <select
                    className="select select-bordered max-w-xs"
                    onChange={(e) => setFilterStatus(e.target.value)}
                    value={filterStatus}
                >
                    <option value="">All Active Deliveries</option>
                    <option value="driver_assigned">Pending Acceptance</option>
                    <option value="rider_arriving">Accepted / Arriving</option>
                    <option value="parcel_picked_up">Picked Up</option>
                </select>
            </div>

            {isLoading || isFetching ? (
                <Loading />
            ) : (
                <div className="overflow-x-auto shadow-lg rounded-lg border border-base-300">
                    <table className="table table-zebra w-full text-center min-w-[700px]">
                        <thead className="bg-secondary text-white">
                            <tr>
                                <th>#</th>
                                <th>Parcel Name</th>
                                <th>Confirm Actions</th>
                                <th>Update Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredParcels.map((parcel, i) => (
                                <tr key={parcel._id}>
                                    <th>{i + 1}</th>
                                    <td className="font-semibold">{parcel.parcelName}</td>

                                    <td>
                                        {
                                            parcel.deliveryStatus === 'driver_assigned'
                                                ? <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() => handleDeliveryStatusUpdate(parcel, 'rider_arriving')}
                                                        className='btn btn-sm btn-success text-white'>Accept</button>
                                                    <button
                                                        onClick={() => handleReject(parcel)}
                                                        className='btn btn-sm btn-error text-white'>Reject</button>
                                                </div>
                                                : <span className="badge badge-success text-white px-3 py-3 capitalize">
                                                    {parcel.deliveryStatus.split('_').join(' ').split('-').join(' ')}
                                                </span>
                                        }
                                    </td>

                                    <td>
                                        <div className="flex justify-center gap-2">
                                            <button
                                                disabled={parcel.deliveryStatus !== 'rider_arriving'}
                                                onClick={() => handleDeliveryStatusUpdate(parcel, 'parcel_picked_up')}
                                                className='btn btn-sm btn-outline btn-primary text-secondary'>
                                                Mark Picked Up
                                            </button>

                                            <button
                                                disabled={parcel.deliveryStatus !== 'parcel_picked_up'}
                                                onClick={() => handleDeliveryStatusUpdate(parcel, 'parcel_delivered')}
                                                className='btn btn-sm btn-primary  text-secondary'>
                                                Mark Delivered
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination Controls */}
            <div className="flex justify-center items-center mt-6 gap-4">
                <button
                    className="btn btn-sm btn-outline"
                    onClick={() => setPage((old) => Math.max(old - 1, 1))}
                    disabled={page === 1}
                >
                    Previous
                </button>
                <span className="text-sm font-semibold">
                    Page {page} of {totalPages || 1}
                </span>
                <button
                    className="btn btn-sm btn-outline"
                    onClick={() => setPage((old) => (parcels.length === limit ? old + 1 : old))}
                    disabled={page === totalPages || totalPages === 0}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default AssignedDeliveries;