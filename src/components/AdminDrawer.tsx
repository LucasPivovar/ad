"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { formatCurrency } from "@/utils/format";

export function AdminDrawer() {
  const {
    screenFlow,
    setScreenFlow,
    user,
    agreements,
    adminCreateAgreement,
    setActiveTab,
    setHasLinkedAgreements,
    setNegotiateStep,
    setPreloadCode,
  } = useApp();

  const [creditor, setCreditor] = useState("Lojas Renner");
  const [originalAmount, setOriginalAmount] = useState(3200);
  const [settlementAmount, setSettlementAmount] = useState(1200);
  const [installments, setInstallments] = useState(10);
  const [paymentMethod, setPaymentMethod] = useState<
    "pix_boleto" | "talao_sanepar" | "talao_copel"
  >("talao_sanepar");
  const [concessionaireAccount, setConcessionaireAccount] = useState("Sanepar 8492019-2");
  const [createdCode, setCreatedCode] = useState<string | null>(null);

  if (screenFlow !== "admin") return null;

  const installmentValue = installments > 0 ? settlementAmount / installments : 0;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const created = adminCreateAgreement({
      creditor,
      creditorType: "other",
      contractNumber: `${Math.floor(1000 + Math.random() * 9000)}***`,
      originalAmount: Number(originalAmount),
      discountAmount: Number(originalAmount) - Number(settlementAmount),
      settlementAmount: Number(settlementAmount),
      installments: Number(installments),
      installmentValue,
      paidInstallments: 0,
      status: "em_dia",
      nextDueDate: "10/11/2026",
      paymentMethod,
      concessionaireAccount:
        paymentMethod !== "pix_boleto" ? concessionaireAccount : undefined,
    });
    setCreatedCode(created.id);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-app)] p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top Bar */}
        <div className="card-surface p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--primary)] text-white flex items-center justify-center">
              <i className="bi bi-sliders text-lg" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[var(--text-main)]">
                Painel Admin — Backoffice & Mesa de Negociação
              </h1>
              <p className="text-xs text-[var(--text-secondary)]">
                Base de clientes cadastrados e criação manual de acordos vinculados ao CPF.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setScreenFlow("portal");
              setActiveTab("inicio");
            }}
            className="btn-secondary px-4 h-10 text-xs flex items-center gap-2 self-start sm:self-auto"
          >
            <i className="bi bi-arrow-left" />
            <span>Voltar para Visão do Cliente</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Base de Cadastro de Clientes */}
          <div className="lg:col-span-5 card-surface p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
                <i className="bi bi-people text-[var(--primary)]" />
                <span>Base de Cadastro (Clientes)</span>
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[var(--primary-soft)] text-[var(--primary)]">
                1 cadastrado
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[var(--text-main)]">{user.name}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[var(--success-soft)] text-[var(--success)]">
                  KYC Validado
                </span>
              </div>
              <p className="text-[var(--text-secondary)] num-tabular">CPF: {user.cpf}</p>
              <p className="text-[var(--text-secondary)]">
                {user.phone} • {user.email}
              </p>
              <p className="text-[var(--text-muted)] text-[11px]">
                {user.address.street}, {user.address.number} — {user.address.city}/{user.address.uf}
              </p>
            </div>

            <div className="pt-2 border-t border-[var(--border-color)] space-y-2">
              <h3 className="text-xs font-bold text-[var(--text-main)]">
                Acordos Vinculados ao CPF ({agreements.length})
              </h3>
              {agreements.map((a) => (
                <div
                  key={a.id}
                  className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-[var(--text-main)]">{a.creditor}</p>
                    <p className="text-[11px] text-[var(--text-muted)] num-tabular">
                      Código: {a.id}
                    </p>
                  </div>
                  <span className="font-bold text-[var(--text-main)] num-tabular">
                    {a.installments}x de {formatCurrency(a.installmentValue)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Criar Acordo Manual na Unha */}
          <div className="lg:col-span-7 card-surface p-6 space-y-4">
            <div>
              <h2 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
                <i className="bi bi-file-earmark-plus text-[var(--primary)]" />
                <span>Criar Novo Acordo (Negociação de Mesa)</span>
              </h2>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Vincule manualmente um acordo ao CPF do cliente e gere o código de identificação.
              </p>
            </div>

            {createdCode && (
              <div className="p-4 rounded-xl bg-[var(--success-soft)] border border-[var(--success-border)] text-xs space-y-2.5 page-enter">
                <div>
                  <p className="font-bold text-[var(--success)] flex items-center gap-1.5">
                    <i className="bi bi-check-circle-fill" />
                    <span>Acordo criado com sucesso na mesa de negociação!</span>
                  </p>
                  <p className="text-[var(--text-main)] num-tabular mt-1">
                    Código gerado para o cliente:{" "}
                    <strong className="text-sm font-extrabold text-[var(--primary)] bg-white px-2 py-0.5 rounded border border-[var(--primary-border)]">
                      {createdCode}
                    </strong>
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setPreloadCode(createdCode);
                      setScreenFlow("portal");
                      setHasLinkedAgreements(false);
                      setNegotiateStep("link_code");
                      setActiveTab("inicio");
                    }}
                    className="btn-primary px-3.5 py-2 text-xs flex items-center gap-1.5"
                  >
                    <i className="bi bi-link-45deg text-sm" />
                    <span>Testar Vinculação no Portal (Usar Código)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setScreenFlow("portal");
                      setHasLinkedAgreements(true);
                      setActiveTab("meus-acordos");
                    }}
                    className="btn-secondary px-3.5 py-2 text-xs flex items-center gap-1.5"
                  >
                    <i className="bi bi-eye text-sm" />
                    <span>Ver em Meus Acordos</span>
                  </button>
                </div>
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[var(--text-main)] mb-1">
                    CPF do Cliente
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={user.cpf}
                    className="input-field w-full h-10 px-3 bg-[var(--bg-subtle)] num-tabular"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[var(--text-main)] mb-1">
                    Instituição / Credor Original
                  </label>
                  <input
                    type="text"
                    value={creditor}
                    onChange={(e) => setCreditor(e.target.value)}
                    placeholder="Ex: Renner, Riachuelo, Banco Itaú"
                    className="input-field w-full h-10 px-3"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-[var(--text-main)] mb-1">
                    Dívida Original (R$)
                  </label>
                  <input
                    type="number"
                    value={originalAmount}
                    onChange={(e) => setOriginalAmount(Number(e.target.value))}
                    className="input-field w-full h-10 px-3 num-tabular"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[var(--text-main)] mb-1">
                    Valor Negociado (R$)
                  </label>
                  <input
                    type="number"
                    value={settlementAmount}
                    onChange={(e) => setSettlementAmount(Number(e.target.value))}
                    className="input-field w-full h-10 px-3 num-tabular"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[var(--text-main)] mb-1">
                    Nº de Parcelas
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={48}
                    value={installments}
                    onChange={(e) => setInstallments(Number(e.target.value))}
                    className="input-field w-full h-10 px-3 num-tabular"
                    required
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] flex items-center justify-between">
                <span className="text-[var(--text-secondary)]">Valor calculado por parcela:</span>
                <span className="text-sm font-bold text-[var(--text-main)] num-tabular">
                  {installments}x de {formatCurrency(installmentValue)}
                </span>
              </div>

              <div>
                <label className="block font-semibold text-[var(--text-main)] mb-1.5">
                  Via de Cobrança das Parcelas
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("pix_boleto")}
                    className={`p-2.5 rounded-lg border text-left flex items-center gap-2 ${
                      paymentMethod === "pix_boleto"
                        ? "border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)] font-semibold"
                        : "border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)]"
                    }`}
                  >
                    <i className="bi bi-qr-code" />
                    <span>1ª Via Digital (Pix/Boleto)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod("talao_sanepar");
                      setConcessionaireAccount("Sanepar 8492019-2");
                    }}
                    className={`p-2.5 rounded-lg border text-left flex items-center gap-2 ${
                      paymentMethod === "talao_sanepar"
                        ? "border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)] font-semibold"
                        : "border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)]"
                    }`}
                  >
                    <i className="bi bi-droplet" />
                    <span>2ª Via Talão Sanepar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod("talao_copel");
                      setConcessionaireAccount("Copel 9938120-5");
                    }}
                    className={`p-2.5 rounded-lg border text-left flex items-center gap-2 ${
                      paymentMethod === "talao_copel"
                        ? "border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)] font-semibold"
                        : "border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)]"
                    }`}
                  >
                    <i className="bi bi-lightning-charge" />
                    <span>2ª Via Talão Copel</span>
                  </button>
                </div>

                {paymentMethod !== "pix_boleto" && (
                  <div className="mt-2.5">
                    <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                      Identificação da Conta Concessionária
                    </label>
                    <input
                      type="text"
                      value={concessionaireAccount}
                      onChange={(e) => setConcessionaireAccount(e.target.value)}
                      className="input-field w-full h-9 px-3 num-tabular"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="btn-primary w-full h-11 text-xs flex items-center justify-center gap-2"
              >
                <i className="bi bi-plus-circle" />
                <span>Criar Acordo e Vincular ao CPF</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
