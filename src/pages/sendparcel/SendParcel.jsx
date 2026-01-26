import React from 'react';
import useTitle from '../../hooks/useTitle';
import { useForm, useWatch } from 'react-hook-form';
import { useLoaderData, useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAuth from '../../hooks/useAuth';

const SendParcel = () => {
    useTitle("Send Parcel");
    const { register,
        handleSubmit,
        control,
        formState: { errors }
    } = useForm();
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const serviceCenters = useLoaderData();
    const regionsDuplicate = serviceCenters.map(c => c.region);
    const regions = [...new Set(regionsDuplicate)];
    const senderRegion = useWatch({ control, name: 'senderRegion' });
    const receiverRegion = useWatch({ control, name: 'receiverRegion' })
    const navigate = useNavigate();

    const districtsByRegion = region => {
        const regionDistricts = serviceCenters.filter(c => c.region === region);
        const districts = regionDistricts.map(d => d.district);
        return (districts)
    }

    const handleSendParcel = data => {
        console.log(data);
        const isDocument = data.parcelType === 'document';
        const isSameDistrict = data.senderDistrict === data.receiverDistrict;
        const parcelWeight = parseFloat(data.parcelWeight)
        let cost = 0;
        if (isDocument) {
            cost = isSameDistrict ? 60 : 80;
        }
        else {
            if (parcelWeight < 3) {
                cost = isSameDistrict ? 110 : 150;
            }
            else {
                const minCost = isSameDistrict ? 110 : 150;
                const extraWeight = parcelWeight - 3;
                const extraCharge = isSameDistrict ? extraWeight * 40 : extraWeight * 40 + 40;
                cost = minCost + extraCharge;
            }
        }

        console.log('cost', cost);
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
                    .then(res => {
                        console.log('after saving parcel', res.data)
                        if (res.data.insertedId) {
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
        <div className=' p-4 sm:p-8 md:p-10 lg:p-12 xl:p-14 2xl:p-16  bg-white rounded-2xl shadow-lg max-w-7xl mx-auto mt-10 mb-16'>
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
                        <input type="text" className="input w-full" {...register('parcelName', { required: "Parcel name is required" })} placeholder="Parcel name" />
                        {errors.parcelName && <p className="text-red-500 text-sm mt-1">{errors.parcelName.message}</p>}
                    </fieldset>
                    <fieldset className="fieldset">
                        <label className="label">Parcel weight</label>
                        <input type="number" step="0.01" className="input w-full" {...register('parcelWeight', { required: "Parcel weight is required", min: { value: 0.1, message: "Minimum weight is 0.1 KG" } })} placeholder="Parcel Weight (KG)" />
                        {errors.parcelWeight && <p className="text-red-500 text-sm mt-1">{errors.parcelWeight.message}</p>}
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
                            <input type="text" className="input w-full" {...register('senderName')} readOnly value={user?.displayName} placeholder="Sender Name" />
                        </fieldset>
                        {/* Sender Email */}
                        <fieldset className="fieldset mt-4">
                            <label className="label">Sender Email</label>
                            <input type="text" className="input w-full" {...register('senderEmail')} readOnly value={user?.email} placeholder="Sender Email" />
                        </fieldset>

                        {/* Sender Region */}
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Sender Regions</legend>
                            <select {...register('senderRegion', { required: "Sender region is required" })} defaultValue="" className="select">
                                <option value="" disabled>Pick a region</option>
                                {
                                    regions.map((r, i) => <option key={i} value={r}>{r}</option>)
                                }
                            </select>
                            {errors.senderRegion && <p className="text-red-500 text-sm mt-1">{errors.senderRegion.message}</p>}
                        </fieldset>


                        {/* Sender District */}
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Sender District</legend>
                            <select {...register('senderDistrict', { required: "Sender district is required" })} defaultValue="" className="select">
                                <option value="" disabled>Pick a district</option>
                                {
                                    districtsByRegion(senderRegion).map((r, i) => <option key={i} value={r}>{r}</option>)
                                }

                            </select>
                            {errors.senderDistrict && <p className="text-red-500 text-sm mt-1">{errors.senderDistrict.message}</p>}

                        </fieldset>

                        {/* Sender Address */}
                        <fieldset className="fieldset mt-4">
                            <label className="label">Sender Address</label>
                            <input type="text" className="input w-full" {...register('senderAddress', { required: "Sender address is required" })} placeholder="Sender Address" />
                            {errors.senderAddress && <p className="text-red-500 text-sm mt-1">{errors.senderAddress.message}</p>}
                        </fieldset>
                        {/* Sender Phone No */}
                        <fieldset className="fieldset mt-4">
                            <label className="label">Sender Phone No</label>
                            <input type="tel" className="input w-full" {...register('senderPhone', { required: "Sender phone is required" })} placeholder="Sender Phone No" />
                            {errors.senderPhone && <p className="text-red-500 text-sm mt-1">{errors.senderPhone.message}</p>}
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
                            <input type="text" className="input w-full" {...register('receiverName', { required: "Receiver name is required" })} placeholder="Receiver Name" />
                            {errors.receiverName && <p className="text-red-500 text-sm mt-1">{errors.receiverName.message}</p>}
                        </fieldset>
                        {/* Receiver Email */}
                        <fieldset className="fieldset mt-4">
                            <label className="label">Receiver Email</label>
                            <input type="text" className="input w-full" {...register('receiverEmail', { required: "Receiver email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" } })} placeholder="Receiver Email" />
                            {errors.receiverEmail && <p className="text-red-500 text-sm mt-1">{errors.receiverEmail.message}</p>}
                        </fieldset>

                        {/* Receiver Region */}
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Receiver Regions</legend>
                            <select {...register('receiverRegion', { required: "Receiver region is required" })} defaultValue="" className="select">
                                <option value="" disabled>Pick a region</option>
                                {
                                    regions.map((r, i) => <option key={i} value={r}>{r}</option>)
                                }
                            </select>
                            {errors.receiverRegion && <p className="text-red-500 text-sm mt-1">{errors.receiverRegion.message}</p>}
                        </fieldset>


                        {/* Receiver District */}
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Receiver District</legend>
                            <select {...register('receiverDistrict', { required: "Receiver district is required" })} defaultValue="" className="select">
                                <option value="" disabled>Pick a district</option>
                                {
                                    districtsByRegion(receiverRegion).map((r, i) => <option key={i} value={r}>{r}</option>)
                                }

                            </select>
                            {errors.receiverDistrict && <p className="text-red-500 text-sm mt-1">{errors.receiverDistrict.message}</p>}

                        </fieldset>


                        {/* Receiver Address */}
                        <fieldset className="fieldset mt-4">
                            <label className="label">Receiver Address</label>
                            <input type="text" className="input w-full" {...register('receiverAddress', { required: "Receiver address is required" })} placeholder="Receiver Address" />
                            {errors.receiverAddress && <p className="text-red-500 text-sm mt-1">{errors.receiverAddress.message}</p>}
                        </fieldset>
                        {/* Receiver Phone No */}
                        <fieldset className="fieldset mt-4">
                            <label className="label">Receiver Phone No</label>
                            <input type="tel" className="input w-full" {...register('receiverPhone', { required: "Receiver phone is required" })} placeholder="Receiver Phone No" />
                            {errors.receiverPhone && <p className="text-red-500 text-sm mt-1">{errors.receiverPhone.message}</p>}
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