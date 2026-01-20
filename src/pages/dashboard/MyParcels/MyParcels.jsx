import { useQuery } from '@tanstack/react-query';
import React, { useState, useEffect } from 'react';
import { useLoaderData } from 'react-router';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FiEdit } from 'react-icons/fi';
import { FaEye } from 'react-icons/fa';
import { FaTrashCan } from 'react-icons/fa6';
import Swal from 'sweetalert2';
import { Link } from 'react-router';
import Loading from '../../../components/Loading/Loading';

const MyParcels = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [editParcel, setEditParcel] = useState(null);
  const [editForm, setEditForm] = useState({
    parcelType: '',
    parcelName: '',
    parcelWeight: '',
    senderName: '',
    senderEmail: '',
    senderRegion: '',
    senderDistrict: '',
    senderAddress: '',
    senderPhone: '',
    senderInstruction: '',
    receiverName: '',
    receiverEmail: '',
    receiverRegion: '',
    receiverDistrict: '',
    receiverAddress: '',
    receiverPhone: '',
    receiverInstruction: '',
    cost: ''
  });

  // Auto update delivery cost in edit modal, like SendParcel
  useEffect(() => {
    if (!editParcel) return;
    const newCost = calculateParcelCost(editForm);
    if (editForm.cost !== newCost) {
      setEditForm(prev => ({ ...prev, cost: newCost }));
    }
    // eslint-disable-next-line
  }, [
    editForm.parcelType,
    editForm.parcelWeight,
    editForm.senderDistrict,
    editForm.receiverDistrict,
    editParcel
  ]);

  // Pagination State
  const [page, setPage] = useState(1);
  const limit = 8;
  const [filterStatus, setFilterStatus] = useState('');

  const { data = {}, refetch, isError, error, isLoading, isFetching } = useQuery({
    queryKey: ['myParcels', user?.email, page, filterStatus], // include page & filterStatus in key for auto-refetch
    queryFn: async () => {
      // If we have a filterStatus, pass it. If 'All Statuses' is selected, filterStatus might be '' (empty string)
      const res = await axiosSecure.get(`/parcels?email=${user.email}&page=${page}&limit=${limit}&deliveryStatus=${filterStatus}`);
      return res.data;
    },
    keepPreviousData: true, // Keep old data while new data fetches
  });



  // Handle new response format: { results: [...], count: ... } or fallback to []
  const parcels = data.results || [];
  const totalCount = data.count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  // No client-side filtering needed anymore since we pass filterStatus to server in useQuery
  // The 'data' from server is already filtered by the backend if we passed deliveryStatus


  // Fetch service centers for Region → District
  const serviceCenters = useLoaderData();

  // Compute regions safely
  const serviceCentersRegions = serviceCenters?.length > 0
    ? [...new Set(serviceCenters.map(c => c.region))]
    : [];

  // Compute districts safely by region
  // Return unique districts by region
  const districtsByRegion = (region) =>
    region && serviceCenters?.length > 0
      ? [...new Set(serviceCenters.filter(c => c.region === region).map(c => c.district))]
      : [];

  // Delivery cost calculation like SendParcel
  function calculateParcelCost({ parcelType, parcelWeight, senderDistrict, receiverDistrict }) {
    const isDocument = parcelType === 'document';
    const isSameDistrict = senderDistrict && receiverDistrict && senderDistrict === receiverDistrict;
    const weight = parseFloat(parcelWeight);
    if (!weight || isNaN(weight)) return 0;

    let cost = 0;
    if (isDocument) {
      cost = isSameDistrict ? 60 : 80;
    } else if (weight < 3) {
      cost = isSameDistrict ? 110 : 150;
    } else {
      const minCost = isSameDistrict ? 110 : 150;
      const extraWeight = weight - 3;
      const extraCharge = isSameDistrict
        ? extraWeight * 40
        : extraWeight * 40 + 40;
      cost = minCost + extraCharge;
    }
    return cost;
  }

  const handleParcelDelete = (id) => {
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

  const openEditModal = (parcel) => {
    if (parcel.paymentStatus === 'paid') return;
    setEditParcel(parcel);
    setEditForm({ ...parcel });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async () => {
    try {
      // ❌ OLD: শুধু senderName, senderEmail remove করা
      // const { senderName, senderEmail, ...allowedUpdates } = editForm;

      // ✅ NEW: createdAt কেও remove করুন
      const { _id, senderName, senderEmail, createdAt, ...allowedUpdates } = editForm;

      console.log('Sending updates (without createdAt):', allowedUpdates);

      await axiosSecure.patch(`/parcels/edit/${editParcel._id}`, allowedUpdates);

      Swal.fire('Updated!', 'Parcel details updated successfully.', 'success');
      setEditParcel(null);
      refetch();
    } catch (error) {
      Swal.fire('Error!', error.response?.data?.message || 'Update failed', 'error');
    }
  };



  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-secondary mb-4">
        All of my parcels: <span className="text-primary">{totalCount}</span>
      </h2>

      {/* Filter Dropdown */}
      <div className="mb-4">
        <select
          className="select select-bordered max-w-xs"
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setPage(1); // Reset to page 1 when filter changes
          }}
          value={filterStatus}
        >
          <option value="">All Statuses</option>

          <option value="pending-pickup">Pending Pickup</option>
          <option value="rider_arriving">Rider Arriving</option>
          <option value="driver_assigned">Driver Assigned</option>
          <option value="parcel_delivered">Delivered</option>
        </select>
      </div>

      {isLoading || isFetching ? (
        <Loading />
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg border border-base-300">
          <table className="table table-zebra w-full text-center min-w-[1000px]">
            <thead className="bg-secondary text-white">
              <tr>
                <th>#</th>
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
                  <td>{parcel.senderDistrict} → {parcel.receiverDistrict}</td>
                  <td>${parcel.cost}</td>
                  <td>
                    {parcel.paymentStatus === 'paid' ? (
                      <span className=" text-green-500 font-bold px-2.5 py-0.5">
                        Paid
                      </span>
                    ) : (
                      <button
                        onClick={() => handlePayment(parcel)}
                        className="btn btn-secondary btn-sm text-yellow-500"
                      >
                        Pay
                      </button>
                    )}
                  </td>
                  <td>
                    <Link
                      to={`/parcel-track/${parcel.trackingId}`}
                      className="text-secondary hover:underline"
                    >
                      {parcel.trackingId}
                    </Link>
                  </td>
                  <td>
                    <span
                      className={`badge ${parcel.deliveryStatus === 'parcel_delivered'
                        ? 'badge-primary text-secondary'
                        : parcel.deliveryStatus === 'driver_assigned' || parcel.deliveryStatus === 'pending-pickup' || parcel.deliveryStatus === '-'
                          ? 'badge-secondary text-white'
                          : 'badge-info'
                        }`}
                    >
                      {parcel.deliveryStatus || '–'}
                    </span>
                  </td>
                  <td className="flex justify-center gap-2">
                    <button
                      disabled={parcel.paymentStatus === 'paid'}
                      title={parcel.paymentStatus === 'paid' ? 'Paid parcels cannot be edited' : 'Edit Parcel'}
                      className={`btn btn-square btn-sm hover:bg-primary hover:text-white ${parcel.paymentStatus === 'paid' ? 'opacity-40 cursor-not-allowed' : ''}`}
                      onClick={() => openEditModal(parcel)}
                    >
                      <FiEdit />
                    </button>

                    <button
                      className="btn btn-square btn-sm hover:bg-primary hover:text-white"
                      onClick={() => setSelectedParcel(parcel)}
                    >
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
          onClick={() => setPage((old) => (data.results && data.results.length === limit ? old + 1 : old))}
          disabled={page === totalPages || totalPages === 0}
        >
          Next
        </button>
      </div>

      {/* View Modal */}
      {selectedParcel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-base-100 rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button className="absolute top-2 right-2 btn btn-ghost btn-sm" onClick={() => setSelectedParcel(null)}>✕</button>
            <h3 className="text-xl font-bold text-secondary mb-4">Parcel Details</h3>
            <div className="space-y-2 text-sm text-center">
              <p><span className="font-semibold">Parcel Name:</span> {selectedParcel.parcelName}</p>
              <p><span className="font-semibold">Type:</span> {selectedParcel.parcelType}</p>
              <p><span className="font-semibold">Weight:</span> {selectedParcel.parcelWeight} kg</p>
              <p><span className="font-semibold">Sender:</span> {selectedParcel.senderName} ({selectedParcel.senderPhone})</p>
              <p><span className="font-semibold">Sender Address:</span> {selectedParcel.senderAddress}, {selectedParcel.senderDistrict}, {selectedParcel.senderRegion}</p>
              <p><span className="font-semibold">Receiver:</span> {selectedParcel.receiverName} ({selectedParcel.receiverPhone})</p>
              <p><span className="font-semibold">Receiver Address:</span> {selectedParcel.receiverAddress}, {selectedParcel.receiverDistrict}, {selectedParcel.receiverRegion}</p>
              <p><span className="font-semibold">Cost:</span> ${selectedParcel.cost}</p>
              <p><span className="font-semibold">Payment Status:</span> {selectedParcel.paymentStatus}</p>
              <p><span className="font-semibold">Delivery Status:</span> {selectedParcel.deliveryStatus || '–'}</p>
              <p><span className="font-semibold">Tracking ID:</span> {selectedParcel.trackingId}</p>
              <p><span className="font-semibold">Instructions:</span> {selectedParcel.senderInstruction} / {selectedParcel.receiverInstruction}</p>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal with cascading Region → District */}
      {editParcel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-auto">
          <div className="bg-base-100 rounded-lg shadow-lg w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto my-4">
            <button className="absolute top-2 right-2 btn btn-ghost btn-sm" onClick={() => setEditParcel(null)}>✕</button>

            <h3 className="text-xl font-bold text-secondary mb-4">Edit Parcel</h3>

            <div className="space-y-2 text-sm">
              {/* Parcel Type */}
              <div className='mr-4'>
                <label className='label mr-4'>
                  <input type="radio" name="parcelType" value="document" checked={editForm.parcelType === 'document'} onChange={handleEditChange} className="radio" />
                  Document
                </label>
                <label className='label'>
                  <input type="radio" name="parcelType" value="non-document" checked={editForm.parcelType === 'non-document'} onChange={handleEditChange} className="radio" />
                  Non Document
                </label>
              </div>
              {/* Parcel name */}
              <fieldset className="fieldset mt-4">
                <label className="label">Parcel Name</label>
                <input type="text" name="parcelName" className="input w-full" value={editForm.parcelName || ''} onChange={handleEditChange} placeholder="Parcel name" />
              </fieldset>

              {/* Parcel weight */}
              <fieldset className="fieldset mt-4">
                <label className="label">Parcel Weight (KG)</label>
                <input type="number" name="parcelWeight" className="input w-full" value={editForm.parcelWeight || ''} onChange={handleEditChange} placeholder="Parcel Weight (KG)" />
              </fieldset>

              {/* Delivery Cost (auto-calculated) */}
              <fieldset className="fieldset mt-4">
                <label className="label">Delivery Cost</label>
                <input
                  type="number"
                  name="cost"
                  className="input w-full"
                  value={editForm.cost || ''}
                  readOnly
                />
              </fieldset>

              {/* Sender Details */}
              <h4 className="text-2xl font-semibold mt-4">Sender Details</h4>
              <fieldset className="fieldset mt-4">
                <label className="label">Sender Name</label>
                <input type="text" className="input w-full" name="senderName" value={editForm.senderName || ''} readOnly placeholder="Sender Name" />
              </fieldset>
              <fieldset className="fieldset mt-4">
                <label className="label">Sender Email</label>
                <input type="text" className="input w-full" name="senderEmail" value={editForm.senderEmail || ''} readOnly placeholder="Sender Email" />
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Sender Region</legend>
                <select
                  name="senderRegion"
                  value={editForm.senderRegion || ''}
                  onChange={e => {
                    handleEditChange(e);
                    setEditForm(prev => ({ ...prev, senderDistrict: '' }));
                  }}
                  className="select w-full"
                  disabled={!serviceCenters.length}
                >
                  <option value="" disabled>Pick a region</option>
                  {serviceCentersRegions.map((r, i) => <option key={i} value={r}>{r}</option>)}
                </select>
              </fieldset>

              {/* Sender District */}
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Sender District</legend>
                <select
                  name="senderDistrict"
                  value={editForm.senderDistrict || ''}
                  onChange={handleEditChange}
                  className="select w-full"
                  disabled={!editForm.senderRegion}
                >
                  <option value="" disabled>Pick a district</option>
                  {districtsByRegion(editForm.senderRegion).map((d, i) => <option key={i} value={d}>{d}</option>)}
                </select>
              </fieldset>

              {/* Receiver Details */}
              <h4 className="text-2xl font-semibold mt-4">Receiver Details</h4>
              {/* Receiver Name */}
              <fieldset className="fieldset mt-4">
                <label className="label">Receiver Name</label>
                <input type="text" className="input w-full" name="receiverName" value={editForm.receiverName || ''} onChange={handleEditChange} placeholder="Receiver Name" />
              </fieldset>
              {/* Receiver Email */}
              <fieldset className="fieldset mt-4">
                <label className="label">Receiver Email</label>
                <input type="text" className="input w-full" name="receiverEmail" value={editForm.receiverEmail || ''} onChange={handleEditChange} placeholder="Receiver Email" />
              </fieldset>
              {/* Receiver Region */}
              <fieldset className="fieldset mt-4">
                <legend className="fieldset-legend">Receiver Region</legend>
                <select
                  name="receiverRegion"
                  value={editForm.receiverRegion || ''}
                  onChange={e => {
                    handleEditChange(e);
                    setEditForm(prev => ({ ...prev, receiverDistrict: '' }));
                  }}
                  className="select"
                  disabled={!serviceCenters.length}
                >
                  <option value="" disabled>Pick a region</option>
                  {serviceCentersRegions.map((r, i) => <option key={i} value={r}>{r}</option>)}
                </select>
              </fieldset>
              {/* Receiver District */}
              <fieldset className="fieldset mt-4">
                <legend className="fieldset-legend">Receiver District</legend>
                <select
                  name="receiverDistrict"
                  value={editForm.receiverDistrict || ''}
                  onChange={handleEditChange}
                  className="select"
                  disabled={!editForm.receiverRegion}
                >
                  <option value="" disabled>Pick a district</option>
                  {districtsByRegion(editForm.receiverRegion).map((d, i) => <option key={i} value={d}>{d}</option>)}
                </select>
              </fieldset>
              {/* Receiver Address */}
              <fieldset className="fieldset mt-4">
                <label className="label">Receiver Address</label>
                <input type="text" className="input w-full" name="receiverAddress" value={editForm.receiverAddress || ''} onChange={handleEditChange} placeholder="Receiver Address" />
              </fieldset>
              {/* Receiver Phone */}
              <fieldset className="fieldset mt-4">
                <label className="label">Receiver Phone</label>
                <input type="tel" className="input w-full" name="receiverPhone" value={editForm.receiverPhone || ''} onChange={handleEditChange} placeholder="Receiver Phone No" />
              </fieldset>
              {/* Receiver Instruction */}
              <fieldset className="fieldset mt-4">
                <label className="label">Receiver Instruction</label>
                <textarea name="receiverInstruction" className="textarea w-full" value={editForm.receiverInstruction || ''} onChange={handleEditChange} placeholder="Receiver Instruction" />
              </fieldset>

              <button onClick={handleEditSubmit} className="btn btn-primary w-full mt-3">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyParcels;