import React from "react";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * Logo ACREDTA. Paleta oficial: #021C39 (navy), #01C583 (verde), #E6EAF7 (gelo).
 */
export function BrandLogo({ size = "md", className = "" }: BrandLogoProps) {
  const box = {
    sm: "w-6 h-6 rounded-lg text-sm",
    md: "w-8 h-8 rounded-xl text-lg",
    lg: "w-10 h-10 rounded-xl text-xl",
  }[size];

  const text = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
  }[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div
        className={`${box} bg-[var(--primary)] text-[var(--accent)] flex items-center justify-center shrink-0`}
      >
        <i className="bi bi-check-lg leading-none" />
      </div>
      <span className={`${text} font-extrabold tracking-tight text-[var(--primary)]`}>
        ACRED<span className="text-[var(--accent)]">TA</span>
      </span>
    </div>
  );
}
