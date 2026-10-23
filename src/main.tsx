import React, { useRef, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { InvitationScene } from "./scenes/InvitationScene";
import { BirthdayLetterScene } from "./scenes/BirthdayLetterScene";
import { DreamPortalScene } from "./scenes/DreamPortalScene";
import { StarField } from "./components/StarField";
import { ConstellationScene } from "./scenes/ConstellationScene";
import { GardenScene } from "./scenes/GardenScene";
import { MemoryScene } from "./scenes/MemoryScene";
import { ChallengeScene } from "./scenes/ChallengeScene";
import { SecretGiftScene } from "./scenes/SecretGiftScene";
import { CelebrationScene } from "./scenes/CelebrationScene";
import { AudioProvider, MusicControl } from "./audio";
import { birthday } from "./config";
import { useProgress, type GameId } from "./progress";
import "./style.css";
import "./worlds.css";
import "./finale.css";

function App() {
  const { progress, setProgress, saveError } = useProgress();
  const scene = progress.scene;
  const setScene = (next: number) =>
    setProgress((p) => ({ ...p, scene: Math.max(0, Math.min(8, next)) }));
  const advance = (from: number) =>
    setProgress((p) =>
      p.scene === from && (from !== 7 || p.giftOpened)
        ? { ...p, scene: Math.min(8, from + 1) }
        : p,
    );
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
  const heading = useRef<HTMLDivElement>(null);
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
  }, [scene]);
  useEffect(() => {
    document.title = `Happy Birthday ${birthday.name} | A Little Universe for You`;
    const visibility = () =>
      document.documentElement.classList.toggle("page-hidden", document.hidden);
    visibility();
    document.addEventListener("visibilitychange", visibility);
    return () => {
      document.removeEventListener("visibilitychange", visibility);
      document.documentElement.classList.remove("page-hidden");
    };
  }, []);
  return (
    <MotionConfig reducedMotion="user">
      <div className="desktop-aura" />
      <main
        className="universe"
        aria-label={`${birthday.name}'s birthday universe`}
      >
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
          <MusicControl />
        </nav>
        <div className="scene-host" ref={heading} tabIndex={-1}>
          <AnimatePresence
            mode="wait"
            onExitComplete={() =>
              window.scrollTo({ top: 0, behavior: "instant" })
            }
          >
            <motion.div
              className="scene"
              key={scene}
              initial={{ opacity: 0, filter: "blur(8px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(12px)", scale: 1.06 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
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
              ) : scene === 7 ? (
                <SecretGiftScene
                  magicKey={progress.magicKey}
                  giftUnlocked={progress.giftUnlocked}
                  giftOpened={progress.giftOpened}
                  onUnlock={() =>
                    setProgress((p) =>
                      p.magicKey ? { ...p, giftUnlocked: true } : p,
                    )
                  }
                  onOpened={() =>
                    setProgress((p) =>
                      p.giftUnlocked ? { ...p, giftOpened: true } : p,
                    )
                  }
                  onChallenge={() => setScene(6)}
                  onNext={() => advance(7)}
                />
              ) : (
                <CelebrationScene onReplay={() => setScene(0)} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        <footer className="progress" aria-label={`Scene ${scene + 1} of 9`}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
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
    <AudioProvider>
      <App />
    </AudioProvider>
  </React.StrictMode>,
);
