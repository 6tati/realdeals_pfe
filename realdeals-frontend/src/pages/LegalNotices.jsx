export default function LegalNotices() {
    return (
        <div className="max-w-3xl mx-auto px-6 py-16">
            <h2 className="text-3xl font-bold uppercase tracking-tight mb-10 text-center">Legal Notices</h2>

            <div className="flex flex-col gap-10 text-sm text-neutral-600 leading-relaxed">
                <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-2 text-black">Terms of Use</h3>
                    <p>
                        By accessing and using this website, you agree to comply with these terms. All content, including images, text, and branding, is the property of RealDeals and may not be reproduced without permission.
                    </p>
                </div>
                <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-2 text-black">Privacy Policy</h3>
                    <p>
                        We collect personal information (name, email, phone, address) solely for the purpose of processing orders and providing customer support. Your data is never sold or shared with third parties.
                    </p>
                </div>
                <div>
                    <h3 className="text-sm font-bold uppercase tracking-widest mb-2 text-black">Order Terms</h3>
                    <p>
                        All orders are subject to product availability. Prices are listed in Moroccan Dirham (MAD) and are subject to change without notice.
                    </p>
                </div>
            </div>
        </div>
    );
}