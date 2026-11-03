"use client";

import React from "react";
import { useApp } from "@/context/AppContext";

export function Sidebar() {
  const {
    activeTab,
    setActiveTab,
    setNegotiateStep,
    hasLinkedAgreements,
    setHasLinkedAgreements,
    screenFlow,
    setScreenFlow,
    agreements,
  } = useApp();

  const navItems = [
    { id: "inicio", label: "Início", icon: "bi-house-door", badge: null },
    {
      id: "meus-acordos",
      label: "Meus Acordos",
      icon: "bi-file-earmark-check",
      badge: agreements.length > 0 ? `${agreements.length}` : null,
    },
    { id: "minhas-dividas", label: "Minhas Dívidas", icon: "bi-layers", badge: null },
    { id: "pagamentos", label: "Pagamentos", icon: "bi-credit-card", badge: null },
    { id: "perfil", label: "Meu Perfil", icon: "bi-person", badge: null },
    { id: "suporte", label: "Ajuda e Suporte", icon: "bi-headset", badge: null },
  ] as const;

  const handleNavClick = (tabId: typeof navItems[number]["id"]) => {
    setScreenFlow("portal");
    setNegotiateStep("none");
    setActiveTab(tabId);
  };

  return (
    <aside className="w-60 bg-[var(--bg-surface)] border-r border-[var(--border-color)] flex flex-col justify-between h-full shrink-0 select-none">
      {/* Top: Brand Logo ACREDTA & Main Nav */}
      <div>
        <div className="px-5 py-5 flex items-center gap-2.5 border-b border-[var(--border-subtle)]">
          <div className="w-8 h-8 rounded-xl bg-[var(--primary)] text-[var(--accent)] flex items-center justify-center shrink-0">
            <i className="bi bi-check-lg text-lg leading-none" />
          </div>
          <span className="text-lg font-extrabold tracking-tight text-[var(--primary)]">
            ACRED<span className="text-[var(--accent)]">TA</span>
          </span>
        </div>

        <nav className="px-3 mt-3 space-y-1">
          {navItems.map((item) => {
            const isActive = screenFlow === "portal" && activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-[var(--radius-btn)] text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-[var(--primary)] text-white font-bold"
                    : "text-[var(--text-secondary)] hover:bg-[var(--primary-soft)] hover:text-[var(--primary)]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <i
                    className={`bi ${item.icon} text-base leading-none ${
                      isActive ? "text-[var(--accent)]" : ""
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? "bg-[var(--accent)] text-[var(--primary)]"
                        : "bg-[var(--primary-soft)] text-[var(--primary)]"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom: Quick Flow Switcher & Security Box */}
      <div className="p-3.5 space-y-3">
        <div className="p-3 rounded-xl bg-[var(--primary-soft)] border border-[var(--border-color)] space-y-2">
          <span className="text-[11px] font-bold text-[var(--primary)] block">
            Alternar Fluxos (Demonstração)
          </span>

          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => {
                setScreenFlow("portal");
                setNegotiateStep("none");
                setHasLinkedAgreements(true);
              }}
              className={`px-2 py-1.5 rounded-lg text-[11px] font-semibold border transition-colors ${
                screenFlow === "portal" && hasLinkedAgreements
                  ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                  : "bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-color)]"
              }`}
            >
              Com Acordo
            </button>

            <button
              onClick={() => {
                setScreenFlow("portal");
                setNegotiateStep("none");
                setHasLinkedAgreements(false);
                setActiveTab("inicio");
              }}
              className={`px-2 py-1.5 rounded-lg text-[11px] font-semibold border transition-colors ${
                screenFlow === "portal" && !hasLinkedAgreements
                  ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                  : "bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-color)]"
              }`}
            >
              Sem Acordo
            </button>
          </div>

          <div className="grid grid-cols-3 gap-1">
            <button
              onClick={() => setScreenFlow("login")}
              className="px-2 py-1.5 rounded-lg text-[11px] font-medium bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:text-[var(--primary)]"
            >
              Login
            </button>
            <button
              onClick={() => setScreenFlow("register_start")}
              className="px-2 py-1.5 rounded-lg text-[11px] font-medium bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:text-[var(--primary)]"
            >
              Cadastro
            </button>
            <button
              onClick={() => setScreenFlow("admin")}
              className="px-2 py-1.5 rounded-lg text-[11px] font-bold bg-[var(--accent)] text-[var(--primary)] border border-[var(--accent)]"
            >
              Admin
            </button>
          </div>
        </div>

        {/* Security Card */}
        <div className="p-3.5 rounded-xl bg-[var(--primary-soft)] border border-[var(--border-color)] flex items-start gap-2.5">
          <i className="bi bi-shield-check text-base text-[var(--accent)] mt-0.5 shrink-0" />
          <p className="text-xs text-[var(--text-secondary)] leading-snug">
            Seus acordos com segurança, praticidade e transparência.
          </p>
        </div>
      </div>
    </aside>
  );
}
