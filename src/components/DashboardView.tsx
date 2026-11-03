"use client";

import React, { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import { CreditorLogo } from "./CreditorLogo";
import { EmptyStateView } from "./EmptyStateView";
import { NegotiateModals } from "./NegotiateModals";
import { formatCurrency } from "@/utils/format";

interface DashboardViewProps {
  onOpenPaymentModal: (agreementId: string) => void;
}

export function DashboardView({ onOpenPaymentModal }: DashboardViewProps) {
  const { agreements, setActiveTab, negotiateStep, setNegotiateStep } = useApp();
  const [ringReady, setRingReady] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setRingReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (negotiateStep !== "none") {
    return (<div key={negotiateStep} className="page-enter"><NegotiateModals /></div>);
  }

  if (agreements.length === 0) {
    return <EmptyStateView />;
  }

  const totalAgreed = 5760.0;
  const totalPaid = 1440.0;
  const totalRemaining = 4320.0;
  const progressPercent = 25;

  const firstActive = agreements[0];

  return (
    <div className="space-y-5 page-enter">
      {/* Top Banner (Exact match to Image 4) */}
      <div className="rounded-[var(--radius-card)] bg-[var(--primary)] text-white p-5 sm:p-6 relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1.5 max-w-lg relative z-10">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-[var(--accent)] text-[11px] font-bold border border-white/15">
            <i className="bi bi-shield-check" />
            Portal Oficial de Acordos
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Seus acordos em um só lugar.
          </h2>
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
            Acompanhe, pague e mantenha suas contas em dia de forma simples, com 1ª via digital ou talão de concessionária.
          </p>
        </div>

        <div className="hidden md:flex items-center justify-center shrink-0 pr-2">
          <div className="w-16 h-24 rounded-2xl bg-white/10 border-2 border-white/20 flex items-center justify-center shadow-inner relative transform rotate-6 hover:rotate-0 transition-transform">
            <div className="w-8 h-8 rounded-full bg-[var(--accent)] text-[var(--primary)] flex items-center justify-center shadow-sm">
              <i className="bi bi-check-lg text-lg font-bold" />
            </div>
          </div>
        </div>
      </div>

      {/* Top 3 Summary Cards (Exact match to Image 3) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 stagger">
        <div className="card-surface p-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center shrink-0">
            <i className="bi bi-file-earmark-check text-xl leading-none" />
          </div>
          <div>
            <span className="text-xs text-[var(--text-secondary)] block">Acordos ativos</span>
            <span className="text-xl font-bold text-[var(--text-main)] num-tabular">
              {agreements.length}
            </span>
          </div>
        </div>

        <div className="card-surface p-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center shrink-0">
            <i className="bi bi-layers text-xl leading-none" />
          </div>
          <div>
            <span className="text-xs text-[var(--text-secondary)] block">Total do acordo</span>
            <span className="text-xl font-bold text-[var(--text-main)] num-tabular">
              {formatCurrency(totalAgreed)}
            </span>
          </div>
        </div>

        <div className="card-surface p-4 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center shrink-0">
            <i className="bi bi-wallet2 text-xl leading-none" />
          </div>
          <div>
            <span className="text-xs text-[var(--text-secondary)] block">Saldo restante</span>
            <span className="text-xl font-bold text-[var(--text-main)] num-tabular">
              {formatCurrency(totalRemaining)}
            </span>
          </div>
        </div>
      </div>

      {/* Middle Row: Próxima Parcela (Blue Card) & Progresso do Acordo (White Card) - Exact match to Image 3 */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 stagger">
        {/* Left: Blue Card Próxima Parcela */}
        <div className="md:col-span-6 rounded-[var(--radius-card)] bg-[var(--primary)] text-white p-5 md:p-6 flex flex-col justify-between shadow-sm">
          <div>
            <span className="text-xs font-medium text-white/90 block">Próxima parcela</span>
            <span className="text-3xl font-bold num-tabular block mt-1">
              {formatCurrency(firstActive.installmentValue)}
            </span>
            <div className="flex items-center gap-2 text-xs text-white/90 mt-2">
              <i className="bi bi-calendar3" />
              <span className="num-tabular">Vencimento: {firstActive.nextDueDate}</span>
            </div>
          </div>

          <button
            onClick={() => onOpenPaymentModal(firstActive.id)}
            className="mt-5 w-full h-11 rounded-[var(--radius-btn)] bg-[var(--accent)] text-[var(--primary)] font-bold text-sm flex items-center justify-center gap-2 hover:bg-[var(--accent-hover)] transition-colors"
          >
            <i className="bi bi-credit-card" />
            <span>Pagar agora</span>
          </button>
        </div>

        {/* Right: White Card Progresso do Acordo */}
        <div className="md:col-span-6 card-surface p-5 md:p-6 flex flex-col justify-between">
          <h3 className="text-sm font-bold text-[var(--text-main)] mb-3">
            Progresso do acordo
          </h3>

          <div className="flex items-center gap-6 my-auto">
            {/* Circular Progress SVG */}
            <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="var(--border-color)"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="var(--primary)"
                  strokeWidth="10"
                  strokeDasharray="251.2"
                  className="ring-progress"
                  strokeDashoffset={ringReady ? 251.2 - (251.2 * progressPercent) / 100 : 251.2}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-xl font-bold text-[var(--text-main)] num-tabular leading-none">
                  {progressPercent}%
                </span>
                <span className="text-[11px] text-[var(--text-muted)] mt-0.5">pago</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-3 text-xs flex-1">
              <div className="flex items-start gap-2.5">
                <i className="bi bi-check-circle-fill text-[var(--success)] text-sm mt-0.5" />
                <div>
                  <span className="text-[var(--text-secondary)] block">Valor já pago</span>
                  <span className="text-sm font-bold text-[var(--text-main)] num-tabular">
                    {formatCurrency(totalPaid)}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <i className="bi bi-circle text-[var(--text-muted)] text-sm mt-0.5" />
                <div>
                  <span className="text-[var(--text-secondary)] block">Total do acordo</span>
                  <span className="text-sm font-bold text-[var(--text-main)] num-tabular">
                    {formatCurrency(totalAgreed)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section: Meus Acordos (Exact match to Image 4) */}
      <div className="card-surface p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-[var(--text-main)]">Meus Acordos</h3>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setNegotiateStep("link_code")}
              className="text-xs font-semibold text-[var(--primary)] hover:underline flex items-center gap-1"
            >
              <i className="bi bi-plus-circle" />
              <span>Vincular acordo</span>
            </button>
          </div>
        </div>

        <div className="divide-y divide-[var(--border-color)]">
          {agreements.map((agr) => (
            <div
              key={agr.id}
              onClick={() => setActiveTab("meus-acordos")}
              className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 cursor-pointer row-hover -mx-2 px-2 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <CreditorLogo creditor={agr.creditor} size="md" />
                <div>
                  <p className="text-sm font-bold text-[var(--text-main)]">{agr.creditor}</p>
                  <p className="text-xs text-[var(--text-muted)] num-tabular">
                    Acordo nº {agr.contractNumber}
                    {agr.paymentMethod !== "pix_boleto" && (
                      <span className="ml-2 text-[var(--primary)] font-medium">
                        • Via {agr.concessionaireAccount}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-xs sm:text-sm font-semibold text-[var(--text-main)] num-tabular">
                  {agr.installments}x de {formatCurrency(agr.installmentValue)}
                </span>

                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--success-soft)] text-[var(--success)] border border-[var(--success-border)]">
                  Em dia
                </span>

                <i className="bi bi-chevron-right row-chevron inline-block text-xs text-[var(--text-muted)]" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom 4 Quick Access Cards (Exact match to Image 4) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 stagger">
        <button
          onClick={() => setActiveTab("meus-acordos")}
          className="card-surface card-interactive p-4 text-center flex flex-col items-center"
        >
          <div className="icon-chip w-10 h-10 rounded-xl bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center mb-2">
            <i className="bi bi-file-earmark-check text-lg" />
          </div>
          <span className="text-xs font-bold text-[var(--text-main)]">Meus Acordos</span>
          <span className="text-[11px] text-[var(--text-secondary)] mt-0.5">Veja seus acordos</span>
        </button>

        <button
          onClick={() => setActiveTab("pagamentos")}
          className="card-surface card-interactive p-4 text-center flex flex-col items-center"
        >
          <div className="icon-chip w-10 h-10 rounded-xl bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center mb-2">
            <i className="bi bi-credit-card text-lg" />
          </div>
          <span className="text-xs font-bold text-[var(--text-main)]">Pagamentos</span>
          <span className="text-[11px] text-[var(--text-secondary)] mt-0.5">Pague suas parcelas</span>
        </button>

        <button
          onClick={() => setActiveTab("perfil")}
          className="card-surface card-interactive p-4 text-center flex flex-col items-center"
        >
          <div className="icon-chip w-10 h-10 rounded-xl bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center mb-2">
            <i className="bi bi-person text-lg" />
          </div>
          <span className="text-xs font-bold text-[var(--text-main)]">Meu Perfil</span>
          <span className="text-[11px] text-[var(--text-secondary)] mt-0.5">Atualize seus dados</span>
        </button>

        <button
          onClick={() => setActiveTab("suporte")}
          className="card-surface card-interactive p-4 text-center flex flex-col items-center"
        >
          <div className="icon-chip w-10 h-10 rounded-xl bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center mb-2">
            <i className="bi bi-headset text-lg" />
          </div>
          <span className="text-xs font-bold text-[var(--text-main)]">Ajuda e Suporte</span>
          <span className="text-[11px] text-[var(--text-secondary)] mt-0.5">Tire suas dúvidas</span>
        </button>
      </div>
    </div>
  );
}



