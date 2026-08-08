import React from 'react';

export const Marquee: React.FC = () => {
  return (
    <div
      className="marquee-wrap border-y border-white/10 bg-zinc-900/40 py-3 overflow-hidden"
      aria-hidden="true"
    >
      <div className="marquee font-display font-semibold uppercase whitespace-nowrap">
        <span>
          No refunds on attitude&nbsp;✦&nbsp;Sold out on campus&nbsp;✦&nbsp;Drop 001 is
          live&nbsp;✦&nbsp;No advance deposit&nbsp;✦&nbsp;You laugh, we print&nbsp;✦&nbsp;Guaranteed
          funny or your rent back&nbsp;✦&nbsp;&nbsp;
        </span>
        <span>
          No refunds on attitude&nbsp;✦&nbsp;Sold out on campus&nbsp;✦&nbsp;Drop 001 is
          live&nbsp;✦&nbsp;No advance deposit&nbsp;✦&nbsp;You laugh, we print&nbsp;✦&nbsp;Guaranteed
          funny or your rent back&nbsp;✦&nbsp;&nbsp;
        </span>
      </div>
    </div>
  );
};
