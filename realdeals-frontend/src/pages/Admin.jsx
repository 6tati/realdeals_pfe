import { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import AdminOrders from '../components/admin/AdminOrders';
import AdminProducts from '../components/admin/AdminProducts';
import AdminCategories from '../components/admin/AdminCategories';
import AdminSales from '../components/admin/AdminSales';
import AdminClients from '../components/admin/AdminClients.jsx';
import { getAdminClients, getAdminOrders, getAdminStats } from '../services/api';
import AdminMessages from '../components/AdminMessages';

const TABS = [
    { key: 'Orders', label: 'Orders' },
    { key: 'Products', label: 'Products' },
    { key: 'Categories', label: 'Categories' },
    { key: 'Sales', label: 'Sales' },
    { key: 'Clients', label: 'Clients' },
    { key: 'Messages', label: 'Messages' }
];

export default function Admin() {
    const user = JSON.parse(localStorage.getItem('user'));
    const [activeTab, setActiveTab] = useState('Orders');
    const [summary, setSummary] = useState({ clients: 0, orders: 0, revenue: 0, pending: 0 });

    useEffect(() => {
        if (!user || user.role !== 'ADMIN') return;

        Promise.allSettled([getAdminClients(), getAdminOrders(), getAdminStats()])
            .then(([clientsRes, ordersRes, statsRes]) => {
                const clients = clientsRes.status === 'fulfilled' ? clientsRes.value : [];
                const orders = ordersRes.status === 'fulfilled' ? ordersRes.value : [];
                const stats = statsRes.status === 'fulfilled' ? statsRes.value : {};

                setSummary({
                    clients: Array.isArray(clients) ? clients.length : 0,
                    orders: Array.isArray(orders) ? orders.length : Number(stats.orderCount || 0),
                    revenue: Number(stats.totalRevenue || 0),
                    pending: Array.isArray(orders) ? orders.filter(o => o.statut === 'EN_ATTENTE').length : 0,
                });
            });
    }, [user?.role]);

    const title = useMemo(() => TABS.find(t => t.key === activeTab)?.label || 'Dashboard', [activeTab]);

    if (!user || user.role !== 'ADMIN') {
        return <Navigate to="/" replace />;
    }

    return (
        <main className="min-h-screen bg-neutral-50">
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.35em] text-neutral-500">REALDEALS Backoffice</p>
                        <h1 className="mt-2 text-3xl sm:text-4xl font-black uppercase tracking-tight text-black">Admin Dashboard</h1>
                        <p className="mt-2 text-sm text-neutral-500">Manage orders, clients, products, categories, and sales.</p>
                    </div>

                    <div className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-neutral-600">
                        {user.name || 'Admin'} · {user.role}
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
                    <SummaryCard label="Revenue" value={`${summary.revenue} MAD`} />
                    <SummaryCard label="Orders" value={summary.orders} />
                    <SummaryCard label="Pending" value={summary.pending} />
                    <SummaryCard label="Clients" value={summary.clients} />
                </div>

                <div className="rounded-3xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
                    <div className="border-b border-neutral-200 px-4 sm:px-6">
                        <div className="flex gap-1 overflow-x-auto">
                            {TABS.map(tab => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`px-4 py-3 text-xs font-black uppercase tracking-widest ${
                                        activeTab === tab.key
                                            ? 'bg-black text-white'
                                            : 'bg-white text-black border border-neutral-200'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 sm:p-6 lg:p-8">
                        <div className="mb-6">
                            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">{title}</h2>
                            <p className="mt-1 text-sm text-neutral-500">{getTabDescription(activeTab)}</p>
                        </div>

                        {activeTab === 'Orders' && <AdminOrders />}
                        {activeTab === 'Products' && <AdminProducts />}
                        {activeTab === 'Categories' && <AdminCategories />}
                        {activeTab === 'Sales' && <AdminSales />}
                        {activeTab === 'Clients' && <AdminClients />}
                        {activeTab === 'Messages' && <AdminMessages />}
                    </div>
                </div>
            </section>
        </main>
    );
}

function SummaryCard({ label, value }) {
    return (
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 shadow-sm">
            <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-neutral-400">{label}</p>
            <p className="mt-2 text-xl sm:text-2xl font-black text-black">{value}</p>
        </div>
    );
}

function getTabDescription(tab) {
    switch (tab) {
        case 'Orders': return 'Track orders and update delivery status.';
        case 'Products': return 'Create, review, and delete store products.';
        case 'Categories': return 'Organize products by category.';
        case 'Sales': return 'View revenue and order count by period.';
        case 'Clients': return 'Review and edit registered customers.';
        default: return '';
    }
}
