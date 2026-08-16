import React from 'react';

export const FAQ: React.FC = () => {
  return (
    <section id="faq" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
      <p className="overline text-center">Faq</p>
      <h2 className="font-display font-bold text-4xl text-center mb-10 text-white">
        Questions, <span className="text-lime-400">almost</span> answered.
      </h2>
      <div className="space-y-4">
        <details className="group border border-white/10 rounded-xl bg-zinc-900/40 p-5" open>
          <summary className="font-semibold cursor-pointer list-none flex justify-between items-center text-white">
            How do I pay?
            <span className="transition group-open:rotate-45 text-lime-400 font-bold text-xl">
              +
            </span>
          </summary>
          <p className="mt-3 text-zinc-400 text-sm">
            UPI, cards, netbanking and wallets — all processed securely through Razorpay.
          </p>
        </details>
        <details className="group rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <summary className="font-semibold cursor-pointer list-none flex justify-between items-center text-white">
            How fast does delivery reach?{' '}
            <span className="transition group-open:rotate-45 text-zinc-400 text-xl">+</span>
          </summary>
          <p className="mt-3 text-zinc-400 text-sm">
            Ships door-to-door from the drop. Hostel-room folks get priority courier once the
            batch prints.
          </p>
        </details>
        <details className="group rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <summary className="font-semibold cursor-pointer list-none flex justify-between items-center text-white">
            Who the hell sells meme tees on campus?{' '}
            <span className="transition group-open:rotate-45 text-zinc-400 text-xl">+</span>
          </summary>
          <p className="mt-3 text-zinc-400 text-sm">
            Us. The people who had to live through your group chat.
          </p>
        </details>
      </div>
    </section>
  );
};
