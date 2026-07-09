export default function Alert({ type = 'error', children }) {
    const styles = {
        error: 'bg-red-950/50 border-red-600 text-red-400',
        success: 'bg-white/5 border-white text-white',
        info: 'bg-neutral-900 border-neutral-700 text-neutral-400',
    };
    return (
        <div className={`border-2 p-4 mb-4 font-medium ${styles[type]}`}>
            {children}
        </div>
    );
}