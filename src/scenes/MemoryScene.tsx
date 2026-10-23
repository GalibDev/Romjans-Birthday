import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, ImagePlus, Expand } from "lucide-react";
import { memories, type Memory } from "../config";
import { WorldHeading } from "../components/WorldHeading";
import { MagicalButton } from "../components/MagicalButton";
import { MagicDialog } from "../components/MagicDialog";
function MemoryPhoto({
  memory,
  full = false,
}: {
  memory: Memory;
  full?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  return memory.image && !failed ? (
    <img
      className="memory-photo"
      src={memory.image}
      alt={memory.caption}
      draggable={false}
      decoding="async"
      style={{
        objectPosition: memory.imagePosition ?? "50% 30%",
        objectFit: full ? "contain" : (memory.imageFit ?? "cover"),
      }}
      onError={() => setFailed(true)}
    />
  ) : (
    <div className="memory-placeholder">
      <ImagePlus size={34} strokeWidth={1} />
      <span>A memory belongs here</span>
      <small>Our photo, coming soon</small>
    </div>
  );
}
export function MemoryScene({
  visited,
  visit,
  onNext,
}: {
  visited: string[];
  visit: (id: string) => void;
  onNext: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [enlarged, setEnlarged] = useState(false);
  const [closing, setClosing] = useState(false);
  const [direction, setDirection] = useState(1);
  const reduced = useReducedMotion();
  const dragged = useRef(false);
  const transitioning = useRef(false);
  const memory = memories[index];
  useEffect(() => {
    const next = new Image();
    next.src = memories[(index + 1) % memories.length].image ?? "";
    return () => {
      next.onload = null;
      next.onerror = null;
    };
  }, [index]);
  function move(delta: number) {
    if (transitioning.current) return;
    transitioning.current = true;
    setDirection(delta);
    setIndex((index + delta + memories.length) % memories.length);
    visit(memory.id);
    visit(memories[(index + delta + memories.length) % memories.length].id);
  }
  const allSeen = memories.every(
    (m) => visited.includes(m.id) || m.id === memory.id,
  );
  return (
    <div className="world-scene memory-scene">
      <img className="memory-clouds" src="/art/memory-clouds.png" alt="" />
      <WorldHeading
        eyebrow="THE MOMENTS WE KEEP"
        subtitle="Swipe through the moments"
      >
        Our Beautiful
        <br />
        <em>Memories</em>
      </WorldHeading>
      <div className="memory-stage">
        <span className="polaroid-ghost ghost-left" />
        <span className="polaroid-ghost ghost-right" />
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            className="polaroid"
            key={memory.id}
            custom={direction}
            variants={{
              enter: (dir: number) => ({
                opacity: 0,
                x: reduced ? 0 : dir * 40,
                rotate: reduced ? 0 : dir * 3,
              }),
              visible: { opacity: 1, x: 0, rotate: reduced ? 0 : -3 },
              leave: (dir: number) => ({
                opacity: 0,
                x: reduced ? 0 : -dir * 40,
                rotate: reduced ? 0 : -dir * 5,
              }),
            }}
            initial="enter"
            animate="visible"
            exit="leave"
            transition={{
              duration: reduced ? 0.12 : 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
            onAnimationComplete={(definition) => {
              if (definition === "visible") transitioning.current = false;
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.35}
            dragMomentum={false}
            onDragStart={() => {
              dragged.current = true;
            }}
            onDragEnd={(_, info) => {
              if (info.offset.x > 40 || info.velocity.x > 450) move(-1);
              else if (info.offset.x < -40 || info.velocity.x < -450) move(1);
            }}
          >
            <button
              className="photo-open"
              aria-label={`Enlarge memory: ${memory.caption}`}
              onPointerDown={() => {
                dragged.current = false;
              }}
              onClick={() => {
                if (dragged.current) {
                  dragged.current = false;
                  return;
                }
                visit(memory.id);
                setEnlarged(true);
              }}
            >
              <MemoryPhoto memory={memory} />
              <Expand className="expand-icon" size={18} />
            </button>
            <div className="polaroid-inscription">
              <span className="polaroid-number">
                {String(index + 1).padStart(2, "0")} /{" "}
                {String(memories.length).padStart(2, "0")}
              </span>
              <span aria-hidden="true">✧</span>
            </div>
            <p className="memory-caption">{memory.caption}</p>
            {memory.date && <time>{memory.date}</time>}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="gallery-controls">
        <button
          className="icon-button"
          aria-label="Previous memory"
          onClick={() => move(-1)}
        >
          <ChevronLeft size={22} />
        </button>
        <span aria-live="polite">
          {index + 1} / {memories.length}
        </span>
        <button
          className="icon-button"
          aria-label="Next memory"
          onClick={() => move(1)}
        >
          <ChevronRight size={22} />
        </button>
      </div>
      <p className="memory-description">{memory.description}</p>
      <div className="world-bottom">
        {allSeen ? (
          <MagicalButton onClick={() => setClosing(true)}>
            Keep These Moments
          </MagicalButton>
        ) : (
          <p className="gentle-hint">
            A few moments to explore, a lifetime more to make.
          </p>
        )}
      </div>
      {enlarged && (
        <MagicDialog
          title={memory.caption}
          className="photo-dialog"
          onClose={() => setEnlarged(false)}
        >
          <MemoryPhoto memory={memory} full />
          <h2>{memory.caption}</h2>
          {memory.date && <p>{memory.date}</p>}
          <p>{memory.description}</p>
        </MagicDialog>
      )}
      {closing && (
        <MagicDialog
          title="To more beautiful memories"
          onClose={() => setClosing(false)}
        >
          <p className="eyebrow">OUR STORY IS STILL BEING WRITTEN</p>
          <h2>To more beautiful memories.</h2>
          <p className="wish-message">
            The best part of every memory is having someone to share it with.
            Here is to all the wonderful moments still ahead, Romjan.
          </p>
          <MagicalButton onClick={onNext}>Follow the Moonlight</MagicalButton>
        </MagicDialog>
      )}
    </div>
  );
}
