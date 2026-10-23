import { useId, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Flower2, Check } from "lucide-react";
import { flowers } from "../config";
import { WorldHeading } from "../components/WorldHeading";
import { MagicalButton } from "../components/MagicalButton";
import { MagicDialog } from "../components/MagicDialog";
const positions = [
  [23, 17],
  [75, 32],
  [33, 49],
  [75, 70],
  [24, 84],
];
function MagicalBloom() {
  const id = useId();
  return (
    <svg
      className="magical-bloom"
      viewBox="0 0 72 76"
      width="64"
      height="68"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={id}>
          <stop stopColor="#fff0f7" />
          <stop offset=".45" stopColor="#d9b0f3" />
          <stop offset="1" stopColor="#8750b5" />
        </radialGradient>
        <radialGradient id={`${id}-gold`}>
          <stop stopColor="#fff5c9" />
          <stop offset="1" stopColor="#deaa72" />
        </radialGradient>
      </defs>
      <g fill={`url(#${id})`} stroke="#f2c9ee" strokeWidth=".7">
        {Array.from({ length: 8 }, (_, i) => (
          <ellipse
            key={i}
            cx="36"
            cy="22"
            rx="9"
            ry="18"
            transform={`rotate(${i * 45} 36 37)`}
          />
        ))}
      </g>
      <g fill="none" stroke="#fff0f4" strokeOpacity=".4" strokeWidth=".6">
        {Array.from({ length: 8 }, (_, i) => (
          <path
            key={i}
            d="M36 36Q32 21 36 7"
            transform={`rotate(${i * 45} 36 37)`}
          />
        ))}
      </g>
      <circle cx="36" cy="37" r="9" fill={`url(#${id}-gold)`} />
      <g fill="#fff4d1">
        {Array.from({ length: 7 }, (_, i) => (
          <circle
            key={i}
            cx={36 + Math.cos(i) * 5}
            cy={37 + Math.sin(i) * 5}
            r="1"
          />
        ))}
      </g>
    </svg>
  );
}
export function GardenScene({
  viewed,
  secret,
  discover,
  revealSecret,
  onNext,
}: {
  viewed: number[];
  secret: boolean;
  discover: (id: number) => void;
  revealSecret: () => void;
  onNext: () => void;
}) {
  const [selected, setSelected] = useState<number | "secret" | null>(null);
  const [offset, setOffset] = useState(0);
  const reduced = useReducedMotion();
  return (
    <div
      className="world-scene garden-scene"
      onPointerMove={(e) => {
        if (e.pointerType === "mouse" && !reduced)
          setOffset(
            ((e.clientX - e.currentTarget.getBoundingClientRect().left) /
              e.currentTarget.clientWidth) *
              8 -
              4,
          );
      }}
      onPointerLeave={() => setOffset(0)}
    >
      <div
        className="garden-art"
        style={{ transform: `translateX(${offset}px)` }}
      >
        <img
          className="garden-sanctuary"
          src="/art/garden-sanctuary.png"
          alt="An enchanted floating garden with a glowing pavilion"
        />
        <img
          className="garden-flower-art"
          src="/art/garden-flower.png"
          alt="Luminous purple flowers"
        />
      </div>
      <WorldHeading
        eyebrow="LET YOUR WONDER GROW"
        subtitle="Touch a glowing bloom. Find a little joy."
      >
        The Garden of
        <br />
        <em>Little Wonders</em>
      </WorldHeading>
      <div className="garden-blooms">
        {flowers.map((_, i) => (
          <motion.button
            key={i}
            className={`flower-button ${viewed.includes(i) ? "bloomed" : ""}`}
            data-sound="chime"
            style={{
              left: `${positions[i][0]}%`,
              top: `${positions[i][1]}%`,
              x: "-50%",
              y: "-50%",
            }}
            whileTap={{ scale: 1.08 }}
            onClick={() => {
              discover(i);
              setSelected(i);
            }}
            aria-label={`Explore flower ${i + 1}${viewed.includes(i) ? ", discovered" : ""}`}
          >
            <MagicalBloom />
            <span>
              {
                [
                  "A little kindness",
                  "Dream bigger",
                  "Your smile",
                  "Adventures await",
                  "Simply you",
                ][i]
              }
            </span>
            {viewed.includes(i) && <Check size={13} />}
          </motion.button>
        ))}
        <button
          className="secret-butterfly"
          aria-label="Follow the little butterfly"
          onClick={() => {
            revealSecret();
            setSelected("secret");
          }}
        >
          <svg viewBox="0 0 50 40" aria-hidden="true">
            <path d="M25 25C-9-8 1 43 24 29M25 25C59-8 49 43 26 29" />
            <path d="M25 13v22" />
          </svg>
        </button>
      </div>
      <div className="fireflies" aria-hidden="true">
        {Array.from({ length: 9 }, (_, i) => (
          <i
            key={i}
            style={{
              left: `${(i * 31) % 100}%`,
              top: `${20 + ((i * 17) % 75)}%`,
              animationDelay: `${i * 0.6}s`,
            }}
          />
        ))}
      </div>
      <div className="world-bottom">
        <p className="discovery-count" aria-live="polite">
          {viewed.length}/5 blooms discovered {secret ? "· A secret found" : ""}
        </p>
        {viewed.length >= 3 ? (
          <MagicalButton onClick={onNext}>
            Drift into Our Memories
          </MagicalButton>
        ) : (
          <p className="gentle-hint">
            Explore any three flowers to follow the clouds.
          </p>
        )}
      </div>
      {selected !== null && (
        <MagicDialog
          title={selected === "secret" ? "A little secret" : "A garden message"}
          onClose={() => setSelected(null)}
        >
          <Flower2 size={44} className="dialog-symbol" />
          <p className="eyebrow">
            {selected === "secret"
              ? "A HIDDEN LITTLE WONDER"
              : "PICKED JUST FOR YOU"}
          </p>
          <h2>
            {selected === "secret" ? "A little secret" : "A little reminder"}
          </h2>
          <p className="wish-message">
            {selected === "secret"
              ? "A little secret: this universe is celebrating you!"
              : flowers[selected]}
          </p>
        </MagicDialog>
      )}
    </div>
  );
}
