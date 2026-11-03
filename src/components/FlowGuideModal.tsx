"use client";

import React from "react";
import { useApp } from "@/context/AppContext";

export function FlowGuideModal() {
  const { flowGuideOpen, setFlowGuideOpen, setScreenFlow, setHasLinkedAgreements, setNegotiateStep, setActiveTab } = useApp();

  if (!flowGuideOpen) return null;

  return (
    <div className="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="card-surface modal-panel w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--primary)] text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--accent)] text-[var(--primary)] flex items-center justify-center font-bold">
              <i className="bi bi-lightbulb-fill text-base" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">Guia Autoexplicativo do Produto</h3>
              <p className="text-[11px] text-white/80">Entenda o modelo de negócio ACREDTA e como demonstrar</p>
            </div>
          </div>
          <button
            onClick={() => setFlowGuideOpen(false)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <i className="bi bi-x-lg text-sm" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
          {/* Card 1: Carteira e Mesa */}
          <div className="p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[var(--primary)] text-white text-xs font-bold flex items-center justify-center">1</span>
              <h4 className="font-bold text-[var(--text-main)] text-sm">Aquisição de Carteiras & Negociação de Mesa</h4>
            </div>
            <p className="text-[var(--text-secondary)] leading-relaxed pl-8">
              A <strong>ACREDTA</strong> adquire lotes de carteiras de dívidas vencidas (ex: Itaú, Santander, Renner). A negociação é conduzida offline pela equipe de atendimento (&ldquo;na unha / mesa&rdquo;). O cliente não precisa de integração bancária automática.
            </p>
          </div>

          {/* Card 2: Código e Vinculação */}
          <div className="p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[var(--primary)] text-white text-xs font-bold flex items-center justify-center">2</span>
              <h4 className="font-bold text-[var(--text-main)] text-sm">Cliente Sem Acordo Inicial & Vinculação por Código</h4>
            </div>
            <p className="text-[var(--text-secondary)] leading-relaxed pl-8">
              Quando o devedor acessa o aplicativo após fazer o cadastro, o estado inicial é <em>&ldquo;Nenhum acordo encontrado&rdquo;</em>. Ao clicar em <strong>&ldquo;Vincular um acordo&rdquo;</strong>, ele digita o código fornecido pelo operador (ex: <code className="px-1.5 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-color)] font-mono text-[var(--primary)]">AC-4587962</code>) e o acordo é ativado na conta imediatamente.
            </p>
          </div>

          {/* Card 3: Duas Vias de Cobrança */}
          <div className="p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[var(--primary)] text-white text-xs font-bold flex items-center justify-center">3</span>
              <h4 className="font-bold text-[var(--text-main)] text-sm">As Duas Vias de Cobrança (Estratégia Anti-Inadimplência)</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pl-8 pt-1">
              <div className="p-2.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)]">
                <p className="font-bold text-[var(--primary)] flex items-center gap-1.5">
                  <i className="bi bi-qr-code text-[var(--accent)]" />
                  <span>1ª Via Digital</span>
                </p>
                <p className="text-[11px] text-[var(--text-muted)] mt-1">
                  Pix instantâneo (com QR Code dinâmico) e Boleto bancário tradicional.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)]">
                <p className="font-bold text-[var(--primary)] flex items-center gap-1.5">
                  <i className="bi bi-droplet-half text-[#0066B3]" />
                  <span>2ª Via Concessionária</span>
                </p>
                <p className="text-[11px] text-[var(--text-muted)] mt-1">
                  Parcela embutida na conta da <strong>Sanepar</strong> (água) ou <strong>Copel</strong> (luz), garantindo que o cliente pague junto das contas essenciais.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="pt-2">
            <p className="font-bold text-[var(--text-main)] mb-2">Atalhos rápidos para demonstração:</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => {
                  setFlowGuideOpen(false);
                  setScreenFlow("portal");
                  setHasLinkedAgreements(false);
                  setNegotiateStep("none");
                  setActiveTab("inicio");
                }}
                className="p-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-[var(--primary)] text-center text-xs font-semibold text-[var(--text-main)] hover:bg-[var(--primary-soft)] transition-colors"
              >
                <i className="bi bi-folder-x text-[var(--primary)] block text-base mb-0.5" />
                <span>Testar Sem Acordo</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setFlowGuideOpen(false);
                  setScreenFlow("portal");
                  setHasLinkedAgreements(true);
                  setNegotiateStep("none");
                  setActiveTab("inicio");
                }}
                className="p-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-[var(--primary)] text-center text-xs font-semibold text-[var(--text-main)] hover:bg-[var(--primary-soft)] transition-colors"
              >
                <i className="bi bi-speedometer2 text-[var(--accent)] block text-base mb-0.5" />
                <span>Ver Dashboard Ativo</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setFlowGuideOpen(false);
                  setScreenFlow("admin");
                }}
                className="p-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-[var(--primary)] text-center text-xs font-semibold text-[var(--text-main)] hover:bg-[var(--primary-soft)] transition-colors"
              >
                <i className="bi bi-sliders text-[var(--primary)] block text-base mb-0.5" />
                <span>Mesa / Admin</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setFlowGuideOpen(false);
                  setScreenFlow("register_start");
                }}
                className="p-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-color)] hover:border-[var(--primary)] text-center text-xs font-semibold text-[var(--text-main)] hover:bg-[var(--primary-soft)] transition-colors"
              >
                <i className="bi bi-person-bounding-box text-[var(--primary)] block text-base mb-0.5" />
                <span>Biometria & KYC</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[var(--border-color)] bg-[var(--bg-subtle)] flex justify-end shrink-0">
          <button
            onClick={() => setFlowGuideOpen(false)}
            className="btn-primary px-5 h-9 text-xs"
          >
            Entendi, fechar guia
          </button>
        </div>
      </div>
    </div>
  );
}
