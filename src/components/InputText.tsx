import React from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function InputText({ label, className = "", ...rest }: Props) {
  return (
    <label className="flex flex-col">
      {label && <span className="mb-1 text-sm">{label}</span>}
      <input className={`border px-2 py-1 rounded ${className}`} {...rest} />
    </label>
  );
}
