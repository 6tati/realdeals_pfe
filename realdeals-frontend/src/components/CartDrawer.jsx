import { Link } from 'react-router-dom';
import Button from './ui/Button';
import { useCart } from '../context/CartContext';

export default function CartDrawer({ open, onClose }) {
    const { cart, removeFromCart } = useCart();
    const total = cart.reduce((sum, p) => sum + p.prix, 0);

    return (
        <>
            <div
                className={`fixed inset-0 bg-black/40 z-40 transition-opacity ${
                    open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                onClick={onClose}
            />

            <div
                className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white border-l border-neutral-200 z-50 transform transition-transform duration-300 flex flex-col ${
                    open ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="flex items-center justify-between p-6 border-b border-neutral-200">
                    <h3 className="text-sm font-bold uppercase tracking-widest">Your Bag ({cart.length})</h3>
                    <button onClick={onClose} className="text-xl leading-none hover:text-neutral-500 transition-colors">×</button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {cart.length === 0 ? (
                        <p className="text-neutral-400 uppercase text-xs tracking-widest">Your bag is empty</p>
                    ) : (
                        <div className="flex flex-col gap-6">
                            {cart.map((p, i) => (
                                <div key={i} className="flex gap-4 items-start border-b border-neutral-100 pb-6">
                                    <div className="w-20 h-24 bg-neutral-100 flex items-center justify-center flex-shrink-0">
                                        {p.imageUrl ? (
                                            <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-[9px] text-neutral-300 uppercase tracking-widest text-center px-1">
                                                No Image
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{p.name}</p>
                                        <p className="text-sm text-neutral-500 mt-1">{p.prix} MAD</p>
                                        <button
                                            onClick={() => removeFromCart(i)}
                                            className="text-xs uppercase tracking-widest text-neutral-400 hover:text-black mt-2 transition-colors"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="p-6 border-t border-neutral-200">
                        <div className="flex justify-between mb-5 text-sm">
                            <span className="font-medium uppercase tracking-widest">Total</span>
                            <span className="font-medium">{total} MAD</span>
                        </div>
                        <Link to="/checkout" onClick={onClose}>
                            <button className="w-full bg-black text-white text-xs font-bold uppercase tracking-widest py-4 hover:bg-neutral-800 transition-colors">
                                Checkout
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}