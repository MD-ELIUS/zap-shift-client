import React from 'react';
import useTitle from '../../../hooks/useTitle';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import Loading from '../../../components/Loading/Loading';

const COLORS = ['#CAEB66', '#03373D', '#FFBB28', '#FF8042', '#8884d8'];

const Statistics = () => {
    useTitle("Statistics");
    const axiosSecure = useAxiosSecure();
    const { user, loading } = useAuth();

    const { data: stats = {}, isLoading } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: async () => {
            const res = await axiosSecure.get('/dashboard/stats');
            return res.data;
        }
    });

    if (isLoading || loading) {
        return <Loading></Loading>;
    }

    // Prepare data for BarChart
    const barChartData = stats.chartData || [];

    return (
        <div className="p-4 space-y-6">
            <h2 className="text-3xl font-bold mb-6">
                Hi, Welcome Back <span className="text-primary">{user?.displayName}!</span>
            </h2>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.role === 'admin' && (
                    <>
                        <div className="stat bg-base-100 shadow-xl rounded-2xl border-l-4 border-primary">
                            <div className="stat-figure text-secondary">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <div className="stat-title">Total Bookings</div>
                            <div className="stat-value text-secondary">{stats.totalBookings}</div>
                        </div>
                        <div className="stat bg-base-100 shadow-xl rounded-2xl border-l-4 border-primary">
                            <div className="stat-figure text-secondary">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                            </div>
                            <div className="stat-title">Total Delivered</div>
                            <div className="stat-value text-secondary">{stats.totalDelivered}</div>
                        </div>
                        <div className="stat bg-base-100 shadow-xl rounded-2xl border-l-4 border-primary">
                            <div className="stat-figure text-secondary">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
                            </div>
                            <div className="stat-title">Total Users</div>
                            <div className="stat-value text-secondary">{stats.totalUsers}</div>
                        </div>
                        <div className="stat bg-base-100 shadow-xl rounded-2xl border-l-4 border-primary">
                            <div className="stat-figure text-secondary">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
                            </div>
                            <div className="stat-title">Total Riders</div>
                            <div className="stat-value text-secondary">{stats.totalRiders}</div>
                        </div>
                    </>
                )}

                {stats.role === 'user' && (
                    <>
                        <div className="stat bg-base-100 shadow-xl rounded-2xl border-l-4 border-primary">
                            <div className="stat-title">My Bookings</div>
                            <div className="stat-value text-secondary">{stats.totalBookings}</div>
                        </div>
                        <div className="stat bg-base-100 shadow-xl rounded-2xl border-l-4 border-primary">
                            <div className="stat-title">Delivered</div>
                            <div className="stat-value text-secondary">{stats.totalDelivered}</div>
                        </div>
                        <div className="stat bg-base-100 shadow-xl rounded-2xl border-l-4 border-primary">
                            <div className="stat-title">Pending Parcels</div>
                            <div className="stat-value text-secondary">{stats.totalPending || 0}</div>
                        </div>
                        <div className="stat bg-base-100 shadow-xl rounded-2xl border-l-4 border-primary">
                            <div className="stat-title">In Transit</div>
                            <div className="stat-value text-secondary">{stats.totalInTransit || 0}</div>
                        </div>
                    </>
                )}

                {stats.role === 'rider' && (
                    <>
                        <div className="stat bg-base-100 shadow-xl rounded-2xl border-l-4 border-primary">
                            <div className="stat-title">Assigned Parcels</div>
                            <div className="stat-value text-secondary">{stats.totalAssigned}</div>
                        </div>
                        <div className="stat bg-base-100 shadow-xl rounded-2xl border-l-4 border-primary">
                            <div className="stat-title">Delivered</div>
                            <div className="stat-value text-secondary">{stats.totalDelivered}</div>
                        </div>
                        <div className="stat bg-base-100 shadow-xl rounded-2xl border-l-4 border-primary">
                            <div className="stat-title">Pending Pickups</div>
                            <div className="stat-value text-secondary">{stats.totalPendingPickup || 0}</div>
                        </div>
                        <div className="stat bg-base-100 shadow-xl rounded-2xl border-l-4 border-primary">
                            <div className="stat-title">In Delivery</div>
                            <div className="stat-value text-secondary">{stats.totalInDelivery || 0}</div>
                        </div>
                    </>
                )}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                {/* Bar Chart */}
                <div className="bg-base-100 p-6 rounded-2xl shadow-xl">
                    <h3 className="text-xl font-semibold mb-4 text-center">Parcel Status Distribution</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={barChartData}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" fill="#8884d8">
                                    {barChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart */}
                <div className="bg-base-100 p-6 rounded-2xl shadow-xl">
                    <h3 className="text-xl font-semibold mb-4 text-center">Status Overview</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={barChartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {barChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Statistics;
