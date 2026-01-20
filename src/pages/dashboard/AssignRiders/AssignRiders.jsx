import { useQuery } from '@tanstack/react-query';
import React, { useRef, useState } from 'react';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Loading from '../../../components/Loading/Loading';

const AssignRiders = () => {
    const [selectedParcel, setSelectedParcel] = useState(null);
    const axiosSecure = useAxiosSecure();
    const riderModalRef = useRef();

    const [page, setPage] = useState(1);
    const limit = 5;
    const [searchTerm, setSearchTerm] = useState('');

    const { data: response = {}, refetch: parcelsRefetch, isLoading, isFetching } = useQuery({
        queryKey: ['parcels', 'pending-pickup', page, searchTerm],
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels?deliveryStatus=pending-pickup&page=${page}&limit=${limit}&searchText=${searchTerm}`)
            return res.data;
        },
        keepPreviousData: true
    })



    const parcels = response.results || [];
    const totalCount = response.count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    // Server-side filtering now
    const filteredParcels = parcels;

    const { data: riders = [] } = useQuery({
        queryKey: ['riders', selectedParcel?.senderDistrict, 'available'],
        enabled: !!selectedParcel,
        queryFn: async () => {
            const res = await axiosSecure.get(`/riders?status=approved&district=${selectedParcel?.senderDistrict}&workStatus=available`);
            return res.data;
        }
    })



    const openAssignRiderModal = parcel => {
        setSelectedParcel(parcel);
        riderModalRef.current.showModal()
    }

    const handleAssignRider = rider => {
        const riderAssignInfo = {
            riderId: rider._id,
            riderEmail: rider.riderEmail,
            riderName: rider.riderName,
            parcelId: selectedParcel._id,
            trackingId: selectedParcel.trackingId
        }

        axiosSecure.patch(`/parcels/${selectedParcel._id}`, riderAssignInfo)
            .then(res => {
                if (res.data.modifiedCount) {
                    riderModalRef.current.close();
                    parcelsRefetch();
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: `Rider has been assigned.`,
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            })
    }

    return (
        <div className="w-full">
            <h2 className="text-2xl font-bold text-secondary mb-4">
                Assign Riders: <span className="text-primary">{totalCount}</span>
            </h2>

            {/* Search Bar */}
            <div className="mb-4">
                <div className="relative group max-w-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                        <svg className="h-5 w-5 text-gray-600 group-focus-within:text-primary transition-colors" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(1);
                        }}
                        type="search"
                        className="input input-bordered w-full pl-10 focus:border-primary focus:outline-none shadow-sm"
                        placeholder="Search Parcel Name or District..." />
                </div>
            </div>

            {/* Main Table */}
            {isLoading || isFetching ? (
                <Loading />
            ) : (
                <div className="overflow-x-auto shadow-lg rounded-lg border border-base-300">
                    <table className="table table-zebra w-full text-center min-w-[700px]">
                        <thead className="bg-secondary text-white">
                            <tr>
                                <th>#</th>
                                <th>Parcel Name</th>
                                <th>Cost</th>
                                <th>Created At</th>
                                <th>Pickup District</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredParcels.map((parcel, index) => (
                                <tr key={parcel._id}>
                                    <th>{index + 1}</th>
                                    <td className="font-semibold">{parcel.parcelName}</td>
                                    <td>${parcel.cost}</td>
                                    <td>{new Date(parcel.createdAt).toLocaleDateString()}</td>
                                    <td>{parcel.senderDistrict}</td>
                                    <td>
                                        <button
                                            onClick={() => openAssignRiderModal(parcel)}
                                            className='btn btn-sm btn-primary text-black shadow-md'>
                                            Find Riders
                                        </button>
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

            {/* Rider Selection Modal */}
            <dialog ref={riderModalRef} className="modal modal-bottom sm:modal-middle">
                <div className="modal-box max-w-2xl">
                    <h3 className="font-bold text-xl text-secondary mb-4 underline">
                        Available Riders in {selectedParcel?.senderDistrict}
                    </h3>

                    <div className="overflow-x-auto border rounded-md">
                        <table className="table table-zebra w-full text-center min-w-[500px]">
                            <thead className="bg-gray-100 font-bold">
                                <tr>
                                    <th>#</th>
                                    <th>Rider Name</th>
                                    <th>Email</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {riders.length > 0 ? (
                                    riders.map((rider, i) => (
                                        <tr key={rider._id}>
                                            <th>{i + 1}</th>
                                            <td className="font-medium">{rider.riderName}</td>
                                            <td>{rider.riderEmail}</td>
                                            <td>
                                                <button
                                                    onClick={() => handleAssignRider(rider)}
                                                    className='btn btn-xs btn-primary text-black'>
                                                    Assign
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-error py-4">
                                            No available riders in this district!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn btn-sm btn-ghost border border-gray-300">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default AssignRiders;