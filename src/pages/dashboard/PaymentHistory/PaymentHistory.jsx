import React, { useState } from 'react';
import useTitle from '../../../hooks/useTitle';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router';
import Loading from '../../../components/Loading/Loading';
import { FaFileDownload } from 'react-icons/fa';

const PaymentHistory = () => {
  useTitle("Payment History");
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [page, setPage] = React.useState(1);
  const limit = 5;

  const [searchTerm, setSearchTerm] = React.useState('');

  const { data: response = {}, isLoading, isFetching } = useQuery({
    queryKey: ['payments', user?.email, page, searchTerm],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email=${user.email}&page=${page}&limit=${limit}&searchText=${searchTerm}`)
      return res.data;
    },
    keepPreviousData: true
  })

  // Handle new response format: { results: [...], count: ... } or fallback to []
  const payments = response.results || [];
  const totalCount = response.count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  // Filter now happens on server
  const filteredPayments = payments;

  const handleDownloadInvoice = (payment) => {
    window.open(`${import.meta.env.VITE_API_URL || 'http://localhost:5205'}/invoices/transaction/${payment.transactionId}`, '_blank');
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-secondary mb-4">
        Payment History: <span className="text-primary">{totalCount}</span>
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
            placeholder="Search Transaction or Parcel..." />
        </div>
      </div>

      {/* Table Container with Shadow and Border */}
      {isLoading || isFetching ? (
        <Loading />
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg border border-base-300">
          <table className="table table-zebra w-full text-center min-w-[800px]">
            {/* Head with secondary background and white text */}
            <thead className="bg-secondary text-white">
              <tr>
                <th>#</th>
                <th>Parcel Name</th>
                <th>Cost</th>
                <th>Transaction Id</th>
                <th>Tracking Id</th>
                <th>Payment Date</th>
                <th>Invoice</th>
              </tr>
            </thead>
            <tbody>
              {
                filteredPayments.map((payment, index) => (
                  <tr key={payment._id}>
                    <th>{index + 1}</th>
                    <td className="font-medium">{payment.parcelName}</td>
                    <td className="font-bold text-secondary">${payment.amount}</td>
                    <td className="text-sm opacity-70">{payment.transactionId}</td>
                    <td>
                      <Link
                        to={`/parcel-track/${payment.trackingId}`}
                        className="text-secondary hover:underline"
                      >
                        {payment.trackingId}
                      </Link>
                    </td>
                    <td>
                      {new Date(payment.paidAt).toLocaleDateString()}
                    </td>
                    <td>
                      <button
                        onClick={() => handleDownloadInvoice(payment)}
                        className="btn btn-sm btn-ghost text-primary hover:bg-base-200"
                        title="Download Invoice"
                      >
                        <FaFileDownload size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>

          {/* Empty State */}
          {payments.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              No payment history found.
            </div>
          )}
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
          onClick={() => setPage((old) => (payments.length === limit ? old + 1 : old))}
          disabled={page === totalPages || totalPages === 0}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PaymentHistory;