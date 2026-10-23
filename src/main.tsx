import React, { useState, useRef, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { ArrowLeft, Music2, VolumeX } from "lucide-react";
import { InvitationScene } from "./scenes/InvitationScene";
import { BirthdayLetterScene } from "./scenes/BirthdayLetterScene";
import { DreamPortalScene } from "./scenes/DreamPortalScene";
import { StarField } from "./components/StarField";
import { ConstellationScene } from "./scenes/ConstellationScene";
import { GardenScene } from "./scenes/GardenScene";
import { MemoryScene } from "./scenes/MemoryScene";
import { ChallengeScene } from "./scenes/ChallengeScene";
import { GiftEntryScene } from "./scenes/GiftEntryScene";
import { useProgress, type GameId } from "./progress";
import "./style.css";
import "./worlds.css";

function App() {
  const { progress, setProgress, saveError } = useProgress();
  const scene = progress.scene;
  const setScene = (next: number) =>
    setProgress((p) => ({ ...p, scene: Math.max(0, Math.min(7, next)) }));
  const advance = (from: number) =>
    setProgress((p) => (p.scene === from ? { ...p, scene: from + 1 } : p));
  const discoverWish = (id: string) =>
    setProgress((p) =>
      p.wishes.includes(id) ? p : { ...p, wishes: [...p.wishes, id] },
    );
  const discoverFlower = (id: number) =>
    setProgress((p) =>
      p.flowers.includes(id) ? p : { ...p, flowers: [...p.flowers, id] },
    );
  const visitMemory = (id: string) =>
    setProgress((p) =>
      p.memories.includes(id) ? p : { ...p, memories: [...p.memories, id] },
    );
  const completeGame = (id: GameId) =>
    setProgress((p) => {
      const games = p.games.includes(id) ? p.games : [...p.games, id];
      return { ...p, games, magicKey: games.length === 3 };
    });
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
                <InvitationScene onNext={() => advance(0)} />
              ) : scene === 1 ? (
                <BirthdayLetterScene onNext={() => advance(1)} />
              ) : scene === 2 ? (
                <DreamPortalScene onNext={() => advance(2)} />
              ) : scene === 3 ? (
                <ConstellationScene
                  discovered={progress.wishes}
                  discover={discoverWish}
                  onNext={() => advance(3)}
                />
              ) : scene === 4 ? (
                <GardenScene
                  viewed={progress.flowers}
                  secret={progress.butterfly}
                  discover={discoverFlower}
                  revealSecret={() =>
                    setProgress((p) => ({ ...p, butterfly: true }))
                  }
                  onNext={() => advance(4)}
                />
              ) : scene === 5 ? (
                <MemoryScene
                  visited={progress.memories}
                  visit={visitMemory}
                  onNext={() => advance(5)}
                />
              ) : scene === 6 ? (
                <ChallengeScene
                  completed={progress.games}
                  magicKey={progress.magicKey}
                  complete={completeGame}
                  onNext={() => advance(6)}
                />
              ) : (
                <GiftEntryScene />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        <footer className="progress" aria-label={`Scene ${scene + 1} of 8`}>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <span key={i} className={i === scene ? "active" : ""} />
          ))}
        </footer>
        {saveError && (
          <p className="save-notice" role="status">
            Progress stays here while this tab is open. Browser storage is
            unavailable.
          </p>
        )}
      </main>
    </MotionConfig>
  );
}
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
