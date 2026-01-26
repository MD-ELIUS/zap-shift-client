import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, Link } from 'react-router';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Loading from '../../../components/Loading/Loading';
import { FaCheckCircle, FaBox, FaHome, FaPrint, FaFileDownload } from 'react-icons/fa';
import emailjs from '@emailjs/browser';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const [invoiceData, setInvoiceData] = useState(null)
    const sessionId = searchParams.get('session_id')
    const emailSentRef = useRef(false);

    const axiosSecure = useAxiosSecure();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (sessionId && !invoiceData) {
            setLoading(true);
            axiosSecure.patch(`/payment-success?session_id=${sessionId}`)
                .then(res => {
                    const data = res.data.invoiceData || {
                        transactionId: res.data.transactionId,
                        trackingId: res.data.trackingId,
                        amount: res.data.paymentInfo?.amount, // Fallback if old structure
                        date: new Date(),
                        customer_name: 'Customer',
                        items: [{ description: 'Parcel Delivery', amount: 0 }]
                    };

                    setInvoiceData(data);

                    // Send Email only once
                    if (res.data.success && !emailSentRef.current) {
                        emailSentRef.current = true;
                        sendEmailNotification(data);
                    }

                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                })
        }
    }, [sessionId, axiosSecure, invoiceData])

    const sendEmailNotification = (data) => {
        const templateParams = {
            subject: 'Payment Successful - Invoice Received',
            to_name: data.customer_name,
            to_email: data.customer_email,
            message: `Your payment of $${data.amount} for parcel delivery has been successfully received.`,
            transaction_id: data.transactionId,
            amount: data.amount,
            date: new Date(data.date).toLocaleDateString()
        };

        emailjs.send(
            import.meta.env.VITE_EMAILJS_SERVICE_ID,
            import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
            templateParams,
            import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        ).then((response) => {
            console.log('SUCCESS!', response.status, response.text);
        }, (err) => {
            console.log('FAILED...', err);
        });
    };

    const handleDownloadInvoice = () => {
        if (invoiceData?.transactionId) {
            window.open(`${import.meta.env.VITE_API_URL || 'http://localhost:5205'}/invoices/transaction/${invoiceData.transactionId}`, '_blank');
        }
    };

    if (loading) return <Loading />

    return (
        <div className="min-h-[90vh] flex items-center justify-center p-4 bg-gradient-to-br from-base-200 to-base-300">
            <div className="card w-full max-w-2xl bg-base-100/90 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/20 overflow-hidden">
                {/* Top Success Banner */}
                <div className="bg-success py-10 flex flex-col items-center justify-center gap-4 text-success-content relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] opacity-20"></div>
                    <div className="bg-white/20 p-5 rounded-full ring-8 ring-white/10 animate-pulse">
                        <FaCheckCircle className="text-6xl drop-shadow-lg" />
                    </div>
                    <h2 className="text-4xl font-black tracking-tight uppercase">Confirmed!</h2>
                </div>

                <div className="card-body p-8 lg:p-12 space-y-8">
                    <div className="text-center space-y-3">
                        <h3 className="text-2xl font-bold opacity-80 text-primary">Payment Received Successfully</h3>
                        <p className="text-base-content/60 max-w-md mx-auto">Your parcel booking has been processed and is now scheduled for pickup. We've sent the invoice to your email.</p>
                    </div>

                    {/* Information Grid */}
                    {invoiceData && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-base-200 p-6 rounded-2xl border border-base-300 group transition-all duration-300 hover:shadow-inner">
                                <p className="text-[10px] uppercase tracking-widest font-bold text-base-content/40 mb-2">Transaction ID</p>
                                <p className="font-mono font-bold text-secondary break-all select-all">{invoiceData.transactionId}</p>
                            </div>
                            <div className="bg-base-200 p-6 rounded-2xl border border-base-300 group transition-all duration-300 hover:shadow-inner">
                                <p className="text-[10px] uppercase tracking-widest font-bold text-base-content/40 mb-2">Amount</p>
                                <p className="font-mono font-black text-secondary select-all text-2xl">${invoiceData.amount}</p>
                            </div>
                        </div>
                    )}

                    {/* Action Hub */}
                    <div className="flex flex-col gap-4">
                        <Link
                            to={`/parcel-track/${invoiceData?.trackingId}`}
                            className="btn btn-primary btn-lg shadow-xl shadow-primary/30 gap-3 group text-lg text-secondary"
                        >
                            <FaBox className="group-hover:scale-110 transition-transform" />
                            Track Live Delivery
                        </Link>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <Link to="/dashboard/my-parcels" className="btn btn-outline border-base-300 hover:bg-base-200 hover:text-base-content gap-2">
                                <FaBox className="text-xs" /> My Parcels
                            </Link>

                            <button
                                className="btn btn-outline border-base-300 hover:bg-base-200 hover:text-base-content gap-2"
                                onClick={handleDownloadInvoice}
                            >
                                <FaFileDownload className="text-xs" /> Invoice
                            </button>

                            <button className="btn btn-outline border-base-300 hover:bg-base-200 hover:text-base-content gap-2" onClick={() => window.print()}>
                                <FaPrint className="text-xs" /> Print
                            </button>
                            <Link to="/" className="btn btn-outline border-base-300 hover:bg-base-200 hover:text-base-content gap-2">
                                <FaHome className="text-xs" /> Home
                            </Link>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-base-300 flex flex-col md:flex-row items-center justify-between gap-4 text-xs opacity-50">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-success animate-ping"></span>
                            <span>Secure Payment Verified</span>
                        </div>
                        <div className="flex gap-6">
                            <span className="cursor-pointer hover:text-primary transition-colors">Documentation</span>
                            <span className="cursor-pointer hover:text-primary transition-colors">24/7 Support</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
