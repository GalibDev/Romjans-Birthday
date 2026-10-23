import { useState } from "react";
import { motion } from "motion/react";
import { birthday } from "../config";
import { MagicalButton } from "../components/MagicalButton";
import { artwork, useArtwork } from "../artwork";
export function DreamPortalScene({ onNext }: { onNext: () => void }) {
  const [entering, setEntering] = useState(false);
  const { status, retry } = useArtwork(artwork.portal);
  return (
    <div className="portal-scene">
      <header>
        <p>Welcome to</p>
        <h1>{birthday.name}’s</h1>
        <h2>Universe</h2>
      </header>
      <motion.div
        className="portal-world"
        animate={
          entering ? { scale: 2.8, opacity: 0 } : { scale: 1, opacity: 1 }
        }
        transition={{ duration: 1.8, ease: "easeIn" }}
        onAnimationComplete={() => {
          if (entering) onNext();
        }}
      >
        <img
          src={status === "ready" ? artwork.portal : undefined}
          width={941}
          height={1672}
          decoding="async"
          loading="eager"
          fetchPriority="high"
          className="decoded-portal-art"
          data-ready={status === "ready"}
          alt="A male traveler gazes into a glowing lavender portal, with a moonlit castle floating beyond"
        />
        <div className="portal-ring" />
      </motion.div>
      <div className="portal-copy">
        {status === "error" && (
          <button className="artwork-retry" onClick={retry}>
            Artwork unavailable · Retry image
          </button>
        )}
        <p>
          A world of dreams, memories,
          <br />
          and little wonders.
        </p>
        <MagicalButton sound="portal" onClick={() => setEntering(true)}>
          {entering ? "Into the magic…" : "Let's Begin"}
        </MagicalButton>
      </div>
    </div>
  );
}
