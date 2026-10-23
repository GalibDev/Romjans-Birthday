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
const preferenceKey = "romjan-visit-music-v2";
function readPreference() {
  try {
    return sessionStorage.getItem(preferenceKey) !== "muted";
  } catch {
    return true;
  }
}
const AudioState = createContext({
  enabled: true,
  activated: false,
  error: "",
  toggle: () => {},
  sound: (_sound: Sound) => {},
});
export const useMagicAudio = () => useContext(AudioState);
export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(readPreference);
  const [activated, setActivated] = useState(false);
  const [error, setError] = useState("");
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;
  const activatedRef = useRef(false),
    mounted = useRef(false),
    starting = useRef(false);
  const music = useRef<HTMLAudioElement | null>(null);
  const context = useRef<AudioContext | null>(null);
  const mediaSource = useRef<MediaElementAudioSourceNode | null>(null);
  const musicGain = useRef<GainNode | null>(null);
  const sources = useRef(new Set<OscillatorNode>());
  const generation = useRef(0),
    fadeFrame = useRef<number | null>(null);
  const pausePlayback = useCallback(() => {
    generation.current++;
    starting.current = false;
    if (fadeFrame.current !== null) {
      cancelAnimationFrame(fadeFrame.current);
      fadeFrame.current = null;
    }
    music.current?.pause();
    const ctx = context.current;
    if (ctx && musicGain.current) {
      musicGain.current.gain.cancelScheduledValues(ctx.currentTime);
      musicGain.current.gain.setValueAtTime(0, ctx.currentTime);
    }
    for (const source of sources.current) {
      try {
        source.stop();
      } catch {
        /* Already ended. */
      }
    }
    void ctx?.suspend().catch(() => {});
  }, []);
  const startPlayback = useCallback(() => {
    if (
      !mounted.current ||
      !enabledRef.current ||
      document.hidden ||
      starting.current
    )
      return;
    if (music.current && !music.current.paused) return;
    const ticket = ++generation.current;
    starting.current = true;
    setError("");
    let player = music.current;
    if (!player) {
      player = new Audio(personalMedia.ambientMusic);
      player.loop = true;
      player.preload = "auto";
      player.addEventListener("error", () => {
        if (mounted.current) {
          pausePlayback();
          setError("Music could not load. Tap the music button to retry.");
        }
      });
      music.current = player;
    }
    try {
      if (typeof AudioContext !== "undefined" && !context.current)
        context.current = new AudioContext();
      if (context.current && !mediaSource.current) {
        const gain = context.current.createGain();
        gain.gain.value = 0;
        const source = context.current.createMediaElementSource(player);
        source.connect(gain);
        gain.connect(context.current.destination);
        mediaSource.current = source;
        musicGain.current = gain;
      }
    } catch {
      /* Use HTML audio when the Web Audio graph is unavailable. */
    }
    const ctx = context.current;
    player.volume = musicGain.current ? 1 : 0;
    if (player.error) player.load();
    // Both calls happen synchronously within the interaction to satisfy Safari autoplay rules.
    const resume = ctx?.resume() ?? Promise.resolve();
    void Promise.all([resume, player.play()])
      .then(() => {
        if (!mounted.current || ticket !== generation.current) return;
        starting.current = false;
        if (!enabledRef.current || document.hidden) {
          pausePlayback();
          return;
        }
        const gain = musicGain.current;
        if (ctx && gain) {
          gain.gain.cancelScheduledValues(ctx.currentTime);
          gain.gain.setValueAtTime(0, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.23, ctx.currentTime + 1.5);
        } else {
          const start = performance.now();
          const fade = (now: number) => {
            if (ticket !== generation.current) return;
            player.volume = 0.23 * Math.min((now - start) / 1500, 1);
            if (now - start < 1500)
              fadeFrame.current = requestAnimationFrame(fade);
            else fadeFrame.current = null;
          };
          fadeFrame.current = requestAnimationFrame(fade);
        }
      })
      .catch(() => {
        if (!mounted.current || ticket !== generation.current) return;
        pausePlayback();
        setError("Music is paused. Tap the music button to try again.");
      });
  }, [pausePlayback]);
  const sound = useCallback((kind: Sound) => {
    const ctx = context.current;
    if (
      !enabledRef.current ||
      !activatedRef.current ||
      document.hidden ||
      !ctx ||
      ctx.state !== "running"
    )
      return;
    const notes: Record<Sound, number[]> = {
      envelope: [392, 587.33, 783.99],
      portal: [196, 293.66, 440, 587.33],
      star: [783.99, 1174.66],
      unlock: [329.63, 493.88, 659.25, 987.77],
      celebration: [261.63, 329.63, 392, 523.25, 659.25],
      chime: [523.25, 783.99],
    };
    notes[kind]?.forEach((pitch, i) => {
      const oscillator = ctx.createOscillator(),
        gain = ctx.createGain(),
        time = ctx.currentTime + i * 0.13;
      oscillator.type = "sine";
      oscillator.frequency.value = pitch;
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.025, time + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 1.1);
      oscillator.connect(gain);
      gain.connect(ctx.destination);
      sources.current.add(oscillator);
      oscillator.onended = () => {
        sources.current.delete(oscillator);
        oscillator.disconnect();
        gain.disconnect();
      };
      oscillator.start(time);
      oscillator.stop(time + 1.15);
    });
  }, []);
  useEffect(() => {
    mounted.current = true;
    const interaction = (event: MouseEvent) => {
      const target =
        event.target instanceof Element
          ? event.target.closest("[data-sound]")
          : null;
      if (
        !target ||
        target.getAttribute("aria-disabled") === "true" ||
        target.matches(":disabled")
      )
        return;
      let returning = false;
      try {
        returning =
          sessionStorage.getItem("romjan-visit-music-activated") === "true";
      } catch {
        /* Keep activation in memory. */
      }
      if (
        target.getAttribute("data-sound") === "envelope" ||
        returning ||
        activatedRef.current
      ) {
        activatedRef.current = true;
        setActivated(true);
        try {
          sessionStorage.setItem("romjan-visit-music-activated", "true");
        } catch {
          /* Keep in memory. */
        }
        startPlayback();
      }
      sound(target.getAttribute("data-sound") as Sound);
    };
    const visibility = () => {
      if (document.hidden) pausePlayback();
      else if (activatedRef.current && enabledRef.current) startPlayback();
    };
    // Capture before React disables the invitation button during its opening animation.
    document.addEventListener("click", interaction, true);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      mounted.current = false;
      document.removeEventListener("click", interaction, true);
      document.removeEventListener("visibilitychange", visibility);
      pausePlayback();
      const player = music.current;
      music.current = null;
      if (player) {
        player.removeAttribute("src");
        player.load();
      }
      mediaSource.current?.disconnect();
      musicGain.current?.disconnect();
      mediaSource.current = null;
      musicGain.current = null;
      const ctx = context.current;
      context.current = null;
      void ctx?.close().catch(() => {});
    };
  }, [pausePlayback, startPlayback, sound]);
  const toggle = () => {
    const next = error ? true : !enabledRef.current;
    enabledRef.current = next;
    setEnabled(next);
    try {
      sessionStorage.setItem(preferenceKey, next ? "enabled" : "muted");
    } catch {
      /* Keep preference in memory. */
    }
    if (!next) {
      setError("");
      pausePlayback();
      return;
    }
    activatedRef.current = true;
    setActivated(true);
    try {
      sessionStorage.setItem("romjan-visit-music-activated", "true");
    } catch {
      /* Keep in memory. */
    }
    startPlayback();
  };
  return (
    <AudioState.Provider value={{ enabled, activated, error, toggle, sound }}>
      {children}
    </AudioState.Provider>
  );
}
export function MusicControl({ className = "" }: { className?: string }) {
  const { enabled, activated, error, toggle } = useMagicAudio();
  return (
    <button
      className={`icon-button ${className}`}
      onClick={toggle}
      aria-label={error ? "Retry music" : enabled ? "Mute music" : "Play music"}
      aria-pressed={enabled}
      title={
        error ||
        (enabled && !activated
          ? "Music starts when you open the invitation"
          : enabled
            ? "Music and magical sounds on"
            : "Music and magical sounds off")
      }
    >
      {enabled ? <Music2 size={19} /> : <VolumeX size={19} />}
      {error && (
        <span className="sr-only" role="status">
          {error}
        </span>
      )}
    </button>
  );
}
