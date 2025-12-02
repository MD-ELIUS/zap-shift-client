import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useLoaderData, useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';

const SendParcel = () => {
    const { register,
         handleSubmit,
          control, 
        // formState: { errors } 
           } = useForm() ;
           const {user} = useAuth() ;
    const axiosSecure = useAxiosSecure() ;
    const serviceCenters = useLoaderData() ;
    const regionsDuplicate = serviceCenters.map(c => c.region) ;
    const regions = [...new Set(regionsDuplicate)] ;
    const senderRegion = useWatch({control, name: 'senderRegion'}) ;
    const receiverRegion = useWatch({control, name: 'receiverRegion'})
    const navigate = useNavigate() ;

    const districtsByRegion = region => {
       const regionDistricts = serviceCenters.filter( c => c.region === region) ;
       const districts = regionDistricts.map(d => d.district) ;
       return(districts)
    }

    const handleSendParcel = data => {
        console.log(data) ;
        const isDocument = data.parcelType === 'document' ;
        const isSameDistrict = data.senderDistrict === data.receiverDistrict ;
        const parcelWeight = parseFloat(data.parcelWeight) 
        let cost = 0 ;
        if (isDocument) {
            cost = isSameDistrict ? 60 : 80 ;
        }
        else {
            if(parcelWeight < 3) {
                cost = isSameDistrict ? 110 : 150 ;
            }
            else {
                const minCost = isSameDistrict ? 110 : 150 ;
                const extraWeight = parcelWeight - 3 ;
                const extraCharge = isSameDistrict ? extraWeight * 40 : extraWeight * 40 + 40 ;
                cost = minCost + extraCharge ;
            }
        }

        console.log('cost', cost) ;
        data.cost = cost

        Swal.fire({
  title: "Agree with the cost?",
  text: `You will be charged ${cost} taka!`,
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Confirm and Continue Payment"
}).then((result) => {
  if (result.isConfirmed) {

    // Save the parcel info in the database

    axiosSecure.post('/parcels', data)
    .then( res => {
        console.log('after saving parcel', res.data)
        if(res.data.insertedId) {
            navigate('/dashboard/my-parcels')
            Swal.fire({
  position: "top-end",
  icon: "success",
  title: "Parcel has created.Please Pay",
  showConfirmButton: false,
  timer: 1500
});
        }
    })

  
  }
});

    }

    // console.log(regions)
    //  console.log(errors)


    return (
        <div>
            <h2 className='text-4xl font-bold'>
                Send A Parcel
            </h2>
            <form onSubmit={handleSubmit(handleSendParcel)} className='my-8 p-8 rounded-2xl border border-primary shadow-lg'>

                <h4 className='text-2xl font-semibold mb-4 text-black'>Enter your parcel details</h4>

                {/* Parcel Type */}
                <div className='mr-4  '>
                    <label className='label mr-4'>
                        <input type="radio" value="document" {...register('parcelType')} className="radio" defaultChecked />
                        Document</label>
                    <label className='label'>
                        <input type="radio" value="non-document" {...register('parcelType')} className="radio" />
                        Non Document</label>
                </div>

                {/* Parcel Info: name, weight */}
                <div className='grid  grid-cols-1 md:grid-cols-2 gap-12 mb-8'>
                    <fieldset className="fieldset">
                        <label className="label">Parcel name</label>
                        <input type="text" className="input w-full" {...register('parcelName')} placeholder="Parcel name" />
                    </fieldset>
                    <fieldset className="fieldset">
                        <label className="label">Parcel weight</label>
                        <input type="number" className="input w-full" {...register('parcelWeight')} placeholder="Parcel Weight (KG)" />
                    </fieldset>
                </div>

                {/* two column */}

                <div className='grid  grid-cols-1 md:grid-cols-2 gap-12'>

                    {/* sender Info */}
                    <div>
                        <h4 className="text-2xl font-semibold">Sender Details</h4>
                        {/* Sender Name */}
                        <fieldset className="fieldset mt-4">
                            <label className="label">Sender name</label>
                            <input type="text" className="input w-full" {...register('senderName')} placeholder="Sender Name" />
                        </fieldset>
                        {/* Sender Email */}
                        <fieldset className="fieldset mt-4">
                            <label className="label">Sender Email</label>
                            <input type="text" className="input w-full" {...register('senderEmail')} readOnly value={user?.email} placeholder="Sender Email" />
                        </fieldset>

                        {/* Sender Region */}
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Sender Regions</legend>
                            <select {...register('senderRegion')} defaultValue="Pick a region" className="select">
                                <option disabled={true}>Pick a browser</option>
                                 {
                                    regions.map((r, i) => <option key={i} value={r}>{r}</option>)
                                 }
                            </select>
                            <span className="label">Optional</span>
                        </fieldset>


                               {/* Sender District */}
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Sender District</legend>
                            <select {...register('senderDistrict')} defaultValue="Pick a District" className="select">
                                <option disabled={true}>Pick a district</option>
                                {
                                    districtsByRegion(senderRegion).map((r, i) => <option key={i} value={r}>{r}</option>)
                                }
                               
                            </select>
                           
                        </fieldset>

                        {/* Sender Address */}
                        <fieldset className="fieldset mt-4">
                            <label className="label">Sender Address</label>
                            <input type="text" className="input w-full" {...register('senderAddress')} placeholder="Sender Address" />
                        </fieldset>
                        {/* Sender Phone No */}
                        <fieldset className="fieldset mt-4">
                            <label className="label">Sender Phone No</label>
                            <input type="tel" className="input w-full" {...register('senderPhone')} placeholder="Sender Phone No" />
                        </fieldset>
                      
                        {/* Sender Instruction */}
                        <fieldset className="fieldset mt-4">
                            <label className="label">Sender Instruction</label>
                            <textarea className="textarea w-full" {...register('senderInstruction')} placeholder="Sender Instruction" />
                        </fieldset>
                    </div>

                    {/* receiver Info */}
                    <div>

                        <h4 className="text-2xl font-semibold">Receiver Details</h4>
                        {/* Receiver Name */}
                        <fieldset className="fieldset mt-4">
                            <label className="label">Receiver name</label>
                            <input type="text" className="input w-full" {...register('receiverName')} placeholder="Receiver Name" />
                        </fieldset>
                        {/* Receiver Email */}
                        <fieldset className="fieldset mt-4">
                            <label className="label">Receiver Email</label>
                            <input type="text" className="input w-full" {...register('receiverEmail')} placeholder="Receiver Email" />
                        </fieldset>

                          {/* Receiver Region */}
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Receiver Regions</legend>
                            <select {...register('receiverRegion')} defaultValue="Pick a region" className="select">
                                <option disabled={true}>Pick a browser</option>
                                 {
                                    regions.map((r, i) => <option key={i} value={r}>{r}</option>)
                                 }
                            </select>
                            <span className="label">Optional</span>
                        </fieldset>


                               {/* Receiver District */}
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Receiver District</legend>
                            <select {...register('receiverDistrict')} defaultValue="Pick a District" className="select">
                                <option disabled={true}>Pick a district</option>
                                {
                                    districtsByRegion(receiverRegion).map((r, i) => <option key={i} value={r}>{r}</option>)
                                }
                               
                            </select>
                           
                        </fieldset>


                        {/* Receiver Address */}
                        <fieldset className="fieldset mt-4">
                            <label className="label">Receiver Address</label>
                            <input type="text" className="input w-full" {...register('receiverAddress')} placeholder="Receiver Address" />
                        </fieldset>
                        {/* Receiver Phone No */}
                        <fieldset className="fieldset mt-4">
                            <label className="label">Receiver Phone No</label>
                            <input type="tel" className="input w-full" {...register('receiverPhone')} placeholder="Receiver Phone No" />
                        </fieldset>
                    
                        {/* Receiver Instruction */}
                        <fieldset className="fieldset mt-4">
                            <label className="label">Receiver Instruction</label>
                            <textarea className="textarea w-full" {...register('receiverInstruction')} placeholder="Receiver Instruction" />
                        </fieldset>

                    </div>

                </div>

                <input type="submit" className='btn btn-primary text-black mt-4' value="Send Parcel" />
            </form>
        </div>
    );
};

export default SendParcel;