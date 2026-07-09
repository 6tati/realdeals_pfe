export default function ClientServices() {
    return (
        <div className="max-w-3xl mx-auto px-6 py-16">
            <h2 className="text-3xl font-bold uppercase tracking-tight mb-10 text-center">Client Services</h2>

            <div className="flex flex-col gap-10">
                <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-2">Shipping</h3>
                    <p className="text-neutral-600 text-sm leading-relaxed">
                        Orders are processed within 1-3 business days. Delivery across Morocco typically takes 2-5 business days depending on your location.
                    </p>
                </div>
                <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-2">Returns & Exchanges</h3>
                    <p className="text-neutral-600 text-sm leading-relaxed">
                        Items may be returned or exchanged within 14 days of delivery, provided they are unworn and in original packaging. Contact us to initiate a return.
                    </p>
                </div>
                <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-2">Sizing</h3>
                    <p className="text-neutral-600 text-sm leading-relaxed">
                        Our pieces are designed with an oversized, relaxed fit. If you're between sizes, we recommend sizing down for a more fitted look.
                    </p>
                </div>
                <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-2">Payment</h3>
                    <p className="text-neutral-600 text-sm leading-relaxed">
                        We accept credit card, cash on delivery, and bank transfer.
                    </p>
                </div>
            </div>
        </div>
    );
}