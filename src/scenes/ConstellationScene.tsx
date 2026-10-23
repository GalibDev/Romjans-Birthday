import { useState } from "react";
import { motion } from "motion/react";
import { Star, Check, Sparkles } from "lucide-react";
import { wishes } from "../config";
import { MagicalButton } from "../components/MagicalButton";
import { MagicDialog } from "../components/MagicDialog";
import { WorldHeading } from "../components/WorldHeading";
const positions = [
  [24, 22],
  [77, 20],
  [53, 48],
  [15, 73],
  [83, 82],
];
export function ConstellationScene({
  discovered,
  discover,
  onNext,
}: {
  discovered: string[];
  discover: (id: string) => void;
  onNext: () => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const complete = discovered.length === wishes.length;
  return (
    <div
      className={`world-scene constellation-scene ${complete ? "constellation-complete" : ""}`}
    >
      <img
        className="world-landscape"
        src="/art/wish-castle.png"
        alt="A distant castle floating above a lavender lake"
      />
      <WorldHeading
        eyebrow="LITTLE LIGHTS, BIG DREAMS"
        subtitle="Tap each star to open a wish"
      >
        A Sky Full of
        <br />
        <em>Wishes for You</em>
      </WorldHeading>
      <div className="constellation-map">
        <svg
          className="constellation-lines"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {[
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 4],
            [4, 0],
          ].map(([a, b]) => (
            <line
              key={`${a}-${b}`}
              x1={positions[a][0]}
              y1={positions[a][1]}
              x2={positions[b][0]}
              y2={positions[b][1]}
              className={
                complete ||
                (discovered.includes(wishes[a].id) &&
                  discovered.includes(wishes[b].id))
                  ? "lit"
                  : ""
              }
            />
          ))}
        </svg>
        {wishes.map((wish, i) => (
          <button
            key={wish.id}
            className={`wish-star ${discovered.includes(wish.id) ? "discovered" : ""}`}
            style={{ left: `${positions[i][0]}%`, top: `${positions[i][1]}%` }}
            onClick={() => {
              setSelected(i);
              discover(wish.id);
            }}
            aria-label={`Open ${wish.title} wish${discovered.includes(wish.id) ? ", discovered" : ""}`}
          >
            <Star size={47} strokeWidth={1} />
            <span>{wish.title}</span>
            {discovered.includes(wish.id) && (
              <Check className="star-check" size={13} />
            )}
          </button>
        ))}
      </div>
      <div className="world-bottom">
        <p className="discovery-count" aria-live="polite">
          {complete ? (
            <>
              <Sparkles size={16} /> Every wish is yours
            </>
          ) : (
            `${discovered.length} of 5 wishes discovered`
          )}
        </p>
        {complete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <MagicalButton onClick={onNext}>
              Into the Magical Garden
            </MagicalButton>
          </motion.div>
        )}
      </div>
      {selected !== null && (
        <MagicDialog
          title={wishes[selected].title}
          className="wish-dialog"
          onClose={() => setSelected(null)}
        >
          <div className="wish-reveal-star" aria-hidden="true">
            ✧
          </div>
          <p className="eyebrow">A WISH FOR YOU</p>
          <h2>{wishes[selected].title}</h2>
          <p className="wish-message">{wishes[selected].message}</p>
          <p className="wish-signature">With a little stardust, always.</p>
          <div className="wish-switcher">
            {wishes.map((w, i) => (
              <button
                key={w.id}
                aria-label={`Read ${w.title}`}
                aria-pressed={i === selected}
                onClick={() => {
                  setSelected(i);
                  discover(w.id);
                }}
              >
                <Star
                  size={19}
                  fill={discovered.includes(w.id) ? "currentColor" : "none"}
                />
              </button>
            ))}
          </div>
        </MagicDialog>
      )}
    </div>
  );
}
