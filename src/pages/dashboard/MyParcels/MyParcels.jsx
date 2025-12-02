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
const {user} = useAuth() ;
const axiosSecure = useAxiosSecure()
console.log(user)

    const { data: parcels = [], refetch } = useQuery({
        
        queryKey: ['myParcels', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels?email=${user.email}`)
            return res.data
        }
    })

    console.log(parcels)

    const handleParcelDelete = (id) => {
         console.log(id)
         Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
}).then((result) => {
  if (result.isConfirmed) {

    axiosSecure.delete(`parcels/${id}`)
    .then(res => {
        console.log(res.data)

        
    if(res.data.deletedCount) {
        
        // refresh the data in the ui 
        refetch()
          Swal.fire({
      title: "Deleted!",
      text: "Your parcel request has been deleted.",
      icon: "success"
    });

    }
    })


  
  }
});
    }

    const handlePayment = async(parcel) => {
            const paymentInfo = {
            cost: parcel.cost,
            parcelId: parcel._id,
            senderEmail: parcel.senderEmail,
            parcelName: parcel.parcelName
    }
     const res = await axiosSecure.post('/payment-checkout-session', paymentInfo)
        console.log(res.data.url)
        window.location.assign(res.data.url) ;
}

    return (
        <div>
            <h2> All of my parcels: {parcels.length} </h2>

            <div className="overflow-x-auto">
  <table className="table table-zebra">
    {/* head */}
    <thead>
      <tr>
         <th></th>
        <th>Sender Name</th>
        <th>Receiver Name</th>
        <th>Parcel Route</th>
        <th>Delivery Cost</th>
        <th>Payment Status</th>
        <th>Delivery Status</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {
        parcels.map((parcel, index) =>  <tr key={parcel._id}>
        <th>{index + 1}</th>
        <td>{parcel.senderName}</td>
        <td> {parcel.receiverName} </td>
        <td> {parcel.senderDistrict} to {parcel.receiverDistrict} </td>
        <td>{parcel.cost}</td>
         <td>
            {
                parcel.paymentStatus === 'paid' ?
                <span className='text-green-500'>Paid</span> :
                <div className=' flex gap-1 items-center'>
                  <span className='text-yellow-500'>Pending</span>
                  {/* <Link to={`/dashboard/payment/${parcel._id}`} className='btn btn-primary btn-sm'>Pay</Link> */}
                   <button onClick={() => handlePayment(parcel)} className='btn btn-primary btn-sm'>Pay</button>
                </div>
               
            }
        </td>
        <td>pending</td>
       
        <td>
            <button className='btn btn-square hover:bg-primary mx-2'>
                 <FiEdit></FiEdit>
            </button>
            <button className='btn btn-square hover:bg-primary mx-2'>
                 <FaEye></FaEye>
            </button>
            <button onClick={() => handleParcelDelete(parcel._id)} className='btn btn-square hover:bg-primary mx-2'>
                 <FaTrashCan></FaTrashCan>
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

export default MyParcels;