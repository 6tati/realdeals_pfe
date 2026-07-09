import { useState, useEffect } from 'react';
import Spinner from '../components/ui/Spinner';
import Alert from '../components/ui/Alert';
import { getMyOrders } from '../services/api';

export default function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const user = JSON.parse(localStorage.getItem('user'));

    const statusSteps = ['EN_ATTENTE', 'CONFIRMEE', 'EXPEDIEE', 'LIVREE'];

    const getStepIndex = (status) => {
        if (status === 'ANNULEE') return -1;
        return statusSteps.indexOf(status);
    };

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        getMyOrders(user.idUtilisateur)
            .then(setOrders)
            .catch(() => setError('Failed to load your orders.'))
            .finally(() => setLoading(false));
    }, []);

    const statusStyles = {
        EN_ATTENTE: 'bg-neutral-100 text-neutral-700',
        CONFIRMEE: 'bg-blue-50 text-blue-700',
        EXPEDIEE: 'bg-yellow-50 text-yellow-700',
        LIVREE: 'bg-green-50 text-green-700',
        ANNULEE: 'bg-red-50 text-red-700',
    };

    if (!user) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center px-6">
                <Alert type="info">Please log in to view your orders.</Alert>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-6 py-16">
            <h2 className="text-3xl font-bold uppercase tracking-tight mb-10 text-center">
                My Orders
            </h2>

            {error && <Alert type="error">{error}</Alert>}

            {loading ? (
                <Spinner />
            ) : orders.length === 0 ? (
                <Alert type="info">You haven't placed any orders yet.</Alert>
            ) : (
                <div className="flex flex-col gap-8">
                    {orders.map(order => (
                        <div key={order.idOrder} className="border border-neutral-200 p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-sm font-bold uppercase tracking-widest">
                                        Order #{order.idOrder}
                                    </p>
                                    <p className="text-xs text-neutral-500 mt-1">
                                        {new Date(order.dateCreation).toLocaleDateString()}
                                    </p>
                                </div>

                                <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 ${statusStyles[order.statut] || 'bg-neutral-100 text-neutral-700'}`}>
            {order.statut.replace('_', ' ')}
        </span>
                            </div>

                            {/* Add delivery tracking here */}
                            <div className="mt-6 mb-6">
                                {order.statut === 'ANNULEE' ? (
                                    <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                                        This order has been cancelled.
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-4 gap-2">
                                        {statusSteps.map((step, index) => {
                                            const active = index <= getStepIndex(order.statut);

                                            return (
                                                <div key={step} className="flex flex-col items-center gap-2">
                                                    <div className={`h-3 w-3 rounded-full ${active ? 'bg-black' : 'bg-neutral-300'}`} />
                                                    <span className={`text-[9px] font-black uppercase tracking-widest text-center ${active ? 'text-black' : 'text-neutral-400'}`}>
                                {step.replace('_', ' ')}
                            </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-neutral-100 pt-4 flex flex-col gap-2">
                                {order.lignesCommande?.map(ligne => (
                                    <div key={ligne.idLigneCommande} className="flex justify-between text-sm">
                <span className="text-neutral-700">
                    {ligne.produit?.name}{' '}
                    <span className="text-neutral-400">x{ligne.quantite}</span>
                </span>
                                        <span className="text-neutral-500">{ligne.prixUnitaire} MAD</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between mt-5 pt-4 border-t border-neutral-100">
                                <span className="text-sm font-bold uppercase tracking-widest">Total</span>
                                <span className="text-sm font-bold">{order.total} MAD</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}