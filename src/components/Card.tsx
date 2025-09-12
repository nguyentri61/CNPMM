import type React from "react";

interface Props {
  image?: string;
  title: string;
  subtitle?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function Card({
  image,
  title,
  subtitle,
  children,
  className = "",
}: Props) {
  return (
    <div className={`border rounded p-3 ${className}`}>
      {image && (
        <img
          src={image}
          alt={title}
          className="w-full h-40 object-cover rounded mb-2"
        />
      )}
      <h4 className="font-medium">{title}</h4>
      {subtitle && <div className="text-sm text-gray-600">{subtitle}</div>}
      <div className="mt-2">{children}</div>
    </div>
  );
}
