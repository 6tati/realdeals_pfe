import { Link } from 'react-router-dom';

export default function About() {
    return (
        <div className="bg-white text-black">
            {/* Hero */}
            <section className="relative min-h-[70vh] flex items-end bg-black overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1a1a1a_0%,_#000_65%)]" />

                <div className="relative z-10 px-6 sm:px-12 lg:px-20 pb-12 sm:pb-20 max-w-5xl">
                    <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.35em] text-white/70 mb-4">
                        RealDeals
                    </p>

                    <h1 className="text-white text-4xl sm:text-6xl lg:text-8xl font-light uppercase tracking-tight leading-none">
                        Give to Get
                    </h1>
                </div>
            </section>
            {/* Intro */}
            <section className="px-6 sm:px-12 lg:px-20 py-20 sm:py-28">
                <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-neutral-400 mb-4">
                            About the brand
                        </p>

                        <h2 className="text-3xl sm:text-5xl font-light leading-tight uppercase">
                            RealDeals is a Casablanca streetwear brand built around intention, identity, and exchange.
                        </h2>
                    </div>

                    <div className="text-neutral-700 text-sm sm:text-base leading-8 space-y-6">
                        <p>
                            RealDeals was created from the idea that style is not only about what you wear,
                            but what you stand for. Every piece is designed to carry a simple message:
                            give value, earn value, and move with purpose.
                        </p>

                        <p>
                            The brand blends everyday streetwear with clean silhouettes, bold graphics,
                            and minimal details. Inspired by youth culture, local identity, and the energy
                            of Casablanca, RealDeals creates pieces made for daily wear and personal expression.
                        </p>
                    </div>
                </div>
            </section>

            {/* Philosophy */}
            <section className="border-y border-neutral-200">
                <div className="grid grid-cols-1 md:grid-cols-3">
                    <InfoBlock
                        number="01"
                        title="Intent"
                        text="Each product starts with a clear idea: simple design, strong identity, and wearable comfort."
                    />

                    <InfoBlock
                        number="02"
                        title="Culture"
                        text="RealDeals is connected to streetwear, music, art, and the visual language of youth culture."
                    />

                    <InfoBlock
                        number="03"
                        title="Exchange"
                        text="Give to Get is the mindset: what you put into the world shapes what comes back."
                    />
                </div>
            </section>

            {/* Statement */}
            <section className="px-6 sm:px-12 lg:px-20 py-24 sm:py-36 bg-neutral-950 text-white">
                <div className="max-w-6xl mx-auto">
                    <p className="text-xs font-bold uppercase tracking-[0.35em] text-white/40 mb-8">
                        Brand statement
                    </p>

                    <h2 className="text-4xl sm:text-6xl lg:text-7xl font-light uppercase tracking-tight leading-[1.05] max-w-5xl">
                        We design pieces for people who move with purpose, stay grounded, and create their own value.
                    </h2>
                </div>
            </section>

            {/* Values */}
            <section className="px-6 sm:px-12 lg:px-20 py-20 sm:py-28">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-12">
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-neutral-400 mb-4">
                            Values
                        </p>

                        <h2 className="text-3xl sm:text-5xl font-light uppercase">
                            Built for everyday expression.
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <ValueCard title="Minimal but bold">
                            Clean silhouettes with details that stand out without doing too much.
                        </ValueCard>

                        <ValueCard title="Streetwear first">
                            Clothing made for movement, layering, and everyday city life.
                        </ValueCard>

                        <ValueCard title="Local energy">
                            Inspired by Casablanca, North African identity, and independent creative culture.
                        </ValueCard>

                        <ValueCard title="Future focused">
                            RealDeals is still growing, testing, and building a stronger visual universe.
                        </ValueCard>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="px-6 sm:px-12 lg:px-20 py-20 border-t border-neutral-200 text-center">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-neutral-400 mb-4">
                    Discover the collection
                </p>

                <h2 className="text-3xl sm:text-5xl font-light uppercase mb-8">
                    RealDeals Summer 2026
                </h2>

                <Link
                    to="/produits"
                    className="inline-block bg-black text-white text-xs font-bold uppercase tracking-[0.25em] px-10 py-4 hover:bg-neutral-800 transition-colors"
                >
                    Shop now
                </Link>
            </section>
        </div>
    );
}

function InfoBlock({ number, title, text }) {
    return (
        <div className="p-8 sm:p-12 border-b md:border-b-0 md:border-r border-neutral-200 last:border-r-0">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-neutral-400 mb-8">
                {number}
            </p>

            <h3 className="text-2xl font-light uppercase mb-4">
                {title}
            </h3>

            <p className="text-sm leading-7 text-neutral-600">
                {text}
            </p>
        </div>
    );
}

function ValueCard({ title, children }) {
    return (
        <div className="border border-neutral-200 p-8 sm:p-10">
            <h3 className="text-lg font-bold uppercase tracking-[0.15em] mb-4">
                {title}
            </h3>

            <p className="text-sm leading-7 text-neutral-600">
                {children}
            </p>
        </div>
    );
}