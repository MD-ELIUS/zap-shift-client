import React, { useMemo } from 'react';
import useTitle from '../hooks/useTitle';
import { useForm, useWatch } from 'react-hook-form';
import { useLoaderData } from 'react-router';

const PricingCalculator = () => {
  useTitle("Pricing Calculator");

  /* ===============================
     LOADER DATA (100% SAFE)
  =============================== */
  const loaderData = useLoaderData();
  const serviceCenters = Array.isArray(loaderData) ? loaderData : [];

  /* ===============================
     FORM SETUP
  =============================== */
  const { register, control, reset } = useForm({
    defaultValues: {
      parcelType: 'document',
      parcelWeight: '',
      senderRegion: '',
      senderDistrict: '',
      receiverRegion: '',
      receiverDistrict: '',
    },
  });

  /* ===============================
     REGIONS (SEND PARCEL STYLE)
  =============================== */
  const regions = useMemo(() => {
    if (!serviceCenters.length) return [];
    return [...new Set(serviceCenters.map(c => c.region))];
  }, [serviceCenters]);

  /* ===============================
     WATCH VALUES
  =============================== */
  const parcelType = useWatch({ control, name: 'parcelType' });
  const parcelWeight = useWatch({ control, name: 'parcelWeight' });
  const senderRegion = useWatch({ control, name: 'senderRegion' });
  const receiverRegion = useWatch({ control, name: 'receiverRegion' });
  const senderDistrict = useWatch({ control, name: 'senderDistrict' });
  const receiverDistrict = useWatch({ control, name: 'receiverDistrict' });

  /* ===============================
     DISTRICTS BY REGION (SAFE)
  =============================== */
  const districtsByRegion = (region) => {
    if (!region) return [];
    return serviceCenters
      .filter(c => c.region === region)
      .map(c => c.district);
  };

  /* ===============================
     PRICE CALCULATION
  =============================== */
  const price = useMemo(() => {
    if (!senderDistrict || !receiverDistrict) return 0;

    const sameDistrict = senderDistrict === receiverDistrict;
    const weight = parseFloat(parcelWeight || 0);
    let cost = 0;

    if (parcelType === 'document') {
      cost = sameDistrict ? 60 : 80;
    } else {
      if (weight <= 3) {
        cost = sameDistrict ? 110 : 150;
      } else {
        const base = sameDistrict ? 110 : 150;
        const extra = (weight - 3) * 40;
        cost = sameDistrict ? base + extra : base + extra + 40;
      }
    }

    return cost;
  }, [parcelType, parcelWeight, senderDistrict, receiverDistrict]);

  /* ===============================
     UI
  =============================== */
  return (
    <div className="p-4 sm:p-8 md:p-10 lg:p-12 xl:p-14 2xl:p-16 max-w-7xl mx-auto bg-white rounded-2xl shadow-lg my-10">

      {/* PAGE TITLE */}
      <h2 className="text-4xl font-bold text-secondary mb-3">
        Pricing Calculator
      </h2>

      {/* SUBTITLE */}
      <p className="text-gray-600 max-w-3xl">
        Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle.
        From personal packages to business shipments — we deliver on time, every time.
      </p>

      <div className="my-8 border-t border-gray-300"></div>

      {/* SMALL TITLE */}
      <h3 className="text-2xl font-semibold mb-6 text-center">
        Calculate Your Cost
      </h3>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* LEFT FORM */}
        <div className="p-6 border rounded-xl shadow-sm space-y-4 border-primary">

          {/* Parcel Type */}
          <select {...register('parcelType')} className="select w-full">
            <option value="document">Document</option>
            <option value="non-document">Non Document</option>
          </select>

          {/* Weight */}
          <input
            type="number"
            step="0.1"
            {...register('parcelWeight')}
            placeholder="Parcel Weight (KG)"
            className="input w-full"
          />

          {/* Sender */}
          <select {...register('senderRegion')} className="select w-full">
            <option value="">Select Sender Region</option>
            {regions.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          <select {...register('senderDistrict')} className="select w-full">
            <option value="">Select Sender District</option>
            {districtsByRegion(senderRegion).map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {/* Receiver */}
          <select {...register('receiverRegion')} className="select w-full">
            <option value="">Select Receiver Region</option>
            {regions.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          <select {...register('receiverDistrict')} className="select w-full">
            <option value="">Select Receiver District</option>
            {districtsByRegion(receiverRegion).map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {/* Buttons */}
          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={() => reset()}
              className="btn bg-gray-200 text-black border-0"
            >
              Reset
            </button>

            <button
              type="button"
              className="btn btn-primary border-0 text-black"
            >
              Calculate
            </button>
          </div>
        </div>

        {/* RIGHT PRICE */}
        <div className="p-6 border border-primary rounded-xl shadow-sm flex flex-col justify-center items-center text-center ">

          <p className="text-gray-600 mb-2">
            Estimated Price
          </p>

          <h2 className="text-5xl font-bold text-secondary">
            ৳ {price}
          </h2>

          <p className="text-sm text-gray-500 mt-3">
            Final cost may vary based on confirmation
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingCalculator;
