"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { CreditorLogo } from "./CreditorLogo";
import { EmptyStateView } from "./EmptyStateView";
import { formatCurrency } from "@/utils/format";

interface MyAgreementsViewProps {
  onOpenPaymentModal: (agreementId: string) => void;
}

export function MyAgreementsView({ onOpenPaymentModal }: MyAgreementsViewProps) {
  const { agreements, setNegotiateStep, setActiveTab } = useApp();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (agreements.length === 0) {
    return <EmptyStateView />;
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-main)]">Meus Acordos</h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
            Veja os detalhes dos seus acordos ativos.
          </p>
        </div>

        <button
          onClick={() => {
            setActiveTab("inicio");
            setNegotiateStep("link_code");
          }}
          className="btn-primary px-4 h-10 text-xs self-start sm:self-auto flex items-center gap-1.5"
        >
          <i className="bi bi-plus-lg" />
          <span>Vincular ou iniciar acordo</span>
        </button>
      </div>

      <div className="space-y-3 stagger">
        {agreements.map((agr) => {
          const isOpen = expandedId === agr.id;
          return (
            <div key={agr.id} className="card-surface overflow-hidden">
              {/* Row Header (Exact match to Image 3) */}
              <div
                onClick={() => setExpandedId(isOpen ? null : agr.id)}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer row-hover"
              >
                <div className="flex items-center gap-3.5">
                  <CreditorLogo creditor={agr.creditor} size="md" />
                  <div>
                    <p className="text-sm font-bold text-[var(--text-main)]">{agr.creditor}</p>
                    <p className="text-xs text-[var(--text-muted)] num-tabular">
                      Acordo nº {agr.contractNumber}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 sm:flex items-center gap-4 sm:gap-8 border-t sm:border-t-0 pt-3 sm:pt-0 border-[var(--border-color)]">
                  <div>
                    <span className="text-[11px] text-[var(--text-muted)] block">
                      Valor do acordo
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-[var(--text-main)] num-tabular">
                      {formatCurrency(agr.originalAmount)}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-[var(--text-muted)] block">Parcelas</span>
                    <span className="text-xs sm:text-sm font-bold text-[var(--text-main)] num-tabular">
                      {agr.installments}x de {formatCurrency(agr.installmentValue)}
                    </span>
                  </div>

                  <div className="flex items-center justify-end gap-3">
                    <div>
                      <span className="text-[11px] text-[var(--text-muted)] block">Situação</span>
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[var(--success-soft)] text-[var(--success)] border border-[var(--success-border)]">
                        Em dia
                      </span>
                    </div>
                    <i
                      className={`bi bi-chevron-${isOpen ? "down" : "right"} text-xs text-[var(--text-muted)]`}
                    />
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {isOpen && (
                <div className="expand-in p-4 sm:p-5 border-t border-[var(--border-color)] bg-[var(--bg-subtle)] space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
                      <span className="text-[11px] text-[var(--text-muted)] block">
                        Código do Contrato
                      </span>
                      <span className="font-bold text-[var(--text-main)] num-tabular mt-0.5 block">
                        {agr.id}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
                      <span className="text-[11px] text-[var(--text-muted)] block">
                        Via de Cobrança
                      </span>
                      <span className="font-bold text-[var(--text-main)] mt-0.5 flex items-center gap-1.5">
                        {agr.paymentMethod === "pix_boleto" ? (
                          <>
                            <i className="bi bi-qr-code text-[var(--primary)]" />
                            <span>1ª Via Digital (Pix e Boleto)</span>
                          </>
                        ) : (
                          <>
                            <i className="bi bi-receipt text-[var(--primary)]" />
                            <span>2ª Via Talão ({agr.concessionaireAccount})</span>
                          </>
                        )}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)]">
                      <span className="text-[11px] text-[var(--text-muted)] block">
                        Parcelas Quitadas
                      </span>
                      <span className="font-bold text-[var(--text-main)] num-tabular mt-0.5 block">
                        {agr.paidInstallments} de {agr.installments} pagas
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      onClick={() => onOpenPaymentModal(agr.id)}
                      className="btn-primary px-4 h-10 text-xs flex items-center gap-2"
                    >
                      <i className="bi bi-credit-card" />
                      <span>Pagar próxima parcela ({formatCurrency(agr.installmentValue)})</span>
                    </button>

                    <button
                      onClick={() => setActiveTab("pagamentos")}
                      className="btn-secondary px-4 h-10 text-xs flex items-center gap-2"
                    >
                      <i className="bi bi-clock-history" />
                      <span>Ver histórico e comprovantes</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

