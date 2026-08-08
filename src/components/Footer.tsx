import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/5 py-10 text-center text-zinc-500 text-sm">
      <p className="font-display font-bold text-white mb-2">
        Insider<span className="text-lime-400">Memes.</span>
      </p>
      <p>Made for the hostel, by the hostel. Payments secured by Razorpay.</p>
    </footer>
  );
};
