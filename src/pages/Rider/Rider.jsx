import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useLoaderData } from 'react-router';
import Swal from 'sweetalert2';

const Rider = () => {


    const { register,
        handleSubmit,
        control,
        // formState: { errors } 
    } = useForm();

    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const serviceCenters = useLoaderData();
    const regionsDuplicate = serviceCenters.map(c => c.region);
    const regions = [...new Set(regionsDuplicate)];
    const riderRegion = useWatch({ control, name: 'riderRegion' });

    const districtsByRegion = region => {
        const regionDistricts = serviceCenters.filter(c => c.region === region);
        const districts = regionDistricts.map(d => d.district);
        return (districts)
    }

    const handleRiderApplication = data => {
        console.log(data);
        axiosSecure.post('/riders', data)
            .then(res => {
                if (res.data.insertedId) {
                   
                    console.log('Rider application submitted', res.data);
                return    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: "Your application has been submitted successfully. we will get back to you soon!",
                        showConfirmButton: false,
                        timer: 1500
                    });
                }

        else if (res.data.message === 'rider already exist') {
        Swal.fire({
            icon: "warning",
            title: "Sorry you already use this email to apply as a rider",
            text: "Our system already has your application.",
            confirmButtonText: "OK"
        });
    }
                
            })
            .catch(error => {
                console.error('Error submitting rider application:', error);
            })
    }


    return (
        <div>
            <h2 className="text-4xl text-secondary">Be a Rider</h2>

            <p className='text-accent-300 mb-10'>Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle. From personal packages to business shipments — we deliver on time, every time.</p>



            <form onSubmit={handleSubmit(handleRiderApplication)} className='my-8 p-8 rounded-2xl border border-primary shadow-lg'>

                <h4 className='text-2xl font-semibold mb-4 text-primary'>Tell us about your self</h4>


                {/* sender Info */}

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                        {/* Rider Name */}
                        <fieldset className="fieldset mt-4">
                            <label className="label">Rider name</label>
                            <input type="text" className="input w-full" {...register('riderName')} placeholder="Rider Name" />
                        </fieldset>


                        {/* Rider NID NUMBER */}
                        <fieldset className="fieldset mt-4">
                            <label className="label">Rider NID</label>
                            <input type="text" className="input w-full" {...register('riderNID')} placeholder="Rider NID" />
                        </fieldset>

                        {/* Rider Contact */}
                        <fieldset className="fieldset mt-4">
                            <label className="label">Rider Contact</label>
                            <input type="tel" className="input w-full" {...register('riderContact')} placeholder="Rider Contact" />
                        </fieldset>

                        {/* Rider Region */}
                        <fieldset className="fieldset mt-4">
                            <legend className="fieldset-legend">Rider Regions</legend>
                            <select {...register('riderRegion')} defaultValue="Pick a region" className="select w-full">
                                <option disabled={true}>Pick a browser</option>
                                {
                                    regions.map((r, i) => <option key={i} value={r}>{r}</option>)
                                }
                            </select>

                        </fieldset>




                    </div>

                    <div >
                        {/* Rider Email */}
                        <fieldset className="fieldset mt-4">
                            <label className="label">Rider Email</label>
                            <input type="text" className="input w-full" {...register('riderEmail')} readOnly value={user?.email} placeholder="Rider Email" />
                        </fieldset>

                        {/* Rider Driving License */}
                        <fieldset className="fieldset mt-4">
                            <label className="label">Rider Driving License</label>
                            <input type="text" className="input w-full" {...register('riderLicense')} placeholder="Rider Driving License" />
                        </fieldset>

                        {/* Rider Age */}
                        <fieldset className="fieldset mt-4">
                            <label className="label">Rider Age</label>
                            <input type="text" className="input w-full" {...register('riderAge')} placeholder="Rider Age" />
                        </fieldset>


                        {/* Rider District */}
                        <fieldset className="fieldset mt-4">
                            <legend className="fieldset-legend">Rider District</legend>
                            <select {...register('riderDistrict')} defaultValue="Pick a District" className="select w-full">
                                <option disabled={true}>Pick a district</option>
                                {
                                    districtsByRegion(riderRegion).map((r, i) => <option key={i} value={r}>{r}</option>)
                                }

                            </select>

                        </fieldset>



                    </div>
                </div>


                <input type="submit" className='btn btn-primary text-black mt-4' value="Apply as a Rider" />

            </form>
        </div >
    );
};

export default Rider;