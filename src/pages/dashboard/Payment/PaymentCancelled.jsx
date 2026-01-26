import React from 'react';
import { Link } from 'react-router';
import { FaTimesCircle, FaExclamationTriangle, FaHeadset, FaArrowLeft, FaUndo } from 'react-icons/fa';

const PaymentCancelled = () => {
    return (
        <div className="min-h-[90vh] flex items-center justify-center p-4 bg-gradient-to-br from-base-200 to-base-300">
            <div className="card w-full max-w-2xl bg-base-100/90 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/20 overflow-hidden">
                {/* Top Cancel Banner */}
                <div className="bg-error py-10 flex flex-col items-center justify-center gap-4 text-error-content relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] opacity-20"></div>
                    <div className="bg-white/20 p-5 rounded-full ring-8 ring-white/10">
                        <FaTimesCircle className="text-6xl drop-shadow-lg" />
                    </div>
                    <h2 className="text-4xl font-black tracking-tight uppercase">Cancelled</h2>
                </div>

                <div className="card-body p-8 lg:p-12 space-y-8">
                    <div className="text-center space-y-3">
                        <h3 className="text-2xl font-bold opacity-80 text-error">Payment Not Completed</h3>
                        <div className="inline-flex items-center gap-2 bg-warning/10 text-warning px-4 py-2 rounded-full text-sm font-semibold border border-warning/20 mx-auto">
                            <FaExclamationTriangle />
                            <span>Your bank account has not been charged.</span>
                        </div>
                        <p className="text-base-content/60 max-w-md mx-auto mt-4">The payment process was either manually cancelled or timed out. Don't worry, you can restart the process whenever you're ready.</p>
                    </div>

                    {/* Action Hub */}
                    <div className="flex flex-col gap-4">
                        <Link
                            to="/dashboard/my-parcels"
                            className="btn btn-error btn-lg shadow-xl shadow-error/30 gap-3 group text-lg text-white"
                        >
                            <FaUndo className="group-hover:rotate-[-45deg] transition-transform" />
                            Retry Payment Now
                        </Link>

                        <div className="grid grid-cols-2 gap-4">
                            <Link to="/dashboard/my-parcels" className="btn btn-outline border-base-300 hover:bg-base-200 hover:text-base-content gap-2 py-4 h-auto">
                                <FaArrowLeft className="text-xs" /> Back to List
                            </Link>
                            <Link to="/contact" className="btn btn-outline border-base-300 hover:bg-base-200 hover:text-base-content gap-2 py-4 h-auto">
                                <FaHeadset /> Get Support
                            </Link>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-base-300 flex flex-col items-center text-center space-y-2 opacity-50 text-xs">
                        <p>Need help with a payment issue? Our team is available 24/7.</p>
                        <div className="flex gap-4">
                            <span className="cursor-pointer hover:underline">Troubleshooting</span>
                            <span className="cursor-pointer hover:underline">Payment Methods</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentCancelled;
