"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { CreditorLogo } from "./CreditorLogo";
import { formatCurrency } from "@/utils/format";
import { Agreement } from "@/types";

export function NegotiateModals() {
  const {
    negotiateStep,
    setNegotiateStep,
    user,
    availableDebts,
    selectedDebt,
    setSelectedDebt,
    selectedOfferIndex,
    setSelectedOfferIndex,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    concessionaireAccount,
    setConcessionaireAccount,
    linkAgreementByCode,
    finalizeNewAgreement,
    setActiveTab,
    pendingMesaAgreements,
    agreements,
    preloadCode,
  } = useApp();

  const [codeInput, setCodeInput] = useState(preloadCode || "AC-4587962");
  const [foundAgreement, setFoundAgreement] = useState<Agreement | null>(null);
  const [cpfInput, setCpfInput] = useState(user.cpf);
  const [agreedProposal, setAgreedProposal] = useState(true);
  const [agreedContract, setAgreedContract] = useState(true);
  const [showContractPreview, setShowContractPreview] = useState(false);
  const [frontPhotoTaken, setFrontPhotoTaken] = useState(true);
  const [backPhotoTaken, setBackPhotoTaken] = useState(true);
  const [selfieSnapped, setSelfieSnapped] = useState(false);
  const [flashActive, setFlashActive] = useState(false);

  useEffect(() => {
    if (preloadCode) {
      setCodeInput(preloadCode);
    }
  }, [preloadCode, negotiateStep]);

  if (negotiateStep === "none") return null;

  const offer = selectedDebt.offers[selectedOfferIndex] || selectedDebt.offers[0];

  const handleSearchAgreement = () => {
    const clean = codeInput.trim().toUpperCase();
    const found =
      pendingMesaAgreements.find(
        (a) =>
          a.id.toUpperCase() === clean ||
          a.contractNumber.includes(clean.replace(/\D/g, ""))
      ) ||
      agreements.find(
        (a) =>
          a.id.toUpperCase() === clean ||
          a.contractNumber.includes(clean.replace(/\D/g, ""))
      );

    if (found) {
      setFoundAgreement(found);
    } else {
      setFoundAgreement({
        id: clean.startsWith("AC-") ? clean : `AC-${clean || "4587962"}`,
        creditor: "Banco Itaú",
        creditorType: "itau",
        contractNumber: "4587***",
        originalAmount: 4320.0,
        discountAmount: 2880.0,
        settlementAmount: 1440.0,
        installments: 12,
        installmentValue: 120.0,
        paidInstallments: 0,
        status: "em_dia",
        nextDueDate: "10/11/2026",
        paymentMethod: selectedPaymentMethod,
        concessionaireAccount:
          selectedPaymentMethod !== "pix_boleto"
            ? `${selectedPaymentMethod === "talao_sanepar" ? "Sanepar" : "Copel"} ${concessionaireAccount}`
            : undefined,
        createdAt: new Date().toISOString().split("T")[0],
      });
    }
    setNegotiateStep("link_found");
  };

  const handleSnapSelfie = () => {
    setFlashActive(true);
    setTimeout(() => {
      setFlashActive(false);
      setSelfieSnapped(true);
    }, 350);
  };

  /* ----------------------------------------------------------------
     1. VINCULAR ACORDO EXISTENTE (Imagem 1 - Linha 1, Tela 2)
     ---------------------------------------------------------------- */
  if (negotiateStep === "link_code") {
    return (
      <div className="card-surface p-6 md:p-8 max-w-md mx-auto my-2">
        <button
          onClick={() => setNegotiateStep("none")}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--text-main)] hover:text-[var(--primary)] mb-3"
        >
          <i className="bi bi-arrow-left text-base" />
          <span>Vincular acordo existente</span>
        </button>

        <p className="text-xs text-[var(--text-secondary)] mb-5 leading-relaxed">
          Informe o código do seu acordo ou número do contrato para encontrar seus dados.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-main)] mb-1.5">
              Código do acordo / Contrato
            </label>
            <div className="relative">
              <input
                type="text"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                placeholder="AC-4587962"
                className="input-field w-full h-11 pl-3.5 pr-10 text-sm font-medium num-tabular"
              />
              <i className="bi bi-search text-sm text-[var(--primary)] absolute right-3.5 top-3" />
            </div>
          </div>

          <button
            onClick={handleSearchAgreement}
            className="btn-primary w-full h-11 text-sm"
          >
            Buscar acordo
          </button>

          <div className="text-center pt-2 text-xs text-[var(--text-muted)]">
            <span>Não tenho um código</span>
            <span className="mx-2">|</span>
            <button
              onClick={() => setNegotiateStep("search_cpf")}
              className="text-[var(--primary)] font-semibold hover:underline"
            >
              Iniciar um novo acordo
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ----------------------------------------------------------------
     2. ACORDO ENCONTRADO! (Imagem 1 - Linha 1, Tela 3)
     ---------------------------------------------------------------- */
  if (negotiateStep === "link_found") {
    const displayAgr = foundAgreement || {
      id: codeInput || "AC-4587962",
      creditor: "Banco Itaú",
      creditorType: "itau" as const,
      contractNumber: "4587***",
      originalAmount: 4320.0,
      discountAmount: 2880.0,
      settlementAmount: 1440.0,
      installments: 12,
      installmentValue: 120.0,
      paidInstallments: 0,
      status: "em_dia" as const,
      nextDueDate: "10/11/2026",
      paymentMethod: selectedPaymentMethod,
      createdAt: "2026-11-03",
    };

    const hasTalao =
      displayAgr.paymentMethod === "talao_sanepar" ||
      displayAgr.paymentMethod === "talao_copel" ||
      !!displayAgr.concessionaireAccount;

    return (
      <div className="card-surface p-6 md:p-8 max-w-md mx-auto my-2">
        <button
          onClick={() => setNegotiateStep("link_code")}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--text-main)] hover:text-[var(--primary)] mb-2"
        >
          <i className="bi bi-arrow-left text-base" />
        </button>

        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-full bg-[var(--accent)] text-[var(--primary)] flex items-center justify-center mx-auto mb-3 pop-in">
            <i className="bi bi-check-lg text-2xl leading-none" />
          </div>
          <h3 className="text-lg font-bold text-[var(--text-main)]">Acordo encontrado!</h3>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Encontramos um acordo em seu CPF.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-2.5 text-xs mb-5">
          <div className="flex items-center gap-3 pb-2.5 border-b border-[var(--border-color)]">
            <CreditorLogo creditor={displayAgr.creditor} size="sm" />
            <div>
              <p className="font-bold text-sm text-[var(--text-main)]">{displayAgr.creditor}</p>
              <p className="text-[11px] text-[var(--text-muted)] num-tabular">
                Contrato: {displayAgr.id}
              </p>
            </div>
          </div>

          <div className="flex justify-between py-0.5">
            <span className="text-[var(--text-secondary)]">Valor original da dívida</span>
            <span className="font-bold text-[var(--text-main)] num-tabular">
              {formatCurrency(displayAgr.originalAmount)}
            </span>
          </div>
          <div className="flex justify-between py-0.5">
            <span className="text-[var(--text-secondary)]">Valor do acordo</span>
            <span className="font-bold text-[var(--text-main)] num-tabular">
              {formatCurrency(displayAgr.settlementAmount)}
            </span>
          </div>
          <div className="flex justify-between py-0.5">
            <span className="text-[var(--text-secondary)]">Parcelas</span>
            <span className="font-bold text-[var(--text-main)] num-tabular">
              {displayAgr.installments}x de {formatCurrency(displayAgr.installmentValue)}
            </span>
          </div>

          {hasTalao && (
            <div className="pt-2 border-t border-[var(--border-color)] flex items-center gap-2 text-xs font-semibold text-[var(--success)]">
              <i className="bi bi-droplet-half text-sm" />
              <span>
                Cobrança na fatura:{" "}
                {displayAgr.concessionaireAccount ||
                  (displayAgr.paymentMethod === "talao_sanepar" ? "Sanepar" : "Copel")}
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => {
            linkAgreementByCode(displayAgr.id);
            setNegotiateStep("none");
            setActiveTab("inicio");
          }}
          className="btn-primary w-full h-11 text-sm"
        >
          Vincular à minha conta
        </button>
      </div>
    );
  }

  /* ----------------------------------------------------------------
     3. BUSCAR ACORDO POR CPF (Imagem 1 - Linha 2, Tela 1)
     ---------------------------------------------------------------- */
  if (negotiateStep === "search_cpf") {
    return (
      <div className="card-surface p-6 md:p-8 max-w-md mx-auto my-2">
        <button
          onClick={() => setNegotiateStep("none")}
          className="inline-flex items-center gap-2 text-base font-bold text-[var(--text-main)] hover:text-[var(--primary)] mb-2"
        >
          <i className="bi bi-arrow-left" />
          <span>Buscar acordo</span>
        </button>

        <p className="text-xs text-[var(--text-secondary)] mb-5 leading-relaxed">
          Digite seu CPF para verificarmos se há dívidas disponíveis para negociação.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--text-main)] mb-1.5">
              CPF
            </label>
            <input
              type="text"
              value={cpfInput}
              onChange={(e) => setCpfInput(e.target.value)}
              className="input-field w-full h-11 px-3.5 text-sm font-medium num-tabular"
            />
          </div>

          <button
            onClick={() => setNegotiateStep("available_debts")}
            className="btn-primary w-full h-11 text-sm"
          >
            Consultar
          </button>
        </div>
      </div>
    );
  }

  /* ----------------------------------------------------------------
     4. ACORDOS DISPONÍVEIS (Imagem 1 - Linha 2, Tela 2)
     ---------------------------------------------------------------- */
  if (negotiateStep === "available_debts") {
    return (
      <div className="card-surface p-6 md:p-8 max-w-md mx-auto my-2">
        <button
          onClick={() => setNegotiateStep("search_cpf")}
          className="inline-flex items-center gap-2 text-base font-bold text-[var(--text-main)] hover:text-[var(--primary)] mb-1"
        >
          <i className="bi bi-arrow-left" />
          <span>Acordos disponíveis</span>
        </button>

        <p className="text-xs text-[var(--text-secondary)] mb-4">
          Encontramos {availableDebts.length} dívidas em seu CPF.
        </p>

        <div className="space-y-2.5 mb-5">
          {availableDebts.map((debt) => (
            <button
              key={debt.id}
              onClick={() => {
                setSelectedDebt(debt);
                setSelectedOfferIndex(0);
                setNegotiateStep("proposal");
              }}
              className="w-full p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-color)] card-interactive flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-3">
                <CreditorLogo creditor={debt.creditor} size="sm" />
                <div>
                  <p className="text-sm font-bold text-[var(--text-main)]">{debt.creditor}</p>
                  <p className="text-xs text-[var(--text-secondary)] num-tabular">
                    Dívida original: {formatCurrency(debt.originalAmount)}
                  </p>
                </div>
              </div>
              <i className="bi bi-chevron-right row-chevron inline-block text-sm text-[var(--text-muted)]" />
            </button>
          ))}
        </div>

        <div className="p-3.5 rounded-xl bg-[var(--primary-soft)] border border-[var(--primary-border)] flex items-start gap-2.5 text-xs text-[var(--text-secondary)]">
          <i className="bi bi-info-circle text-[var(--primary)] text-sm shrink-0 mt-0.5" />
          <span>
            Você pode negociar, revisar as condições e formalizar um novo acordo de forma 100% digital.
          </span>
        </div>
      </div>
    );
  }

  /* ----------------------------------------------------------------
     5. PROPOSTA DE ACORDO (Imagem 1 - Linha 2, Tela 3 + Duas Vias do Áudio)
     ---------------------------------------------------------------- */
  if (negotiateStep === "proposal") {
    return (
      <div className="card-surface p-6 md:p-8 max-w-2xl mx-auto my-2">
        <button
          onClick={() => setNegotiateStep("available_debts")}
          className="inline-flex items-center gap-2 text-base font-bold text-[var(--text-main)] hover:text-[var(--primary)] mb-1"
        >
          <i className="bi bi-arrow-left" />
          <span>Proposta de acordo</span>
        </button>

        <p className="text-xs text-[var(--text-secondary)] mb-5">
          Confira as condições especiais para regularizar sua dívida.
        </p>

        {/* Two Columns on Desktop, Stacked on Mobile (Exact match to Image 1) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          {/* Left Box: Creditor & Values Summary */}
          <div className="p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-2.5 text-xs">
            <div className="flex items-center gap-3 pb-2.5 border-b border-[var(--border-color)]">
              <CreditorLogo creditor={selectedDebt.creditor} size="sm" />
              <div>
                <p className="font-bold text-sm text-[var(--text-main)]">{selectedDebt.creditor}</p>
                <p className="text-[11px] text-[var(--text-muted)] num-tabular">
                  Contrato: {selectedDebt.contractMasked}
                </p>
              </div>
            </div>

            <div className="flex justify-between py-0.5">
              <span className="text-[var(--text-secondary)]">Valor original da dívida</span>
              <span className="font-bold text-[var(--text-main)] num-tabular">
                {formatCurrency(selectedDebt.originalAmount)}
              </span>
            </div>

            <div className="flex justify-between py-0.5">
              <span className="text-[var(--text-secondary)]">Desconto negociado</span>
              <span className="font-bold text-[var(--success)] num-tabular">
                - {formatCurrency(selectedDebt.originalAmount - offer.totalAmount)}
              </span>
            </div>

            <div className="flex justify-between py-1 border-t border-[var(--border-color)]">
              <span className="font-semibold text-[var(--text-main)]">Valor do acordo</span>
              <span className="font-bold text-sm text-[var(--text-main)] num-tabular">
                {formatCurrency(offer.totalAmount)}
              </span>
            </div>

            <div className="flex justify-between py-0.5">
              <span className="text-[var(--text-secondary)]">Parcelas</span>
              <span className="font-bold text-[var(--text-main)] num-tabular">
                {offer.description}
              </span>
            </div>
          </div>

          {/* Right Box: Installment Radio Options */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[var(--text-main)] block mb-1">
              Outras opções
            </span>

            {selectedDebt.offers.map((opt, idx) => {
              const isSelected = selectedOfferIndex === idx;
              return (
                <label
                  key={idx}
                  className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer text-xs transition-colors ${
                    isSelected
                      ? "border-[var(--primary)] bg-[var(--primary-soft)]"
                      : "border-[var(--border-color)] bg-[var(--bg-surface)] hover:bg-[var(--bg-subtle)]"
                  }`}
                >
                  <input
                    type="radio"
                    name="installment_option"
                    checked={isSelected}
                    onChange={() => setSelectedOfferIndex(idx)}
                    className="mt-0.5 accent-[var(--primary)]"
                  />
                  <div>
                    <span className="font-bold text-[var(--text-main)] num-tabular">
                      {opt.description}
                    </span>
                    {opt.installments > 1 ? (
                      <span className="text-[11px] text-[var(--text-muted)] ml-1 num-tabular">
                        ({formatCurrency(opt.totalAmount)})
                      </span>
                    ) : (
                      <span className="block text-[11px] text-[var(--success)] font-medium">
                        (10% de desconto extra)
                      </span>
                    )}
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Via de Cobrança (Requisito explícito do Áudio 2: Digital vs Talão Sanepar/Copel) */}
        <div className="p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] mb-5 space-y-3">
          <span className="text-xs font-bold text-[var(--text-main)] block">
            Via de pagamento das parcelas
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setSelectedPaymentMethod("pix_boleto")}
              className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition-colors ${
                selectedPaymentMethod === "pix_boleto"
                  ? "border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)] font-semibold"
                  : "border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)]"
              }`}
            >
              <i className="bi bi-qr-code text-sm" />
              <span>1ª Via Digital (Pix/Boleto)</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedPaymentMethod("talao_sanepar")}
              className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition-colors ${
                selectedPaymentMethod === "talao_sanepar"
                  ? "border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)] font-semibold"
                  : "border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)]"
              }`}
            >
              <i className="bi bi-droplet text-sm" />
              <span>2ª Via Talão Sanepar</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedPaymentMethod("talao_copel")}
              className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition-colors ${
                selectedPaymentMethod === "talao_copel"
                  ? "border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--primary)] font-semibold"
                  : "border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)]"
              }`}
            >
              <i className="bi bi-lightning-charge text-sm" />
              <span>2ª Via Talão Copel</span>
            </button>
          </div>

          {selectedPaymentMethod !== "pix_boleto" && (
            <div className="pt-1">
              <label className="block text-[11px] font-semibold text-[var(--text-secondary)] mb-1">
                Matrícula / Unidade Consumidora ({selectedPaymentMethod === "talao_sanepar" ? "Sanepar" : "Copel"})
              </label>
              <input
                type="text"
                value={concessionaireAccount}
                onChange={(e) => setConcessionaireAccount(e.target.value)}
                placeholder="Ex: 8492019-2"
                className="input-field w-full h-9 px-3 text-xs num-tabular"
              />
            </div>
          )}
        </div>

        <button
          onClick={() => setNegotiateStep("review")}
          className="btn-primary w-full h-11 text-sm"
        >
          Continuar com esta proposta
        </button>
      </div>
    );
  }

  /* ----------------------------------------------------------------
     6. REVISÃO E CONFIRMAÇÃO (Imagem 1 - Linha 2, Tela 4)
     ---------------------------------------------------------------- */
  if (negotiateStep === "review") {
    return (
      <div className="card-surface p-6 md:p-8 max-w-md mx-auto my-2">
        <button
          onClick={() => setNegotiateStep("proposal")}
          className="inline-flex items-center gap-2 text-base font-bold text-[var(--text-main)] hover:text-[var(--primary)] mb-1"
        >
          <i className="bi bi-arrow-left" />
          <span>Revisão e confirmação</span>
        </button>

        <p className="text-xs text-[var(--text-secondary)] mb-5">
          Confirme os dados antes de seguir para o contrato.
        </p>

        <div className="p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-3 text-xs mb-4">
          <div className="flex items-center justify-between">
            <span className="text-[var(--text-secondary)] flex items-center gap-2">
              <i className="bi bi-person text-[var(--primary)]" />
              Empresa credora
            </span>
            <span className="font-bold text-[var(--text-main)]">{selectedDebt.creditor}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[var(--text-secondary)] flex items-center gap-2">
              <i className="bi bi-wallet2 text-[var(--primary)]" />
              Valor do acordo
            </span>
            <span className="font-bold text-[var(--text-main)] num-tabular">
              {formatCurrency(offer.totalAmount)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[var(--text-secondary)] flex items-center gap-2">
              <i className="bi bi-credit-card text-[var(--primary)]" />
              Forma de pagamento
            </span>
            <span className="font-bold text-[var(--text-main)] num-tabular">
              {offer.description}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[var(--text-secondary)] flex items-center gap-2">
              <i className="bi bi-clock text-[var(--primary)]" />
              Vencimento da 1ª parcela
            </span>
            <span className="font-bold text-[var(--text-main)] num-tabular">10/11/2026</span>
          </div>
        </div>

        <label className="flex items-center gap-2.5 text-xs text-[var(--text-secondary)] mb-5 cursor-pointer">
          <input
            type="checkbox"
            checked={agreedProposal}
            onChange={(e) => setAgreedProposal(e.target.checked)}
            className="w-4 h-4 accent-[var(--primary)] rounded"
          />
          <span>
            Li e concordo com as{" "}
            <strong className="text-[var(--primary)] underline">Condições da proposta</strong>.
          </span>
        </label>

        <button
          onClick={() => setNegotiateStep("contract")}
          disabled={!agreedProposal}
          className="btn-primary w-full h-11 text-sm disabled:opacity-50"
        >
          Continuar para o contrato
        </button>
      </div>
    );
  }

  /* ----------------------------------------------------------------
     7. CONTRATO DIGITAL (Imagem 1 - Linha 3, Tela 1)
     ---------------------------------------------------------------- */
  if (negotiateStep === "contract") {
    return (
      <div className="card-surface p-6 md:p-8 max-w-md mx-auto my-2">
        <button
          onClick={() => setNegotiateStep("review")}
          className="inline-flex items-center gap-2 text-base font-bold text-[var(--text-main)] hover:text-[var(--primary)] mb-1"
        >
          <i className="bi bi-arrow-left" />
          <span>Contrato digital</span>
        </button>

        <p className="text-xs text-[var(--text-secondary)] mb-4 leading-relaxed">
          Leia o contrato com atenção e, se estiver de acordo, realize a assinatura digital.
        </p>

        <div className="p-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center">
              <i className="bi bi-file-earmark-text text-base" />
            </div>
            <div>
              <p className="text-xs font-bold text-[var(--text-main)]">Contrato de Acordo</p>
              <p className="text-[11px] text-[var(--text-muted)] num-tabular">AC-4587962.pdf</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowContractPreview(!showContractPreview)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]"
            title="Visualizar cláusulas"
          >
            <i className="bi bi-eye text-base" />
          </button>
        </div>

        {showContractPreview && (
          <div className="p-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[11px] text-[var(--text-secondary)] max-h-36 overflow-y-auto mb-4 space-y-1.5 leading-relaxed">
            <p className="font-bold text-[var(--text-main)]">
              TERMO DE CONFISSÃO E RENEGOCIAÇÃO DE DÍVIDA
            </p>
            <p>
              Credor: {selectedDebt.creditor}. Devedor: {user.name}, CPF {user.cpf}.
            </p>
            <p>
              Valor renegociado: {formatCurrency(offer.totalAmount)} pago em {offer.description}.
            </p>
            <p>
              A baixa da restrição nos órgãos de proteção ocorrerá em até 5 dias úteis após a quitação da 1ª parcela.
            </p>
          </div>
        )}

        <label className="flex items-start gap-2.5 text-xs text-[var(--text-secondary)] mb-5 cursor-pointer">
          <input
            type="checkbox"
            checked={agreedContract}
            onChange={(e) => setAgreedContract(e.target.checked)}
            className="w-4 h-4 accent-[var(--primary)] rounded mt-0.5"
          />
          <span>Li e concordo com todas as cláusulas do contrato de acordo.</span>
        </label>

        <button
          onClick={() => setNegotiateStep("contract_signed")}
          disabled={!agreedContract}
          className="btn-primary w-full h-11 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <i className="bi bi-pen text-xs" />
          <span>Assinar contrato digital</span>
        </button>
      </div>
    );
  }

  /* ----------------------------------------------------------------
     8. CONTRATO ASSINADO! (Imagem 1 - Linha 3, Tela 2)
     ---------------------------------------------------------------- */
  if (negotiateStep === "contract_signed") {
    return (
      <div className="card-surface p-6 md:p-8 max-w-md mx-auto my-2 text-center">
        <div className="w-12 h-12 rounded-full bg-[var(--accent)] text-[var(--primary)] flex items-center justify-center mx-auto mb-3 pop-in">
          <i className="bi bi-check-lg text-2xl leading-none" />
        </div>

        <h3 className="text-lg font-bold text-[var(--text-main)]">Contrato assinado!</h3>
        <p className="text-xs text-[var(--text-secondary)] mt-0.5 mb-5">
          Seu contrato foi assinado com sucesso.
        </p>

        <div className="p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-2 text-xs text-left mb-5">
          <div className="flex justify-between">
            <span className="text-[var(--text-secondary)]">Contrato:</span>
            <span className="font-bold text-[var(--text-main)] num-tabular">AC-4587962</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-secondary)]">Empresa:</span>
            <span className="font-bold text-[var(--text-main)]">{selectedDebt.creditor}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-secondary)]">Valor do acordo:</span>
            <span className="font-bold text-[var(--text-main)] num-tabular">
              {formatCurrency(offer.totalAmount)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-secondary)]">Parcelas:</span>
            <span className="font-bold text-[var(--text-main)] num-tabular">
              {offer.description}
            </span>
          </div>
        </div>

        <button
          onClick={() => setNegotiateStep("kyc_intro")}
          className="btn-primary w-full h-11 text-sm"
        >
          Continuar para validação
        </button>
      </div>
    );
  }

  /* ----------------------------------------------------------------
     9. VALIDAÇÃO DE IDENTIDADE - INTRO (Imagem 1 - Linha 3, Tela 3)
     ---------------------------------------------------------------- */
  if (negotiateStep === "kyc_intro") {
    return (
      <div className="card-surface p-6 md:p-8 max-w-md mx-auto my-2">
        <button
          onClick={() => setNegotiateStep("contract_signed")}
          className="inline-flex items-center gap-2 text-base font-bold text-[var(--text-main)] hover:text-[var(--primary)] mb-1"
        >
          <i className="bi bi-arrow-left" />
          <span>Validação de identidade</span>
        </button>

        <p className="text-xs text-[var(--text-secondary)] mb-5 leading-relaxed">
          Para garantir a segurança do seu acordo, precisamos confirmar sua identidade.
        </p>

        <div className="space-y-3 mb-5">
          <div className="p-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center shrink-0">
              <i className="bi bi-person-vcard text-lg" />
            </div>
            <div>
              <p className="text-xs font-bold text-[var(--text-main)]">
                Documento com foto (CNH ou RG)
              </p>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Frente e verso do documento
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center shrink-0">
              <i className="bi bi-person-bounding-box text-lg" />
            </div>
            <div>
              <p className="text-xs font-bold text-[var(--text-main)]">Selfie</p>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Foto do seu rosto em tempo real
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setNegotiateStep("kyc_docs")}
          className="btn-primary w-full h-11 text-sm"
        >
          Iniciar validação
        </button>
      </div>
    );
  }

  /* ----------------------------------------------------------------
     10. ENVIE SEU DOCUMENTO (Imagem 1 - Linha 3, Tela 4)
     ---------------------------------------------------------------- */
  if (negotiateStep === "kyc_docs") {
    return (
      <div className="card-surface p-6 md:p-8 max-w-md mx-auto my-2">
        <button
          onClick={() => setNegotiateStep("kyc_intro")}
          className="inline-flex items-center gap-2 text-base font-bold text-[var(--text-main)] hover:text-[var(--primary)] mb-1"
        >
          <i className="bi bi-arrow-left" />
          <span>Envie seu documento</span>
        </button>

        <p className="text-xs text-[var(--text-secondary)] mb-5">
          Tire fotos nítidas do seu documento.
        </p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] flex flex-col items-center text-center">
            <div className="w-12 h-9 rounded bg-[var(--primary-soft)] border border-[var(--primary-border)] flex items-center justify-center text-[var(--primary)] mb-2.5">
              <i className="bi bi-person-vcard text-lg" />
            </div>
            <span className="text-xs font-bold text-[var(--text-main)] mb-2">
              Frente do documento
            </span>
            <button
              type="button"
              onClick={() => setFrontPhotoTaken(true)}
              className="btn-secondary px-3 py-1.5 text-[11px] flex items-center gap-1.5"
            >
              <i className="bi bi-camera text-xs text-[var(--primary)]" />
              <span>{frontPhotoTaken ? "Foto enviada" : "Tirar foto"}</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] flex flex-col items-center text-center">
            <div className="w-12 h-9 rounded bg-[var(--primary-soft)] border border-[var(--primary-border)] flex items-center justify-center text-[var(--primary)] mb-2.5">
              <i className="bi bi-card-text text-lg" />
            </div>
            <span className="text-xs font-bold text-[var(--text-main)] mb-2">
              Verso do documento
            </span>
            <button
              type="button"
              onClick={() => setBackPhotoTaken(true)}
              className="btn-secondary px-3 py-1.5 text-[11px] flex items-center gap-1.5"
            >
              <i className="bi bi-camera text-xs text-[var(--primary)]" />
              <span>{backPhotoTaken ? "Foto enviada" : "Tirar foto"}</span>
            </button>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] flex items-center gap-2 text-xs text-[var(--text-secondary)] mb-5">
          <i className="bi bi-info-circle text-[var(--primary)]" />
          <span>Use um ambiente bem iluminado e evite reflexos.</span>
        </div>

        <button
          onClick={() => setNegotiateStep("kyc_selfie")}
          className="btn-primary w-full h-11 text-sm"
        >
          Continuar
        </button>
      </div>
    );
  }

  /* ----------------------------------------------------------------
     11. TIRE UMA SELFIE (Imagem 1 - Linha 3, Tela 5)
     ---------------------------------------------------------------- */
  if (negotiateStep === "kyc_selfie") {
    return (
      <div className="card-surface p-6 md:p-8 max-w-md mx-auto my-2">
        <button
          onClick={() => setNegotiateStep("kyc_docs")}
          className="inline-flex items-center gap-2 text-base font-bold text-[var(--text-main)] hover:text-[var(--primary)] mb-1"
        >
          <i className="bi bi-arrow-left" />
          <span>Tire uma selfie</span>
        </button>

        <p className="text-xs text-[var(--text-secondary)] mb-4">
          Posicione seu rosto no enquadramento.
        </p>

        {/* Camera Frame with Corner Guides & Scanner (Exact match to Image 1) */}
        <div className="w-52 h-60 mx-auto rounded-2xl bg-[var(--bg-muted)] border border-[var(--border-color)] relative flex flex-col items-center justify-center mb-5 overflow-hidden">
          {flashActive && <div className="camera-flash-overlay" />}
          {!selfieSnapped && <div className="scanner-laser" />}

          {/* Corner Brackets */}
          <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-[var(--primary)] rounded-tl" />
          <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-[var(--primary)] rounded-tr" />
          <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-[var(--primary)] rounded-bl" />
          <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-[var(--primary)] rounded-br" />

          {selfieSnapped ? (
            <div className="flex flex-col items-center text-center p-4 page-enter">
              <div className="w-20 h-20 rounded-full bg-[var(--accent-soft)] border-2 border-[var(--accent)] text-[var(--accent)] flex items-center justify-center mb-2 pop-in">
                <i className="bi bi-person-check-fill text-4xl text-[var(--success)]" />
              </div>
              <span className="text-xs font-bold text-[var(--success)]">
                Biometria Capturada!
              </span>
              <span className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                Rosto validado com sucesso
              </span>
            </div>
          ) : (
            <>
              <div className="w-20 h-20 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center mb-2">
                <i className="bi bi-person-bounding-box text-4xl" />
              </div>
              <span className="text-[11px] font-medium text-[var(--text-secondary)]">
                Centralize seu rosto no quadro
              </span>
            </>
          )}
        </div>

        {selfieSnapped ? (
          <div className="space-y-2">
            <button
              onClick={() => setNegotiateStep("kyc_done")}
              className="btn-primary w-full h-11 text-sm flex items-center justify-center gap-2"
            >
              <span>Confirmar e Concluir Validação</span>
              <i className="bi bi-arrow-right text-sm" />
            </button>
            <button
              type="button"
              onClick={() => setSelfieSnapped(false)}
              className="btn-secondary w-full h-10 text-xs"
            >
              Tirar outra foto
            </button>
          </div>
        ) : (
          <button
            onClick={handleSnapSelfie}
            className="btn-primary w-full h-11 text-sm flex items-center justify-center gap-2"
          >
            <i className="bi bi-camera text-sm" />
            <span>Tirar selfie</span>
          </button>
        )}
      </div>
    );
  }

  /* ----------------------------------------------------------------
     12. VALIDAÇÃO CONCLUÍDA! (Imagem 1 - Linha 3, Tela 6)
     ---------------------------------------------------------------- */
  return (
    <div className="card-surface p-6 md:p-8 max-w-md mx-auto my-2 text-center">
      <div className="w-14 h-14 rounded-full bg-[var(--accent)] text-[var(--primary)] flex items-center justify-center mx-auto mb-3 pop-in">
        <i className="bi bi-check-lg text-3xl leading-none" />
      </div>

      <h3 className="text-lg font-bold text-[var(--text-main)]">Validação concluída!</h3>
      <p className="text-xs text-[var(--text-secondary)] mt-1 mb-6 leading-relaxed">
        Sua identidade foi confirmada com sucesso e seu acordo está ativo.
      </p>

      <button
        onClick={() => {
          finalizeNewAgreement();
          setNegotiateStep("none");
          setActiveTab("inicio");
        }}
        className="btn-primary w-full h-11 text-sm"
      >
        Acessar meus acordos
      </button>
    </div>
  );
}


