import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/api';
import banner1 from '../assets/Banner-1.jpg';
import banner2 from '../assets/Second-Banner.jpg';

export default function Home() {
    const [produits, setProduits] = useState([]);

    useEffect(() => {
        getProducts().then(setProduits).catch(console.error);
    }, []);

    const halalProducts = produits
        .filter(p => p.categorie?.name?.toLowerCase() === 'halal')
        .slice(0, 2);

    return (
        <div className="bg-white text-black">
            {/* Hero banner */}
            <section className="relative h-[calc(100vh-67px)] overflow-hidden bg-black sm:h-auto sm:min-h-[70vh]">
                <Link to="/produits" className="block h-full w-full">
                    {/* Mobile: rotated banner expanded to fit screen width */}
                    <div className="absolute inset-0 flex items-center justify-center sm:hidden">
                        <img
                            src={banner1}
                            alt="RealDeals hero"
                            className="h-[100vw] w-auto max-w-none rotate-90 object-contain"
                        />
                    </div>

                    {/* Desktop: normal horizontal banner */}
                    <img
                        src={banner1}
                        alt="RealDeals hero"
                        className="hidden h-full min-h-[70vh] w-full object-cover object-center sm:block"
                    />

                    {/* Mobile shop button */}
                    <div className="absolute bottom-8 left-6 right-6 z-10 sm:hidden">
                        <span className="flex w-full items-center justify-center bg-black px-8 py-5 text-sm font-black uppercase tracking-[0.2em] text-white">
                            Shop
                        </span>
                    </div>
                </Link>
            </section>

            {/* Halal Collection */}
            <div className="max-w-4xl mx-auto px-6 sm:px-8 py-14 sm:py-20 text-center">
                <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight mb-2">
                    Halal Collection
                </h2>

                <p className="text-neutral-500 font-light mb-8 sm:mb-10">
                    Crafted with intent.
                </p>

                {halalProducts.length === 0 ? (
                    <p className="text-neutral-400 text-sm">Coming soon.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 max-w-2xl mx-auto">
                        {halalProducts.map(p => (
                            <Link
                                to={`/produits/${p.idProd}`}
                                key={p.idProd}
                                className="group text-left block"
                            >
                                <div className="aspect-[3/4] bg-neutral-100 overflow-hidden mb-3 sm:mb-4">
                                    {p.imageUrl ? (
                                        <img
                                            src={p.imageUrl}
                                            alt={p.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-neutral-300 text-[10px] sm:text-xs uppercase tracking-widest text-center px-2">
                                            Coming Soon
                                        </div>
                                    )}
                                </div>

                                <h3 className="font-bold uppercase text-xs sm:text-sm tracking-wide group-hover:text-neutral-500 transition-colors">
                                    {p.name}
                                </h3>

                                <p className="text-neutral-500 mt-1 text-sm">
                                    {p.prix} MAD
                                </p>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Banner 2 */}
            <Link to="/produits" className="block">
                <div
                    className="relative w-full bg-cover bg-center flex flex-col items-start justify-end hover:opacity-95 transition-opacity"
                    style={{
                        backgroundImage: `url(${banner2})`,
                        height: 'clamp(300px, 60vw, 600px)',
                    }}
                >
                    <div className="w-full px-6 sm:px-16 pb-10 sm:pb-16">
                        <h2 className="text-white text-xl sm:text-3xl md:text-5xl font-light uppercase tracking-widest mb-4 sm:mb-6 drop-shadow-lg">
                            Realdeals Summer 2026
                        </h2>

                        <span className="inline-block bg-black text-white text-xs font-bold uppercase tracking-widest px-6 sm:px-10 py-3 sm:py-4 hover:bg-neutral-800 transition-colors">
                            Shop
                        </span>
                    </div>
                </div>
            </Link>
        </div>
    );
}
