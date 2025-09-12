import React from "react";

type Variant = "primary" | "secondary" | "danger";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
}

const base = "px-3 py-2 rounded-md inline-flex items-center justify-center";

export default function Button({
  variant = "primary",
  loading,
  className = "",
  children,
  ...rest
}: ButtonProps) {
  const variantClass = {
    primary: "bg-blue-600 text-white",
    secondary: "bg-gray-200 text-black",
    danger: "bg-red-600 text-white",
  }[variant];

  return (
    <button className={`${base} ${variantClass} ${className}`} {...rest}>
      {loading ? "..." : children}
    </button>
  );
}
