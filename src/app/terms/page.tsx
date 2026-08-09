import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms & Conditions | JustMemes',
  description: 'Terms and conditions governing purchases and website usage at JustMemes.',
};

export default function TermsPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 text-zinc-300">
      <Link
        href="/"
        className="text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition mb-6 inline-block"
      >
        ← Back to Home
      </Link>

      <h1 className="font-display text-4xl font-bold text-white mb-6">
        Terms & <span className="text-lime-400">Conditions</span>
      </h1>

      <p className="text-sm text-zinc-500 mb-8">Last updated: August 9, 2026</p>

      <div className="space-y-8 text-sm leading-relaxed border-t border-white/10 pt-8">
        <section>
          <h2 className="text-xl font-bold text-white mb-3">1. Introduction</h2>
          <p>
            Welcome to JustMemes (&quot;InsiderMemes&quot;, &quot;we&quot;, &quot;our&quot;, &quot;us&quot;). By accessing our website, placing an order, or browsing our apparel catalog, you agree to be bound by these Terms and Conditions. Please read them carefully before making any transaction.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">2. Orders & Products</h2>
          <p>
            All products displayed on our site are subject to availability. Prices for products are subject to change without notice. We reserve the right to refuse service, limit quantities, or cancel orders at our sole discretion.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">3. Pricing & Payments</h2>
          <p>
            Prices are listed in Indian Rupees (INR, ₹). Payments are processed securely via authorized Payment Gateways including PhonePe and Razorpay. By initiating a transaction, you authorize us to charge the specified amount for your order.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">4. Intellectual Property</h2>
          <p>
            All content on this website, including designs, graphics, logos, text, and artwork, are the exclusive property of JustMemes and are protected under Indian intellectual property laws. Unauthorized reproduction or resale is prohibited.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">5. Governing Law</h2>
          <p>
            These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising out of these terms shall be subject to the exclusive jurisdiction of the courts of India.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">6. Contact Information</h2>
          <p>
            If you have any questions regarding these Terms, please reach out via our{' '}
            <Link href="/contact" className="text-lime-400 underline">
              Contact Us page
            </Link>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
