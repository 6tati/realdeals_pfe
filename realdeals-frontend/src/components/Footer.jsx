import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email) {
            setSubmitted(true);
            setEmail('');
            setTimeout(() => setSubmitted(false), 3000);
        }
    };

    return (
        <footer className="border-t border-neutral-200 px-8 sm:px-16 py-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
                {/* Newsletter */}
                <div className="w-full sm:w-80">
                    <p className="text-sm font-medium mb-2">Join the Conversation</p>
                    {submitted ? (
                        <p className="text-sm text-neutral-500">Thanks for subscribing!</p>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex items-center border-b border-black pb-1">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="EMAIL ADDRESS"
                                className="flex-1 text-xs uppercase tracking-widest placeholder-neutral-400 outline-none bg-transparent"
                            />
                            <button type="submit" className="text-lg hover:text-neutral-500 transition-colors">
                                →
                            </button>
                        </form>
                    )}
                </div>

                {/* Links */}
                <div className="flex flex-wrap gap-x-8 gap-y-3 text-xs font-medium uppercase tracking-widest">
                    <Link to="/contact" className="hover:text-neutral-500 transition-colors">Contact</Link>
                    <Link to="/client-services" className="hover:text-neutral-500 transition-colors">Client Services</Link>
                    <Link to="/legal-notices" className="hover:text-neutral-500 transition-colors">Legal Notices</Link>
                    <a href="https://www.instagram.com/real_deals_official/" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-500 transition-colors">Social</a>
                </div>
            </div>
        </footer>
    );
}