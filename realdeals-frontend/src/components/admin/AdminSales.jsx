import { useEffect, useState } from 'react';
import Alert from '../ui/Alert';
import { getAdminStats } from '../../services/api';

export default function AdminSales() {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchStats = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getAdminStats(from, to);
            setStats(data);
        } catch (err) {
            console.error(err);
            setError('Failed to load stats.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchStats(); }, []);

    return (
        <div>
            <div className="mb-8 rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
                    <DateField label="From" value={from} onChange={setFrom} />
                    <DateField label="To" value={to} onChange={setTo} />
                    <button onClick={fetchStats} disabled={loading} className="rounded-xl bg-black px-8 py-3 text-xs font-black uppercase tracking-widest text-white transition-colors hover:bg-neutral-800 disabled:opacity-50">
                        {loading ? 'Loading...' : 'View Sales'}
                    </button>
                </div>
            </div>
            {error && <div className="mb-5"><Alert type="error">{error}</Alert></div>}
            {stats && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <StatCard label="Total Revenue" value={`${stats.totalRevenue || 0} MAD`} />
                    <StatCard label="Orders" value={stats.orderCount || 0} />
                </div>
            )}
        </div>
    );
}

function DateField({ label, value, onChange }) {
    return (
        <label>
            <span className="mb-2 block text-[10px] font-black uppercase tracking-widest text-neutral-500">{label}</span>
            <input type="date" value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-black" />
        </label>
    );
}

function StatCard({ label, value }) {
    return (
        <div className="rounded-2xl border border-neutral-200 bg-white p-8">
            <p className="text-xs font-black uppercase tracking-widest text-neutral-400">{label}</p>
            <p className="mt-3 text-3xl font-black tracking-tight">{value}</p>
        </div>
    );
}
