import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { motion } from "motion/react";
import { MusicControl } from "../audio";
export function MagicDialog({
  title,
  children,
  onClose,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  className?: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = dialog.current!;
    el.showModal();
    return () => el.close();
  }, []);
  return (
    <dialog
      ref={dialog}
      className={`magic-dialog ${className}`}
      aria-label={title}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <MusicControl className="dialog-audio" />
      <button
        className="icon-button dialog-close"
        onClick={onClose}
        aria-label="Close"
      >
        <X size={20} />
      </button>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {children}
      </motion.div>
    </dialog>
  );
}
