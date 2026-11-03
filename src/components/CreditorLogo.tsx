import React from "react";

interface CreditorLogoProps {
  creditor: string;
  size?: "sm" | "md" | "lg";
}

export function CreditorLogo({ creditor, size = "md" }: CreditorLogoProps) {
  const norm = creditor.toLowerCase();

  const sizeClasses = {
    sm: "w-9 h-9 text-xs rounded-xl",
    md: "w-11 h-11 text-xs rounded-xl",
    lg: "w-12 h-12 text-sm rounded-xl",
  }[size];

  if (norm.includes("itaú") || norm.includes("itau")) {
    return (
      <div
        className={`${sizeClasses} bg-[#EC7000] flex items-center justify-center font-bold text-white shrink-0 select-none`}
      >
        <span className="bg-[#003399] px-1.5 py-0.5 rounded text-[10px] font-extrabold text-[#FFD700] leading-none">
          Itaú
        </span>
      </div>
    );
  }

  if (norm.includes("santander")) {
    return (
      <div
        className={`${sizeClasses} bg-[#EC0000] flex items-center justify-center font-bold text-white shrink-0 select-none`}
      >
        <i className="bi bi-fire text-lg leading-none" />
      </div>
    );
  }

  if (norm.includes("vivo")) {
    return (
      <div
        className={`${sizeClasses} bg-[#660099] flex items-center justify-center font-bold text-white shrink-0 select-none`}
      >
        <span className="text-[11px] font-bold lowercase tracking-tight">vivo</span>
      </div>
    );
  }

  if (norm.includes("renner")) {
    return (
      <div
        className={`${sizeClasses} bg-[#D3121A] flex items-center justify-center font-bold text-white shrink-0 select-none`}
      >
        <span className="text-[10px] font-bold uppercase">Renner</span>
      </div>
    );
  }

  if (norm.includes("riachuelo")) {
    return (
      <div
        className={`${sizeClasses} bg-[#111827] flex items-center justify-center font-bold text-white shrink-0 select-none`}
      >
        <span className="text-[9px] font-bold uppercase">RCHLO</span>
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses} bg-[var(--primary)] flex items-center justify-center font-bold text-white shrink-0 select-none`}
    >
      <i className="bi bi-bank text-base leading-none" />
    </div>
  );
}
