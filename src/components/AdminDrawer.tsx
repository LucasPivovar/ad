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
    kycApplicants,
    approveUserKYC,
    rejectUserKYC,
  } = useApp();

  const [adminTab, setAdminTab] = useState<"kyc" | "mesa">("kyc");
  const [selectedApplicantId, setSelectedApplicantId] = useState<string>("usr_02");

  // Mesa Form States
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

  const selectedApplicant =
    kycApplicants.find((a) => a.id === selectedApplicantId) || kycApplicants[0];

  const pendingCount = kycApplicants.filter((a) => a.status === "analyzing").length;

  return (
    <div className="min-h-screen bg-[var(--bg-app)] p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-5">
        {/* Top Bar */}
        <div className="card-surface p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--primary)] text-white flex items-center justify-center shrink-0">
              <i className="bi bi-shield-lock text-lg text-[var(--accent)]" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-[var(--text-main)]">
                Painel Admin &amp; Backoffice ACREDTA
              </h1>
              <p className="text-xs text-[var(--text-secondary)]">
                Aprovação de cadastros de clientes (KYC) e mesa de negociação de dívidas.
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

        {/* Admin Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-1">
          <button
            onClick={() => setAdminTab("kyc")}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold flex items-center gap-2 transition-colors border-b-2 ${
              adminTab === "kyc"
                ? "border-[var(--primary)] text-[var(--primary)] bg-[var(--bg-surface)]"
                : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-main)]"
            }`}
          >
            <i className="bi bi-person-check text-sm" />
            <span>Aprovação de Usuários (KYC)</span>
            {pendingCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[var(--warning-soft)] text-[var(--warning)] border border-[var(--warning-border)]">
                {pendingCount} pendentes
              </span>
            )}
          </button>

          <button
            onClick={() => setAdminTab("mesa")}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-bold flex items-center gap-2 transition-colors border-b-2 ${
              adminTab === "mesa"
                ? "border-[var(--primary)] text-[var(--primary)] bg-[var(--bg-surface)]"
                : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-main)]"
            }`}
          >
            <i className="bi bi-sliders text-sm" />
            <span>Mesa de Negociação (Criar Acordos)</span>
          </button>
        </div>

        {/* ============================================================== */}
        {/* ABA 1: APROVAÇÃO DE USUÁRIOS & VALIDAÇÃO DE KYC               */}
        {/* ============================================================== */}
        {adminTab === "kyc" && (
          <div className="space-y-4 page-enter">
            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="card-surface p-3.5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[var(--warning-soft)] text-[var(--warning)] flex items-center justify-center shrink-0">
                  <i className="bi bi-hourglass-split text-base" />
                </div>
                <div>
                  <span className="text-[11px] text-[var(--text-secondary)] block">Aguardando Análise</span>
                  <span className="text-lg font-bold text-[var(--text-main)] num-tabular">{pendingCount} usuários</span>
                </div>
              </div>

              <div className="card-surface p-3.5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[var(--success-soft)] text-[var(--success)] flex items-center justify-center shrink-0">
                  <i className="bi bi-check-circle-fill text-base" />
                </div>
                <div>
                  <span className="text-[11px] text-[var(--text-secondary)] block">Cadastros Aprovados</span>
                  <span className="text-lg font-bold text-[var(--text-main)] num-tabular">
                    {kycApplicants.filter((a) => a.status === "approved").length} usuários
                  </span>
                </div>
              </div>

              <div className="card-surface p-3.5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center shrink-0">
                  <i className="bi bi-people text-base" />
                </div>
                <div>
                  <span className="text-[11px] text-[var(--text-secondary)] block">Total na Base</span>
                  <span className="text-lg font-bold text-[var(--text-main)] num-tabular">{kycApplicants.length} cadastrados</span>
                </div>
              </div>
            </div>

            {/* Split View: List on Left, Inspection Dossier on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Left Column: Lista de Usuários */}
              <div className="lg:col-span-5 card-surface p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[var(--border-color)]">
                  <h3 className="text-xs font-bold text-[var(--text-main)]">Fila de Cadastros ({kycApplicants.length})</h3>
                  <span className="text-[11px] text-[var(--text-muted)]">Clique para inspecionar</span>
                </div>

                <div className="space-y-2">
                  {kycApplicants.map((app) => {
                    const isSelected = app.id === selectedApplicant.id;
                    const isApproved = app.status === "approved";
                    const isAnalyzing = app.status === "analyzing";

                    return (
                      <button
                        key={app.id}
                        type="button"
                        onClick={() => setSelectedApplicantId(app.id)}
                        className={`w-full p-3 rounded-xl border text-left transition-colors flex items-center justify-between gap-2.5 ${
                          isSelected
                            ? "border-[var(--primary)] bg-[var(--primary-soft)]"
                            : "border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)]"
                        }`}
                      >
                        <div>
                          <p className="font-bold text-xs text-[var(--text-main)]">{app.name}</p>
                          <p className="text-[11px] text-[var(--text-muted)] num-tabular mt-0.5">
                            CPF: {app.cpf} • {app.registeredAt}
                          </p>
                        </div>

                        <div>
                          {isApproved && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--success-soft)] text-[var(--success)] border border-[var(--success-border)]">
                              Aprovado
                            </span>
                          )}
                          {isAnalyzing && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--warning-soft)] text-[var(--warning)] border border-[var(--warning-border)] animate-pulse">
                              Análise Pendente
                            </span>
                          )}
                          {!isApproved && !isAnalyzing && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--danger-soft)] text-[var(--danger)] border border-[var(--danger-border)]">
                              Reprovado
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Dossiê e Botão de Aprovação */}
              <div className="lg:col-span-7 card-surface p-5 space-y-4">
                {/* Dossier Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[var(--border-color)] gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-[var(--text-main)]">
                      Dossiê KYC — {selectedApplicant.name}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] num-tabular">
                      CPF: {selectedApplicant.cpf} • Cadastrado em {selectedApplicant.registeredAt}
                    </p>
                  </div>

                  <div>
                    {selectedApplicant.status === "approved" ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[var(--success-soft)] text-[var(--success)] border border-[var(--success-border)] flex items-center gap-1">
                        <i className="bi bi-check-circle-fill" />
                        <span>Acesso Liberado</span>
                      </span>
                    ) : selectedApplicant.status === "analyzing" ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[var(--warning-soft)] text-[var(--warning)] border border-[var(--warning-border)] flex items-center gap-1">
                        <i className="bi bi-hourglass-split" />
                        <span>Aguardando Aprovação</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[var(--danger-soft)] text-[var(--danger)] border border-[var(--danger-border)] flex items-center gap-1">
                        <i className="bi bi-x-circle" />
                        <span>Cadastro Reprovado</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Personal Info Box */}
                <div className="p-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[11px] text-[var(--text-muted)] block">Contato:</span>
                    <strong className="text-[var(--text-main)] block">{selectedApplicant.phone}</strong>
                    <span className="text-[11px] text-[var(--text-secondary)]">{selectedApplicant.email}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-[var(--text-muted)] block">Endereço Residencial:</span>
                    <strong className="text-[var(--text-main)] block">{selectedApplicant.cityUf}</strong>
                    <span className="text-[11px] text-[var(--text-secondary)]">{selectedApplicant.addressFull}</span>
                  </div>
                </div>

                {/* Biometric Documents Review */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--text-main)]">
                      Comprovantes de Identidade Enviados:
                    </span>
                    <span className="text-[11px] font-bold text-[var(--success)] flex items-center gap-1">
                      <i className="bi bi-patch-check-fill" />
                      <span>{selectedApplicant.selfieMatchScore}% compatibilidade biométrica</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Doc Front */}
                    <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-center space-y-2">
                      <div className="w-full h-20 rounded-lg bg-[var(--primary-soft)] border border-[var(--border-color)] flex flex-col items-center justify-center text-[var(--primary)] relative">
                        <i className="bi bi-person-vcard text-2xl" />
                        <span className="text-[10px] font-bold uppercase mt-1">{selectedApplicant.documentType} (Frente)</span>
                        <span className="absolute bottom-1 right-1.5 px-1 rounded bg-[var(--success)] text-white text-[9px] font-bold">OK</span>
                      </div>
                      <span className="text-[11px] text-[var(--text-secondary)] block font-medium">Frente legível</span>
                    </div>

                    {/* Doc Back */}
                    <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-center space-y-2">
                      <div className="w-full h-20 rounded-lg bg-[var(--primary-soft)] border border-[var(--border-color)] flex flex-col items-center justify-center text-[var(--primary)] relative">
                        <i className="bi bi-card-text text-2xl" />
                        <span className="text-[10px] font-bold uppercase mt-1">{selectedApplicant.documentType} (Verso)</span>
                        <span className="absolute bottom-1 right-1.5 px-1 rounded bg-[var(--success)] text-white text-[9px] font-bold">OK</span>
                      </div>
                      <span className="text-[11px] text-[var(--text-secondary)] block font-medium">Verso legível</span>
                    </div>

                    {/* Selfie Biométrica */}
                    <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] text-center space-y-2">
                      <div className="w-full h-20 rounded-lg bg-[var(--primary-soft)] border border-[var(--accent)] flex flex-col items-center justify-center text-[var(--primary)] relative">
                        <i className="bi bi-person-bounding-box text-2xl" />
                        <span className="text-[10px] font-bold mt-1">Selfie Facial</span>
                        <span className="absolute bottom-1 right-1.5 px-1 rounded bg-[var(--success)] text-white text-[9px] font-bold">MIRA OK</span>
                      </div>
                      <span className="text-[11px] text-[var(--text-secondary)] block font-medium">Rosto centralizado</span>
                    </div>
                  </div>
                </div>

                {/* Admin Approval Decision Buttons */}
                <div className="pt-2 border-t border-[var(--border-color)] flex flex-wrap items-center gap-3">
                  {selectedApplicant.status !== "approved" ? (
                    <>
                      <button
                        type="button"
                        onClick={() => approveUserKYC(selectedApplicant.id)}
                        className="btn-primary px-5 h-11 text-xs font-bold flex items-center gap-2 flex-1 justify-center"
                      >
                        <i className="bi bi-check-circle-fill text-sm" />
                        <span>Aprovar Cadastro (Liberar Acesso do Cliente)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => rejectUserKYC(selectedApplicant.id)}
                        className="btn-secondary px-4 h-11 text-xs text-[var(--danger)] hover:bg-[var(--danger-soft)] flex items-center gap-2"
                      >
                        <i className="bi bi-x-circle" />
                        <span>Reprovar Foto</span>
                      </button>
                    </>
                  ) : (
                    <div className="w-full flex items-center justify-between p-3 rounded-xl bg-[var(--success-soft)] border border-[var(--success-border)] text-xs">
                      <span className="font-bold text-[var(--success)] flex items-center gap-2">
                        <i className="bi bi-check-circle-fill text-base" />
                        <span>Este usuário já está aprovado e liberado para usar o portal.</span>
                      </span>

                      <button
                        type="button"
                        onClick={() => rejectUserKYC(selectedApplicant.id)}
                        className="text-[11px] text-[var(--danger)] font-semibold hover:underline"
                      >
                        Revogar aprovação
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* ABA 2: MESA DE NEGOCIAÇÃO (CRIAR ACORDOS)                      */}
        {/* ============================================================== */}
        {adminTab === "mesa" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start page-enter">
            {/* Left: Base de Acordos Vinculados */}
            <div className="lg:col-span-5 card-surface p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2">
                  <i className="bi bi-file-earmark-check text-[var(--primary)]" />
                  <span>Acordos Ativos na Mesa ({agreements.length})</span>
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[var(--primary-soft)] text-[var(--primary)]">
                  CPF {user.cpf}
                </span>
              </div>

              <div className="space-y-2">
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

            {/* Right: Formulário de Criação Manual na Mesa */}
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
                      className="btn-primary px-3.5 py-2 text-xs flex items-center gap-1.5 font-bold"
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
                  className="btn-primary w-full h-11 text-xs font-bold flex items-center justify-center gap-2"
                >
                  <i className="bi bi-plus-circle" />
                  <span>Criar Acordo e Vincular ao CPF</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
