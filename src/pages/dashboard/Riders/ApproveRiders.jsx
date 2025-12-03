import React from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { FaPersonCircleCheck, FaPersonCircleXmark, FaTrashCan } from 'react-icons/fa6';
import Swal from 'sweetalert2';

const ApproveRiders = () => {
    const axiosSecure = useAxiosSecure();

    const { refetch, data: riders = [] } = useQuery({
        queryKey: ['riders', 'pending'],
        queryFn: async () => {
            const res = await axiosSecure.get('/riders');
            return res.data;
        }

    })

    const updateRiderStatus = (rider, status) => {
        const updateInfo = { status : status, riderEmail: rider.riderEmail } ;
        axiosSecure.patch(`/riders/${rider._id}`, updateInfo)
            .then(res => {
                refetch();
                if(res.data.modifiedCount) {
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


    const handleApproval = rider => {
        updateRiderStatus(rider, 'approved') ;
    }

    const handleRejection = rider => {
        updateRiderStatus(rider, 'rejected') ;
    }

    


    return (
        <div>
            <h2 className="text-4xl">Riders Pending Approval: {riders.length}</h2>

            <div className="overflow-x-auto">
                <table className="table table-zebra">
                    {/* head */}
                    <thead>
                        <tr>
                            <th></th>
                            <th>Rider Name</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>District</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            riders.map((rider, index) => <tr key={rider._id}>

                                <th>{index + 1}</th>
                                <td>{rider.riderName}</td>
                                <td>{rider.riderEmail}</td>
                                <td className={`${rider.status === 'approved' ? "text-green-500" : rider.status === 'pending' ? "text-yellow-500" : "text-red-500" }`}>{rider.status}</td>
                                <td>{rider.riderDistrict}</td>
                                <td className='flex gap-2'>
                                    <button onClick={() => handleApproval(rider)} className='btn btn-sm btn-primary text-black'>
                                        <FaPersonCircleCheck size={20} />

                                    </button>
                                    <button onClick={() => handleRejection(rider)} className='btn btn-sm btn-primary text-black'>

                                        <FaPersonCircleXmark size={20} />

                                    </button>
                                    <button className='btn btn-sm btn-primary text-black'>

                                        <FaTrashCan size={20} />
                                    </button>
                                </td>

                            </tr>)
                        }

                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default ApproveRiders;