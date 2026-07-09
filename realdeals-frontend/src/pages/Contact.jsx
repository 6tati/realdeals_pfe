import { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendContactMessage } from '../services/api';

export default function Contact() {
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        subject: 'Order support',
        message: ''
    });

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setSuccess(false);
        setError(null);

        try {
            await sendContactMessage(form);

            setForm({
                fullName: '',
                email: '',
                subject: 'Order support',
                message: ''
            });

            setSuccess(true);
        } catch (err) {
            console.error(err);
            setError('Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-white text-black">
            <section className="border-b border-neutral-200">
                <div className="mx-auto max-w-7xl px-6 py-24 sm:px-10 sm:py-32">
                    <p className="mb-6 text-[10px] font-black uppercase tracking-[0.35em] text-neutral-500">
                        Customer Support
                    </p>

                    <h1 className="max-w-4xl text-5xl font-black uppercase leading-none tracking-[-0.06em] sm:text-7xl lg:text-8xl">
                        Contact RealDeals
                    </h1>

                    <p className="mt-8 max-w-2xl text-sm leading-7 text-neutral-600 sm:text-base">
                        For orders, delivery updates, product questions, or general support,
                        contact the RealDeals team. We will answer as soon as possible.
                    </p>
                </div>
            </section>

            <section className="mx-auto grid max-w-7xl grid-cols-1 border-b border-neutral-200 lg:grid-cols-2">
                <div className="border-b border-neutral-200 px-6 py-16 sm:px-10 lg:border-b-0 lg:border-r">
                    <h2 className="text-xs font-black uppercase tracking-[0.3em]">
                        Information
                    </h2>

                    <div className="mt-10 space-y-10">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-neutral-500">
                                Email
                            </p>
                            <a
                                href="mailto:contact@realdeals.ma"
                                className="mt-3 block text-lg font-bold tracking-tight hover:text-neutral-500"
                            >
                                contact@realdeals.ma
                            </a>
                        </div>

                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-neutral-500">
                                Phone
                            </p>
                            <a
                                href="tel:+212600000000"
                                className="mt-3 block text-lg font-bold tracking-tight hover:text-neutral-500"
                            >
                                +212 600 000 000
                            </a>
                        </div>

                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-neutral-500">
                                Location
                            </p>
                            <p className="mt-3 text-lg font-bold tracking-tight">
                                Casablanca, Morocco
                            </p>
                        </div>

                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-neutral-500">
                                Support Hours
                            </p>
                            <p className="mt-3 text-lg font-bold tracking-tight">
                                Monday — Saturday / 10:00 — 18:00
                            </p>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-16 sm:px-10">
                    <h2 className="text-xs font-black uppercase tracking-[0.3em]">
                        Send a message
                    </h2>

                    <form onSubmit={handleSubmit} className="mt-10 space-y-6">
                        <div>
                            <label className="mb-3 block text-[10px] font-black uppercase tracking-[0.25em] text-neutral-500">
                                Full Name
                            </label>
                            <input
                                name="fullName"
                                type="text"
                                value={form.fullName}
                                onChange={handleChange}
                                required
                                placeholder="Your name"
                                className="w-full border border-neutral-300 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
                            />
                        </div>

                        <div>
                            <label className="mb-3 block text-[10px] font-black uppercase tracking-[0.25em] text-neutral-500">
                                Email
                            </label>
                            <input
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                placeholder="your@email.com"
                                className="w-full border border-neutral-300 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
                            />
                        </div>

                        <div>
                            <label className="mb-3 block text-[10px] font-black uppercase tracking-[0.25em] text-neutral-500">
                                Subject
                            </label>
                            <select
                                name="subject"
                                value={form.subject}
                                onChange={handleChange}
                                className="w-full border border-neutral-300 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
                            >
                                <option>Order support</option>
                                <option>Delivery tracking</option>
                                <option>Product question</option>
                                <option>Return or exchange</option>
                                <option>Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-3 block text-[10px] font-black uppercase tracking-[0.25em] text-neutral-500">
                                Message
                            </label>
                            <textarea
                                name="message"
                                value={form.message}
                                onChange={handleChange}
                                required
                                rows="6"
                                placeholder="Write your message..."
                                className="w-full resize-none border border-neutral-300 bg-white px-4 py-4 text-sm outline-none transition focus:border-black"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black px-6 py-5 text-xs font-black uppercase tracking-[0.25em] text-white transition hover:bg-neutral-800 disabled:bg-neutral-400"
                        >
                            {loading ? 'Sending...' : 'Submit Message'}
                        </button>

                        {success && (
                            <p className="text-sm font-bold text-green-700">
                                Message sent successfully.
                            </p>
                        )}

                        {error && (
                            <p className="text-sm font-bold text-red-700">
                                {error}
                            </p>
                        )}
                    </form>
                </div>
            </section>

            <section className="mx-auto grid max-w-7xl grid-cols-1 sm:grid-cols-3">
                <Link
                    to="/produits"
                    className="group border-b border-neutral-200 px-6 py-10 transition hover:bg-neutral-50 sm:border-r sm:px-10"
                >
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500">
                        Shop
                    </p>
                    <h3 className="mt-4 text-2xl font-black uppercase tracking-[-0.04em]">
                        Browse Products
                    </h3>
                    <p className="mt-4 text-sm leading-6 text-neutral-600">
                        Discover RealDeals streetwear pieces and collections.
                    </p>
                </Link>

                <Link
                    to="/my-orders"
                    className="group border-b border-neutral-200 px-6 py-10 transition hover:bg-neutral-50 sm:border-r sm:px-10"
                >
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500">
                        Orders
                    </p>
                    <h3 className="mt-4 text-2xl font-black uppercase tracking-[-0.04em]">
                        Track Orders
                    </h3>
                    <p className="mt-4 text-sm leading-6 text-neutral-600">
                        View delivery status and order notifications.
                    </p>
                </Link>

                <Link
                    to="/client-services"
                    className="group border-b border-neutral-200 px-6 py-10 transition hover:bg-neutral-50 sm:px-10"
                >
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500">
                        Help
                    </p>
                    <h3 className="mt-4 text-2xl font-black uppercase tracking-[-0.04em]">
                        Client Services
                    </h3>
                    <p className="mt-4 text-sm leading-6 text-neutral-600">
                        Read delivery, return, and customer support information.
                    </p>
                </Link>
            </section>
        </main>
    );
}