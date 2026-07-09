import { useState, useEffect } from 'react';
import Spinner from '../ui/Spinner';
import Alert from '../ui/Alert';
import { getAdminClients, updateUser } from '../../services/api';

export default function AdminClients() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');

    useEffect(() => {
        getAdminClients()
            .then(setClients)
            .catch((err) => {
                console.error(err);
                setError('Failed to load clients.');
            })
            .finally(() => setLoading(false));
    }, []);

    const startEdit = (client) => {
        setEditingId(client.idUtilisateur);
        setEditName(client.name || '');
    };

    const saveEdit = async (id) => {
        try {
            await updateUser(id, { name: editName });
            setClients(prev => prev.map(c => c.idUtilisateur === id ? { ...c, name: editName } : c));
            setEditingId(null);
        } catch (err) {
            console.error(err);
            setError('Failed to update client.');
        }
    };

    if (loading) return <Spinner />;
    if (error) return <Alert type="error">{error}</Alert>;
    if (clients.length === 0) return <Alert type="info">No clients yet.</Alert>;

    return (
        <div className="overflow-hidden rounded-2xl border border-neutral-200">
            <div className="hidden lg:grid grid-cols-[1.3fr_1.7fr_0.8fr_1fr_0.6fr] gap-4 bg-neutral-50 px-5 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">
                <span>Name</span><span>Email</span><span>Role</span><span>Joined</span><span className="text-right">Action</span>
            </div>
            <div className="divide-y divide-neutral-100">
                {clients.map(c => (
                    <div key={c.idUtilisateur} className="grid grid-cols-1 gap-3 px-5 py-4 lg:grid-cols-[1.3fr_1.7fr_0.8fr_1fr_0.6fr] lg:items-center">
                        <div>
                            <p className="lg:hidden text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Name</p>
                            {editingId === c.idUtilisateur ? (
                                <input value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-black" />
                            ) : <p className="font-bold">{c.name || '-'}</p>}
                        </div>
                        <div><p className="lg:hidden text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Email</p><p className="break-all text-sm text-neutral-500">{c.email}</p></div>
                        <div><p className="lg:hidden text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Role</p><span className="rounded-full bg-neutral-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-neutral-700">{c.role}</span></div>
                        <div><p className="lg:hidden text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Joined</p><p className="text-sm text-neutral-500">{c.dateCreation ? new Date(c.dateCreation).toLocaleDateString() : '-'}</p></div>
                        <div className="lg:text-right">
                            {editingId === c.idUtilisateur ? (
                                <div className="flex gap-3 lg:justify-end">
                                    <button onClick={() => saveEdit(c.idUtilisateur)} className="text-xs font-black uppercase tracking-widest text-black hover:text-neutral-500">Save</button>
                                    <button onClick={() => setEditingId(null)} className="text-xs font-black uppercase tracking-widest text-neutral-400 hover:text-black">Cancel</button>
                                </div>
                            ) : (
                                <button onClick={() => startEdit(c)} className="text-xs font-black uppercase tracking-widest text-neutral-400 hover:text-black">Edit</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
