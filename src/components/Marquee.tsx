import React from 'react';

export const Marquee: React.FC = () => {
  return (
    <div
      className="marquee-wrap border-y border-white/10 bg-zinc-900/40 py-3 overflow-hidden"
      aria-hidden="true"
    >
      <div className="marquee font-display font-semibold uppercase whitespace-nowrap">
        <span>
          Wear the meme, become the meme&nbsp;✦&nbsp;Free campus delivery&nbsp;✦&nbsp;Drop 001 is
          live&nbsp;✦&nbsp;No restocks&nbsp;✦&nbsp;Campus-only drop&nbsp;✦&nbsp;&nbsp;
        </span>
        <span>
          Wear the meme, become the meme&nbsp;✦&nbsp;Free campus delivery&nbsp;✦&nbsp;Drop 001 is
          live&nbsp;✦&nbsp;No restocks&nbsp;✦&nbsp;Campus-only drop&nbsp;✦&nbsp;&nbsp;
        </span>
      </div>
    </div>
  );
};
