"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { EmptyStateView } from "./EmptyStateView";
import { formatCurrency } from "@/utils/format";

interface PaymentsViewProps {
  onOpenPaymentModal: (agreementId: string, directMethod?: "pix" | "boleto") => void;
}

export function PaymentsView({ onOpenPaymentModal }: PaymentsViewProps) {
  const { agreements, receipts } = useApp();
  const [subTab, setSubTab] = useState<"pagar" | "historico" | "comprovantes">("pagar");

  if (agreements.length === 0) {
    return <EmptyStateView />;
  }

  const firstPending = agreements[0];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-[var(--text-main)]">Pagamentos</h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
          Pague suas parcelas, acompanhe o histórico e baixe comprovantes.
        </p>
      </div>

      {/* 3 Pill Tabs (Exact match to Image 3) */}
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          onClick={() => setSubTab("pagar")}
          className={`px-4 h-10 rounded-full text-xs font-semibold flex items-center gap-2 transition-colors ${
            subTab === "pagar"
              ? "bg-[var(--primary)] text-white"
              : "bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:text-[var(--text-main)]"
          }`}
        >
          <i className="bi bi-tag" />
          <span>Pagar parcela</span>
        </button>

        <button
          onClick={() => setSubTab("historico")}
          className={`px-4 h-10 rounded-full text-xs font-semibold flex items-center gap-2 transition-colors ${
            subTab === "historico"
              ? "bg-[var(--primary)] text-white"
              : "bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:text-[var(--text-main)]"
          }`}
        >
          <i className="bi bi-clock-history" />
          <span>Histórico de pagamentos</span>
        </button>

        <button
          onClick={() => setSubTab("comprovantes")}
          className={`px-4 h-10 rounded-full text-xs font-semibold flex items-center gap-2 transition-colors ${
            subTab === "comprovantes"
              ? "bg-[var(--primary)] text-white"
              : "bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-color)] hover:text-[var(--text-main)]"
          }`}
        >
          <i className="bi bi-receipt" />
          <span>Comprovantes</span>
        </button>
      </div>

      {/* TAB 1: PAGAR PARCELA (Exact match to Image 3) */}
      {subTab === "pagar" && (
        <div className="space-y-4 page-enter">
          <div className="card-surface p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-sm font-bold text-[var(--text-main)] block">
                Parcela em aberto ({firstPending.creditor})
              </span>
              <span className="text-3xl font-bold text-[var(--text-main)] num-tabular block mt-1.5">
                {formatCurrency(firstPending.installmentValue)}
              </span>
              <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] mt-2">
                <i className="bi bi-calendar3 text-[var(--primary)]" />
                <span className="num-tabular">Vencimento: {firstPending.nextDueDate}</span>
              </div>
            </div>

            <div className="w-full md:w-64 space-y-2.5">
              <button
                onClick={() => onOpenPaymentModal(firstPending.id, "pix")}
                className="btn-primary w-full h-11 text-xs flex items-center justify-center gap-2"
              >
                <i className="bi bi-qr-code" />
                <span>Pagar com Pix</span>
              </button>

              <button
                onClick={() => onOpenPaymentModal(firstPending.id, "boleto")}
                className="btn-secondary w-full h-11 text-xs flex items-center justify-center gap-2"
              >
                <i className="bi bi-upc-scan" />
                <span>Gerar Boleto</span>
              </button>
            </div>
          </div>

          {/* 2ª Via Talão Concessionária (Sanepar / Copel) conforme Áudio 2 */}
          <div className="card-surface p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--bg-subtle)]">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center shrink-0">
                <i className="bi bi-droplet text-lg" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[var(--text-main)]">
                  2ª Via via Talão Concessionária (Sanepar / Copel)
                </h4>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5 leading-relaxed">
                  Para evitar inadimplência, suas parcelas podem ser cobradas diretamente na fatura da Sanepar ou da Copel.
                </p>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[var(--primary-soft)] text-[var(--primary)] border border-[var(--primary-border)] shrink-0 self-start sm:self-center">
              Matrícula 8492019-2
            </span>
          </div>
        </div>
      )}

      {/* TAB 2: HISTÓRICO DE PAGAMENTOS */}
      {subTab === "historico" && (
        <div className="card-surface overflow-hidden page-enter">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--bg-subtle)] border-b border-[var(--border-color)] text-[var(--text-secondary)] font-semibold">
                <tr>
                  <th className="px-5 py-3.5">Credor</th>
                  <th className="px-5 py-3.5">Parcela</th>
                  <th className="px-5 py-3.5">Data</th>
                  <th className="px-5 py-3.5">Valor</th>
                  <th className="px-5 py-3.5">Forma</th>
                  <th className="px-5 py-3.5 text-right">Situação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {receipts.map((rec) => (
                  <tr key={rec.id} className="row-hover transition-colors">
                    <td className="px-5 py-3.5 font-bold text-[var(--text-main)]">
                      {rec.creditor}
                    </td>
                    <td className="px-5 py-3.5 text-[var(--text-secondary)] num-tabular">
                      {rec.installment}/{rec.totalInstallments}
                    </td>
                    <td className="px-5 py-3.5 text-[var(--text-secondary)] num-tabular">
                      {rec.paidAt}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-[var(--text-main)] num-tabular">
                      {formatCurrency(rec.amount)}
                    </td>
                    <td className="px-5 py-3.5 text-[var(--text-secondary)]">{rec.method}</td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[var(--success-soft)] text-[var(--success)] border border-[var(--success-border)]">
                        Pago
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: COMPROVANTES */}
      {subTab === "comprovantes" && (
        <div className="space-y-3 stagger">
          {receipts.map((rec) => (
            <div
              key={rec.id}
              className="card-surface p-4 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center">
                  <i className="bi bi-file-earmark-check text-lg" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[var(--text-main)]">
                    Comprovante Parcela {rec.installment}/{rec.totalInstallments} — {rec.creditor}
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)] num-tabular mt-0.5">
                    Autenticação: {rec.authCode} • Pago em {rec.paidAt}
                  </p>
                </div>
              </div>

              <button
                onClick={() => alert(`Comprovante baixado: ${rec.authCode}.pdf`)}
                className="btn-secondary px-3 py-1.5 text-xs flex items-center gap-1.5"
              >
                <i className="bi bi-download text-[var(--primary)]" />
                <span>Baixar</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

