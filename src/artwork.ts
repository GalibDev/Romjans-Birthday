import { useEffect, useState } from "react";
export const artwork = {
  invitation: "/images/invitation-hd.webp",
  portal: "/images/portal-hd.webp",
};
const requests = new Map<string, Promise<boolean>>();
// One fetch/decode promise per URL, reused by prewarming and scene mounts.
function loadArtwork(
  url: string,
  priority: "high" | "low" = "high",
): Promise<boolean> {
  const existing = requests.get(url);
  if (existing) return existing;
  const request = new Promise<boolean>((resolve) => {
    const image = new Image();
    image.decoding = "async";
    image.fetchPriority = priority;
    let finished = false;
    const finish = (success: boolean) => {
      if (finished) return;
      finished = true;
      clearTimeout(timeout);
      image.onload = null;
      image.onerror = null;
      if (!success) requests.delete(url);
      resolve(success);
    };
    const timeout = setTimeout(() => finish(false), 15000);
    image.onload = () => {
      // Safari may reject decode() even though a cached image is paintable.
      if (typeof image.decode !== "function") {
        finish(image.naturalWidth > 0);
        return;
      }
      void image.decode().then(
        () => finish(true),
        () => finish(image.complete && image.naturalWidth > 0),
      );
    };
    image.onerror = () => finish(false);
    image.src = url;
  });
  requests.set(url, request);
  return request;
}
export function warmPortalArtwork() {
  // Let an in-flight invitation finish before spending bandwidth on the portal.
  void (requests.get(artwork.invitation) ?? Promise.resolve(true)).then(() =>
    loadArtwork(artwork.portal, "low"),
  );
}
export function useArtwork(url: string) {
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setStatus("loading");
    void loadArtwork(url).then((ok) => {
      if (active) setStatus(ok ? "ready" : "error");
    });
    return () => {
      active = false;
    };
  }, [url, attempt]);
  return { status, retry: () => setAttempt((n) => n + 1) };
}
