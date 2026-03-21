export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white text-stone-900">
            <div className="bg-black text-white py-20 text-center">
                <h1 className="font-serif text-5xl mb-3">Our Story</h1>
                <p className="text-stone-400 text-sm tracking-wide uppercase">Crafting Elegance Since Day One</p>
            </div>

            <div className="container mx-auto px-4 max-w-3xl py-16">
                <div className="prose prose-stone prose-lg mx-auto">
                    <p className="text-lg text-stone-600 leading-relaxed mb-8">
                        <strong className="text-black">Priyanka Fashionvilla</strong> was born from a simple belief — every woman deserves to feel extraordinary.
                        What started as a passion for curating beautiful, high-quality fashion has grown into a destination
                        for women who appreciate timeless elegance with a modern edge.
                    </p>

                    <h2 className="font-serif text-2xl mb-4 mt-10">Our Mission</h2>
                    <p className="text-stone-600 leading-relaxed mb-8">
                        We bridge the gap between luxury and accessibility, bringing you meticulously curated collections
                        that you can wear with confidence — whether it&apos;s a grand gala, an intimate cocktail evening,
                        or your everyday life. Every piece in our collection is chosen with care, reflecting our commitment
                        to quality, fit, and style.
                    </p>

                    <h2 className="font-serif text-2xl mb-4 mt-10">What Sets Us Apart</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 not-prose mb-10">
                        <div className="text-center p-6 bg-stone-50 rounded-sm">
                            <p className="font-serif text-3xl mb-2">✦</p>
                            <h3 className="font-medium text-sm uppercase tracking-wider mb-2">Curated Selection</h3>
                            <p className="text-sm text-stone-500">Every piece hand-picked for quality and style.</p>
                        </div>
                        <div className="text-center p-6 bg-stone-50 rounded-sm">
                            <p className="font-serif text-3xl mb-2">♡</p>
                            <h3 className="font-medium text-sm uppercase tracking-wider mb-2">Customer First</h3>
                            <p className="text-sm text-stone-500">Your satisfaction is our highest priority.</p>
                        </div>
                        <div className="text-center p-6 bg-stone-50 rounded-sm">
                            <p className="font-serif text-3xl mb-2">✿</p>
                            <h3 className="font-medium text-sm uppercase tracking-wider mb-2">Timeless Fashion</h3>
                            <p className="text-sm text-stone-500">Designs that transcend trends and seasons.</p>
                        </div>
                    </div>

                    <h2 className="font-serif text-2xl mb-4 mt-10">Our Promise</h2>
                    <p className="text-stone-600 leading-relaxed">
                        When you shop with Priyanka Fashionvilla, you&apos;re not just buying clothes —
                        you&apos;re investing in confidence. We promise genuine products, hassle-free returns,
                        and a shopping experience that feels as luxurious as the fashion itself.
                    </p>
                </div>
            </div>
        </div>
    );
}
