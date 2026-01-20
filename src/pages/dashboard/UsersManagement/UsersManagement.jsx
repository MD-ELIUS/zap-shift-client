import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FaUserShield, FaTrashAlt } from 'react-icons/fa';
import { FiShieldOff } from 'react-icons/fi';
import Swal from 'sweetalert2';
import Loading from '../../../components/Loading/Loading';

const UsersManagement = () => {
    const axiosSecure = useAxiosSecure();
    const [searchText, setSearchText] = useState('');

    const [page, setPage] = useState(1);
    const limit = 5;

    const { refetch, data: response = {}, isLoading, isFetching } = useQuery({
        queryKey: ['users', searchText, page],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users?searchText=${searchText}&page=${page}&limit=${limit}`);
            return res.data;
        },
        keepPreviousData: true
    })



    const users = response.results || [];
    const totalCount = response.count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    const [roleFilter, setRoleFilter] = useState('');

    const filteredUsers = users.filter(user => {
        if (roleFilter && (user.role || 'user') !== roleFilter) return false;
        return true;
    });



    const handleMakeAdmin = user => {
        const roleInfo = { role: 'admin' }
        axiosSecure.patch(`/users/${user._id}/role`, roleInfo)
            .then(res => {
                if (res.data.modifiedCount) {
                    refetch();
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: `${user.displayName} is now an Admin`,
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            })
    }

    const handleRemoveAdmin = user => {
        const roleInfo = { role: 'user' }
        axiosSecure.patch(`/users/${user._id}/role`, roleInfo)
            .then(res => {
                if (res.data.modifiedCount) {
                    refetch();
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: `${user.displayName} removed from Admin`,
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            })
    }

    const handleDeleteUser = user => {
        Swal.fire({
            title: "Are you sure?",
            text: `You want to delete ${user.displayName}!`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.delete(`/users/${user._id}`)
                    .then(res => {
                        if (res.data.deletedCount > 0) {
                            refetch();
                            Swal.fire("Deleted!", "User has been removed.", "success");
                        }
                    })
            }
        });
    }

    return (
        <div className="w-full">
            <h2 className="text-2xl font-bold text-secondary mb-4">
                Manage Users: <span className="text-primary">{totalCount}</span>
            </h2>

            {/* Search Bar Section */}
            <div className="mb-6 max-w-md flex gap-4">
                <div className="relative group flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                        <svg className="h-5 w-5 text-gray-600 group-focus-within:text-primary transition-colors" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        value={searchText}
                        onChange={(e) => {
                            setSearchText(e.target.value);
                            setPage(1);
                        }}
                        type="search"
                        className="input input-bordered w-full pl-10 focus:border-primary focus:outline-none shadow-sm"
                        placeholder="Search by name or email..." />
                </div>

                {/* Role Filter */}
                <select
                    className="select select-bordered"
                    onChange={(e) => setRoleFilter(e.target.value)}
                    value={roleFilter}
                >
                    <option value="">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                    <option value="rider">Rider</option>
                </select>
            </div>

            {/* Table Section */}
            {isLoading || isFetching ? (
                <Loading />
            ) : (
                <div className="overflow-x-auto shadow-lg rounded-lg border border-base-300">
                    <table className="table table-zebra w-full text-center min-w-[700px]">
                        <thead className="bg-secondary text-white">
                            <tr>
                                <th>#</th>
                                <th className='text-left'>User</th>

                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user, index) => (
                                <tr key={user._id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <div className="flex items-center gap-3 ">
                                            <div className="avatar">
                                                <div className="mask mask-squircle h-12 w-12">
                                                    <img src={user.photoURL} alt={user.displayName} />
                                                </div>
                                            </div>
                                            <div className="text-left">
                                                <div className="font-bold">{user.displayName}</div>
                                                <div className="text-xs opacity-50 capitalize">{user.email || 'User email'}</div>
                                            </div>
                                        </div>
                                    </td>

                                    <td>
                                        <span className={`badge badge-sm font-medium ${user.role === 'admin' ? 'badge-primary text-secondary' : 'badge-secondary border-gray-300'}`}>
                                            {user.role || 'user'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex gap-2 justify-center">
                                            {/* Admin Toggle Button */}
                                            {user.role === 'admin' ? (
                                                <button onClick={() => handleRemoveAdmin(user)} className="btn btn-sm btn-primary text-black" title="Remove Admin">
                                                    <FiShieldOff size={18} />
                                                </button>
                                            ) : (
                                                <button onClick={() => handleMakeAdmin(user)} className="btn btn-sm btn-primary text-black" title="Make Admin">
                                                    <FaUserShield size={18} />
                                                </button>
                                            )}

                                            {/* Delete Button */}
                                            <button onClick={() => handleDeleteUser(user)} className="btn btn-sm btn-error text-white" title="Delete User">
                                                <FaTrashAlt size={16} />
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
                    onClick={() => setPage((old) => (users.length === limit ? old + 1 : old))}
                    disabled={page === totalPages || totalPages === 0}
                >
                    Next
                </button>
            </div>

            {
                users.length === 0 && (
                    <div className="text-center py-10 text-gray-400 italic font-medium">
                        No users found matching your search.
                    </div>
                )
            }
        </div >
    );
};

export default UsersManagement;