import { useState } from "react";
import { motion } from "motion/react";
export function InvitationScene({ onNext }: { onNext: () => void }) {
  const [opening, setOpening] = useState(false);
  return (
    <div className={`invitation ${opening ? "opening" : ""}`}>
      <img
        className="moon-art"
        src="/art/moon.png"
        alt="A luminous golden crescent moon"
      />
      <h1>
        A little magic
        <br />
        has been waiting
        <br />
        <em>for you…</em>
      </h1>
      <motion.button
        className="envelope"
        data-sound="envelope"
        aria-label="Open your magical birthday invitation"
        disabled={opening}
        onClick={() => setOpening(true)}
        animate={
          opening
            ? { y: -25, scale: 1.15, opacity: 0, rotateX: 25 }
            : { y: [0, -9, 0] }
        }
        transition={
          opening
            ? { duration: 1.5 }
            : { duration: 5, repeat: Infinity, ease: "easeInOut" }
        }
        onAnimationComplete={() => {
          if (opening) onNext();
        }}
      >
        <img
          src="/art/envelope.png"
          alt="A glowing lavender envelope with a gold wax seal"
        />
      </motion.button>
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
        <p>{opening ? "A little wonder awaits…" : "Tap to open"}</p>
        <span className="eyebrow">SOMETHING SPECIAL, JUST FOR YOU</span>
      </div>
      <img className="cloud-floor" src="/art/clouds.png" alt="" />
    </div>
  );
}
