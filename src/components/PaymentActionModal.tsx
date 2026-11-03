"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { formatCurrency } from "@/utils/format";

interface PaymentActionModalProps {
  agreementId: string | null;
  directMethod?: "pix" | "boleto";
  onClose: () => void;
}

export function PaymentActionModal({
  agreementId,
  directMethod = "pix",
  onClose,
}: PaymentActionModalProps) {
  const { agreements, payInstallment, user } = useApp();
  const [method, setMethod] = useState<"pix" | "boleto" | "talao">(directMethod);
  const [copied, setCopied] = useState(false);
  const [talaoProvider, setTalaoProvider] = useState<"sanepar" | "copel">("sanepar");

  const agr = agreements.find((a) => a.id === agreementId);
  if (!agreementId || !agr) return null;

  const isCopel =
    agr.paymentMethod === "talao_copel" ||
    (agr.concessionaireAccount && agr.concessionaireAccount.toLowerCase().includes("copel"));

  const activeProvider = isCopel ? "copel" : talaoProvider;

  const pixCode =
    "00020126580014br.gov.bcb.pix0136e9028471-2938-4102-9843-9182309182035204000053039865405120.005802BR5920ACREDTA FINANCEIRA6008CURITIBA62070503***6304E8A1";
  const boletoLine = "34191.79001 01043.510047 91020.150008 8 98210000012000";
  const talaoBarcode =
    activeProvider === "sanepar"
      ? "82650000002-1 16800002168-3 01102026110-4 84920192000-8"
      : "83670000002-5 16800002168-1 01102026110-9 99381205000-2";

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmPayment = () => {
    payInstallment(
      agr.id,
      method === "pix"
        ? "PIX"
        : method === "boleto"
        ? "BOLETO"
        : activeProvider === "sanepar"
        ? "TALÃO SANEPAR"
        : "TALÃO COPEL"
    );
    onClose();
  };

  return (
    <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="card-surface modal-panel w-full max-w-lg overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-subtle)] shrink-0">
          <div>
            <h3 className="text-sm font-bold text-[var(--text-main)]">Pagar Parcela</h3>
            <p className="text-xs text-[var(--text-muted)] num-tabular">
              {agr.creditor} • Contrato {agr.id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-surface)] transition-colors"
          >
            <i className="bi bi-x-lg text-sm" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Summary Banner */}
          <div className="p-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] flex items-center justify-between">
            <div>
              <span className="text-[11px] text-[var(--text-secondary)] block">
                Parcela {agr.paidInstallments + 1} de {agr.installments}
              </span>
              <span className="text-2xl font-extrabold text-[var(--text-main)] num-tabular">
                {formatCurrency(agr.installmentValue)}
              </span>
            </div>
            <div className="text-right text-xs">
              <span className="text-[11px] text-[var(--text-muted)] block">Vencimento</span>
              <span className="font-bold text-[var(--text-main)] num-tabular">
                {agr.nextDueDate}
              </span>
            </div>
          </div>

          {/* Method Switcher: Pix, Boleto, Talão */}
          <div className="grid grid-cols-3 gap-1.5 bg-[var(--bg-subtle)] p-1 rounded-xl border border-[var(--border-color)] text-xs">
            <button
              onClick={() => setMethod("pix")}
              className={`py-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                method === "pix"
                  ? "bg-[var(--primary)] text-white shadow-xs"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-main)]"
              }`}
            >
              <i className="bi bi-qr-code" />
              <span>1ª Via Pix</span>
            </button>

            <button
              onClick={() => setMethod("boleto")}
              className={`py-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                method === "boleto"
                  ? "bg-[var(--primary)] text-white shadow-xs"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-main)]"
              }`}
            >
              <i className="bi bi-upc-scan" />
              <span>1ª Via Boleto</span>
            </button>

            <button
              onClick={() => setMethod("talao")}
              className={`py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-colors ${
                method === "talao"
                  ? "bg-[var(--accent)] text-[var(--primary)] shadow-xs"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-main)]"
              }`}
            >
              <i className="bi bi-droplet-half" />
              <span>2ª Via Talão</span>
            </button>
          </div>

          {/* METHOD 1: PIX */}
          {method === "pix" && (
            <div className="space-y-3 text-center page-enter">
              <div className="w-40 h-40 mx-auto rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] flex items-center justify-center shadow-xs">
                <i className="bi bi-qr-code text-7xl text-[var(--primary)]" />
              </div>
              <p className="text-xs text-[var(--text-secondary)]">
                Escaneie o QR Code ou copie o código Pix abaixo com compensação instantânea:
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={pixCode}
                  className="input-field flex-1 h-10 px-3 text-xs font-mono"
                />
                <button
                  onClick={() => handleCopy(pixCode)}
                  className="btn-secondary px-3.5 h-10 text-xs flex items-center gap-1.5 shrink-0"
                >
                  <i className={`bi ${copied ? "bi-check-lg text-[var(--success)]" : "bi-copy"}`} />
                  <span>{copied ? "Copiado" : "Copiar"}</span>
                </button>
              </div>
            </div>
          )}

          {/* METHOD 2: BOLETO */}
          {method === "boleto" && (
            <div className="space-y-3 page-enter">
              <label className="block text-xs font-semibold text-[var(--text-main)]">
                Linha Digitável do Boleto Bancário:
              </label>
              <div className="p-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] font-mono text-xs text-[var(--text-main)] break-all leading-relaxed">
                {boletoLine}
              </div>
              <button
                onClick={() => handleCopy(boletoLine)}
                className="btn-secondary w-full h-10 text-xs flex items-center justify-center gap-2"
              >
                <i className={`bi ${copied ? "bi-check-lg text-[var(--success)]" : "bi-copy"}`} />
                <span>{copied ? "Linha digitável copiada" : "Copiar linha digitável"}</span>
              </button>
            </div>
          )}

          {/* METHOD 3: SIMULADOR DE FATURA CONCESSIONÁRIA (SANEPAR / COPEL) - ÁUDIO 2 */}
          {method === "talao" && (
            <div className="space-y-3 page-enter">
              {/* Concessionaire Toggle */}
              <div className="flex items-center justify-between pb-1">
                <span className="font-semibold text-xs text-[var(--text-main)]">
                  Concessionária conveniada:
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setTalaoProvider("sanepar")}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold border transition-colors ${
                      activeProvider === "sanepar"
                        ? "bg-[#0066B3] text-white border-[#0066B3]"
                        : "bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-color)]"
                    }`}
                  >
                    Sanepar (Água)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTalaoProvider("copel")}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold border transition-colors ${
                      activeProvider === "copel"
                        ? "bg-[#008542] text-white border-[#008542]"
                        : "bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-color)]"
                    }`}
                  >
                    Copel (Luz)
                  </button>
                </div>
              </div>

              {/* Realistic Utility Stub */}
              <div className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] overflow-hidden shadow-xs">
                {/* Header Banner */}
                <div
                  className={`px-3.5 py-2.5 text-white flex items-center justify-between ${
                    activeProvider === "sanepar" ? "bg-[#0066B3]" : "bg-[#008542]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <i
                      className={`bi ${
                        activeProvider === "sanepar"
                          ? "bi-droplet-half"
                          : "bi-lightning-charge-fill"
                      } text-base`}
                    />
                    <div>
                      <p className="font-extrabold text-xs tracking-tight uppercase">
                        {activeProvider === "sanepar"
                          ? "SANEPAR — Água e Esgoto"
                          : "COPEL — Energia Elétrica"}
                      </p>
                      <p className="text-[10px] text-white/80">Fatura Mensal de Serviços</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono bg-white/20 px-2 py-0.5 rounded">
                    Mês Ref.: 11/2026
                  </span>
                </div>

                {/* Bill Metadata */}
                <div className="p-3 bg-[var(--bg-subtle)] border-b border-[var(--border-color)] grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-[var(--text-muted)] block">Cliente / Titular:</span>
                    <strong className="text-[var(--text-main)] truncate block">
                      {user.name}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)] block">
                      {activeProvider === "sanepar" ? "Matrícula do Imóvel:" : "Unidade Consumidora:"}
                    </span>
                    <strong className="text-[var(--text-main)] font-mono">
                      {agr.concessionaireAccount ||
                        (activeProvider === "sanepar" ? "8492019-2" : "9938120-5")}
                    </strong>
                  </div>
                </div>

                {/* Line Item Breakdown */}
                <div className="p-3 space-y-1.5 text-xs">
                  <div className="flex justify-between text-[var(--text-secondary)] text-[11px]">
                    <span>Consumo mensal apurado</span>
                    <span className="num-tabular">R$ 84,30</span>
                  </div>
                  <div className="flex justify-between text-[var(--text-secondary)] text-[11px]">
                    <span>Tarifas e tributos (ICMS/PIS/COFINS)</span>
                    <span className="num-tabular">R$ 12,50</span>
                  </div>

                  {/* PARCELA ACREDTA DESTACADA */}
                  <div className="p-2 rounded-lg bg-[var(--primary-soft)] border border-[var(--accent)] flex items-center justify-between text-[var(--primary)] font-bold">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                      <span>PARC. {agr.paidInstallments + 1}/{agr.installments} ACORDO ACREDTA ({agr.creditor})</span>
                    </div>
                    <span className="text-sm num-tabular text-[var(--accent)] font-extrabold">
                      {formatCurrency(agr.installmentValue)}
                    </span>
                  </div>

                  <div className="flex justify-between pt-1 border-t border-[var(--border-color)] text-xs font-bold text-[var(--text-main)]">
                    <span>Total consolidado da fatura</span>
                    <span className="num-tabular text-sm text-[var(--primary)]">
                      {formatCurrency(96.8 + agr.installmentValue)}
                    </span>
                  </div>
                </div>

                {/* Barcode line */}
                <div className="p-2.5 bg-[var(--bg-subtle)] border-t border-[var(--border-color)]">
                  <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] font-mono break-all">
                    <span>{talaoBarcode}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(talaoBarcode)}
                      className="ml-2 px-2 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--primary)] font-bold shrink-0"
                    >
                      Copiar
                    </button>
                  </div>
                </div>
              </div>

              {/* Security info box */}
              <div className="p-3 rounded-xl bg-[var(--primary-soft)] border border-[var(--primary-border)] flex items-start gap-2.5 text-xs text-[var(--text-secondary)] leading-relaxed">
                <i className="bi bi-shield-check text-[var(--accent)] text-sm shrink-0 mt-0.5" />
                <span>
                  <strong>Garantia contra Inadimplência:</strong> Esta modalidade foi pactuada na mesa de negociação para que o valor seja quitado junto à sua conta de consumo, sem risco de reativação de negativação.
                </span>
              </div>
            </div>
          )}

          <button
            onClick={handleConfirmPayment}
            className="btn-primary w-full h-11 text-xs flex items-center justify-center gap-2"
          >
            <i className="bi bi-check-circle" />
            <span>Simular Baixa / Confirmação da Parcela</span>
          </button>
        </div>
      </div>
    </div>
  );
}
