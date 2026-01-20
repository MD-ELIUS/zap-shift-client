import React, { useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import Loading from '../../../components/Loading/Loading';

const CompletedDeliveries = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [searchTerm, setSearchTerm] = useState('');

    const { data: parcels = [], isLoading, isFetching } = useQuery({
        queryKey: ['parcels', user.email, 'parcel_delivered'],
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels/rider?riderEmail=${user.email}&deliveryStatus=parcel_delivered`)
            return res.data;
        }
    })



    const filteredParcels = parcels.filter(parcel =>
        parcel.parcelName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parcel.senderDistrict?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const calculatePayout = parcel => {
        if (parcel.senderDistrict === parcel.receiverDistrict) {
            return (parcel.cost * 0.8).toFixed(2);
        } else {
            return (parcel.cost * 0.6).toFixed(2);
        }
    }

    return (
        <div className="w-full">
            <h2 className="text-2xl font-bold text-secondary mb-4">
                Completed Deliveries: <span className="text-primary">{parcels.length}</span>
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
                        onChange={(e) => setSearchTerm(e.target.value)}
                        type="search"
                        className="input input-bordered w-full pl-10 focus:border-primary focus:outline-none shadow-sm"
                        placeholder="Search Parcel..." />
                </div>
            </div>

            {isLoading || isFetching ? (
                <Loading />
            ) : (
                <div className="overflow-x-auto shadow-lg rounded-lg border border-base-300">
                    <table className="table table-zebra w-full text-center min-w-[700px]">
                        {/* Head - Styled like AssignedDeliveries */}
                        <thead className="bg-secondary text-white">
                            <tr>
                                <th>#</th>
                                <th>Parcel Name</th>
                                <th>Created At</th>
                                <th>Pickup District</th>
                                <th>Cost</th>
                                <th>Payout</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredParcels.map((parcel, index) => (
                                <tr key={parcel._id}>
                                    <th>{index + 1}</th>
                                    <td className="font-semibold">{parcel.parcelName}</td>
                                    <td>{new Date(parcel.createdAt).toLocaleDateString()}</td>
                                    <td>{parcel.senderDistrict}</td>
                                    <td className="font-medium">${parcel.cost}</td>
                                    <td className="text-secondary font-bold">${calculatePayout(parcel)}</td>
                                    <td>
                                        <button
                                            className='btn btn-sm btn-primary text-white shadow-md'>
                                            Cash out
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {parcels.length === 0 && (
                <div className="text-center py-10 text-gray-500 font-medium">
                    No completed deliveries found.
                </div>
            )}
        </div>
    );
};

export default CompletedDeliveries;