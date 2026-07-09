import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Alert from '../components/ui/Alert';

export default function Cart() {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        setCart(JSON.parse(localStorage.getItem('cart')) || []);
    }, []);

    const removeFromCart = (index) => {
        const updated = cart.filter((_, i) => i !== index);
        setCart(updated);
        localStorage.setItem('cart', JSON.stringify(updated));
    };

    const total = cart.reduce((sum, p) => sum + p.prix, 0);

    return (
        <div className="max-w-3xl mx-auto px-6 py-16">
            <h2 className="text-3xl font-bold uppercase tracking-tight mb-10 text-center">Your Bag</h2>

            {cart.length === 0 ? (
                <Alert type="info">Your bag is empty.</Alert>
            ) : (
                <>
                    <div className="flex flex-col gap-6">
                        {cart.map((p, i) => (
                            <div key={i} className="flex items-center justify-between border-b border-neutral-200 pb-6">
                                <div className="flex gap-4 items-center">
                                    <div className="w-20 h-24 bg-neutral-100 flex items-center justify-center flex-shrink-0">
                                        {p.imageUrl ? (
                                            <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-[9px] text-neutral-300 uppercase tracking-widest text-center px-1">
                                                No Image
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-medium">{p.name}</h3>
                                        <p className="text-neutral-500 mt-1">{p.prix} MAD</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeFromCart(i)}
                                    className="text-xs uppercase tracking-widest text-neutral-400 hover:text-black transition-colors"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 flex items-center justify-between">
                        <p className="text-lg font-medium">Total: {total} MAD</p>
                        <Link to="/checkout">
                            <button className="bg-black text-white text-xs font-bold uppercase tracking-widest px-10 py-4 hover:bg-neutral-800 transition-colors">
                                Checkout
                            </button>
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}