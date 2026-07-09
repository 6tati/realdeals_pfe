import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchOverlay({ open, onClose }) {
    const [query, setQuery] = useState('');
    const inputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (open && inputRef.current) {
            inputRef.current.focus();
        }
    }, [open]);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/produits?search=${encodeURIComponent(query.trim())}`);
            onClose();
            setQuery('');
        }
    };

    return (
        <div
            className={`fixed top-0 left-0 right-0 bg-white border-b border-neutral-200 z-50 transition-all duration-300 overflow-hidden ${
                open ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
            }`}
        >
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-6 py-8 flex items-center gap-4">
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="SEARCH PRODUCTS"
                    className="flex-1 border-b border-black pb-2 text-sm uppercase tracking-widest placeholder-neutral-400 outline-none bg-transparent"
                />
                <button type="submit" className="text-lg hover:text-neutral-500 transition-colors">
                    →
                </button>
                <button type="button" onClick={onClose} className="text-xl leading-none hover:text-neutral-500 transition-colors">
                    ×
                </button>
            </form>
        </div>
    );
}