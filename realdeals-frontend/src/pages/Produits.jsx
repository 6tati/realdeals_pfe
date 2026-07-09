import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getProducts } from '../services/api';
import Spinner from '../components/ui/Spinner';
import Alert from '../components/ui/Alert';
import { useCart } from '../context/CartContext';

export default function Produits() {
    const [produits, setProduits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [addedMessage, setAddedMessage] = useState('');
    const [sortOpen, setSortOpen] = useState(false);
    const [sortOrder, setSortOrder] = useState('default');
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const { addToCart } = useCart();

    useEffect(() => {
        getProducts()
            .then(setProduits)
            .catch(() => setError('Failed to load products. Please try again.'))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        setSearchTerm(searchParams.get('search') || '');
    }, [searchParams]);

    const handleAdd = (produit) => {
        addToCart(produit);
        setAddedMessage(`${produit.name} added to cart`);
        setTimeout(() => setAddedMessage(''), 2000);
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (value) {
            setSearchParams({ search: value });
        } else {
            setSearchParams({});
        }
    };

    const filtered = produits
        .filter(p => {
            if (!searchTerm) return true;
            const term = searchTerm.toLowerCase();
            return p.name.toLowerCase().includes(term) || p.description?.toLowerCase().includes(term);
        })
        .sort((a, b) => {
            if (sortOrder === 'price-asc') return a.prix - b.prix;
            if (sortOrder === 'price-desc') return b.prix - a.prix;
            return 0;
        });

    return (
        <div className="bg-white text-black min-h-screen">
            {/* Search + Filter bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-6 sm:px-10 py-6">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="SEARCH PRODUCTS"
                    className="w-full sm:w-64 border-b border-black pb-2 text-xs uppercase tracking-widest placeholder-neutral-400 outline-none bg-transparent"
                />

                <div className="relative">
                    <button
                        onClick={() => setSortOpen(!sortOpen)}
                        className="text-xs font-medium uppercase tracking-widest flex items-center gap-1 whitespace-nowrap"
                    >
                        Filter & Sort <span className="text-sm">+</span>
                    </button>
                    {sortOpen && (
                        <div className="absolute right-0 mt-3 w-56 bg-white border border-neutral-200 shadow-lg z-20">
                            <button onClick={() => { setSortOrder('default'); setSortOpen(false); }} className="w-full text-left px-4 py-3 text-xs uppercase tracking-widest hover:bg-neutral-100">
                                Default
                            </button>
                            <button onClick={() => { setSortOrder('price-asc'); setSortOpen(false); }} className="w-full text-left px-4 py-3 text-xs uppercase tracking-widest hover:bg-neutral-100">
                                Price: Low to High
                            </button>
                            <button onClick={() => { setSortOrder('price-desc'); setSortOpen(false); }} className="w-full text-left px-4 py-3 text-xs uppercase tracking-widest hover:bg-neutral-100">
                                Price: High to Low
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="px-6 sm:px-10 pb-24">
                {error && <Alert type="error">{error}</Alert>}
                {addedMessage && <Alert type="success">{addedMessage}</Alert>}

                {loading ? (
                    <Spinner />
                ) : filtered.length === 0 ? (
                    <Alert type="info">
                        {searchTerm ? `No products match "${searchTerm}".` : 'No products available right now.'}
                    </Alert>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-0 gap-y-12">
                        {filtered.map(p => {
                            const soldOut = p.stock === 0;
                            return (
                                <div key={p.idProd} className="group border-r border-neutral-100 last:border-r-0 px-4">
                                    <Link to={`/produits/${p.idProd}`}>
                                        <div className="relative aspect-square bg-neutral-100 overflow-hidden mb-5 flex items-center justify-center">
                                            {p.imageUrl ? (
                                                <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                            ) : (
                                                <span className="text-neutral-300 text-xs uppercase tracking-widest">Image Coming Soon</span>
                                            )}
                                            {soldOut && (
                                                <span className="absolute top-4 left-4 bg-white text-black text-[10px] font-medium uppercase tracking-widest px-2 py-1 border border-neutral-300">
                                                    Sold Out
                                                </span>
                                            )}
                                        </div>
                                    </Link>

                                    {!soldOut && (
                                        <button
                                            onClick={() => handleAdd(p)}
                                            className="relative w-full -mt-5 mb-5 bg-black text-white text-xs font-medium uppercase tracking-widest py-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        >
                                            Quick Add
                                        </button>
                                    )}

                                    <Link to={`/produits/${p.idProd}`} className="block">
                                        <p className="text-[11px] font-medium uppercase tracking-widest text-neutral-500 mb-1">
                                            {p.categorie?.name || 'RealDeals'}
                                        </p>
                                        <h3 className="text-sm font-normal hover:text-neutral-500 transition-colors">{p.name}</h3>
                                    </Link>
                                    <p className="text-sm text-neutral-500 mt-1">{p.prix.toLocaleString()},00 dh</p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}