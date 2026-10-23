import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Download, RotateCcw, Sparkles } from "lucide-react";
import { birthday, finalWishes } from "../config";
import { useMagicAudio } from "../audio";
import { saveBirthdayCard } from "../card";
import "../celebration-hd.css";
function Finale({ onReplay }: { onReplay: () => void }) {
  const reduced = useReducedMotion();
  const [stage, setStage] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const { sound } = useMagicAudio();
  const latestSound = useRef(sound);
  latestSound.current = sound;
  useEffect(() => {
    setStage(0);
    const timings = reduced
      ? [0, 30, 60, 90, 120]
      : [650, 1600, 2700, 3900, 5400];
    const timers = timings.map((delay, i) =>
      setTimeout(() => {
        setStage(i + 1);
        if (i === 1 || i === 4) latestSound.current("celebration");
      }, delay),
    );
    return () => timers.forEach(clearTimeout);
  }, [attempt, reduced]);
  async function download() {
    if (saving) return;
    setSaving(true);
    setSaveStatus("Creating your birthday card…");
    try {
      await saveBirthdayCard();
      setSaveStatus("Your birthday card is ready to keep.");
    } catch {
      setSaveStatus("The card could not be saved. You can try again.");
    } finally {
      setSaving(false);
    }
  }
  return (
    <div className={`world-scene finale-scene finale-hd finale-stage-${stage}`}>
      <div className="finale-sky" key={`sky-${attempt}`} aria-hidden="true">
        <div className="aurora" />
        {stage >= 1 && <div className="shooting-star" />}
        {stage >= 2 && (
          <>
            <div className="lanterns">
              {Array.from({ length: 4 }, (_, i) => (
                <span
                  className="lantern"
                  key={i}
                  style={{
                    left: `${4 + ((i * 29) % 90)}%`,
                    animationDelay: `${i * 0.65}s`,
                    animationDuration: `${11 + (i % 3) * 2}s`,
                  }}
                />
              ))}
            </div>
            <div className="fireworks">
              {[0, 1].map((burst) => (
                <div className={`firework firework-${burst}`} key={burst}>
                  {Array.from({ length: 10 }, (_, i) => (
                    <i
                      key={i}
                      style={
                        {
                          "--ray": `${i * 36}deg`,
                          "--delay": `${burst * 1.4}s`,
                        } as React.CSSProperties
                      }
                    />
                  ))}
                </div>
              ))}
            </div>
          </>
        )}
        {stage >= 5 && (
          <div className="finale-confetti">
            {Array.from({ length: 14 }, (_, i) => (
              <i
                key={i}
                style={
                  {
                    left: `${(i * 37) % 100}%`,
                    animationDelay: `${i * 0.16}s`,
                    background: i % 2 ? "#e9c1f6" : "#ffd598",
                    "--turn": `${i % 2 ? 180 : -220}deg`,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>
        )}
      </div>
      <div className="finale-art-frame">
        <img
          className="celebration-landscape"
          src="/art/birthday-celebration-hd.webp"
          width={941}
          height={1672}
          decoding="async"
          alt="A friend opens his arms to a magical city beneath floating golden lanterns"
        />
        <motion.header
          className="finale-heading"
          animate={{
            opacity: stage >= 3 ? 1 : 0,
            y: stage >= 3 ? 0 : reduced ? 0 : 12,
            scale: stage >= 3 ? 1 : reduced ? 1 : 0.97,
          }}
          transition={{ duration: reduced ? 0.1 : 1.3 }}
          aria-hidden={stage < 3}
        >
          <p>Happy Birthday,</p>
          <h1>{birthday.name}!</h1>
          <p className="finale-subtitle">{finalWishes.subtitle}</p>
        </motion.header>
      </div>
      <div className="finale-breath" aria-live="polite">
        {stage < 3 ? (
          <span>A little silence before the magic…</span>
        ) : (
          <span className="sr-only">Happy Birthday, {birthday.name}!</span>
        )}
      </div>
      <motion.div
        className="final-wish-card"
        animate={{ opacity: stage >= 4 ? 1 : 0, y: stage >= 4 ? 0 : 15 }}
        transition={{ duration: reduced ? 0.1 : 1.2 }}
        aria-hidden={stage < 4}
      >
        <Sparkles size={21} />
        {finalWishes.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </motion.div>
      {stage >= 5 && (
        <motion.div
          className="finale-controls"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <button
            className="magic-button"
            onClick={() => setAttempt((i) => i + 1)}
            data-sound="chime"
          >
            <Sparkles size={17} />
            Celebrate Again
          </button>
          <div className="finale-secondary">
            <button className="text-button" onClick={onReplay}>
              <RotateCcw size={15} />
              Replay the Journey
            </button>
            <button
              className="text-button"
              disabled={saving}
              onClick={download}
            >
              <Download size={15} />
              {saving ? "Creating…" : "Save Birthday Card"}
            </button>
          </div>
          <p className="card-save-status" role="status">
            {saveStatus ||
              "A universe of good wishes, always yours to revisit."}
          </p>
        </motion.div>
      )}
    </div>
  );
}
export function CelebrationScene({ onReplay }: { onReplay: () => void }) {
  return <Finale onReplay={onReplay} />;
}
