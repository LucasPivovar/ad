"use client";

import React, { createContext, useContext, useState } from "react";
import { UserProfile, Agreement, AvailableDebt, PaymentReceipt } from "@/types";

export type ScreenFlow =
  | "portal" // Área logada normal (Início, Acordos, Dívidas, Pagamentos, Perfil, Suporte)
  | "login" // Tela de Login (Imagem 3 topo-esq)
  | "register_start" // Tela "Crie sua conta - Informe seu CPF" (Imagem 2 topo-esq)
  | "register_steps" // Wizard 4 passos: Dados pessoais, Acesso, Documentos, Selfie (Imagem 2)
  | "register_done" // "Cadastro enviado para análise!" (Imagem 2 base-dir)
  | "admin"; // Backoffice Admin (Áudio 1 e 2)

export type NegotiateStep =
  | "none"
  | "link_code" // 1. Vincular acordo existente (digitar código)
  | "link_found" // 1. Acordo encontrado!
  | "search_cpf" // 2. Buscar acordo por CPF
  | "available_debts" // 2. Acordos disponíveis
  | "proposal" // 2. Proposta de acordo
  | "review" // 2. Revisão e confirmação
  | "contract" // 3. Contrato digital
  | "contract_signed" // 3. Contrato assinado!
  | "kyc_intro" // 3. Validação de identidade
  | "kyc_docs" // 3. Envie seu documento
  | "kyc_selfie" // 3. Tire uma selfie
  | "kyc_done"; // 3. Validação concluída!

interface AppContextType {
  // Navegação principal de telas
  screenFlow: ScreenFlow;
  setScreenFlow: (flow: ScreenFlow) => void;

  // Aba ativa dentro do Portal Logado
  activeTab: "inicio" | "meus-acordos" | "minhas-dividas" | "pagamentos" | "perfil" | "suporte";
  setActiveTab: (
    tab: "inicio" | "meus-acordos" | "minhas-dividas" | "pagamentos" | "perfil" | "suporte"
  ) => void;

  // Modo Cliente Com Acordo vs Cliente Sem Acordo (Imagem 1 & Áudio 1)
  hasLinkedAgreements: boolean;
  setHasLinkedAgreements: (val: boolean) => void;

  // Fluxo de Vinculação / Novo Acordo (Imagem 1)
  negotiateStep: NegotiateStep;
  setNegotiateStep: (step: NegotiateStep) => void;

  // Dados do Usuário
  user: UserProfile;
  updateUser: (data: Partial<UserProfile>) => void;

  // Proposta e Acordos
  agreements: Agreement[];
  pendingMesaAgreements: Agreement[];
  availableDebts: AvailableDebt[];
  receipts: PaymentReceipt[];
  selectedDebt: AvailableDebt;
  setSelectedDebt: (debt: AvailableDebt) => void;
  selectedOfferIndex: number;
  setSelectedOfferIndex: (index: number) => void;
  selectedPaymentMethod: "pix_boleto" | "talao_sanepar" | "talao_copel";
  setSelectedPaymentMethod: (method: "pix_boleto" | "talao_sanepar" | "talao_copel") => void;
  concessionaireAccount: string;
  setConcessionaireAccount: (acc: string) => void;
  preloadCode: string;
  setPreloadCode: (code: string) => void;

  // Ações de negócio
  linkAgreementByCode: (code: string) => Agreement | null;
  finalizeNewAgreement: () => Agreement;
  payInstallment: (
    agreementId: string,
    method: "PIX" | "BOLETO" | "TALÃO SANEPAR" | "TALÃO COPEL"
  ) => void;
  adminCreateAgreement: (newAgr: Omit<Agreement, "id" | "createdAt">) => Agreement;
}

const INITIAL_USER: UserProfile = {
  id: "usr_01",
  name: "Lucas Wallysson Antunes Oliveira",
  cpf: "123.456.789-09",
  email: "lucas@exemplo.com",
  phone: "(41) 98456-7890",
  birthDate: "15/04/1992",
  address: {
    cep: "83702-000",
    street: "Rua das Araucárias",
    number: "123",
    complement: "Apto 01",
    neighborhood: "Centro",
    city: "Araucária",
    uf: "PR",
  },
  kycStatus: "approved",
};

const INITIAL_AGREEMENTS: Agreement[] = [
  {
    id: "AC-4587962",
    creditor: "Banco Itaú",
    creditorType: "itau",
    contractNumber: "4587***",
    originalAmount: 4320.0,
    discountAmount: 2880.0,
    settlementAmount: 1440.0,
    installments: 12,
    installmentValue: 120.0,
    paidInstallments: 3,
    status: "em_dia",
    nextDueDate: "10/11/2026",
    paymentMethod: "pix_boleto",
    createdAt: "2026-08-10",
  },
  {
    id: "AC-9876321",
    creditor: "Santander",
    creditorType: "santander",
    contractNumber: "9876***",
    originalAmount: 3920.0,
    discountAmount: 1040.0,
    settlementAmount: 2880.0,
    installments: 24,
    installmentValue: 240.0,
    paidInstallments: 4,
    status: "em_dia",
    nextDueDate: "15/11/2026",
    paymentMethod: "talao_sanepar",
    concessionaireAccount: "Sanepar 8492019-2",
    createdAt: "2026-07-15",
  },
];

