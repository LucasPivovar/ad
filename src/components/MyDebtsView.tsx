"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { CreditorLogo } from "./CreditorLogo";
import { formatCurrency } from "@/utils/format";

interface MyDebtsViewProps {
  onOpenPaymentModal: (agreementId: string) => void;
}

export function MyDebtsView({ onOpenPaymentModal }: MyDebtsViewProps) {
  const { availableDebts, agreements, setNegotiateStep, setActiveTab } = useApp();

  const totalDebts = 12480.0;
  const discountsObtained = 6720.0;
  const activeCount = agreements.length;
  const firstActive = agreements[0];

  return (
    <div className="space-y-5 page-enter">
      {/* Top Banner (Exact match to Image 5) */}
      <div className="rounded-[var(--radius-card)] bg-[var(--primary)] text-white p-6 sm:p-7 relative overflow-hidden shadow-xs">
        <div className="max-w-xl relative z-10 space-y-2.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[var(--accent)] text-xs font-bold border border-white/15">
            <i className="bi bi-tag" />
            Condições especiais de quitação
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
            Regularize suas dívidas
          </h2>
          <p className="text-xs sm:text-sm text-[var(--bg-muted)] leading-relaxed">
            Negocie com condições especiais e descontos de até 90%, com parcelas que cabem no seu bolso via Pix ou Talão Concessionária.
          </p>
          <div className="pt-1">
            <button
              onClick={() => setNegotiateStep("available_debts")}
              className="btn-primary px-5 h-10 text-xs flex items-center gap-2"
            >
              <span>Ver minhas dívidas</span>
              <i className="bi bi-arrow-right" />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Metrics Cards (Exact match to Image 5) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 stagger">
        <div className="card-surface p-4">
          <div className="flex items-center gap-2 text-[var(--text-secondary)] text-xs mb-1">
            <i className="bi bi-layers text-[var(--primary)] text-base" />
            <span>Total de dívidas</span>
          </div>
          <span className="text-xl sm:text-2xl font-extrabold text-[var(--text-main)] num-tabular">
            {formatCurrency(totalDebts)}
          </span>
        </div>

        <div className="card-surface p-4">
          <div className="flex items-center gap-2 text-[var(--text-secondary)] text-xs mb-1">
            <i className="bi bi-percent text-[var(--accent)] text-base" />
            <span>Descontos obtidos</span>
          </div>
          <span className="text-xl sm:text-2xl font-extrabold text-[var(--success)] num-tabular">
            {formatCurrency(discountsObtained)}
          </span>
        </div>

        <div className="card-surface p-4">
          <div className="flex items-center gap-2 text-[var(--text-secondary)] text-xs mb-1">
            <i className="bi bi-file-earmark-check text-[var(--primary)] text-base" />
            <span>Acordos ativos</span>
          </div>
          <span className="text-xl sm:text-2xl font-extrabold text-[var(--text-main)] num-tabular">
            {activeCount}
          </span>
        </div>

        <div className="card-surface p-4">
          <div className="flex items-center gap-2 text-[var(--text-secondary)] text-xs mb-1">
            <i className="bi bi-credit-card text-[var(--primary)] text-base" />
            <span>Próxima parcela</span>
          </div>
          <span className="text-xl sm:text-2xl font-extrabold text-[var(--text-main)] num-tabular">
            {firstActive ? formatCurrency(firstActive.installmentValue) : "R$ 0,00"}
          </span>
          <span className="text-[10px] text-[var(--text-muted)] block mt-0.5 num-tabular">
            {firstActive ? `Vence em ${firstActive.nextDueDate}` : "Nenhum débito"}
          </span>
        </div>
      </div>

      {/* Main Row: Dívidas List (Left) + Meu Acordo Atual (Right) - Image 5 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Lista Minhas Dívidas */}
        <div className="lg:col-span-8 card-surface p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[var(--text-main)]">Minhas Dívidas</h3>
            <button
              onClick={() => setNegotiateStep("available_debts")}
              className="text-xs font-semibold text-[var(--primary)] hover:underline flex items-center gap-1"
            >
              <span>Ver todas</span>
              <i className="bi bi-arrow-right text-xs" />
            </button>
          </div>

          <div className="divide-y divide-[var(--border-color)]">
            {availableDebts.map((debt) => {
              const hasAgreement = agreements.some(
                (a) => a.creditor.toLowerCase() === debt.creditor.toLowerCase()
              );
              return (
                <div
                  key={debt.id}
                  onClick={() => {
                    if (!hasAgreement) {
                      setNegotiateStep("proposal");
                    } else {
                      setActiveTab("meus-acordos");
                    }
                  }}
                  className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 cursor-pointer row-hover -mx-2 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <CreditorLogo creditor={debt.creditor} size="md" />
                    <div>
                      <p className="text-sm font-bold text-[var(--text-main)]">{debt.creditor}</p>
                      <p className="text-xs text-[var(--text-muted)] num-tabular">
                        Contrato: {debt.contractMasked}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-xs sm:text-sm font-bold text-[var(--text-main)] num-tabular">
                      {formatCurrency(debt.originalAmount)}
                    </span>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        hasAgreement
                          ? "bg-[var(--success-soft)] text-[var(--success)] border border-[var(--success-border)]"
                          : "bg-[var(--warning-soft)] text-[var(--warning)] border border-[var(--warning-border)]"
                      }`}
                    >
                      {hasAgreement ? "Em acordo" : "Pendente"}
                    </span>

                    <i className="bi bi-chevron-right row-chevron text-xs text-[var(--text-muted)]" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Meu Acordo Atual (Image 5) */}
        {firstActive && (
          <div className="lg:col-span-4 card-surface p-5 space-y-4">
            <h3 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
              <i className="bi bi-file-earmark-text text-[var(--primary)]" />
              <span>Meu acordo atual</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-[var(--border-color)]">
                <span className="text-[var(--text-secondary)]">Valor original:</span>
                <span className="font-medium text-[var(--text-muted)] line-through num-tabular">
                  {formatCurrency(firstActive.originalAmount)}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-[var(--border-color)]">
                <span className="text-[var(--text-secondary)]">Valor do acordo:</span>
                <span className="font-bold text-[var(--text-main)] num-tabular">
                  {formatCurrency(firstActive.settlementAmount)}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-[var(--border-color)]">
                <span className="text-[var(--text-secondary)]">Parcelas:</span>
                <span className="font-bold text-[var(--text-main)] num-tabular">
                  {firstActive.installments}x de {formatCurrency(firstActive.installmentValue)}
                </span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-[var(--text-secondary)]">Próximo vencimento:</span>
                <span className="font-bold text-[var(--primary)] num-tabular">
                  {firstActive.nextDueDate}
                </span>
              </div>
            </div>

            <button
              onClick={() => onOpenPaymentModal(firstActive.id)}
              className="btn-primary w-full h-11 text-xs flex items-center justify-center gap-2 shadow-xs"
            >
              <i className="bi bi-credit-card" />
              <span>Pagar parcela</span>
            </button>
          </div>
        )}
      </div>

      {/* Bottom 4 Shortcuts (Exact match to Image 5) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 stagger">
        <button
          onClick={() => setNegotiateStep("proposal")}
          className="card-surface card-interactive p-4 text-left flex items-center gap-3"
        >
          <div className="icon-chip w-10 h-10 rounded-xl bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center shrink-0">
            <i className="bi bi-calculator text-lg" />
          </div>
          <div>
            <span className="text-xs font-bold text-[var(--text-main)] block">Simular acordo</span>
            <span className="text-[11px] text-[var(--text-secondary)]">Veja quanto pode economizar</span>
          </div>
        </button>

        <button
          onClick={() => setNegotiateStep("available_debts")}
          className="card-surface card-interactive p-4 text-left flex items-center gap-3"
        >
          <div className="icon-chip w-10 h-10 rounded-xl bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center shrink-0">
            <i className="bi bi-tag text-lg" />
          </div>
          <div>
            <span className="text-xs font-bold text-[var(--text-main)] block">Minhas propostas</span>
            <span className="text-[11px] text-[var(--text-secondary)]">Condições disponíveis</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab("pagamentos")}
          className="card-surface card-interactive p-4 text-left flex items-center gap-3"
        >
          <div className="icon-chip w-10 h-10 rounded-xl bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center shrink-0">
            <i className="bi bi-clock-history text-lg" />
          </div>
          <div>
            <span className="text-xs font-bold text-[var(--text-main)] block">Histórico</span>
            <span className="text-[11px] text-[var(--text-secondary)]">Acompanhe pagamentos</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab("suporte")}
          className="card-surface card-interactive p-4 text-left flex items-center gap-3"
        >
          <div className="icon-chip w-10 h-10 rounded-xl bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center shrink-0">
            <i className="bi bi-headset text-lg" />
          </div>
          <div>
            <span className="text-xs font-bold text-[var(--text-main)] block">Central de ajuda</span>
            <span className="text-[11px] text-[var(--text-secondary)]">Tire suas dúvidas</span>
          </div>
        </button>
      </div>
    </div>
  );
}
