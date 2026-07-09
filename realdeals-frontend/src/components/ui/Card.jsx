export default function Card({ children, className = '' }) {
    return (
        <div className={`bg-neutral-950 border-2 border-neutral-800 hover:border-red-600 transition-colors p-5 ${className}`}>
            {children}
        </div>
    );
}