import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | Meme Theory',
  description: 'How Meme Theory collects, protects, and handles your personal information.',
};

export default function PrivacyPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 text-zinc-300">
      <Link
        href="/"
        className="text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition mb-6 inline-block"
      >
        ← Back to Home
      </Link>

      <h1 className="font-display text-4xl font-bold text-white mb-6">
        Privacy <span className="text-lime-400">Policy</span>
      </h1>

      <p className="text-sm text-zinc-500 mb-8">Last updated: August 9, 2026</p>

      <div className="space-y-8 text-sm leading-relaxed border-t border-white/10 pt-8">
        <section>
          <h2 className="text-xl font-bold text-white mb-3">1. Information We Collect</h2>
          <p>
            When you purchase apparel or interact with Meme Theory, we collect personal information necessary for order fulfillment, including your name, email address, phone number, delivery address, hostel name, and room number.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">2. How We Use Your Data</h2>
          <p>
            Your information is used strictly to process orders, communicate shipment updates, provide customer support, and improve our campus delivery service. We do not sell or rent your personal data to third parties.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">3. Payment Security</h2>
          <p>
            All payment transactions are encrypted and processed by authorized payment partners (such as Razorpay). Meme Theory does not store your credit card, UPI PIN, bank details, or CVV on our servers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">4. Cookies & Analytics</h2>
          <p>
            We may use session cookies to remember cart items and optimize your shopping experience. You can manage or disable cookies through your web browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">5. Data Retention & Deletion</h2>
          <p>
            We retain order details only as long as necessary for tax, regulatory, and fulfillment obligations. You may request deletion of your contact data by reaching out to our support team.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-white mb-3">6. Updates & Contact</h2>
          <p>
            We reserve the right to update this policy periodically. For privacy queries, please contact us via our{' '}
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
