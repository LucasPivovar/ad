"use client";

import React, { useState } from "react";
import { AppProvider, useApp } from "@/context/AppContext";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { DashboardView } from "@/components/DashboardView";
import { MyAgreementsView } from "@/components/MyAgreementsView";
import { MyDebtsView } from "@/components/MyDebtsView";
import { PaymentsView } from "@/components/PaymentsView";
import { ProfileView } from "@/components/ProfileView";
import { SupportView } from "@/components/SupportView";
import { OnboardingModal } from "@/components/OnboardingModal";
import { PaymentActionModal } from "@/components/PaymentActionModal";
import { AdminDrawer } from "@/components/AdminDrawer";
import { FlowGuideModal } from "@/components/FlowGuideModal";
import { MobileSimulatorModal } from "@/components/MobileSimulatorModal";
import { ToastNotification } from "@/components/ToastNotification";

function AppShell() {
  const { screenFlow, activeTab } = useApp();

  const [paymentModal, setPaymentModal] = useState<{
    agreementId: string | null;
    directMethod?: "pix" | "boleto";
  }>({
    agreementId: null,
  });

  const handleOpenPayment = (agreementId: string, directMethod?: "pix" | "boleto") => {
    setPaymentModal({ agreementId, directMethod });
  };

  // Telas dedicadas: Login, Cadastro (4 etapas) ou Painel Admin
  if (
    screenFlow === "login" ||
    screenFlow === "register_start" ||
    screenFlow === "register_steps" ||
    screenFlow === "register_done"
  ) {
    return <OnboardingModal />;
  }

  if (screenFlow === "admin") {
    return <AdminDrawer />;
  }

  // Área Logada do Cliente (Responsiva: Mobile-First com Bottom Nav e Desktop com Sidebar)
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--bg-app)]">
      {/* Sidebar Desktop (>= 768px) */}
      <div className="hidden md:flex h-full shrink-0">
        <Sidebar />
      </div>

      {/* Área Principal */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div key={activeTab} className="max-w-5xl mx-auto tab-enter">
            {activeTab === "inicio" && (
              <DashboardView onOpenPaymentModal={handleOpenPayment} />
            )}
            {activeTab === "meus-acordos" && (
              <MyAgreementsView onOpenPaymentModal={handleOpenPayment} />
            )}
            {activeTab === "minhas-dividas" && (
              <MyDebtsView onOpenPaymentModal={handleOpenPayment} />
            )}
            {activeTab === "pagamentos" && (
              <PaymentsView onOpenPaymentModal={handleOpenPayment} />
            )}
            {activeTab === "perfil" && <ProfileView />}
            {activeTab === "suporte" && <SupportView />}
          </div>
        </main>

        {/* Navegação Inferior Mobile (< 768px) */}
        <div className="md:hidden shrink-0">
          <MobileBottomNav />
        </div>
      </div>

      {/* Modal de Pagamento (Pix, Boleto e Talão) */}
      <PaymentActionModal
        agreementId={paymentModal.agreementId}
        directMethod={paymentModal.directMethod}
        onClose={() => setPaymentModal({ agreementId: null })}
      />

      {/* Guia Autoexplicativo do Produto */}
      <FlowGuideModal />

      {/* Simulador Mobile em Moldura de Smartphone (Imagem 4) */}
      <MobileSimulatorModal />

      {/* Notificação Toast Flutuante */}
      <ToastNotification />
    </div>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
