import React from 'react';
import useTitle from '../../hooks/useTitle';
import { useForm, useWatch } from 'react-hook-form';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useLoaderData } from 'react-router';
import Swal from 'sweetalert2';
import riderImg from "../../assets/agent-pending.png"; // image add করো

const Rider = () => {
    useTitle("Be a Rider");

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm();

    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const serviceCenters = useLoaderData();
    const regionsDuplicate = serviceCenters.map(c => c.region);
    const regions = [...new Set(regionsDuplicate)];
    const riderRegion = useWatch({ control, name: 'riderRegion' });

    const districtsByRegion = region => {
        const regionDistricts = serviceCenters.filter(c => c.region === region);
        return regionDistricts.map(d => d.district);
    };

    const handleRiderApplication = data => {
        axiosSecure.post('/riders', data)
            .then(res => {
                if (res.data.insertedId) {
                    return Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: "Your application has been submitted successfully. we will get back to you soon!",
                        showConfirmButton: false,
                        timer: 1500
                    });
                } else if (res.data.message === 'rider already exist') {
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
            });
    };

    return (
        <section className=" p-4 sm:p-8 md:p-10 lg:p-12 xl:p-14 2xl:p-16  bg-white rounded-2xl shadow-lg max-w-7xl mx-auto mt-10 mb-16">
            <div className="max-w-7xl mx-auto px-4">

                {/* Title */}
                <h2 className="text-4xl font-bold text-secondary mb-4">
                    Be a Rider
                </h2>

                <p className="text-gray-600 max-w-2xl mb-6 sm:mb-8 md:mb-10 lg:mb-12">
                    Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle.
                    From personal packages to business shipments — we deliver on time, every time.
                </p>

                {/* Content */}
                <div className="flex flex-col-reverse lg:flex-row items-center gap-12">

                    {/* Form */}
                    <div className="w-full lg:w-1/2">
                        <form
                            onSubmit={handleSubmit(handleRiderApplication)}
                            className="p-8 rounded-2xl border border-primary shadow-lg bg-white"
                        >
                            <h4 className="text-2xl font-semibold mb-6 text-primary">
                                Tell us about yourself
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <div>
                                    <fieldset className="fieldset mt-4">
                                        <label className="label">Rider name</label>
                                        <input
                                            type="text"
                                            className="input w-full"
                                            {...register('riderName')}
                                            readOnly
                                            value={user?.displayName}
                                        />
                                    </fieldset>

                                    <fieldset className="fieldset mt-4">
                                        <label className="label">Rider NID</label>
                                        <input
                                            type="text"
                                            className="input w-full"
                                            {...register('riderNID', { required: "NID is required" })}
                                        />
                                        {errors.riderNID && <p className="text-red-500 text-sm mt-1">{errors.riderNID.message}</p>}
                                    </fieldset>

                                    <fieldset className="fieldset mt-4">
                                        <label className="label">Rider Contact</label>
                                        <input
                                            type="tel"
                                            className="input w-full"
                                            {...register('riderContact', { required: "Contact number is required" })}
                                        />
                                        {errors.riderContact && <p className="text-red-500 text-sm mt-1">{errors.riderContact.message}</p>}
                                    </fieldset>

                                    <fieldset className="fieldset mt-4">
                                        <legend className="fieldset-legend">Rider Region</legend>
                                        <select
                                            {...register('riderRegion', { required: "Region is required" })}
                                            className="select w-full"
                                            defaultValue=""
                                        >
                                            <option value="" disabled>Pick a region</option>
                                            {regions.map((r, i) => (
                                                <option key={i} value={r}>{r}</option>
                                            ))}
                                        </select>
                                        {errors.riderRegion && <p className="text-red-500 text-sm mt-1">{errors.riderRegion.message}</p>}
                                    </fieldset>
                                </div>

                                <div>
                                    <fieldset className="fieldset mt-4">
                                        <label className="label">Rider Email</label>
                                        <input
                                            type="text"
                                            className="input w-full"
                                            {...register('riderEmail')}
                                            readOnly
                                            value={user?.email}
                                        />
                                    </fieldset>

                                    <fieldset className="fieldset mt-4">
                                        <label className="label">Driving License</label>
                                        <input
                                            type="text"
                                            className="input w-full"
                                            {...register('riderLicense', { required: "Driving license is required" })}
                                        />
                                        {errors.riderLicense && <p className="text-red-500 text-sm mt-1">{errors.riderLicense.message}</p>}
                                    </fieldset>

                                    <fieldset className="fieldset mt-4">
                                        <label className="label">Rider Age</label>
                                        <input
                                            type="number"
                                            className="input w-full"
                                            {...register('riderAge', { required: "Age is required", min: { value: 18, message: "Minimum age is 18" } })}
                                        />
                                        {errors.riderAge && <p className="text-red-500 text-sm mt-1">{errors.riderAge.message}</p>}
                                    </fieldset>

                                    <fieldset className="fieldset mt-4">
                                        <legend className="fieldset-legend">Rider District</legend>
                                        <select
                                            {...register('riderDistrict', { required: "District is required" })}
                                            className="select w-full"
                                            defaultValue=""
                                        >
                                            <option value="" disabled>Pick a district</option>
                                            {districtsByRegion(riderRegion).map((d, i) => (
                                                <option key={i} value={d}>{d}</option>
                                            ))}
                                        </select>
                                        {errors.riderDistrict && <p className="text-red-500 text-sm mt-1">{errors.riderDistrict.message}</p>}
                                    </fieldset>
                                </div>
                            </div>

                            <input
                                type="submit"
                                className="btn btn-primary text-black mt-6 w-full"
                                value="Apply as a Rider"
                            />
                        </form>
                    </div>

                    {/* Image */}
                    <div className="w-full lg:w-1/2 flex justify-center">
                        <img
                            src={riderImg}
                            alt="Be a Rider"
                            className="max-w-md w-full object-contain"
                        />
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Rider;
