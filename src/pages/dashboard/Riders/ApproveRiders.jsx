import React from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { FaPersonCircleCheck, FaPersonCircleXmark, FaTrashCan } from 'react-icons/fa6';
import Swal from 'sweetalert2';
import Loading from '../../../components/Loading/Loading';

const ApproveRiders = () => {
    const axiosSecure = useAxiosSecure();

    const [page, setPage] = React.useState(1);
    const limit = 5;

    const [searchTerm, setSearchTerm] = React.useState('');

    const { refetch, data: response = {}, isLoading, isFetching } = useQuery({
        queryKey: ['riders', 'pending', page, searchTerm],
        queryFn: async () => {
            const res = await axiosSecure.get(`/riders?page=${page}&limit=${limit}&searchText=${searchTerm}`);
            return res.data;
        },
        keepPreviousData: true
    })



    const riders = response.results || [];
    const totalCount = response.count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    // Filter now happens on server
    const filteredRiders = riders;

    const updateRiderStatus = (rider, status) => {
        const updateInfo = { status: status, riderEmail: rider.riderEmail };
        axiosSecure.patch(`/riders/${rider._id}`, updateInfo)
            .then(res => {
                refetch();
                if (res.data.modifiedCount > 0) {
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: `Rider has been ${status}`,
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            })
    }

    // --- ডিলিট ফাংশন শুরু ---
    const handleDelete = (rider) => {
        Swal.fire({
            title: "Are you sure?",
            text: `You want to delete ${rider.riderName}!`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                // আপনার ব্যাকএন্ডে রাইডার ডিলিট করার জন্য এই রুটটি থাকতে হবে
                axiosSecure.delete(`/riders/${rider._id}`)
                    .then(res => {
                        if (res.data.deletedCount > 0) {
                            refetch();
                            Swal.fire(
                                "Deleted!",
                                "Rider has been removed from the list.",
                                "success"
                            );
                        }
                    })
                    .catch(error => {
                        console.error("Error deleting rider:", error);
                        Swal.fire("Error", "Could not delete the rider.", "error");
                    });
            }
        });
    }
    // --- ডিলিট ফাংশন শেষ ---

    const handleApproval = rider => {
        updateRiderStatus(rider, 'approved');
    }

    const handleRejection = rider => {
        updateRiderStatus(rider, 'rejected');
    }

    return (
        <div className="w-full">
            <h2 className="text-2xl font-bold text-secondary mb-4">
                Riders Pending Approval: <span className="text-primary">{totalCount}</span>
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
                        placeholder="Search Name, Email, District..." />
                </div>
            </div>

            {isLoading || isFetching ? (
                <Loading />
            ) : (
                <div className="overflow-x-auto shadow-lg rounded-lg border border-base-300">
                    <table className="table table-zebra w-full text-center min-w-[800px]">
                        <thead className="bg-secondary text-white">
                            <tr>
                                <th>#</th>
                                <th>Rider Name</th>
                                <th>Email</th>
                                <th>Status</th>
                                <th>District</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                filteredRiders.map((rider, index) => (
                                    <tr key={rider._id}>
                                        <th>{index + 1}</th>
                                        <td className="font-semibold">{rider.riderName}</td>
                                        <td>{rider.riderEmail}</td>
                                        <td>
                                            <span className={`badge font-medium capitalize 
                                            ${rider.status === 'approved' ? "badge-primary text-secondary" :
                                                    rider.status === 'pending' ? "badge-warning text-white" :
                                                        "badge-error text-white"}`}>
                                                {rider.status}
                                            </span>
                                        </td>
                                        <td>{rider.riderDistrict}</td>
                                        <td>
                                            <div className='flex justify-center gap-2'>
                                                <button
                                                    disabled={rider.status === 'approved'}
                                                    onClick={() => handleApproval(rider)}
                                                    className='btn btn-sm btn-primary text-secondary'
                                                    title="Approve">
                                                    <FaPersonCircleCheck size={18} />
                                                </button>

                                                <button
                                                    disabled={rider.status === 'rejected'}
                                                    onClick={() => handleRejection(rider)}
                                                    className='btn btn-sm btn-primary text-secondary'
                                                    title="Reject">
                                                    <FaPersonCircleXmark size={18} />
                                                </button>

                                                {/* ডিলিট বাটন আপডেট করা হয়েছে */}
                                                <button
                                                    onClick={() => handleDelete(rider)}
                                                    className='btn btn-sm btn-error text-white'
                                                    title="Delete">
                                                    <FaTrashCan size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            }
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
                    onClick={() => setPage((old) => (riders.length === limit ? old + 1 : old))}
                    disabled={page === totalPages || totalPages === 0}
                >
                    Next
                </button>
            </div>

            {riders.length === 0 && (
                <div className="text-center py-10 text-gray-500 font-medium italic">
                    No riders found in the list.
                </div>
            )}
        </div>
    );
};

export default ApproveRiders;