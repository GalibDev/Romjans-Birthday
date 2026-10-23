import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Music2, VolumeX } from "lucide-react";
import { personalMedia } from "./config";
export type Sound =
  "chime" | "envelope" | "portal" | "star" | "unlock" | "celebration";
const preferenceKey = "romjan-universe-music-v1";
const AudioState = createContext({
  enabled: false,
  activated: false,
  toggle: () => {},
  sound: (_sound: Sound) => {},
});
export const useMagicAudio = () => useContext(AudioState);
function initialPreference() {
  try {
    return JSON.parse(localStorage.getItem(preferenceKey) || "false") === true;
  } catch {
    return false;
  }
}
export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(initialPreference);
  const [activated, setActivated] = useState(false);
  const [visible, setVisible] = useState(!document.hidden);
  const context = useRef<AudioContext | null>(null);
  const sources = useRef(new Set<OscillatorNode>());
  const mounted = useRef(false);
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;
  const activatedRef = useRef(activated);
  activatedRef.current = activated;
  const music = useRef<HTMLAudioElement | null>(null);
  const [useFile, setUseFile] = useState(Boolean(personalMedia.ambientMusic));
  const activate = useCallback(async () => {
    try {
      if (typeof AudioContext === "undefined") return;
      if (!context.current || context.current.state === "closed")
        context.current = new AudioContext();
      await context.current.resume();
      if (mounted.current) {
        activatedRef.current = true;
        setActivated(true);
      }
    } catch {
      /* The journey remains usable if browser audio is unavailable. */
    }
  }, []);
  const note = useCallback(
    (frequency: number, time: number, duration: number, volume = 0.025) => {
      const ctx = context.current;
      if (!ctx || ctx.state !== "running") return;
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(volume, time + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      sources.current.add(oscillator);
      oscillator.onended = () => {
        sources.current.delete(oscillator);
        oscillator.disconnect();
        gain.disconnect();
      };
      oscillator.start(time);
      oscillator.stop(time + duration + 0.05);
    },
    [],
  );
  const sound = useCallback(
    (kind: Sound) => {
      if (!enabledRef.current || !activatedRef.current || document.hidden)
        return;
      const ctx = context.current;
      if (!ctx || ctx.state !== "running") return;
      const notes: Record<Sound, number[]> = {
        envelope: [392, 587.33, 783.99],
        portal: [196, 293.66, 440, 587.33],
        star: [783.99, 1174.66],
        unlock: [329.63, 493.88, 659.25, 987.77],
        celebration: [261.63, 329.63, 392, 523.25, 659.25],
        chime: [523.25, 783.99],
      };
      notes[kind].forEach((pitch, i) =>
        note(pitch, ctx.currentTime + i * 0.13, 1.1, 0.025),
      );
    },
    [note],
  );
  useEffect(() => {
    mounted.current = true;
    const interaction = () => {
      if (enabledRef.current && !activatedRef.current) void activate();
    };
    const clicks = (event: MouseEvent) => {
      const target =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>("[data-sound]")
          : null;
      if (target?.dataset.sound) sound(target.dataset.sound as Sound);
    };
    const visibility = () => setVisible(!document.hidden);
    document.addEventListener("pointerdown", interaction, { capture: true });
    document.addEventListener("keydown", interaction, { capture: true });
    document.addEventListener("click", clicks);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      mounted.current = false;
      document.removeEventListener("pointerdown", interaction, true);
      document.removeEventListener("keydown", interaction, true);
      document.removeEventListener("click", clicks);
      document.removeEventListener("visibilitychange", visibility);
      music.current?.pause();
      const ctx = context.current;
      context.current = null;
      activatedRef.current = false;
      void ctx?.close().catch(() => {});
    };
  }, [activate, sound]);
  useEffect(() => {
    try {
      localStorage.setItem(preferenceKey, JSON.stringify(enabled));
    } catch {
      /* Preference is kept in memory when storage is blocked. */
    }
  }, [enabled]);
  useEffect(() => {
    if (!activated) return;
    if (!enabled || !visible) {
      music.current?.pause();
      for (const source of sources.current) {
        try {
          source.stop();
        } catch {
          /* Already ended. */
        }
      }
      void context.current?.suspend().catch(() => {});
      return;
    }
    void context.current?.resume().catch(() => {});
    if (useFile && personalMedia.ambientMusic) {
      const player = music.current ?? new Audio(personalMedia.ambientMusic);
      music.current = player;
      player.loop = true;
      player.volume = 0.25;
      const failed = () => {
        player.pause();
        setUseFile(false);
      };
      player.addEventListener("error", failed);
      void player.play().catch(failed);
      return () => {
        player.pause();
        player.removeEventListener("error", failed);
      };
    }
    let chord = 0;
    const chords = [
      [196, 246.94, 293.66],
      [174.61, 220, 261.63],
      [164.81, 196, 246.94],
      [146.83, 196, 220],
    ];
    const play = () => {
      const ctx = context.current;
      if (!ctx || ctx.state !== "running") return;
      chords[chord++ % chords.length].forEach((pitch, i) =>
        note(pitch, ctx.currentTime + i * 0.24, 4, 0.013),
      );
    };
    play();
    const interval = setInterval(play, 3500);
    return () => clearInterval(interval);
  }, [enabled, activated, visible, useFile, note]);
  const toggle = () => {
    if (!enabled) {
      void activate();
      setEnabled(true);
    } else setEnabled(false);
  };
  return (
    <AudioState.Provider value={{ enabled, activated, toggle, sound }}>
      {children}
    </AudioState.Provider>
  );
}
export function MusicControl({ className = "" }: { className?: string }) {
  const { enabled, activated, toggle } = useMagicAudio();
  return (
    <button
      className={`icon-button ${className}`}
      onClick={toggle}
      aria-label={enabled ? "Mute music" : "Play music"}
      aria-pressed={enabled}
      title={
        enabled && !activated
          ? "Sound resumes after your first interaction"
          : enabled
            ? "Music and magical sounds on"
            : "Music and magical sounds off"
      }
    >
      {enabled ? <Music2 size={19} /> : <VolumeX size={19} />}
    </button>
  );
}
