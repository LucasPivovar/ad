"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { BrandLogo } from "./BrandLogo";

export function Header() {
  const {
    user,
    hasLinkedAgreements,
    setHasLinkedAgreements,
    setScreenFlow,
    setNegotiateStep,
    setActiveTab,
  } = useApp();

  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const firstName = user.name.split(" ")[0];

  return (
    <header className="bg-[var(--bg-surface)] border-b border-[var(--border-color)] px-4 md:px-8 py-3.5 flex items-center justify-between shrink-0">
      {/* Left: Mobile Logo + Greeting */}
      <div className="flex flex-col">
        {/* Mobile Brand Bar */}
        <BrandLogo size="sm" className="mb-1.5 md:hidden" />

        <h1 className="text-base md:text-lg font-bold text-[var(--text-main)] tracking-tight">
          Olá, {firstName}!
        </h1>
        <p className="text-xs text-[var(--text-secondary)]">
          Acompanhe seus acordos e mantenha seus pagamentos em dia.
        </p>
      </div>

      {/* Right: Notification Bell & User Profile Menu */}
      <div className="flex items-center gap-2.5 md:gap-3 relative">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setNotifOpen(!notifOpen);
              setMenuOpen(false);
            }}
            className="w-9 h-9 rounded-full border border-[var(--border-color)] bg-[var(--bg-surface)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--bg-subtle)] transition-colors relative"
            aria-label="Notificações"
          >
            <i className="bi bi-bell text-sm leading-none" />
            <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-[var(--danger)]" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-72 card-surface dropdown-pop p-3.5 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--border-color)]">
                <span className="text-xs font-bold text-[var(--text-main)]">Notificações</span>
                <button
                  onClick={() => setNotifOpen(false)}
                  className="text-[11px] text-[var(--primary)] font-medium"
                >
                  Fechar
                </button>
              </div>
              <div className="py-2.5 space-y-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-[var(--primary-soft)] border border-[var(--primary-border)]">
                  <p className="font-semibold text-[var(--text-main)]">Parcela próxima do vencimento</p>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                    Parcela de R$ 120,00 vence em 10/11/2026.
                  </p>
                </div>
                <div className="p-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)]">
                  <p className="font-semibold text-[var(--text-main)]">Talão Concessionária Ativo</p>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                    Vinculação com conta Sanepar confirmada.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Button */}
        <div className="relative">
          <button
            onClick={() => {
              setMenuOpen(!menuOpen);
              setNotifOpen(false);
            }}
            className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full border border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)] transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-[var(--primary)] text-white font-bold text-xs flex items-center justify-center">
              {firstName.charAt(0)}
            </div>
            <span className="text-xs font-semibold text-[var(--text-main)] hidden sm:inline">
              Lucas Wallysson
            </span>
            <i className="bi bi-chevron-down text-[11px] text-[var(--text-muted)]" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-56 card-surface dropdown-pop p-1.5 z-50 text-xs">
              <div className="px-3 py-2 border-b border-[var(--border-color)] mb-1">
                <p className="font-bold text-[var(--text-main)] truncate">{user.name}</p>
                <p className="text-[11px] text-[var(--text-muted)] num-tabular">CPF: {user.cpf}</p>
              </div>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  setActiveTab("perfil");
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-main)] flex items-center gap-2"
              >
                <i className="bi bi-person text-sm text-[var(--primary)]" />
                <span>Meu Perfil</span>
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  setNegotiateStep("none");
                  setHasLinkedAgreements(!hasLinkedAgreements);
                  setActiveTab("inicio");
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-main)] flex items-center gap-2"
              >
                <i className="bi bi-arrow-repeat text-sm text-[var(--primary)]" />
                <span>{hasLinkedAgreements ? "Simular Sem Acordo" : "Simular Com Acordo"}</span>
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  setScreenFlow("register_start");
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-main)] flex items-center gap-2"
              >
                <i className="bi bi-person-plus text-sm text-[var(--primary)]" />
                <span>Fluxo de Cadastro (KYC)</span>
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  setScreenFlow("admin");
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-main)] flex items-center gap-2"
              >
                <i className="bi bi-sliders text-sm text-[var(--primary)]" />
                <span>Painel Admin (Mesa)</span>
              </button>

              <div className="my-1 border-t border-[var(--border-color)]" />

              <button
                onClick={() => {
                  setMenuOpen(false);
                  setScreenFlow("login");
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-[var(--danger)] hover:bg-[var(--danger-soft)] flex items-center gap-2"
              >
                <i className="bi bi-box-arrow-right text-sm" />
                <span>Sair / Tela de Login</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