const INITIAL_DEBTS: AvailableDebt[] = [
  {
    id: "debt_itau",
    creditor: "Banco Itaú",
    creditorType: "itau",
    contractMasked: "4587***",
    originalAmount: 4320.0,
    offers: [
      {
        installments: 12,
        installmentValue: 120.0,
        totalAmount: 1440.0,
        discountPercentage: 67,
        description: "12x de R$ 120,00",
      },
      {
        installments: 6,
        installmentValue: 240.0,
        totalAmount: 1440.0,
        discountPercentage: 67,
        description: "6x de R$ 240,00",
      },
      {
        installments: 1,
        installmentValue: 1296.0,
        totalAmount: 1296.0,
        discountPercentage: 70,
        description: "À vista por R$ 1.296,00",
      },
    ],
  },
  {
    id: "debt_santander",
    creditor: "Santander",
    creditorType: "santander",
    contractMasked: "9876***",
    originalAmount: 3920.0,
    offers: [
      {
        installments: 24,
        installmentValue: 240.0,
        totalAmount: 3920.0,
        discountPercentage: 25,
        description: "24x de R$ 240,00",
      },
      {
        installments: 12,
        installmentValue: 240.0,
        totalAmount: 2880.0,
        discountPercentage: 35,
        description: "12x de R$ 240,00",
      },
    ],
  },
  {
    id: "debt_vivo",
    creditor: "Vivo",
    creditorType: "vivo",
    contractMasked: "1166***",
    originalAmount: 2240.0,
    offers: [
      {
        installments: 10,
        installmentValue: 90.0,
        totalAmount: 900.0,
        discountPercentage: 60,
        description: "10x de R$ 90,00",
      },
      {
        installments: 1,
        installmentValue: 750.0,
        totalAmount: 750.0,
        discountPercentage: 66,
        description: "À vista com 66% de desconto",
      },
    ],
  },
];

