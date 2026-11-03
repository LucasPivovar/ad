"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { CreditorLogo } from "./CreditorLogo";
import { formatCurrency } from "@/utils/format";

export function MobileSimulatorModal() {
  const {
    mobilePreviewOpen,
    setMobilePreviewOpen,
    agreements,
    hasLinkedAgreements,
    setHasLinkedAgreements,
    setNegotiateStep,
  } = useApp();

  const [mobileTab, setMobileTab] = useState<"inicio" | "acordos" | "pagamentos" | "perfil" | "suporte">("inicio");
  const [copiedPix, setCopiedPix] = useState(false);

  if (!mobilePreviewOpen) return null;

  const firstActive = agreements[0];

  return (
    <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm">
      <div className="relative flex flex-col items-center">
        {/* Top Control Bar */}
        <div className="w-full max-w-[380px] mb-3 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] animate-pulse" />
            <span className="font-bold">Simulador Mobile Live (Imagem 4)</span>
          </div>
          <button
            onClick={() => setMobilePreviewOpen(false)}
            className="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-1"
          >
            <i className="bi bi-x-lg text-xs" />
            <span>Fechar</span>
          </button>
        </div>

        {/* iPhone 16 Frame */}
        <div className="w-[360px] h-[720px] rounded-[48px] bg-black p-3.5 shadow-2xl border-4 border-slate-700/80 relative flex flex-col overflow-hidden">
          {/* Dynamic Island */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-40 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-slate-900 ml-auto mr-2" />
          </div>

          {/* Screen Content */}
          <div className="w-full h-full rounded-[38px] bg-[var(--bg-app)] overflow-y-auto flex flex-col text-xs text-[var(--text-main)] select-none">
            {/* Mobile Status Bar */}
            <div className="pt-2.5 px-6 pb-1 flex items-center justify-between text-[11px] font-bold text-slate-800 shrink-0">
              <span>10:24</span>
              <div className="flex items-center gap-1.5 text-xs">
                <i className="bi bi-reception-4" />
                <i className="bi bi-wifi" />
                <i className="bi bi-battery-full text-sm" />
              </div>
            </div>

            {/* Mobile Header (ACREDTA + Notification) */}
            <div className="px-5 py-2.5 flex items-center justify-between border-b border-[var(--border-color)] bg-[var(--bg-surface)] shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[var(--primary)] text-[var(--accent)] flex items-center justify-center text-xs">
                  <i className="bi bi-check-lg" />
                </div>
                <span className="text-base font-extrabold tracking-tight text-[var(--primary)]">
                  ACRED<span className="text-[var(--accent)]">TA</span>
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-[var(--bg-subtle)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] relative">
                <i className="bi bi-bell text-xs" />
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--danger)] absolute top-2 right-2" />
              </div>
            </div>

            {/* Scrollable View Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* TAB: INÍCIO */}
              {mobileTab === "inicio" && (
                <div className="space-y-4 page-enter">
                  <div>
                    <h2 className="text-lg font-bold text-[var(--text-main)]">Olá, Lucas!</h2>
                    <p className="text-[11px] text-[var(--text-secondary)]">Acompanhe seus acordos e pagamentos.</p>
                  </div>

                  {!hasLinkedAgreements ? (
                    /* Empty State on Mobile */
                    <div className="card-surface p-6 text-center space-y-3">
                      <div className="w-16 h-16 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center mx-auto text-2xl">
                        <i className="bi bi-search" />
                      </div>
                      <h3 className="font-bold text-sm">Nenhum acordo ativo</h3>
                      <p className="text-[11px] text-[var(--text-secondary)]">
                        Você ainda não possui nenhum acordo vinculado ao seu CPF.
                      </p>
                      <button
                        onClick={() => {
                          setMobilePreviewOpen(false);
                          setNegotiateStep("link_code");
                        }}
                        className="btn-primary w-full h-10 text-xs font-bold"
                      >
                        Vincular um acordo
                      </button>
                    </div>
                  ) : (
                    /* Active Dashboard on Mobile (Exact match to Image 4 phone frame) */
                    <>
                      {/* 2 Top Metric Cards */}
                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="card-surface p-3 flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center shrink-0">
                            <i className="bi bi-file-earmark-check text-base" />
                          </div>
                          <div>
                            <span className="text-[10px] text-[var(--text-muted)] block">Acordos ativos</span>
                            <span className="text-sm font-bold text-[var(--text-main)] num-tabular">
                              {agreements.length}
                            </span>
                          </div>
                        </div>

                        <div className="card-surface p-3 flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center shrink-0">
                            <i className="bi bi-calendar3 text-base" />
                          </div>
                          <div>
                            <span className="text-[10px] text-[var(--text-muted)] block">Próxima parcela</span>
                            <span className="text-xs font-bold text-[var(--text-main)] num-tabular">
                              {firstActive ? formatCurrency(firstActive.installmentValue) : "R$ 0"}
                            </span>
                            <span className="text-[9px] text-[var(--text-muted)] block">10/11/2026</span>
                          </div>
                        </div>
                      </div>

                      {/* Meus Acordos List (Image 4) */}
                      <div className="card-surface p-3.5 space-y-2.5">
                        <span className="text-xs font-bold text-[var(--text-main)] block">Meus Acordos</span>

                        {agreements.map((a) => (
                          <div
                            key={a.id}
                            className="p-2.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2.5">
                              <CreditorLogo creditor={a.creditor} size="sm" />
                              <div>
                                <p className="font-bold text-xs">{a.creditor}</p>
                                <p className="text-[10px] text-[var(--text-muted)] num-tabular">
                                  {a.installments}x de {formatCurrency(a.installmentValue)}
                                </p>
                              </div>
                            </div>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[var(--success-soft)] text-[var(--success)]">
                              Em dia
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Quick Links List (Image 4 right column) */}
                      <div className="card-surface divide-y divide-[var(--border-color)] overflow-hidden">
                        <button
                          onClick={() => setMobileTab("pagamentos")}
                          className="w-full p-3 flex items-center justify-between text-left hover:bg-[var(--bg-subtle)] transition-colors"
                        >
                          <div className="flex items-center gap-2.5 text-xs font-medium">
                            <i className="bi bi-credit-card text-[var(--primary)]" />
                            <span>Pagamentos</span>
                          </div>
                          <i className="bi bi-chevron-right text-xs text-[var(--text-muted)]" />
                        </button>

                        <button
                          onClick={() => setMobileTab("perfil")}
                          className="w-full p-3 flex items-center justify-between text-left hover:bg-[var(--bg-subtle)] transition-colors"
                        >
                          <div className="flex items-center gap-2.5 text-xs font-medium">
                            <i className="bi bi-person text-[var(--primary)]" />
                            <span>Meu Perfil</span>
                          </div>
                          <i className="bi bi-chevron-right text-xs text-[var(--text-muted)]" />
                        </button>

                        <button
                          onClick={() => setMobileTab("suporte")}
                          className="w-full p-3 flex items-center justify-between text-left hover:bg-[var(--bg-subtle)] transition-colors"
                        >
                          <div className="flex items-center gap-2.5 text-xs font-medium">
                            <i className="bi bi-headset text-[var(--primary)]" />
                            <span>Ajuda e Suporte</span>
                          </div>
                          <i className="bi bi-chevron-right text-xs text-[var(--text-muted)]" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* TAB: PAGAMENTOS */}
              {mobileTab === "pagamentos" && (
                <div className="space-y-3 page-enter">
                  <h3 className="text-base font-bold text-[var(--text-main)]">Pagar Parcela</h3>
                  {firstActive ? (
                    <div className="card-surface p-4 space-y-3">
                      <div className="flex justify-between items-center pb-2 border-b border-[var(--border-color)]">
                        <span className="text-[11px] text-[var(--text-secondary)]">{firstActive.creditor}</span>
                        <span className="text-sm font-bold text-[var(--text-main)] num-tabular">
                          {formatCurrency(firstActive.installmentValue)}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={() => {
                            setCopiedPix(true);
                            setTimeout(() => setCopiedPix(false), 2000);
                          }}
                          className="btn-primary w-full h-10 text-xs flex items-center justify-center gap-1.5"
                        >
                          <i className="bi bi-qr-code" />
                          <span>{copiedPix ? "Pix Copiado!" : "Copiar Chave Pix"}</span>
                        </button>

                        <div className="p-2 rounded-lg bg-[var(--primary-soft)] border border-[var(--border-color)] text-[10px] text-[var(--text-secondary)] leading-tight">
                          <i className="bi bi-droplet-half text-[var(--accent)] mr-1" />
                          <span>Disponível também na fatura <strong>Sanepar / Copel</strong>.</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-[var(--text-muted)]">Nenhum acordo com parcela pendente.</p>
                  )}
                </div>
              )}

              {/* TAB: PERFIL */}
              {mobileTab === "perfil" && (
                <div className="space-y-3 page-enter">
                  <h3 className="text-base font-bold text-[var(--text-main)]">Meu Perfil</h3>
                  <div className="card-surface p-4 space-y-2 text-xs">
                    <p className="font-bold text-[var(--text-main)]">Lucas Wallysson Antunes Oliveira</p>
                    <p className="text-[var(--text-muted)] num-tabular">CPF: 123.456.789-09</p>
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[var(--success-soft)] text-[var(--success)]">
                      KYC Aprovado
                    </span>
                  </div>
                </div>
              )}

              {/* TAB: SUPORTE */}
              {mobileTab === "suporte" && (
                <div className="space-y-3 page-enter">
                  <h3 className="text-base font-bold text-[var(--text-main)]">Ajuda e Suporte</h3>
                  <div className="card-surface p-4 text-center space-y-2 text-xs">
                    <i className="bi bi-headset text-2xl text-[var(--primary)]" />
                    <p className="font-bold">Precisa de suporte?</p>
                    <p className="text-[11px] text-[var(--text-secondary)]">Atendimento humanizado das 08h às 19h.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Bottom Navigation Bar (Image 4) */}
            <div className="border-t border-[var(--border-color)] bg-[var(--bg-surface)] py-2 px-3 flex items-center justify-around shrink-0">
              <button
                onClick={() => setMobileTab("inicio")}
                className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold ${
                  mobileTab === "inicio" ? "text-[var(--primary)] font-bold" : "text-[var(--text-muted)]"
                }`}
              >
                <i className={`bi bi-house-door text-base ${mobileTab === "inicio" ? "text-[var(--accent)]" : ""}`} />
                <span>Início</span>
              </button>

              <button
                onClick={() => setMobileTab("pagamentos")}
                className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold ${
                  mobileTab === "pagamentos" ? "text-[var(--primary)] font-bold" : "text-[var(--text-muted)]"
                }`}
              >
                <i className="bi bi-credit-card text-base" />
                <span>Pagar</span>
              </button>

              <button
                onClick={() => setMobileTab("perfil")}
                className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold ${
                  mobileTab === "perfil" ? "text-[var(--primary)] font-bold" : "text-[var(--text-muted)]"
                }`}
              >
                <i className="bi bi-person text-base" />
                <span>Perfil</span>
              </button>

              <button
                onClick={() => setMobileTab("suporte")}
                className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold ${
                  mobileTab === "suporte" ? "text-[var(--primary)] font-bold" : "text-[var(--text-muted)]"
                }`}
              >
                <i className="bi bi-headset text-base" />
                <span>Suporte</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
