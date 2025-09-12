import type React from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-40" onClick={onClose} />
      <div className="bg-white rounded p-4 z-10 w-full max-w-md">
        {title && <h3 className="text-lg mb-2">{title}</h3>}
        <div>{children}</div>
      </div>
    </div>
  );
}
