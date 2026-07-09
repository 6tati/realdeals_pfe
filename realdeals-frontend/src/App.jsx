import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';

import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Produits from './pages/Produits';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import Contact from './pages/Contact';
import ClientServices from './pages/ClientServices';
import LegalNotices from './pages/LegalNotices';
import Admin from './pages/Admin.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import About from './pages/About';

import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import SearchOverlay from './components/SearchOverlay';
import NotificationBell from './components/NotificationBell';

import { CartProvider, useCart } from './context/CartContext';

function ProfileMenu({ user, onLogout, open, setOpenMenu }) {
    return (
        <div className="relative">
            <button
                onClick={() => setOpenMenu(open ? null : 'profile')}
                className="text-xs font-bold uppercase tracking-widest hover:text-neutral-500 transition-colors"
            >
                {user?.name || 'Account'}
            </button>

            {open && (
                <div className="absolute right-0 mt-4 w-48 bg-white border border-neutral-200 shadow-lg z-50">
                    <Link to="/my-orders" onClick={() => setOpenMenu(null)} className="block px-4 py-3 text-xs font-bold uppercase tracking-widest hover:bg-neutral-50">
                        My Orders
                    </Link>

                    {user?.role === 'ADMIN' && (
                        <Link to="/admin" onClick={() => setOpenMenu(null)} className="block px-4 py-3 text-xs font-bold uppercase tracking-widest hover:bg-neutral-50">
                            Admin
                        </Link>
                    )}

                    <button
                        onClick={() => {
                            setOpenMenu(null);
                            onLogout();
                        }}
                        className="w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-widest hover:bg-neutral-50"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}

function CartIcon({ onClick }) {
    const { cart } = useCart();

    const cartCount = cart.reduce((total, item) => {
        return total + (item.quantity || item.quantite || 1);
    }, 0);

    return (
        <button
            onClick={onClick}
            className="relative text-xs font-bold uppercase tracking-widest hover:text-neutral-500 transition-colors"
            aria-label="Bag"
        >
            <span className="hidden sm:inline">Bag ({cartCount})</span>

            <span className="sm:hidden relative inline-flex h-6 w-5 items-center justify-center border border-black">
                <span className="absolute -top-2 h-3 w-3 rounded-t-full border border-black border-b-0 bg-white" />
                {cartCount > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[9px] text-white">
                        {cartCount}
                    </span>
                )}
            </span>
        </button>
    );
}

function SearchIcon({ onClick }) {
    return (
        <button onClick={onClick} className="relative h-7 w-7" aria-label="Search">
            <span className="absolute left-1 top-1 h-4 w-4 rounded-full border-2 border-black" />
            <span className="absolute left-[17px] top-[17px] h-2 w-0.5 rotate-[-45deg] bg-black" />
        </button>
    );
}

function MenuIcon({ open, onClick }) {
    return (
        <button className="sm:hidden flex h-7 w-7 items-center justify-center" onClick={onClick} aria-label="Menu">
            {open ? (
                <span className="text-2xl leading-none">×</span>
            ) : (
                <span className="flex flex-col gap-1.5">
                    <span className="block h-0.5 w-5 bg-black" />
                    <span className="block h-0.5 w-5 bg-black" />
                </span>
            )}
        </button>
    );
}

function Nav({ onCartClick, onSearchClick }) {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [openMenu, setOpenMenu] = useState(null);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setOpenMenu(null);
        navigate('/login');
    };

    return (
        <nav className="bg-white border-b border-neutral-200 px-5 sm:px-8 py-5 sm:py-6 relative z-50">
            <div className="flex items-center justify-between">
                <MenuIcon open={mobileMenuOpen} onClick={() => setMobileMenuOpen(!mobileMenuOpen)} />

                <div className="hidden sm:flex items-center gap-8">
                    <Link to="/produits" className="text-xs font-bold uppercase tracking-widest hover:text-neutral-500 transition-colors">Shop</Link>
                    <Link to="/about" className="text-xs font-bold uppercase tracking-widest hover:text-neutral-500 transition-colors">About</Link>
                </div>

                <Link to="/" className="absolute left-1/2 -translate-x-1/2 text-xl sm:text-xl font-black uppercase tracking-[-0.08em]">
                    RealDeals
                </Link>

                <div className="flex items-center gap-5 sm:hidden">
                    <SearchIcon onClick={onSearchClick} />
                    <CartIcon onClick={onCartClick} />
                </div>

                <div className="hidden sm:flex items-center gap-8">
                    <button onClick={onSearchClick} className="text-xs font-bold uppercase tracking-widest hover:text-neutral-500 transition-colors">Search</button>

                    {user && <NotificationBell open={openMenu === 'notifications'} setOpenMenu={setOpenMenu} />}

                    {user ? (
                        <ProfileMenu user={user} onLogout={handleLogout} open={openMenu === 'profile'} setOpenMenu={setOpenMenu} />
                    ) : (
                        <Link to="/login" className="text-xs font-bold uppercase tracking-widest hover:text-neutral-500 transition-colors">Login</Link>
                    )}

                    <CartIcon onClick={onCartClick} />
                </div>
            </div>

            {mobileMenuOpen && (
                <div className="sm:hidden absolute left-0 top-full z-50 w-full border-t border-neutral-200 bg-white px-6 py-7 shadow-lg">
                    <div className="flex flex-col gap-5">
                        <Link to="/produits" onClick={() => setMobileMenuOpen(false)} className="text-xs font-black uppercase tracking-[0.25em]">Shop</Link>
                        <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="text-xs font-black uppercase tracking-[0.25em]">About</Link>
                        <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="text-xs font-black uppercase tracking-[0.25em]">Contact</Link>

                        {user ? (
                            <>
                                <Link to="/my-orders" onClick={() => setMobileMenuOpen(false)} className="text-xs font-black uppercase tracking-[0.25em]">My Orders</Link>

                                {user.role === 'ADMIN' && (
                                    <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="text-xs font-black uppercase tracking-[0.25em]">Admin Dashboard</Link>
                                )}

                                <button
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        handleLogout();
                                    }}
                                    className="text-left text-xs font-black uppercase tracking-[0.25em] text-red-600"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-xs font-black uppercase tracking-[0.25em]">Login</Link>
                                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="text-xs font-black uppercase tracking-[0.25em]">Register</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

function AppLayout() {
    const [cartOpen, setCartOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    return (
        <div className="min-h-screen bg-white text-black flex flex-col">
            <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
            <Nav onCartClick={() => setCartOpen(true)} onSearchClick={() => setSearchOpen(true)} />
            <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

            <div className="flex-1">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/produits" element={<Produits />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/my-orders" element={<MyOrders />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/client-services" element={<ClientServices />} />
                    <Route path="/legal-notices" element={<LegalNotices />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/produits/:id" element={<ProductDetail />} />
                    <Route path="/about" element={<About />} />
                </Routes>
            </div>

            <Footer />
        </div>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <CartProvider>
                <AppLayout />
            </CartProvider>
        </BrowserRouter>
    );
}
