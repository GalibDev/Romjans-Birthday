import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  Star,
  Puzzle,
  Heart,
  Check,
  KeyRound,
  Sparkles,
} from "lucide-react";
import { birthday, quiz } from "../config";
import type { GameId } from "../progress";
import { WorldHeading } from "../components/WorldHeading";
import { MagicalButton } from "../components/MagicalButton";
import { MagicDialog } from "../components/MagicDialog";
const challenges: {
  id: GameId;
  title: string;
  description: string;
  icon: typeof Star;
}[] = [
  {
    id: "stars",
    title: "Star Catcher",
    description: "Gather seven little lights",
    icon: Star,
  },
  {
    id: "puzzle",
    title: "Puzzle of Us",
    description: "Bring a magical picture together",
    icon: Puzzle,
  },
  {
    id: "quiz",
    title: "Friendship Quiz",
    description: "A few questions, a little joy",
    icon: Heart,
  },
];
function StarCatcher({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(0);
  const [sparkle, setSparkle] = useState<{
    x: number;
    y: number;
    id: number;
  } | null>(null);
  const x = 18 + ((count * 29) % 64),
    y = 20 + ((count * 23) % 60);
  return (
    <>
      <h2>Star Catcher</h2>
      <p>Tap each glowing star. There is no rush.</p>
      <p className="game-counter" aria-live="polite">
        {count} / 7 stars collected
      </p>
      <div className="star-playground">
        <AnimatePresence>
          {count < 7 && (
            <motion.button
              key={count}
              className="catch-star"
              data-sound="star"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.5 }}
              style={{ left: `${x}%`, top: `${y}%` }}
              aria-label={`Catch star ${count + 1}`}
              onClick={() => {
                setSparkle({ x, y, id: count });
                setCount((c) => (c === count ? Math.min(c + 1, 7) : c));
              }}
            >
              <Star size={46} strokeWidth={1.3} />
            </motion.button>
          )}
        </AnimatePresence>
        {sparkle && (
          <motion.span
            key={sparkle.id}
            className="caught-sparkle"
            aria-hidden="true"
            style={{ left: `${sparkle.x}%`, top: `${sparkle.y}%` }}
            initial={{ opacity: 1, scale: 0.7 }}
            animate={{ opacity: 0, scale: 2, y: -25 }}
            transition={{ duration: 0.7 }}
          >
            ✧
          </motion.span>
        )}
        {count === 7 && (
          <div className="game-success">
            <Sparkles size={42} />
            <h3>A pocket full of starlight!</h3>
            <p>You caught every star.</p>
          </div>
        )}
      </div>
      {count === 7 && (
        <MagicalButton onClick={onComplete}>
          Complete Star Catcher
        </MagicalButton>
      )}
    </>
  );
}
const initialTiles = [1, 0, 2, 3, 5, 4, 7, 6, 8];
function PicturePuzzle({ onComplete }: { onComplete: () => void }) {
  const [tiles, setTiles] = useState(initialTiles);
  const [selected, setSelected] = useState<number | null>(null);
  const [hint, setHint] = useState(false);
  const solved = tiles.every((tile, i) => tile === i);
  function tap(index: number) {
    if (solved) return;
    if (selected === null) {
      setSelected(index);
      return;
    }
    if (selected === index) {
      setSelected(null);
      return;
    }
    setTiles((previous) => {
      const next = [...previous];
      [next[index], next[selected]] = [next[selected], next[index]];
      return next;
    });
    setSelected(null);
  }
  function help() {
    setHint(true);
    setSelected(null);
    setTiles((previous) => {
      const next = [...previous];
      const wrong = next.findIndex((tile, i) => tile !== i);
      if (wrong < 0) return next;
      const other = next.indexOf(wrong);
      [next[wrong], next[other]] = [next[other], next[wrong]];
      return next;
    });
  }
  return (
    <>
      <h2>Puzzle of Us</h2>
      <p>Tap two tiles to swap them. Numbers show their places.</p>
      <div className="puzzle-grid" aria-label="Nine tile picture puzzle">
        {tiles.map((tile, index) => (
          <button
            key={index}
            disabled={solved}
            className={`puzzle-tile ${selected === index ? "selected" : ""} ${tile === index ? "in-place" : ""}`}
            style={{
              backgroundImage: "url(/art/puzzle-world.svg)",
              backgroundPosition: `${(tile % 3) * 50}% ${Math.floor(tile / 3) * 50}%`,
            }}
            aria-label={`Position ${index + 1}, tile ${tile + 1}${tile === index ? ", correct" : ""}`}
            aria-pressed={selected === index}
            onClick={() => tap(index)}
          >
            <span>{tile + 1}</span>
          </button>
        ))}
      </div>
      <p className="game-counter" aria-live="polite">
        {solved
          ? "Every piece found its place."
          : `${tiles.filter((t, i) => t === i).length} / 9 tiles in place`}
      </p>
      {solved ? (
        <div className="game-success">
          <Sparkles size={30} />
          <h3>Beautifully put together!</h3>
          <MagicalButton onClick={onComplete}>
            Complete the Puzzle
          </MagicalButton>
        </div>
      ) : (
        <>
          <button className="text-button" onClick={help}>
            A little magic: place one pair for me
          </button>
          {hint && (
            <p className="gentle-hint" role="status">
              A pair is in place. Follow the picture, left to right, 1 to 9.
            </p>
          )}
          <details className="puzzle-preview">
            <summary>Peek at the complete picture</summary>
            <img
              src="/art/puzzle-world.svg"
              alt="A lavender crescent moon over a magical castle and lake"
            />
          </details>
        </>
      )}
    </>
  );
}
function FriendshipQuiz({ onComplete }: { onComplete: () => void }) {
  const [question, setQuestion] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const current = quiz[question];
  const correct = answer === current.correct;
  return done ? (
    <div className="game-success">
      <Heart size={44} />
      <h2>You know where the magic is.</h2>
      <p>In happiness, memories, and the people who care.</p>
      <MagicalButton onClick={onComplete}>Complete the Quiz</MagicalButton>
    </div>
  ) : (
    <>
      <h2>Friendship Quiz</h2>
      <p className="game-counter">
        Question {question + 1} of {quiz.length}
      </p>
      <h3 className="quiz-question">{current.question}</h3>
      <div className="quiz-answers">
        {current.answers.map((option, i) => (
          <button
            className={`${answer === i ? (correct ? "answer-correct" : "answer-try") : ""}`}
            key={option}
            disabled={correct}
            onClick={() => setAnswer(i)}
          >
            <span>{String.fromCharCode(65 + i)}</span>
            {option}
            {answer === i && correct && <Check size={17} />}
          </button>
        ))}
      </div>
      <p className="quiz-feedback" role="status">
        {answer === null
          ? "A little heart is all you need."
          : correct
            ? current.feedback
            : "A lovely thought! Try another — there are no penalties."}
      </p>
      {correct && (
        <MagicalButton
          onClick={() => {
            if (question === quiz.length - 1) setDone(true);
            else {
              setQuestion((q) => q + 1);
              setAnswer(null);
            }
          }}
        >
          {question === quiz.length - 1
            ? "Finish with a Little Magic"
            : "Next Question"}
        </MagicalButton>
      )}
    </>
  );
}
export function ChallengeScene({
  completed,
  magicKey,
  complete,
  onNext,
}: {
  completed: GameId[];
  magicKey: boolean;
  complete: (id: GameId) => void;
  onNext: () => void;
}) {
  const [game, setGame] = useState<GameId | null>(null);
  const [success, setSuccess] = useState<GameId | null>(null);
  const [celebrating, setCelebrating] = useState(false);
  function finish(id: GameId) {
    const final = !completed.includes(id) && completed.length === 2;
    complete(id);
    setGame(null);
    setSuccess(id);
    if (final) setCelebrating(true);
  }
  return (
    <div
      className={`world-scene challenge-scene ${magicKey ? "key-unlocked" : ""}`}
    >
      <img
        className="challenge-clouds"
        src="/art/challenge-clouds.png"
        alt=""
      />
      <WorldHeading
        eyebrow="A LITTLE PLAY, A LITTLE MAGIC"
        subtitle="Three little challenges stand between you and a magical surprise."
      >
        The Moonlight
        <br />
        <em>Challenge</em>
      </WorldHeading>
      <div className="challenge-list">
        {challenges.map((challenge, i) => (
          <button
            key={challenge.id}
            className={`challenge-card ${completed.includes(challenge.id) ? "completed" : ""}`}
            onClick={() => {
              setSuccess(null);
              setGame(challenge.id);
            }}
          >
            <challenge.icon
              className="challenge-icon"
              size={43}
              strokeWidth={1.2}
            />
            <span className="challenge-info">
              <span className="challenge-number">0{i + 1}</span>
              <strong>{challenge.title}</strong>
              <small>{challenge.description}</small>
              <span className="challenge-start">
                {completed.includes(challenge.id) ? "Play again" : "Start"}{" "}
                <span>→</span>
              </span>
            </span>
            {completed.includes(challenge.id) && (
              <Check className="challenge-check" size={17} />
            )}
          </button>
        ))}
      </div>
      <div className="challenge-status" aria-live="polite">
        {success && (
          <motion.p
            key={success}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="success-note"
          >
            <Sparkles size={17} />{" "}
            {challenges.find((c) => c.id === success)?.title} completed!
          </motion.p>
        )}
        <span>{completed.length} / 3 challenges completed</span>
        <div className="challenge-dots">
          {challenges.map((c) => (
            <i key={c.id} className={completed.includes(c.id) ? "done" : ""} />
          ))}
        </div>
      </div>
      {magicKey ? (
        <motion.div
          className="key-reward"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <KeyRound size={54} strokeWidth={1.2} />
          <p>
            You did it, {birthday.name}!<br />
            The Magic Key is yours.
          </p>
          <MagicalButton onClick={onNext}>
            Continue to the Secret Gift
          </MagicalButton>
        </motion.div>
      ) : (
        <div className="locked-key">
          <KeyRound size={46} strokeWidth={1} />
          <p>Three little victories. One magical key.</p>
        </div>
      )}
      {game && (
        <MagicDialog
          title={challenges.find((c) => c.id === game)!.title}
          className="game-dialog"
          onClose={() => setGame(null)}
        >
          <button
            className="text-button game-back"
            onClick={() => setGame(null)}
          >
            <ArrowLeft size={15} /> Back to challenges
          </button>
          {game === "stars" ? (
            <StarCatcher onComplete={() => finish("stars")} />
          ) : game === "puzzle" ? (
            <PicturePuzzle onComplete={() => finish("puzzle")} />
          ) : (
            <FriendshipQuiz onComplete={() => finish("quiz")} />
          )}
        </MagicDialog>
      )}
      {celebrating && (
        <MagicDialog
          title="The Magic Key is yours"
          className="key-dialog"
          onClose={() => setCelebrating(false)}
        >
          <div className="key-particles" aria-hidden="true">
            {Array.from({ length: 12 }, (_, i) => (
              <motion.i
                key={i}
                initial={{ opacity: 0, x: 0, y: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  x: Math.cos(i) * 120,
                  y: Math.sin(i) * 140,
                }}
                transition={{ duration: 2.2, delay: i * 0.08 }}
              >
                ✦
              </motion.i>
            ))}
          </div>
          <motion.div
            className="golden-key"
            initial={{ opacity: 0, rotate: -35, scale: 0.3 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <KeyRound size={100} strokeWidth={1} />
          </motion.div>
          <h2>You did it, {birthday.name}!</h2>
          <p className="wish-message">The Magic Key is yours.</p>
          <MagicalButton onClick={onNext}>
            Continue to the Secret Gift
          </MagicalButton>
          <button className="text-button" onClick={() => setCelebrating(false)}>
            Stay a little longer
          </button>
        </MagicDialog>
      )}
    </div>
  );
}
