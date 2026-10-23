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
    const giftUnlocked = unlocked && raw.giftUnlocked === true;
    const giftOpened = giftUnlocked && raw.giftOpened === true;
    return {
      // Navigation belongs to this mount only; ignore legacy saved scene values.
      scene: 0,
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
      const { scene: _scene, ...savedAchievements } = progress;
      localStorage.setItem(storageKey, JSON.stringify(savedAchievements));
      setSaveError(false);
    } catch {
      setSaveError(true);
    }
  }, [progress]);
  return { progress, setProgress, saveError };
}
