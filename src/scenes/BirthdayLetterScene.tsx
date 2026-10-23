import { motion } from "motion/react";
import { useEffect } from "react";
import { warmPortalArtwork } from "../artwork";
import { birthday } from "../config";
import { MagicalButton } from "../components/MagicalButton";
export function BirthdayLetterScene({ onNext }: { onNext: () => void }) {
  useEffect(() => {
    const timer = setTimeout(warmPortalArtwork, 600);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="letter-scene">
      <div className="letter-halo" />
      <img className="crystals crystal-top" src="/art/crystals.png" alt="" />
      <motion.article
        className="parchment"
        initial={{ scaleY: 0.2, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ duration: 1.1 }}
      >
        <span className="to">To</span>
        <h1>{birthday.name}</h1>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1.2 }}
        >
          {birthday.letter.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <p className="ready">
            Are you ready to enter? <span>✧</span>
          </p>
        </motion.div>
        <span className="paper-star">✧</span>
      </motion.article>
      <img className="crystals crystal-bottom" src="/art/crystals.png" alt="" />
      <motion.div
        className="letter-cta"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <MagicalButton onClick={onNext}>Enter Your Universe</MagicalButton>
      </motion.div>
    </div>
  );
}
