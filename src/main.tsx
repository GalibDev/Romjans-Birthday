import React, { useState, useRef, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { ArrowLeft, ArrowRight, Music2, VolumeX, Sparkles } from "lucide-react";
import { InvitationScene } from "./scenes/InvitationScene";
import { BirthdayLetterScene } from "./scenes/BirthdayLetterScene";
import { DreamPortalScene } from "./scenes/DreamPortalScene";
import { StarField } from "./components/StarField";
import "./style.css";

function App() {
  const [scene, setScene] = useState(0);
  const [music, setMusic] = useState(false);
  const audio = useRef<AudioContext | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const heading = useRef<HTMLDivElement>(null);
  useEffect(() => {
    heading.current?.focus();
  }, [scene]);
  useEffect(
    () => () => {
      if (timer.current) clearInterval(timer.current);
      void audio.current?.close();
    },
    [],
  );
  async function toggleMusic() {
    if (music) {
      if (timer.current) clearInterval(timer.current);
      await audio.current?.suspend();
      setMusic(false);
      return;
    }
    audio.current ??= new AudioContext();
    await audio.current.resume();
    const ctx = audio.current;
    const notes = [261.63, 329.63, 392, 523.25, 440, 392, 329.63, 293.66];
    let i = 0;
    const play = () => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = notes[i++ % notes.length];
      g.gain.setValueAtTime(0, ctx.currentTime);
      g.gain.linearRampToValueAtTime(0.035, ctx.currentTime + 0.1);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.8);
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + 3);
    };
    play();
    timer.current = setInterval(play, 1050);
    setMusic(true);
  }
  return (
    <MotionConfig reducedMotion="user">
      <div className="desktop-aura" />
      <main className="universe" aria-label="Romjan's birthday universe">
        <StarField />
        <nav className="controls">
          {scene > 0 ? (
            <button
              className="icon-button"
              aria-label="Go back"
              onClick={() => setScene(scene - 1)}
            >
              <ArrowLeft size={19} />
            </button>
          ) : (
            <span className="tiny-star">✧</span>
          )}
          <button
            className="icon-button"
            onClick={toggleMusic}
            aria-label={music ? "Mute music" : "Play music"}
            aria-pressed={music}
          >
            {music ? <Music2 size={19} /> : <VolumeX size={19} />}
          </button>
        </nav>
        <div className="scene-host" ref={heading} tabIndex={-1}>
          <AnimatePresence mode="wait">
            <motion.div
              className="scene"
              key={scene}
              initial={{ opacity: 0, filter: "blur(8px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(12px)", scale: 1.06 }}
              transition={{ duration: 0.8 }}
            >
              {scene === 0 ? (
                <InvitationScene onNext={() => setScene(1)} />
              ) : scene === 1 ? (
                <BirthdayLetterScene onNext={() => setScene(2)} />
              ) : scene === 2 ? (
                <DreamPortalScene onNext={() => setScene(3)} />
              ) : (
                <div className="continuation">
                  <Sparkles size={36} />
                  <p className="eyebrow">THIS IS ONLY THE BEGINNING</p>
                  <h1>
                    The Journey
                    <br />
                    <em>Continues</em>
                  </h1>
                  <p>
                    More dreams. More memories.
                    <br />A little more magic, just for you.
                  </p>
                  <button className="magic-button" onClick={() => setScene(0)}>
                    Relive the magic <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        <footer
          className="progress"
          aria-label={`Scene ${Math.min(scene + 1, 3)} of 3`}
        >
          {[0, 1, 2].map((i) => (
            <span key={i} className={i === scene ? "active" : ""} />
          ))}
        </footer>
      </main>
    </MotionConfig>
  );
}
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
