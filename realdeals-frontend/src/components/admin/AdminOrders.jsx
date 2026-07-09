import { useState, useEffect } from 'react';
import Spinner from '../ui/Spinner';
import Alert from '../ui/Alert';
import { getAdminOrders, updateOrderStatus } from '../../services/api';

const STATUS_OPTIONS = ['EN_ATTENTE', 'CONFIRMEE', 'EXPEDIEE', 'LIVREE', 'ANNULEE'];

const statusStyles = {
    EN_ATTENTE: 'bg-neutral-100 text-neutral-700 ring-neutral-200',
    CONFIRMEE: 'bg-blue-50 text-blue-700 ring-blue-100',
    EXPEDIEE: 'bg-yellow-50 text-yellow-700 ring-yellow-100',
    LIVREE: 'bg-green-50 text-green-700 ring-green-100',
    ANNULEE: 'bg-red-50 text-red-700 ring-red-100',
};

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        getAdminOrders()
            .then(data => {
                const sorted = [...data].sort((a, b) => new Date(b.dateCreation) - new Date(a.dateCreation));
                setOrders(sorted);
            })
            .catch((err) => {
                console.error(err);
                setError('Failed to load orders.');
            })
            .finally(() => setLoading(false));
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        setUpdatingId(orderId);
        setError(null);

        try {
            await updateOrderStatus(orderId, newStatus);
            setOrders(prev => prev.map(o => o.idOrder === orderId ? { ...o, statut: newStatus } : o));
        } catch (err) {
            console.error(err);
            setError('Failed to update order status.');
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) return <Spinner />;
    if (error) return <Alert type="error">{error}</Alert>;
    if (orders.length === 0) return <Alert type="info">No orders yet.</Alert>;

    return (
        <div className="space-y-4">
            {orders.map(order => (
                <article key={order.idOrder} className="rounded-2xl border border-neutral-200 bg-white p-4 sm:p-5 transition-shadow hover:shadow-sm">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-3">
                                <h3 className="text-sm sm:text-base font-black uppercase tracking-tight">Order #{order.idOrder}</h3>
                                <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ring-1 ${statusStyles[order.statut] || statusStyles.EN_ATTENTE}`}>
                                    {String(order.statut || 'EN_ATTENTE').replace('_', ' ')}
                                </span>
                            </div>
                            <p className="mt-1 text-xs text-neutral-500">{order.dateCreation ? new Date(order.dateCreation).toLocaleString() : 'No date'}</p>
                        </div>

                        <div className="text-left lg:text-right">
                            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Total</p>
                            <p className="text-lg font-black">{order.total || 0} MAD</p>
                        </div>
                    </div>

                    <div className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 text-sm">
                        <Info label="Client" value={order.clientName || order.clientEmail || `User #${order.idUtilisateur || '-'}`} />
                        <Info label="Phone" value={order.phoneNumber || '-'} />
                        <Info label="Payment" value={order.modePaiement || '-'} />
                        <Info label="Address" value={order.shippingAddress || '-'} />
                    </div>

                    <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-neutral-100 pt-4">
                        <p className="text-xs text-neutral-500">Update order status for delivery tracking.</p>
                        <select
                            value={order.statut || 'EN_ATTENTE'}
                            disabled={updatingId === order.idOrder}
                            onChange={(e) => handleStatusChange(order.idOrder, e.target.value)}
                            className="w-full sm:w-56 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-bold uppercase tracking-widest outline-none disabled:opacity-50"
                        >
                            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                        </select>
                    </div>
                </article>
            ))}
        </div>
    );
}

function Info({ label, value }) {
    return (
        <div className="rounded-xl bg-neutral-50 p-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{label}</p>
            <p className="mt-1 break-words text-neutral-800">{value}</p>
        </div>
    );
}