const INITIAL_RECEIPTS: PaymentReceipt[] = [
  {
    id: "REC-001",
    agreementId: "AC-4587962",
    creditor: "Banco Itaú",
    installment: 1,
    totalInstallments: 12,
    amount: 120.0,
    paidAt: "10/08/2026",
    method: "PIX",
    authCode: "E908234812390",
  },
  {
    id: "REC-002",
    agreementId: "AC-4587962",
    creditor: "Banco Itaú",
    installment: 2,
    totalInstallments: 12,
    amount: 120.0,
    paidAt: "10/09/2026",
    method: "BOLETO",
    authCode: "BOL-238472938",
  },
  {
    id: "REC-003",
    agreementId: "AC-4587962",
    creditor: "Banco Itaú",
    installment: 3,
    totalInstallments: 12,
    amount: 120.0,
    paidAt: "10/10/2026",
    method: "PIX",
    authCode: "E112938402938",
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [screenFlow, setScreenFlow] = useState<ScreenFlow>("portal");
  const [activeTab, setActiveTab] = useState<
    "inicio" | "meus-acordos" | "minhas-dividas" | "pagamentos" | "perfil" | "suporte"
  >("inicio");
  const [hasLinkedAgreements, setHasLinkedAgreements] = useState<boolean>(true);
  const [negotiateStep, setNegotiateStep] = useState<NegotiateStep>("none");

  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [agreements, setAgreements] = useState<Agreement[]>(INITIAL_AGREEMENTS);
  // Acordos gerados na mesa de negociação pelo Admin aguardando vinculação pelo cliente:
  const [pendingMesaAgreements, setPendingMesaAgreements] = useState<Agreement[]>([
    {
      id: "AC-4587962",
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
      paymentMethod: "pix_boleto",
      createdAt: "2026-11-03",
    },
    {
      id: "AC-7894561",
      creditor: "Lojas Renner",
      creditorType: "other",
      contractNumber: "7894***",
      originalAmount: 3200.0,
      discountAmount: 2000.0,
      settlementAmount: 1200.0,
      installments: 10,
      installmentValue: 120.0,
      paidInstallments: 0,
      status: "em_dia",
      nextDueDate: "10/12/2026",
      paymentMethod: "talao_sanepar",
      concessionaireAccount: "Sanepar 8492019-2",
      createdAt: "2026-11-03",
    },
  ]);

  const [availableDebts] = useState<AvailableDebt[]>(INITIAL_DEBTS);
  const [receipts, setReceipts] = useState<PaymentReceipt[]>(INITIAL_RECEIPTS);

  const [selectedDebt, setSelectedDebt] = useState<AvailableDebt>(INITIAL_DEBTS[0]);
  const [selectedOfferIndex, setSelectedOfferIndex] = useState<number>(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "pix_boleto" | "talao_sanepar" | "talao_copel"
  >("pix_boleto");
  const [concessionaireAccount, setConcessionaireAccount] = useState<string>("8492019-2");
  const [preloadCode, setPreloadCode] = useState<string>("AC-4587962");

  const updateUser = (data: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...data }));
  };

  const linkAgreementByCode = (code: string): Agreement | null => {
    const clean = code.trim().toUpperCase();

    // 1. Procurar nos acordos gerados na mesa de negociação pelo Admin
    const foundPending = pendingMesaAgreements.find(
      (a) => a.id.toUpperCase() === clean || a.contractNumber.includes(clean.replace(/\D/g, ""))
    );
    if (foundPending) {
      setAgreements((prev) => {
        const already = prev.find((a) => a.id === foundPending.id);
        if (already) return prev;
        return [foundPending, ...prev];
      });
      setHasLinkedAgreements(true);
      return foundPending;
    }

    // 2. Procurar nos acordos pré-existentes
    const existing = agreements.find((a) => a.id.toUpperCase() === clean);
    if (existing) {
      setHasLinkedAgreements(true);
      return existing;
    }

    // 3. Fallback inteligente para qualquer código digitado durante a apresentação
    const created: Agreement = {
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
    };
    setAgreements((prev) => [created, ...prev]);
    setHasLinkedAgreements(true);
    return created;
  };

  const finalizeNewAgreement = (): Agreement => {
    const offer = selectedDebt.offers[selectedOfferIndex] || selectedDebt.offers[0];
    const created: Agreement = {
      id: "AC-4587962",
      creditor: selectedDebt.creditor,
      creditorType: selectedDebt.creditorType,
      contractNumber: selectedDebt.contractMasked,
      originalAmount: selectedDebt.originalAmount,
      discountAmount: selectedDebt.originalAmount - offer.totalAmount,
      settlementAmount: offer.totalAmount,
      installments: offer.installments,
      installmentValue: offer.installmentValue,
      paidInstallments: 0,
      status: "em_dia",
      nextDueDate: "10/11/2026",
      paymentMethod: selectedPaymentMethod,
      concessionaireAccount:
        selectedPaymentMethod !== "pix_boleto"
          ? `${selectedPaymentMethod === "talao_sanepar" ? "Sanepar" : "Copel"} ${concessionaireAccount}`
          : undefined,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setAgreements((prev) => {
      const exists = prev.some((a) => a.id === created.id);
      if (exists) {
        return prev.map((a) => (a.id === created.id ? created : a));
      }
      return [created, ...prev];
    });
    setHasLinkedAgreements(true);
    return created;
  };

  const payInstallment = (
    agreementId: string,
    method: "PIX" | "BOLETO" | "TALÃO SANEPAR" | "TALÃO COPEL"
  ) => {
    setAgreements((prev) =>
      prev.map((agr) => {
        if (agr.id === agreementId && agr.paidInstallments < agr.installments) {
          const nextPaid = agr.paidInstallments + 1;
          const newRec: PaymentReceipt = {
            id: `REC-${Math.floor(1000 + Math.random() * 9000)}`,
            agreementId: agr.id,
            creditor: agr.creditor,
            installment: nextPaid,
            totalInstallments: agr.installments,
            amount: agr.installmentValue,
            paidAt: new Date().toLocaleDateString("pt-BR"),
            method,
            authCode: `AUT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
          };
          setReceipts((r) => [newRec, ...r]);
          return {
            ...agr,
            paidInstallments: nextPaid,
            status: nextPaid >= agr.installments ? "quitado" : "em_dia",
          };
        }
        return agr;
      })
    );
  };

  // Criação do acordo pela mesa de negociação no Admin
  const adminCreateAgreement = (newAgr: Omit<Agreement, "id" | "createdAt">): Agreement => {
    const created: Agreement = {
      ...newAgr,
      id: `AC-${Math.floor(1000000 + Math.random() * 9000000)}`,
      createdAt: new Date().toISOString().split("T")[0],
    };
    // Salva na fila de acordos pendentes da mesa para vinculação por código
    setPendingMesaAgreements((prev) => [created, ...prev]);
    // Também adiciona diretamente à carteira do CPF
    setAgreements((prev) => [created, ...prev]);
    return created;
  };

  const visibleAgreements = hasLinkedAgreements ? agreements : [];

  return (
    <AppContext.Provider
      value={{
        screenFlow,
        setScreenFlow,
        activeTab,
        setActiveTab,
        hasLinkedAgreements,
        setHasLinkedAgreements,
        negotiateStep,
        setNegotiateStep,
        user,
        updateUser,
        agreements: visibleAgreements,
        pendingMesaAgreements,
        availableDebts,
        receipts,
        selectedDebt,
        setSelectedDebt,
        selectedOfferIndex,
        setSelectedOfferIndex,
        selectedPaymentMethod,
        setSelectedPaymentMethod,
        concessionaireAccount,
        setConcessionaireAccount,
        preloadCode,
        setPreloadCode,
        linkAgreementByCode,
        finalizeNewAgreement,
        payInstallment,
        adminCreateAgreement,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
