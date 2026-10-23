import { ArrowRight } from "lucide-react";
export function MagicalButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button className="magic-button" onClick={onClick}>
      {children}
      <ArrowRight size={17} />
    </button>
  );
}
