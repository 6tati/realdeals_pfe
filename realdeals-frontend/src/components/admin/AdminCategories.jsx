import { useState, useEffect } from 'react';
import Spinner from '../ui/Spinner';
import Alert from '../ui/Alert';

export default function AdminCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newName, setNewName] = useState('');
    const [creating, setCreating] = useState(false);

    const fetchCategories = () => {
        setError(null);
        fetch('http://localhost:8080/api/categories')
            .then(res => res.json())
            .then(setCategories)
            .catch(() => setError('Failed to load categories.'))
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchCategories(); }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newName.trim()) return;
        setCreating(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:8080/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ name: newName.trim() }),
            });
            if (res.ok) {
                setNewName('');
                fetchCategories();
            } else {
                setError('Failed to create category. Name may already exist.');
            }
        } catch (err) {
            console.error(err);
            setError('Network error.');
        } finally {
            setCreating(false);
        }
    };

    if (loading) return <Spinner />;

    return (
        <div>
            {error && <div className="mb-5"><Alert type="error">{error}</Alert></div>}
            <form onSubmit={handleCreate} className="mb-8 rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                <label className="mb-2 block text-[10px] font-black uppercase tracking-widest text-neutral-500">New category</label>
                <div className="flex flex-col gap-3 sm:flex-row">
                    <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Hoodies, Caps, T-shirts..." className="min-w-0 flex-1 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-black" />
                    <button type="submit" disabled={creating} className="rounded-xl bg-black px-6 py-3 text-xs font-black uppercase tracking-widest text-white transition-colors hover:bg-neutral-800 disabled:opacity-50">
                        {creating ? 'Adding...' : 'Add Category'}
                    </button>
                </div>
            </form>
            {categories.length === 0 ? <Alert type="info">No categories yet.</Alert> : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {categories.map(c => (
                        <div key={c.idCateg} className="rounded-2xl border border-neutral-200 bg-white p-5">
                            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Category #{c.idCateg}</p>
                            <p className="mt-2 text-lg font-black uppercase tracking-tight">{c.name}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
