import { useQuery } from '@tanstack/react-query';
import useTitle from '../../hooks/useTitle';
import React from 'react';
import { useParams, Link } from 'react-router';
import useAxios from '../../hooks/useAxios';
import {
    FaBox, FaMapMarkerAlt, FaCalendarAlt,
    FaUser, FaPhoneAlt, FaTruck, FaCheckCircle,
    FaShippingFast, FaArrowLeft, FaInfoCircle,
    FaWeightHanging, FaMoneyBillWave, FaMotorcycle
} from 'react-icons/fa';

const ParcelTrack = () => {
    useTitle("Track Parcel");
    const { trackingId } = useParams();
    const axiosInstance = useAxios();

    const { data: trackings = [], isLoading: isLogsLoading } = useQuery({
        queryKey: ['trackingLogs', trackingId],
        queryFn: async () => {
            const res = await axiosInstance.get(`/trackings/${trackingId}/logs`);
            return res.data;
        },
        enabled: !!trackingId,
    });

    const { data: parcel, isLoading: isParcelLoading } = useQuery({
        queryKey: ['parcelInfo', trackingId],
        queryFn: async () => {
            try {
                const res = await axiosInstance.get(`/parcels/track/${trackingId}`);
                console.log("Parcel Data Fetched:", res.data);
                return res.data;
            } catch (err) {
                return null;
            }
        },
        enabled: !!trackingId,
        retry: false,
    });

    if (isLogsLoading || isParcelLoading) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
            <span className="loading loading-ring loading-lg text-primary"></span>
            <p className="text-sm font-bold text-secondary uppercase tracking-widest text-center">
                Syncing Shipment Details...
            </p>
        </div>
    );

    if (trackings.length === 0 && !isParcelLoading && !parcel) return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-error/5 p-8 rounded-full mb-6">
                <FaBox className="text-6xl text-error/40" />
            </div>
            <h2 className="text-2xl font-bold text-secondary mb-2">Package Not Found</h2>
            <p className="text-sm opacity-60 mb-6 max-w-sm mx-auto">Tracking ID <span className="font-mono font-bold text-error break-all">"{trackingId}"</span> does not exist.</p>
            <Link to="/" className="btn btn-secondary btn-sm px-6 rounded-full"><FaArrowLeft /> Home</Link>
        </div>
    );

    const latestLog = trackings[trackings.length - 1];
    const latestStatus = latestLog?.details || parcel?.deliveryStatus || 'Pending';

    // Journey progress calculation
    const progressMap = {
        'parcel_created': 15,
        'parcel_paid': 35,
        'driver_assigned': 55,
        'rider_arriving': 75,
        'parcel_picked_up': 90,
        'parcel_delivered': 100
    };
    const currentProgress = progressMap[latestLog?.status] || 0;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString();
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] py-6 px-4">
            <div className="max-w-5xl mx-auto space-y-6">

                {/* 🏷️ MINIMAL HEADER */}
                <header className="bg-secondary text-white rounded-2xl p-6 md:p-8 shadow-sm">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#CAEB66] text-secondary rounded-full text-[10px] font-black uppercase tracking-wider">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                                </span>
                                {latestStatus.split('_').join(' ')}
                            </div>
                            <h1 className="text-2xl md:text-3xl font-black font-mono tracking-tight">{trackingId}</h1>
                            <p className="text-xs text-white/60 font-medium">Shipment created on {formatDate(parcel?.createdAt)}</p>
                        </div>

                        <div className="flex gap-3">
                            <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-center min-w-[120px]">
                                <p className="text-[9px] uppercase font-bold text-white/40 mb-1">Type</p>
                                <p className="text-sm font-bold capitalize">{parcel?.parcelType || 'N/A'}</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-center min-w-[120px]">
                                <p className="text-[9px] uppercase font-bold text-white/40 mb-1">Weight</p>
                                <p className="text-sm font-bold">{parcel?.parcelWeight || '0'} KG</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">
                            <span className={currentProgress >= 15 ? 'text-[#CAEB66]' : ''}>Order</span>
                            <span className={currentProgress >= 55 ? 'text-[#CAEB66]' : ''}>Transit</span>
                            <span className={currentProgress >= 100 ? 'text-[#CAEB66]' : ''}>Delivered</span>
                        </div>
                        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                            <div
                                className="bg-[#CAEB66] h-full rounded-full transition-all duration-1000 ease-in-out"
                                style={{ width: `${currentProgress}%` }}
                            ></div>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* 📦 SHIPMENT DETAILS */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-base-200 p-5 space-y-5">
                            <h3 className="text-sm font-black text-secondary flex items-center gap-2 uppercase tracking-tighter">
                                <FaInfoCircle className="text-[#CAEB66]" /> Shipment Details
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-base-content/40 mb-2">From</p>
                                    <div className="text-sm">
                                        <p className="font-bold text-secondary">{parcel?.senderName || 'N/A'}</p>
                                        <p className="text-xs opacity-60 leading-tight">
                                            {parcel?.senderAddress}{parcel?.senderAddress && parcel?.senderDistrict ? ', ' : ''}{parcel?.senderDistrict}
                                        </p>
                                        <p className="text-xs opacity-60 flex items-center gap-1 mt-1">
                                            <FaPhoneAlt className="text-[10px]" /> {parcel?.senderPhone || 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                <div className="border-t border-dashed border-base-200 pt-4">
                                    <p className="text-[10px] uppercase font-bold text-base-content/40 mb-2">To</p>
                                    <div className="text-sm">
                                        <p className="font-bold text-secondary">{parcel?.receiverName || 'N/A'}</p>
                                        <p className="text-xs opacity-60 leading-tight">
                                            {parcel?.receiverAddress}{parcel?.receiverAddress && parcel?.receiverDistrict ? ', ' : ''}{parcel?.receiverDistrict}
                                        </p>
                                        <p className="text-xs opacity-60 flex items-center gap-1 mt-1">
                                            <FaPhoneAlt className="text-[10px]" /> {parcel?.receiverPhone || 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                {parcel?.receiverInstruction && (
                                    <div className="bg-base-100 p-3 rounded-lg border border-base-200 text-xs text-base-content/70 italic">
                                        Note: {parcel?.receiverInstruction}
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-base-200 pt-4 flex justify-between items-center text-xs font-bold">
                                <span className="opacity-40">Total Cost</span>
                                <span className="text-lg font-black text-secondary">${parcel?.cost || '0'}</span>
                            </div>
                        </div>

                        {/* Rider Info if assigned */}
                        {parcel?.riderName && (
                            <div className="bg-secondary rounded-2xl p-5 shadow-sm space-y-4">
                                <h3 className="text-xs font-black text-[#CAEB66] flex items-center gap-2 uppercase">
                                    <FaMotorcycle /> Assigned Rider
                                </h3>
                                <div className="flex items-center gap-3">
                                    <div className="bg-white/10 h-10 w-10 rounded-full flex items-center justify-center text-white">
                                        <FaUser />
                                    </div>
                                    <div className="text-white">
                                        <p className="text-sm font-bold leading-none">{parcel.riderName}</p>
                                        <p className="text-[10px] opacity-60">{parcel.riderEmail}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="bg-[#CAEB66] rounded-2xl p-5 shadow-sm flex items-center justify-between gap-4">
                            <div>
                                <h4 className="font-black text-secondary text-sm italic">Need support?</h4>
                                <p className="text-[10px] text-secondary/60">Help available 24/7</p>
                            </div>
                            <Link to="/contact" className="btn btn-secondary btn-xs rounded-full px-4">Contact</Link>
                        </div>
                    </div>

                    {/* 🕒 TRACKING TIMELINE */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-base-200 p-6 md:p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-lg font-black text-secondary uppercase tracking-tighter flex items-center gap-3">
                                <FaTruck className="text-[#CAEB66]" /> Journey History
                                <span className="text-xs font-normal border border-base-200 px-2 py-0.5 rounded-full text-base-content/40">{trackings.length} steps</span>
                            </h2>
                        </div>

                        <div className="space-y-8 relative">
                            {/* Vertical Line */}
                            <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-base-200"></div>

                            {trackings.slice().reverse().map((log, index) => (
                                <div key={log._id} className="relative flex gap-6">
                                    {/* Icon */}
                                    <div className={`relative z-10 w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all ${index === 0
                                        ? 'bg-[#CAEB66] border-secondary text-secondary shadow-lg shadow-[#CAEB66]/20'
                                        : 'bg-white border-base-200 text-base-content/20'
                                        }`}>
                                        <FaCheckCircle className={index === 0 ? 'text-lg' : 'text-sm'} />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 pb-8">
                                        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-1 mb-2">
                                            <h4 className={`text-sm font-bold uppercase tracking-tight ${index === 0 ? 'text-secondary' : 'text-base-content/60'}`}>
                                                {log.details}
                                            </h4>
                                            <div className="text-[9px] font-bold text-base-content/30 uppercase">
                                                {new Date(log.createdAt).toLocaleString(undefined, {
                                                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                                })}
                                            </div>
                                        </div>
                                        <p className="text-xs text-base-content/50 leading-relaxed font-medium">
                                            Status logged as <span className="text-secondary font-bold">{log.status.split('_').join(' ')}</span>.
                                            Hub process completed: <span className="font-mono text-[10px]">ZS-{log._id.slice(-6).toUpperCase()}</span>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {trackings.length === 0 && (
                            <div className="text-center py-12">
                                <FaBox className="text-4xl text-base-content/10 mx-auto mb-3" />
                                <p className="text-xs font-bold text-base-content/20 uppercase tracking-widest">No Shipment Data Yet</p>
                            </div>
                        )}

                        <div className="mt-6 pt-6 border-t border-base-200 text-center">
                            <Link to="/dashboard/my-parcels" className="text-[10px] font-black text-secondary/40 hover:text-secondary transition-all flex items-center justify-center gap-2 uppercase tracking-widest">
                                <FaArrowLeft className="text-[8px]" /> Back to Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParcelTrack;
