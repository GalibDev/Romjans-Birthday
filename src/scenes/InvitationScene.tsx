import { useId, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { artwork, useArtwork } from "../artwork";
export function InvitationScene({ onNext }: { onNext: () => void }) {
  const [opening, setOpening] = useState(false);
  const started = useRef(false);
  const reduced = useReducedMotion();
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const { status, retry } = useArtwork(artwork.invitation);
  const [nativeLoaded, setNativeLoaded] = useState(false);
  const [nativeFailed, setNativeFailed] = useState(false);
  const [imageAttempt, setImageAttempt] = useState(0);
  const ready = nativeLoaded || status === "ready";
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
      <motion.img
        key={imageAttempt}
        className="invitation-backdrop"
        src={artwork.invitation}
        width={941}
        height={1672}
        loading="eager"
        fetchPriority="high"
        decoding="async"
        alt="A glowing crescent moon, hanging golden stars and a magical lavender envelope among dreamy clouds"
        initial={false}
        animate={{
          opacity: ready ? (opening ? 0.12 : 1) : 0,
          scale: opening && !reduced ? 1.025 : 1,
        }}
        transition={{ duration: opening ? 1.5 : reduced ? 0 : 0.25 }}
        onLoad={() => {
          setNativeLoaded(true);
          setNativeFailed(false);
        }}
        onError={() => setNativeFailed(true)}
      />
      <svg
        className="invitation-art"
        viewBox="0 0 941 1672"
        preserveAspectRatio="xMidYMid slice"
        data-ready={ready}
      >
        <defs>
          <clipPath id={`${id}-envelope`}>
            <path d={envelopePath} />
          </clipPath>
        </defs>
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
              ? {
                  y: reduced ? 0 : [0, -15, -55],
                  scale: reduced ? 1 : [1, 1.03, 1.08],
                  opacity: [1, 1, 0],
                }
              : { y: 0, scale: 1, opacity: 0 }
          }
          transition={
            opening ? { duration: reduced ? 0.3 : 1.5 } : { duration: 0 }
          }
          onAnimationComplete={() => {
            if (opening) onNext();
          }}
          style={{ transformOrigin: "490px 1035px" }}
        >
          <image
            href={artwork.invitation}
            xlinkHref={artwork.invitation}
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
        {!nativeLoaded && (nativeFailed || status === "error") && (
          <button
            className="artwork-retry"
            onClick={() => {
              setNativeFailed(false);
              setImageAttempt((n) => n + 1);
              retry();
            }}
          >
            Artwork unavailable · Retry image
          </button>
        )}
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
