"use client";

import React from "react";
import { useApp } from "@/context/AppContext";

export function EmptyStateView() {
  const { setNegotiateStep, pendingMesaAgreements, setPreloadCode } = useApp();

  return (
    <div className="card-surface p-8 md:p-12 flex flex-col items-center justify-center text-center max-w-xl mx-auto my-4">
      {/* Document + Magnifier Illustration */}
      <div className="float-soft w-24 h-24 rounded-full bg-[var(--primary-soft)] flex items-center justify-center mb-5 relative">
        <div className="w-12 h-14 rounded-lg bg-[var(--bg-surface)] border border-[var(--primary-border)] flex flex-col justify-center px-2.5 gap-1.5 shadow-xs">
          <div className="w-full h-1.5 rounded bg-[var(--primary-border)]" />
          <div className="w-3/4 h-1.5 rounded bg-[var(--border-color)]" />
          <div className="w-1/2 h-1.5 rounded bg-[var(--border-color)]" />
        </div>
        <div className="w-8 h-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center absolute bottom-1 right-1 shadow-sm">
          <i className="bi bi-search text-xs leading-none" />
        </div>
      </div>

      <h2 className="text-xl font-bold text-[var(--text-main)]">
        Nenhum acordo encontrado
      </h2>
      <p className="text-sm text-[var(--text-secondary)] max-w-xs mt-1.5 mb-6 leading-relaxed">
        No momento não há acordos vinculados ao seu CPF.
      </p>

      {/* Stacked Action Buttons (Exact layout from Image 1) */}
      <div className="w-full max-w-xs space-y-2.5">
        <button
          onClick={() => {
            setPreloadCode("AC-4587962");
            setNegotiateStep("link_code");
          }}
          className="btn-primary w-full h-11 text-sm flex items-center justify-center gap-2"
        >
          <span>Vincular um acordo</span>
        </button>

        <button
          onClick={() => setNegotiateStep("search_cpf")}
          className="btn-secondary w-full h-11 text-sm flex items-center justify-center gap-2"
        >
          <span>Iniciar um novo acordo</span>
        </button>
      </div>

      {/* Demo shortcuts for offline mesa agreements */}
      {pendingMesaAgreements.length > 0 && (
        <div className="mt-6 pt-4 border-t border-[var(--border-color)] w-full max-w-xs text-center">
          <span className="text-[11px] text-[var(--text-muted)] block mb-2 font-medium">
            Códigos prontos da mesa de negociação para testar:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {pendingMesaAgreements.slice(0, 3).map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => {
                  setPreloadCode(a.id);
                  setNegotiateStep("link_code");
                }}
                className="px-2.5 py-1 rounded-md bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[11px] font-semibold text-[var(--text-secondary)] hover:text-[var(--primary)] hover:border-[var(--primary)] hover:bg-[var(--primary-soft)] transition-colors flex items-center gap-1"
                title={`Vincular acordo ${a.id} de ${a.creditor}`}
              >
                <i className="bi bi-tag text-[10px] text-[var(--primary)]" />
                <span className="num-tabular">{a.id}</span>
                <span className="text-[10px] text-[var(--text-muted)]">({a.creditor.split(" ")[0]})</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

