"use client";

import React, { useState } from "react";

export function SupportView() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [showChatBox, setShowChatBox] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [sentSuccess, setSentSuccess] = useState(false);

  const faqs = [
    {
      q: "Como pagar minha parcela?",
      a: "Acesse a aba Pagamentos para copiar o código Pix ou gerar o boleto bancário. Caso seu acordo esteja vinculado ao talão da Sanepar ou Copel, a parcela será cobrada automaticamente na sua fatura mensal.",
    },
    {
      q: "Onde encontro meu contrato?",
      a: "Na aba Meus Acordos, clique sobre o seu acordo ativo para expandir os detalhes e acessar o contrato digital assinado.",
    },
    {
      q: "Posso antecipar as parcelas?",
      a: "Sim. Você pode antecipar o pagamento de parcelas a qualquer momento pela aba Pagamentos utilizando o Pix.",
    },
    {
      q: "Como atualizar meus dados?",
      a: "Acesse a aba Meu Perfil e clique no botão Editar dados para atualizar seu telefone, e-mail ou endereço.",
    },
    {
      q: "Em quanto tempo o pagamento é confirmado?",
      a: "Pagamentos via Pix são confirmados em poucos segundos. Boletos bancários e faturas de concessionária levam até 2 dias úteis para compensação.",
    },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    setMessageText("");
    setSentSuccess(true);
    setTimeout(() => setSentSuccess(false), 3000);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-[var(--text-main)]">Ajuda e Suporte</h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
          Tire suas dúvidas, fale com nosso time ou abra um chamado.
        </p>
      </div>

      {/* Two Columns on Desktop, Stacked on Mobile (Exact match to Image 3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Card: Fale com o Suporte */}
        <div className="lg:col-span-5 card-surface p-6 space-y-4">
          <div className="flex items-center gap-2.5">
            <i className="bi bi-headset text-lg text-[var(--primary)]" />
            <h3 className="text-base font-bold text-[var(--text-main)]">Fale com o Suporte</h3>
          </div>

          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Precisa de ajuda? Abra um chamado e nosso time vai te atender o mais rápido possível.
          </p>

          <div className="space-y-2.5 pt-1">
            <button
              onClick={() => setShowChatBox(true)}
              className="btn-primary w-full h-11 text-xs flex items-center justify-center gap-2"
            >
              <i className="bi bi-envelope-plus" />
              <span>Abrir um chamado</span>
            </button>

            <button
              onClick={() => setShowChatBox(true)}
              className="btn-secondary w-full h-11 text-xs flex items-center justify-center gap-2"
            >
              <i className="bi bi-chat-dots text-[var(--text-secondary)]" />
              <span>Conversar no Chat</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--success)] ml-1">
                <span className="w-2 h-2 rounded-full bg-[var(--success)]" />
                Online
              </span>
            </button>
          </div>

          {showChatBox && (
            <form
              onSubmit={handleSendMessage}
              className="expand-in pt-4 border-t border-[var(--border-color)] space-y-3 text-xs"
            >
              <label className="block font-semibold text-[var(--text-main)]">
                Envie sua mensagem para a equipe:
              </label>
              <textarea
                rows={3}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Descreva como podemos ajudar..."
                className="input-field w-full p-3 text-xs"
              />
              {sentSuccess && (
                <p className="text-xs font-semibold text-[var(--success)] flex items-center gap-1.5">
                  <i className="bi bi-check-circle-fill" />
                  <span>Chamado enviado com sucesso!</span>
                </p>
              )}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowChatBox(false)}
                  className="btn-secondary px-3 h-9 text-xs"
                >
                  Fechar
                </button>
                <button type="submit" className="btn-primary px-4 h-9 text-xs">
                  Enviar
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Card: Perguntas Frequentes */}
        <div className="lg:col-span-7 card-surface p-6">
          <div className="flex items-center gap-2.5 mb-4">
            <i className="bi bi-question-circle text-lg text-[var(--primary)]" />
            <h3 className="text-base font-bold text-[var(--text-main)]">Perguntas Frequentes</h3>
          </div>

          <div className="divide-y divide-[var(--border-color)]">
            {faqs.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="py-3 first:pt-0 last:pb-0">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left text-xs font-semibold text-[var(--text-main)] hover:text-[var(--primary)] py-1"
                  >
                    <span>{item.q}</span>
                    <i
                      className={`bi bi-chevron-${isOpen ? "up" : "down"} text-xs text-[var(--text-muted)]`}
                    />
                  </button>

                  {isOpen && (
                    <p className="expand-in text-xs text-[var(--text-secondary)] mt-2 leading-relaxed">
                      {item.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

