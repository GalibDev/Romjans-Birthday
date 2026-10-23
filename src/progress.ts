import { useEffect, useState } from "react";
import { wishes } from "./config";
export type GameId = "stars" | "puzzle" | "quiz";
export type Progress = {
  scene: number;
  wishes: string[];
  flowers: number[];
  memories: string[];
  games: GameId[];
  magicKey: boolean;
  butterfly: boolean;
  giftUnlocked: boolean;
  giftOpened: boolean;
};
const storageKey = "romjan-universe-progress-v1";
const empty: Progress = {
  scene: 0,
  wishes: [],
  flowers: [],
  memories: [],
  games: [],
  magicKey: false,
  butterfly: false,
  giftUnlocked: false,
  giftOpened: false,
};
function readProgress(): Progress {
  try {
    const raw = JSON.parse(localStorage.getItem(storageKey) || "null");
    if (!raw || typeof raw !== "object") return empty;
    const strings = (value: unknown): string[] =>
      Array.isArray(value)
        ? [...new Set(value.filter((v): v is string => typeof v === "string"))]
        : [];
    const games = strings(raw.games).filter((id): id is GameId =>
      ["stars", "puzzle", "quiz"].includes(id),
    );
    const foundWishes = strings(raw.wishes).filter((id) =>
      wishes.some((w) => w.id === id),
    );
    const foundFlowers: number[] = Array.isArray(raw.flowers)
      ? [
          ...new Set<number>(
            raw.flowers.filter(
              (v: unknown): v is number =>
                Number.isInteger(v) && Number(v) >= 0 && Number(v) < 5,
            ),
          ),
        ]
      : [];
    const unlocked = games.length === 3;
    let scene = Number.isInteger(raw.scene)
      ? Math.max(0, Math.min(8, raw.scene))
      : 0;
    if (foundWishes.length < 5) scene = Math.min(scene, 3);
    if (foundFlowers.length < 3) scene = Math.min(scene, 4);
    const giftUnlocked = unlocked && raw.giftUnlocked === true;
    const giftOpened = giftUnlocked && raw.giftOpened === true;
    // Scene 08 can show its locked state; the finale requires the revealed gift.
    if (scene === 8 && !giftOpened) scene = 7;
    return {
      scene,
      wishes: foundWishes,
      flowers: foundFlowers,
      memories: strings(raw.memories),
      games,
      magicKey: unlocked,
      butterfly: raw.butterfly === true,
      giftUnlocked,
      giftOpened,
    };
  } catch {
    return empty;
  }
}
export function useProgress() {
  const [progress, setProgress] = useState<Progress>(readProgress);
  const [saveError, setSaveError] = useState(false);
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(progress));
      setSaveError(false);
    } catch {
      setSaveError(true);
    }
  }, [progress]);
  return { progress, setProgress, saveError };
}
