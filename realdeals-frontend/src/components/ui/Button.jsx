export default function Button({ children, onClick, variant = 'primary', className = '', type = 'button', disabled = false }) {
    const base = 'px-6 py-3 font-bold uppercase tracking-wide text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed';
    const variants = {
        primary: 'bg-red-600 hover:bg-white hover:text-black text-white',
        secondary: 'bg-white text-black hover:bg-red-600 hover:text-white',
        outline: 'border-2 border-white text-white hover:bg-white hover:text-black',
        ghost: 'text-white hover:text-red-500 underline underline-offset-4',
    };
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${base} ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
}