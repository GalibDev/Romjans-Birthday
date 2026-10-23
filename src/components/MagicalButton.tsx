import { ArrowRight } from "lucide-react";
import type { Sound } from "../audio";
export function MagicalButton({
  children,
  onClick,
  sound = "chime",
}: {
  children: React.ReactNode;
  onClick: () => void;
  sound?: Sound;
}) {
  return (
    <button className="magic-button" onClick={onClick} data-sound={sound}>
      {children}
      <ArrowRight size={17} />
    </button>
  );
}
