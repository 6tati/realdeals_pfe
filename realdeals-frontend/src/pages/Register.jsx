import { useState } from 'react';
import { Link } from 'react-router-dom';
import { registerUser } from '../services/api';
import Alert from '../components/ui/Alert';

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await registerUser(form);
            if (res.idUtilisateur) {
                setSuccess(true);
                setTimeout(() => { window.location.href = '/login'; }, 1500);
            } else {
                setError('Registration failed. Please try again.');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-6 py-16">
            <div className="w-full max-w-sm">
                <h2 className="text-3xl font-bold uppercase tracking-tight mb-2 text-center">Register</h2>
                <p className="text-neutral-500 text-sm mb-10 text-center">Create your account.</p>

                {error && <Alert type="error">{error}</Alert>}
                {success && <Alert type="success">Registered! Redirecting to login...</Alert>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <input
                        type="text"
                        name="name"
                        placeholder="FULL NAME"
                        required
                        onChange={handleChange}
                        className="w-full border-b border-black pb-2 text-sm uppercase tracking-widest placeholder-neutral-400 outline-none bg-transparent focus:border-neutral-500 transition-colors"
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="EMAIL ADDRESS"
                        required
                        onChange={handleChange}
                        className="w-full border-b border-black pb-2 text-sm uppercase tracking-widest placeholder-neutral-400 outline-none bg-transparent focus:border-neutral-500 transition-colors"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="PASSWORD"
                        required
                        onChange={handleChange}
                        className="w-full border-b border-black pb-2 text-sm uppercase tracking-widest placeholder-neutral-400 outline-none bg-transparent focus:border-neutral-500 transition-colors"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white text-xs font-bold uppercase tracking-widest py-4 mt-4 hover:bg-neutral-800 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Creating account...' : 'Register'}
                    </button>
                </form>

                <p className="text-center text-sm text-neutral-500 mt-8">
                    Already have an account?{' '}
                    <Link to="/login" className="text-black underline underline-offset-4 hover:text-neutral-600">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}