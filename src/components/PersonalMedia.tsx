import { useState } from "react";
import { personalMedia, birthday } from "../config";
export function PersonalMedia() {
  const [failed, setFailed] = useState({
    photo: false,
    voice: false,
    video: false,
  });
  return (
    <div className="personal-media">
      {personalMedia.photo && !failed.photo && (
        <img
          src={personalMedia.photo}
          alt={`A birthday memory with ${birthday.name}`}
          loading="lazy"
          decoding="async"
          style={{ objectPosition: personalMedia.photoPosition ?? "50% 25%" }}
          onError={() => setFailed((s) => ({ ...s, photo: true }))}
        />
      )}
      {personalMedia.voice && !failed.voice && (
        <div>
          <p>A birthday message, just for you</p>
          <audio
            controls
            preload="none"
            src={personalMedia.voice}
            onError={() => setFailed((s) => ({ ...s, voice: true }))}
          />
        </div>
      )}
      {personalMedia.video && !failed.video && (
        <video
          controls
          playsInline
          preload="metadata"
          src={personalMedia.video}
          aria-label="Your birthday video"
          onError={() => setFailed((s) => ({ ...s, video: true }))}
        />
      )}
    </div>
  );
}
