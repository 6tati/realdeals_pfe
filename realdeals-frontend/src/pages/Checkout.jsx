import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Alert from '../components/ui/Alert';

export default function Checkout() {
    const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);
    const user = JSON.parse(localStorage.getItem('user'));
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phoneNumber: '',
        shippingAddress: '',
        modePaiement: 'CARTE',
    });

    if (!user) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
                <h2 className="text-2xl font-bold uppercase tracking-tight mb-3">Account Required</h2>
                <p className="text-neutral-500 mb-8">You need an account to place an order.</p>
                <div className="flex gap-4">
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-black text-white text-xs font-bold uppercase tracking-widest px-8 py-4 hover:bg-neutral-800 transition-colors"
                    >
                        Login
                    </button>
                    <button
                        onClick={() => navigate('/register')}
                        className="border border-black text-xs font-bold uppercase tracking-widest px-8 py-4 hover:bg-black hover:text-white transition-colors"
                    >
                        Register
                    </button>
                </div>
            </div>
        );
    }

    const total = cart.reduce((sum, p) => sum + p.prix, 0);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleCheckout = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const order = {
            utilisateur: { idUtilisateur: user.idUtilisateur },
            total,
            statut: 'EN_ATTENTE',
            modePaiement: form.modePaiement,
            phoneNumber: form.phoneNumber,
            shippingAddress: form.shippingAddress,
            lignesCommande: cart.map(p => ({
                produit: { idProd: p.idProd },
                quantite: p.quantite || 1,
                prixUnitaire: p.prix
            }))
        };

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:8080/api/commandes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(order)
            });
            if (res.ok) {
                localStorage.removeItem('cart');
                setSubmitted(true);
            } else {
                setError('Something went wrong placing your order.');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
                <h2 className="text-3xl font-bold uppercase tracking-tight mb-3">Order Confirmed</h2>
                <p className="text-neutral-500 mb-8">Thank you — we'll be in touch shortly.</p>
                <Link
                    to="/produits"
                    className="bg-black text-white text-xs font-bold uppercase tracking-widest px-8 py-4 hover:bg-neutral-800 transition-colors"
                >
                    Continue Shopping
                </Link>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center px-6">
                <Alert type="info">Your bag is empty.</Alert>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-6 py-16">
            <h2 className="text-3xl font-bold uppercase tracking-tight mb-10 text-center">Checkout</h2>

            {error && <Alert type="error">{error}</Alert>}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Shipping form */}
                <form onSubmit={handleCheckout} className="flex flex-col gap-6 order-2 lg:order-1">
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-2">Shipping Details</h3>

                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="FULL NAME"
                        required
                        className="w-full border-b border-black pb-2 text-sm uppercase tracking-widest placeholder-neutral-400 outline-none bg-transparent focus:border-neutral-500 transition-colors"
                    />
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="EMAIL ADDRESS"
                        required
                        className="w-full border-b border-black pb-2 text-sm uppercase tracking-widest placeholder-neutral-400 outline-none bg-transparent focus:border-neutral-500 transition-colors"
                    />
                    <input
                        type="tel"
                        name="phoneNumber"
                        value={form.phoneNumber}
                        onChange={handleChange}
                        placeholder="PHONE NUMBER"
                        required
                        className="w-full border-b border-black pb-2 text-sm uppercase tracking-widest placeholder-neutral-400 outline-none bg-transparent focus:border-neutral-500 transition-colors"
                    />
                    <input
                        type="text"
                        name="shippingAddress"
                        value={form.shippingAddress}
                        onChange={handleChange}
                        placeholder="SHIPPING ADDRESS"
                        required
                        className="w-full border-b border-black pb-2 text-sm uppercase tracking-widest placeholder-neutral-400 outline-none bg-transparent focus:border-neutral-500 transition-colors"
                    />

                    <div className="mt-4">
                        <p className="text-sm font-bold uppercase tracking-widest mb-3">Payment Method</p>
                        <div className="flex flex-col gap-3">
                            {[
                                { value: 'CARTE', label: 'Credit Card' },
                                { value: 'CASH', label: 'Cash on Delivery' },
                                { value: 'VIREMENT', label: 'Bank Transfer' },
                            ].map(opt => (
                                <label
                                    key={opt.value}
                                    className={`flex items-center gap-3 border px-4 py-3 cursor-pointer transition-colors ${
                                        form.modePaiement === opt.value
                                            ? 'border-black bg-neutral-50'
                                            : 'border-neutral-200 hover:border-neutral-400'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="modePaiement"
                                        value={opt.value}
                                        checked={form.modePaiement === opt.value}
                                        onChange={handleChange}
                                        className="accent-black"
                                    />
                                    <span className="text-sm">{opt.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white text-xs font-bold uppercase tracking-widest py-4 mt-6 hover:bg-neutral-800 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Placing Order...' : 'Place Order'}
                    </button>
                </form>

                {/* Order summary */}
                <div className="order-1 lg:order-2">
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-6">Order Summary</h3>
                    <div className="flex flex-col gap-5">
                        {cart.map((p, i) => (
                            <div key={i} className="flex gap-4 items-center border-b border-neutral-100 pb-5">
                                <div className="w-16 h-20 bg-neutral-100 flex items-center justify-center flex-shrink-0">
                                    {p.imageUrl ? (
                                        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-[8px] text-neutral-300 uppercase tracking-widest text-center px-1">
                                            No Image
                                        </span>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{p.name}</p>
                                    <p className="text-sm text-neutral-500 mt-1">{p.prix} MAD</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-between mt-6 pt-6 border-t border-neutral-200">
                        <span className="text-lg font-bold uppercase tracking-wide">Total</span>
                        <span className="text-lg font-bold">{total} MAD</span>
                    </div>
                </div>
            </div>
        </div>
    );
}