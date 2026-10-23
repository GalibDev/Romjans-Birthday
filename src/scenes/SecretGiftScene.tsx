import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { KeyRound, LockKeyhole, LockKeyholeOpen, Sparkles } from "lucide-react";
import { birthday, giftMessage } from "../config";
import { WorldHeading } from "../components/WorldHeading";
import { MagicalButton } from "../components/MagicalButton";
import { PersonalMedia } from "../components/PersonalMedia";
import { useMagicAudio } from "../audio";
type Props = {
  magicKey: boolean;
  giftUnlocked: boolean;
  giftOpened: boolean;
  onUnlock: () => void;
  onOpened: () => void;
  onChallenge: () => void;
  onNext: () => void;
};
export function SecretGiftScene({
  magicKey,
  giftUnlocked,
  giftOpened,
  onUnlock,
  onOpened,
  onChallenge,
  onNext,
}: Props) {
  const reduced = useReducedMotion();
  const { sound } = useMagicAudio();
  const [stage, setStage] = useState(giftOpened ? 5 : 0);
  const [ready, setReady] = useState(giftOpened);
  const [dragging, setDragging] = useState(false);
  const lock = useRef<HTMLButtonElement>(null);
  const message = useRef<HTMLElement>(null);
  const started = useRef(false);
  const stageSound = useRef(sound);
  stageSound.current = sound;
  const [opening, setOpening] = useState(false);
  function unlock() {
    if (!magicKey || started.current || giftOpened) return;
    started.current = true;
    setOpening(true);
    onUnlock();
  }
  // An interrupted opening resumes safely on the next visit.
  useEffect(() => {
    if (giftUnlocked && !giftOpened) {
      started.current = true;
      setOpening(true);
    }
  }, [giftUnlocked, giftOpened]);
  useEffect(() => {
    if (!opening) return;
    const timings = reduced
      ? [0, 80, 160, 240, 320]
      : [160, 850, 1650, 2650, 3900];
    const timers = timings.map((delay, index) =>
      setTimeout(() => {
        setStage(index + 1);
        if (index === 0) stageSound.current("unlock");
      }, delay),
    );
    return () => timers.forEach(clearTimeout);
  }, [opening, reduced]);
  useEffect(() => {
    if (stage !== 5 || giftOpened) return;
    onOpened();
  }, [stage, giftOpened, onOpened]);
  useEffect(() => {
    if (stage !== 5) return;
    const timer = setTimeout(
      () => {
        setReady(true);
        message.current?.focus({ preventScroll: true });
      },
      reduced ? 100 : 1700,
    );
    return () => clearTimeout(timer);
  }, [stage, reduced]);
  return (
    <div
      className={`world-scene gift-scene gift-stage-${stage} ${opening ? "gift-opening" : ""}`}
    >
      <img className="gift-landscape" src="/art/wish-castle.png" alt="" />
      <WorldHeading
        eyebrow="YOUR LITTLE MOMENT OF MAGIC"
        subtitle="Every magical journey leads to something special."
      >
        A Special Gift
        <br />
        <em>for You, {birthday.name}</em>
      </WorldHeading>
      <div className="gift-theatre">
        <div className="gift-darkness" />
        <div className="gift-beam" aria-hidden="true" />
        <div className="gift-box">
          <motion.img
            className="gift-lid"
            src="/art/gift-lid.png"
            alt="A golden ribbon on a magical lavender gift"
            animate={
              stage >= 3
                ? {
                    y: reduced ? -12 : -90,
                    rotate: reduced ? 0 : -9,
                    opacity: stage >= 5 ? 0.25 : 1,
                  }
                : { y: 0, rotate: 0, opacity: 1 }
            }
            transition={{ duration: reduced ? 0.1 : 1.6, ease: "easeInOut" }}
          />
          <img
            className="gift-base"
            src="/art/gift-base.png"
            alt="An ornate purple gift box illuminated with stars"
          />
          <div className="gift-ribbon" aria-hidden="true" />
          <button
            ref={lock}
            className={`gift-lock ${dragging ? "lock-target" : ""}`}
            aria-label={
              stage >= 1
                ? "Gift unlocked"
                : magicKey
                  ? "Unlock the gift with your Magic Key"
                  : "Gift locked: Magic Key required"
            }
            disabled={!magicKey || opening || giftOpened}
            onClick={unlock}
          >
            {stage >= 1 ? (
              <LockKeyholeOpen size={31} />
            ) : (
              <LockKeyhole size={31} />
            )}
          </button>
        </div>
        <img className="gift-platform" src="/art/gift-platform.png" alt="" />
        {stage >= 2 && (
          <div className="gift-sparks" aria-hidden="true">
            {Array.from({ length: 18 }, (_, i) => (
              <motion.i
                key={i}
                initial={{ opacity: 0, x: 0, y: 0 }}
                animate={
                  reduced
                    ? { opacity: 0.5 }
                    : {
                        opacity: [0, 1, 0],
                        x: Math.cos(i * 2.4) * (45 + i * 4),
                        y: -50 - i * 11,
                        scale: [0.5, 1.2, 0.2],
                      }
                }
                transition={{ duration: 2.8, delay: (i % 6) * 0.13 }}
              >
                ✦
              </motion.i>
            ))}
          </div>
        )}
        {stage >= 1 && stage < 3 && (
          <motion.div
            className="key-entering"
            aria-hidden="true"
            initial={{ x: -65, y: 120, opacity: 1, rotate: -30 }}
            animate={{ x: 0, y: 0, opacity: stage >= 2 ? 0 : 1, rotate: 0 }}
            transition={{ duration: reduced ? 0.1 : 0.7 }}
          >
            <KeyRound size={44} />
          </motion.div>
        )}
      </div>
      {stage < 5 && (
        <div className="gift-action" aria-live="polite">
          {!magicKey ? (
            <>
              <p>The gift is waiting for its Magic Key.</p>
              <MagicalButton onClick={onChallenge}>
                Return to the Challenge
              </MagicalButton>
            </>
          ) : opening ? (
            <p className="unlock-whisper">
              {
                [
                  "A little magic is waking…",
                  "The lock gives way…",
                  "A ribbon of stardust…",
                  "A light just for you…",
                  "Something wonderful is inside…",
                ][Math.min(stage, 4)]
              }
            </p>
          ) : (
            <>
              <p>
                {giftUnlocked ? "Your gift is ready." : "You earned the key!"}
              </p>
              <motion.button
                className="draggable-key"
                drag={!reduced}
                dragSnapToOrigin
                dragMomentum={false}
                dragElastic={0.12}
                onDragStart={() => setDragging(true)}
                onDragEnd={(event) => {
                  setDragging(false);
                  const rect = lock.current?.getBoundingClientRect();
                  const point =
                    "clientX" in event
                      ? { x: event.clientX, y: event.clientY }
                      : {
                          x: event.changedTouches[0]?.clientX ?? -1,
                          y: event.changedTouches[0]?.clientY ?? -1,
                        };
                  if (
                    rect &&
                    point.x >= rect.left - 25 &&
                    point.x <= rect.right + 25 &&
                    point.y >= rect.top - 25 &&
                    point.y <= rect.bottom + 25
                  )
                    unlock();
                }}
                onClick={unlock}
                aria-label="Tap to unlock your special gift"
                data-sound="chime"
                animate={stage >= 1 ? { y: -100, opacity: 0 } : { opacity: 1 }}
              >
                <KeyRound size={48} strokeWidth={1.2} />
                <span>
                  Tap to unlock <span aria-hidden="true">→</span>
                </span>
              </motion.button>
              <p className="gentle-hint">
                Or gently drag the key onto the glowing lock.
              </p>
            </>
          )}
        </div>
      )}
      {stage === 5 && (
        <motion.article
          className="gift-message"
          ref={message}
          tabIndex={-1}
          initial={giftOpened ? false : { opacity: 0, y: reduced ? 0 : 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4 }}
        >
          <Sparkles size={24} />
          <p className="gift-greeting">{giftMessage.greeting}</p>
          {giftMessage.paragraphs.map((paragraph, i) => (
            <motion.p
              key={paragraph}
              initial={giftOpened ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: reduced ? 0 : 0.2 + i * 0.2, duration: 0.6 }}
            >
              {paragraph}
            </motion.p>
          ))}
          <h2>{giftMessage.birthdayWish}</h2>
          <p className="gift-signoff">{giftMessage.signoff}</p>
          <PersonalMedia />
          {ready && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <MagicalButton onClick={onNext}>
                One Last Surprise Awaits…
              </MagicalButton>
            </motion.div>
          )}
        </motion.article>
      )}
    </div>
  );
}
