import { useId, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
export function InvitationScene({ onNext }: { onNext: () => void }) {
  const [opening, setOpening] = useState(false);
  const started = useRef(false);
  const reduced = useReducedMotion();
  const id = useId();
  const envelopePath = "M146 849 L744 791 L841 1158 L237 1281 Z";
  function openInvitation() {
    if (started.current) return;
    started.current = true;
    setOpening(true);
  }
  return (
    <div
      className={`invitation invitation-highres ${opening ? "opening" : ""}`}
    >
      <svg
        className="invitation-art"
        viewBox="0 0 941 1672"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <clipPath id={`${id}-envelope`}>
            <path d={envelopePath} />
          </clipPath>
          <mask id={`${id}-sky`}>
            <rect width="941" height="1672" fill="white" />
            <path d={envelopePath} fill="black" />
          </mask>
          <radialGradient id={`${id}-light`}>
            <stop stopColor="#edc0dd" />
            <stop offset="1" stopColor="#45385d" />
          </radialGradient>
        </defs>
        <ellipse
          cx="490"
          cy="1040"
          rx="380"
          ry="270"
          fill={`url(#${id}-light)`}
        />
        <image
          href="/art/invitation-high-resolution.png"
          width="941"
          height="1672"
          mask={`url(#${id}-sky)`}
          aria-hidden="true"
        />
        <motion.g
          role="button"
          tabIndex={opening ? -1 : 0}
          aria-label="Open your magical birthday invitation"
          aria-disabled={opening}
          className="envelope-art-button"
          data-sound="envelope"
          onClick={openInvitation}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              e.currentTarget.dispatchEvent(
                new MouseEvent("click", { bubbles: true }),
              );
            }
          }}
          animate={
            opening
              ? { y: reduced ? 0 : -55, scale: reduced ? 1 : 1.08, opacity: 0 }
              : reduced
                ? { y: 0 }
                : { y: [0, -8, 0] }
          }
          transition={
            opening
              ? { duration: reduced ? 0.3 : 1.5 }
              : { duration: 5, repeat: Infinity, ease: "easeInOut" }
          }
          onAnimationComplete={() => {
            if (opening) onNext();
          }}
          style={{ transformOrigin: "490px 1035px" }}
        >
          <image
            href="/art/invitation-high-resolution.png"
            width="941"
            height="1672"
            clipPath={`url(#${id}-envelope)`}
          />
        </motion.g>
      </svg>
      <h1>
        A little magic
        <br />
        has been waiting
        <br />
        <em>for you…</em>
      </h1>
      {opening && (
        <div className="burst" aria-hidden="true">
          {Array.from({ length: 20 }, (_, i) => (
            <motion.i
              key={i}
              initial={{ x: 0, y: 0, opacity: 1 }}
              animate={{
                x: Math.cos(i) * 180,
                y: Math.sin(i) * 200,
                opacity: 0,
              }}
              transition={{ duration: 1.4 }}
            />
          ))}
        </div>
      )}
      <div className="invitation-caption">
        <span className="touch-spark">✧</span>
        <button
          className="invitation-open-prompt"
          data-sound="envelope"
          disabled={opening}
          onClick={openInvitation}
        >
          {opening ? "A little wonder awaits…" : "Tap to Open"}
        </button>
        <span className="eyebrow">SOMETHING SPECIAL, JUST FOR YOU</span>
      </div>
    </div>
  );
}
