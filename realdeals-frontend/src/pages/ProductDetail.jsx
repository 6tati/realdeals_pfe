import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Spinner from '../components/ui/Spinner';
import Alert from '../components/ui/Alert';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [added, setAdded] = useState(false);
    const [selectedSize, setSelectedSize] = useState('');
    const [openSection, setOpenSection] = useState(null);

    const { addToCart } = useCart();

    useEffect(() => {
        setLoading(true);
        setProduct(null);
        setRelated([]);
        setError(null);
        setSelectedSize('');

        fetch(`http://localhost:8080/api/produits/${id}`)
            .then(res => {
                if (!res.ok) throw new Error();
                return res.json();
            })
            .then(data => {
                setProduct(data);
                document.title = `${data.name} — RealDeals`;

                if (data.categorie?.idCateg) {
                    fetch(`http://localhost:8080/api/produits/categorie/${data.categorie.idCateg}`)
                        .then(res => res.json())
                        .then(list => {
                            setRelated(list.filter(p => p.idProd !== data.idProd).slice(0, 4));
                        })
                        .catch(() => {});
                }
            })
            .catch(() => setError('Product not found.'))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="py-24">
                <Spinner />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="max-w-2xl mx-auto px-6 py-24 text-center">
                <Alert type="error">{error || 'Product not found.'}</Alert>
                <Link to="/produits" className="text-sm underline underline-offset-4 mt-4 inline-block">
                    Back to shop
                </Link>
            </div>
        );
    }

    const soldOut = product.stock === 0;
    const price = Number(product.prix || 0).toLocaleString();

    const sizes = product.tailles
        ? product.tailles.split(',').map(size => size.trim()).filter(Boolean)
        : ['S', 'M', 'L', 'XL'];

    const productImages = [
        product.imageUrl,
        ...(product.imageUrls
            ? product.imageUrls.split(',').map(url => url.trim())
            : [])
    ]
        .filter(Boolean)
        .filter((url, index, arr) => arr.indexOf(url) === index)
        .slice(0, 4);

    const mustSelectSize = sizes.length > 0 && !selectedSize;

    const handleAdd = () => {
        if (soldOut || mustSelectSize) return;

        addToCart({
            ...product,
            selectedSize: selectedSize || null,
        });

        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    const getProductCardImage = (p) => {
        if (p.imageUrl) return p.imageUrl;
        if (p.imageUrls) return p.imageUrls.split(',').map(url => url.trim()).filter(Boolean)[0];
        return null;
    };

    return (
        <div className="bg-white text-black">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 lg:gap-12 px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                {/* LEFT IMAGES */}
                <div className="bg-white">
                    <div className="grid grid-cols-1 gap-3 lg:p-0">
                        {productImages.length > 0 ? (
                            productImages.map((image, index) => (
                                <div
                                    key={`${image}-${index}`}
                                    className="bg-neutral-100 aspect-[4/5] max-h-[720px] flex items-center justify-center overflow-hidden"
                                >
                                    <img
                                        src={image}
                                        alt={`${product.name} ${index + 1}`}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="bg-neutral-100 aspect-[4/5] max-h-[720px] flex items-center justify-center overflow-hidden">
                                <span className="text-neutral-300 text-xs uppercase tracking-[0.25em]">
                                    Image Coming Soon
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT PRODUCT INFO */}
                <aside className="lg:sticky lg:top-24 self-start min-w-0 overflow-hidden">
                    <Link
                        to="/produits"
                        className="inline-block text-[11px] uppercase tracking-[0.2em] text-neutral-400 hover:text-black mb-8"
                    >
                        ← Back to shop
                    </Link>

                    <p className="text-xs font-bold uppercase tracking-[0.16em] mb-2">
                        {product.categorie?.name || 'RealDeals'}
                    </p>

                    <h1 className="text-3xl sm:text-4xl font-light leading-tight mb-3 break-words max-w-full">
                        {product.name}
                    </h1>

                    <p className="text-sm tracking-[0.12em] text-neutral-500 mb-8">
                        {price}.00 dh
                    </p>

                    <div className="mb-3">
                        <select
                            value={selectedSize}
                            onChange={(e) => setSelectedSize(e.target.value)}
                            className="w-full border border-neutral-200 px-4 py-4 text-xs outline-none bg-white"
                        >
                            <option value="">Select Size</option>
                            {sizes.map(size => (
                                <option key={size} value={size}>{size}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end text-xs uppercase tracking-[0.16em] text-neutral-600 mb-8">
                        <button className="hover:text-black">Size Chart</button>
                    </div>

                    {!soldOut && (
                        <p className="text-[11px] text-neutral-400 uppercase tracking-[0.18em] mb-3">
                            {product.stock} in stock
                        </p>
                    )}

                    <button
                        onClick={handleAdd}
                        disabled={soldOut || mustSelectSize}
                        className={`w-full py-5 text-xs font-bold uppercase tracking-[0.16em] transition-colors mb-8 ${
                            soldOut || mustSelectSize
                                ? 'bg-neutral-300 text-white cursor-not-allowed'
                                : 'bg-neutral-800 text-white hover:bg-black'
                        }`}
                    >
                        {soldOut ? 'Sold Out' : added ? 'Added ✓' : mustSelectSize ? 'Select Size' : 'Add to Cart'}
                    </button>

                    <div className="text-sm leading-7 tracking-wide text-neutral-800 mb-8">
                        {product.description ? (
                            <p>{product.description}</p>
                        ) : (
                            <p>
                                RealDeals product crafted for everyday streetwear. Clean fit,
                                minimal branding, and made to be worn with intent.
                            </p>
                        )}
                    </div>

                    {product.descriptionSeo && (
                        <p className="text-xs text-neutral-500 leading-6 mb-8">
                            {product.descriptionSeo}
                        </p>
                    )}

                    <p className="text-xs uppercase tracking-[0.2em] mb-8">
                        All sales of this item are final.
                    </p>

                    <Accordion
                        title="Details"
                        open={openSection === 'details'}
                        onClick={() => setOpenSection(openSection === 'details' ? null : 'details')}
                    >
                        <p>Category: {product.categorie?.name || 'RealDeals'}</p>
                        <p>Sizes: {sizes.join(', ')}</p>
                        <p>Stock: {product.stock}</p>
                        <p>Images: {productImages.length}</p>
                        <p>Reference: RD-{product.idProd}</p>
                    </Accordion>

                    <Accordion
                        title="Shipping Policy"
                        open={openSection === 'shipping'}
                        onClick={() => setOpenSection(openSection === 'shipping' ? null : 'shipping')}
                    >
                        <p>Delivery available in Morocco. Orders are confirmed by phone before shipping.</p>
                    </Accordion>

                    <Accordion
                        title="Share"
                        open={openSection === 'share'}
                        onClick={() => setOpenSection(openSection === 'share' ? null : 'share')}
                    >
                        <p>Copy the page link and share this product with your friends.</p>
                    </Accordion>
                </aside>
            </div>

            {/* RELATED PRODUCTS */}
            {related.length > 0 && (
                <div className="px-6 sm:px-10 lg:px-16 py-16 border-t border-neutral-100">
                    <h2 className="text-sm font-bold uppercase tracking-[0.2em] mb-8">
                        You May Also Like
                    </h2>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                        {related.map(p => {
                            const relatedImage = getProductCardImage(p);

                            return (
                                <Link key={p.idProd} to={`/produits/${p.idProd}`} className="group">
                                    <div className="aspect-[3/4] bg-neutral-100 overflow-hidden mb-3 flex items-center justify-center">
                                        {relatedImage ? (
                                            <img
                                                src={relatedImage}
                                                alt={p.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <span className="text-neutral-300 text-[10px] uppercase tracking-widest text-center px-2">
                                                Image Coming Soon
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-xs font-bold uppercase tracking-wide group-hover:text-neutral-500 transition-colors">
                                        {p.name}
                                    </h3>

                                    <p className="text-xs text-neutral-500 mt-1">
                                        {Number(p.prix || 0).toLocaleString()}.00 dh
                                    </p>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

function Accordion({ title, open, onClick, children }) {
    return (
        <div className="border-t border-neutral-200">
            <button
                onClick={onClick}
                className="w-full flex justify-between items-center py-5 text-left text-xs uppercase tracking-[0.2em]"
            >
                <span>{title}</span>
                <span>{open ? '−' : '+'}</span>
            </button>

            {open && (
                <div className="pb-5 text-sm leading-6 text-neutral-600">
                    {children}
                </div>
            )}
        </div>
    );
}
