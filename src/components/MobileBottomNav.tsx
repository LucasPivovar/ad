"use client";

import React from "react";
import { useApp } from "@/context/AppContext";

export function MobileBottomNav() {
  const { activeTab, setActiveTab, setNegotiateStep, setScreenFlow } = useApp();

  const items = [
    { id: "inicio", label: "Início", icon: "bi-house-door" },
    { id: "meus-acordos", label: "Acordos", icon: "bi-file-earmark-check" },
    { id: "pagamentos", label: "Pagamentos", icon: "bi-credit-card" },
    { id: "perfil", label: "Perfil", icon: "bi-person" },
    { id: "suporte", label: "Suporte", icon: "bi-headset" },
  ] as const;

  const handleSelect = (id: typeof items[number]["id"]) => {
    setScreenFlow("portal");
    setNegotiateStep("none");
    setActiveTab(id);
  };

  return (
    <nav className="bg-[var(--bg-surface)] border-t border-[var(--border-color)] px-2 py-1.5 flex items-center justify-around shrink-0 z-40 select-none pb-[calc(env(safe-area-inset-bottom,0px)+0.35rem)]">
      {items.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => handleSelect(item.id)}
            className={`flex flex-col items-center justify-center flex-1 py-1.5 rounded-xl transition-colors ${
              isActive
                ? "bg-[var(--primary)] text-white font-semibold"
                : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
            }`}
          >
            <i
              className={`bi ${item.icon} text-base leading-none ${
                isActive ? "text-[var(--accent)]" : ""
              }`}
            />
            <span className="text-[11px] mt-1 leading-none">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
