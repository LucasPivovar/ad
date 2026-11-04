"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";

export function OnboardingModal() {
  const { screenFlow, setScreenFlow, user, updateUser, setHasLinkedAgreements } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [loginCpf, setLoginCpf] = useState(user.cpf);
  const [loginPass, setLoginPass] = useState("12345678");
  const [showPass, setShowPass] = useState(false);

  const [form, setForm] = useState({
    name: user.name,
    birthDate: user.birthDate,
    cpf: user.cpf,
    phone: user.phone,
    email: user.email,
    cep: user.address.cep,
    street: user.address.street,
    number: user.address.number,
    complement: user.address.complement || "Apto 01",
    neighborhood: user.address.neighborhood,
    city: user.address.city,
    uf: user.address.uf,
    password: "••••••••••••",
    confirmPassword: "••••••••••••",
    terms: true,
    whatsappOptIn: true,
  });

  const [frontDocSent, setFrontDocSent] = useState(false);
  const [backDocSent, setBackDocSent] = useState(false);
  const [selfieTaken, setSelfieTaken] = useState(false);
  const [flashActive, setFlashActive] = useState(false);

  const handleTakeSelfie = () => {
    setFlashActive(true);
    setTimeout(() => {
      setFlashActive(false);
      setSelfieTaken(true);
    }, 350);
  };

  /* ----------------------------------------------------------------
     1. TELA DE LOGIN (Referência Acordo Certo + PWA Mobile First)
     ---------------------------------------------------------------- */
  if (screenFlow === "login") {
    return (
      <div className="min-h-screen bg-[var(--bg-app)] flex flex-col items-center justify-center p-3 sm:p-6 md:p-8">
        {/* Mobile Top Bar (PWA Header) */}
        <div className="w-full max-w-5xl flex items-center justify-between mb-3 md:hidden px-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[var(--primary)] text-[var(--accent)] flex items-center justify-center shadow-sm">
              <i className="bi bi-check-lg text-sm" />
            </div>
            <span className="text-base font-black tracking-tight text-[var(--primary)]">
              ACRED<span className="text-[var(--accent)]">TA</span>
            </span>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[var(--text-secondary)] bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full border border-[var(--border-color)] shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
            App Oficial • PWA
          </span>
        </div>

        {/* Main 2-Column Container */}
        <div className="card-surface page-enter w-full max-w-5xl p-4 sm:p-8 md:p-10 shadow-2xl">
          {/* Mobile-Only Hero Banner (< 768px) */}
          <div className="md:hidden mb-5 relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#021C39] via-[#042852] to-[#021C39] p-4 text-white shadow-lg border border-[#0a3564]">
            <div className="flex items-center justify-between gap-3 relative z-10">
              <div className="space-y-1 flex-1">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-bold text-[#01C583] tracking-wider uppercase">
                  <i className="bi bi-people-fill text-[9px]" /> De pessoas para pessoas
                </span>
                <p className="text-[11px] text-white/80 font-medium">Tudo para você dizer:</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-black text-white tracking-tight">tá pago</span>
                  <span className="w-5 h-5 rounded-full bg-[#01C583] text-[#021C39] flex items-center justify-center font-black text-xs shadow-xs">
                    <i className="bi bi-check-lg" />
                  </span>
                </div>
              </div>
              <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/20 shadow-md shrink-0">
                <img
                  src="/images/hero-smile.jpg"
                  alt="Cliente com celular"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-center">
            {/* Left Column: Form & Access */}
            <div className="md:col-span-6 space-y-5">
              {/* Desktop Logo */}
              <div className="hidden md:flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[var(--primary)] text-[var(--accent)] flex items-center justify-center shadow-sm">
                  <i className="bi bi-check-lg text-base" />
                </div>
                <span className="text-xl font-black tracking-tight text-[var(--primary)]">
                  ACRED<span className="text-[var(--accent)]">TA</span>
                </span>
              </div>

              {/* Badge De pessoas para pessoas */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6EAF7] border border-[#d0d8ef] text-[#021C39] text-xs font-bold tracking-wide uppercase">
                <i className="bi bi-people-fill text-[#01C583]" />
                <span>De pessoas para pessoas</span>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)] leading-tight tracking-tight">
                  Acesse sua conta e acompanhe seus acordos
                </h1>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1.5 leading-relaxed">
                  Consulte seu CPF e acesse sua área com transparência, rapidez e total segurança.
                </p>
              </div>

              {/* Login Form Box */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-4 shadow-xs">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-[var(--text-main)] mb-1">
                      CPF ou E-mail
                    </label>
                    <div className="relative">
                      <i className="bi bi-person text-sm text-[var(--text-muted)] absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        value={loginCpf}
                        onChange={(e) => setLoginCpf(e.target.value)}
                        placeholder="Digite seu CPF ou E-mail"
                        className="input-field w-full h-12 pl-10 pr-3.5 text-sm num-tabular"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[var(--text-main)] mb-1">
                      Senha
                    </label>
                    <div className="relative">
                      <i className="bi bi-lock text-sm text-[var(--text-muted)] absolute left-3.5 top-3.5" />
                      <input
                        type={showPass ? "text" : "password"}
                        value={loginPass}
                        onChange={(e) => setLoginPass(e.target.value)}
                        placeholder="Digite sua senha"
                        className="input-field w-full h-12 pl-10 pr-10 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3.5 top-3.5 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                        aria-label="Mostrar ou ocultar senha"
                      >
                        <i className={`bi ${showPass ? "bi-eye-slash" : "bi-eye"} text-base`} />
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setScreenFlow("portal")}
                  className="btn-primary w-full h-12 text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  <span>Entrar na minha conta</span>
                  <i className="bi bi-arrow-right" />
                </button>

                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => setScreenFlow("portal")}
                    className="text-[var(--primary)] font-semibold hover:underline"
                  >
                    Esqueceu sua senha?
                  </button>
                  <span className="text-[var(--text-light)]">•</span>
                  <button
                    type="button"
                    onClick={() => setScreenFlow("register_start")}
                    className="text-[var(--accent-hover)] font-bold hover:underline"
                  >
                    Criar meu acesso
                  </button>
                </div>
              </div>

              {/* Security Pill */}
              <div className="flex items-center gap-2.5 text-xs text-[var(--text-secondary)] pt-1">
                <i className="bi bi-shield-check text-base text-[var(--accent)] shrink-0" />
                <span>Ambiente protegido com criptografia de ponta a ponta e sigilo bancário.</span>
              </div>
            </div>

            {/* Right Column: Acordo Certo Lifestyle Hero (Desktop >= 768px) */}
            <div className="hidden md:flex md:col-span-6 flex-col justify-between rounded-3xl overflow-hidden bg-gradient-to-br from-[#021C39] via-[#042852] to-[#021C39] p-7 min-h-[500px] border border-[#0a3564] shadow-2xl relative">
              {/* Decorative Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#01C583]/10 blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#0284c7]/20 blur-3xl pointer-events-none" />

              {/* Floating Navy Badge: "Tudo para você dizer: tá pago" (Acordo Certo Reference) */}
              <div className="relative z-20 self-start bg-[#021C39]/95 backdrop-blur-md border border-white/20 text-white rounded-2xl p-4 sm:p-5 shadow-2xl max-w-[210px] transform hover:scale-[1.02] transition-transform">
                <p className="text-xs text-white/80 font-medium leading-tight">
                  Tudo para você dizer:
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">tá pago</span>
                  <span className="w-7 h-7 rounded-full bg-[#01C583] text-[#021C39] flex items-center justify-center font-black text-sm shadow-sm">
                    <i className="bi bi-check-lg" />
                  </span>
                </div>
              </div>

              {/* Photos Composition of diverse smiling Brazilians with smartphone */}
              <div className="relative z-10 my-4 flex items-end justify-center gap-3 sm:gap-4 flex-1">
                {/* Young man smiling with smartphone */}
                <div className="relative w-36 h-52 rounded-2xl overflow-hidden border-2 border-white/10 shadow-lg transform -rotate-2 hover:rotate-0 transition-transform">
                  <img
                    src="/images/hero-phone.jpg"
                    alt="Cliente Acredta com smartphone"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#021C39]/80 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 flex items-center gap-1.5 text-[10px] text-white font-medium">
                    <i className="bi bi-shield-fill-check text-[#01C583]" />
                    <span>100% seguro</span>
                  </div>
                </div>

                {/* Young woman smiling with phone (foreground) */}
                <div className="relative w-44 h-64 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform z-10">
                  <img
                    src="/images/hero-smile.jpg"
                    alt="Cliente sorrindo no celular"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#021C39]/70 via-transparent to-transparent" />
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center gap-1.5 text-[11px] text-white font-bold">
                    <span className="w-2 h-2 rounded-full bg-[#01C583] animate-ping" />
                    <span>Acordo em dia</span>
                  </div>
                </div>
              </div>

              {/* Bottom stats & community pill */}
              <div className="relative z-20 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10 text-white/90">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-[#01C583]">
                    <i className="bi bi-people-fill text-xs" />
                  </div>
                  <div>
                    <span className="text-[10px] text-white/70 block leading-none">Comunidade</span>
                    <strong className="text-xs font-bold text-white">+50 mil acordos</strong>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-semibold text-white/90">
                  <i className="bi bi-patch-check-fill text-[#01C583]" />
                  <span>Portal Oficial ACREDTA</span>
                </div>
              </div>
            </div>
          </div>

          {/* Social Proof Media Bar (Acordo Certo Reference) */}
          <div className="mt-8 pt-6 border-t border-[var(--border-color)] text-center">
            <p className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
              Onde já fomos notícia e destaque nacional
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-[var(--text-light)] font-black text-xs tracking-wider opacity-80">
              <span>GLOBO</span>
              <span>•</span>
              <span>SBT</span>
              <span>•</span>
              <span>RECORD</span>
              <span>•</span>
              <span>BAND</span>
              <span>•</span>
              <span>VEJA</span>
              <span>•</span>
              <span>EXAME</span>
              <span>•</span>
              <span>CNN BRASIL</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ----------------------------------------------------------------
     2. INÍCIO DO CADASTRO - CAPTURA DE CPF (Referência Acordo Certo + PWA)
     ---------------------------------------------------------------- */
  if (screenFlow === "register_start") {
    return (
      <div className="min-h-screen bg-[var(--bg-app)] flex flex-col items-center justify-center p-3 sm:p-6 md:p-8">
        {/* Mobile Top Bar (PWA Header) */}
        <div className="w-full max-w-5xl flex items-center justify-between mb-3 md:hidden px-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[var(--primary)] text-[var(--accent)] flex items-center justify-center shadow-sm">
              <i className="bi bi-check-lg text-sm" />
            </div>
            <span className="text-base font-black tracking-tight text-[var(--primary)]">
              ACRED<span className="text-[var(--accent)]">TA</span>
            </span>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[var(--text-secondary)] bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full border border-[var(--border-color)] shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
            Cadastro Oficial • PWA
          </span>
        </div>

        {/* Main 2-Column Container */}
        <div className="card-surface page-enter w-full max-w-5xl p-4 sm:p-8 md:p-10 shadow-2xl">
          {/* Mobile-Only Hero Banner (< 768px) */}
          <div className="md:hidden mb-5 relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#021C39] via-[#042852] to-[#021C39] p-4 text-white shadow-lg border border-[#0a3564]">
            <div className="flex items-center justify-between gap-3 relative z-10">
              <div className="space-y-1 flex-1">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-bold text-[#01C583] tracking-wider uppercase">
                  <i className="bi bi-people-fill text-[9px]" /> De pessoas para pessoas
                </span>
                <p className="text-[11px] text-white/80 font-medium">Tudo para você dizer:</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-black text-white tracking-tight">tá pago</span>
                  <span className="w-5 h-5 rounded-full bg-[#01C583] text-[#021C39] flex items-center justify-center font-black text-xs shadow-xs">
                    <i className="bi bi-check-lg" />
                  </span>
                </div>
              </div>
              <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/20 shadow-md shrink-0">
                <img
                  src="/images/hero-phone.jpg"
                  alt="Cliente com celular"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-center">
            {/* Left Column: Register Card */}
            <div className="md:col-span-6 space-y-5">
              {/* Desktop Logo */}
              <div className="hidden md:flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[var(--primary)] text-[var(--accent)] flex items-center justify-center shadow-sm">
                  <i className="bi bi-check-lg text-base" />
                </div>
                <span className="text-xl font-black tracking-tight text-[var(--primary)]">
                  ACRED<span className="text-[var(--accent)]">TA</span>
                </span>
              </div>

              {/* Badge De pessoas para pessoas */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6EAF7] border border-[#d0d8ef] text-[#021C39] text-xs font-bold tracking-wide uppercase">
                <i className="bi bi-people-fill text-[#01C583]" />
                <span>De pessoas para pessoas</span>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)] leading-tight tracking-tight">
                  Consulte seu CPF e crie sua conta
                </h1>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1.5 leading-relaxed">
                  Verifique suas propostas de acordo, parcele no talão de concessionária ou Pix, e acompanhe tudo pelo celular.
                </p>
              </div>

              {/* Register Start Box */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[var(--bg-subtle)] border border-[var(--border-color)] space-y-4 shadow-xs">
                <div>
                  <label className="block text-xs font-bold text-[var(--text-main)] mb-1">
                    Digite seu CPF
                  </label>
                  <div className="relative">
                    <i className="bi bi-person-vcard text-sm text-[var(--text-muted)] absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={form.cpf}
                      onChange={(e) => setForm({ ...form, cpf: e.target.value })}
                      placeholder="000.000.000-00"
                      className="input-field w-full h-12 pl-10 pr-3.5 text-sm num-tabular"
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    setStep(1);
                    setScreenFlow("register_steps");
                  }}
                  className="btn-primary w-full h-12 text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  <span>Iniciar cadastro grátis</span>
                  <i className="bi bi-arrow-right" />
                </button>

                <div className="text-center pt-1">
                  <button
                    onClick={() => setScreenFlow("login")}
                    className="text-xs text-[var(--primary)] font-bold hover:underline"
                  >
                    Já tenho uma conta • Fazer login
                  </button>
                </div>
              </div>

              {/* Guarantee */}
              <div className="flex items-center gap-2.5 text-xs text-[var(--text-secondary)] pt-1">
                <i className="bi bi-shield-check text-base text-[var(--accent)] shrink-0" />
                <span>Consulta 100% gratuita, sem compromisso e protegida por sigilo bancário.</span>
              </div>
            </div>

            {/* Right Column: Acordo Certo Lifestyle Hero */}
            <div className="hidden md:flex md:col-span-6 flex-col justify-between rounded-3xl overflow-hidden bg-gradient-to-br from-[#021C39] via-[#042852] to-[#021C39] p-7 min-h-[500px] border border-[#0a3564] shadow-2xl relative">
              {/* Decorative Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#01C583]/10 blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#0284c7]/20 blur-3xl pointer-events-none" />

              {/* Floating Navy Badge: "Tudo para você dizer: tá pago" (Acordo Certo Reference) */}
              <div className="relative z-20 self-start bg-[#021C39]/95 backdrop-blur-md border border-white/20 text-white rounded-2xl p-4 sm:p-5 shadow-2xl max-w-[210px] transform hover:scale-[1.02] transition-transform">
                <p className="text-xs text-white/80 font-medium leading-tight">
                  Tudo para você dizer:
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">tá pago</span>
                  <span className="w-7 h-7 rounded-full bg-[#01C583] text-[#021C39] flex items-center justify-center font-black text-sm shadow-sm">
                    <i className="bi bi-check-lg" />
                  </span>
                </div>
              </div>

              {/* Photos Composition of diverse smiling Brazilians with smartphone */}
              <div className="relative z-10 my-4 flex items-end justify-center gap-3 sm:gap-4 flex-1">
                {/* Young man smiling with smartphone */}
                <div className="relative w-36 h-52 rounded-2xl overflow-hidden border-2 border-white/10 shadow-lg transform -rotate-2 hover:rotate-0 transition-transform">
                  <img
                    src="/images/hero-phone.jpg"
                    alt="Cliente Acredta com celular"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#021C39]/80 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 flex items-center gap-1.5 text-[10px] text-white font-medium">
                    <i className="bi bi-shield-fill-check text-[#01C583]" />
                    <span>100% seguro</span>
                  </div>
                </div>

                {/* Young woman smiling with phone (foreground) */}
                <div className="relative w-44 h-64 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform z-10">
                  <img
                    src="/images/hero-smile.jpg"
                    alt="Cliente sorrindo no celular"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#021C39]/70 via-transparent to-transparent" />
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center gap-1.5 text-[11px] text-white font-bold">
                    <span className="w-2 h-2 rounded-full bg-[#01C583] animate-ping" />
                    <span>Acordo em dia</span>
                  </div>
                </div>
              </div>

              {/* Bottom stats & community pill */}
              <div className="relative z-20 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10 text-white/90">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-[#01C583]">
                    <i className="bi bi-people-fill text-xs" />
                  </div>
                  <div>
                    <span className="text-[10px] text-white/70 block leading-none">Comunidade</span>
                    <strong className="text-xs font-bold text-white">+50 mil acordos</strong>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-semibold text-white/90">
                  <i className="bi bi-patch-check-fill text-[#01C583]" />
                  <span>Portal Oficial ACREDTA</span>
                </div>
              </div>
            </div>
          </div>

          {/* Social Proof Media Bar */}
          <div className="mt-8 pt-6 border-t border-[var(--border-color)] text-center">
            <p className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
              Onde já fomos notícia e destaque nacional
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-[var(--text-light)] font-black text-xs tracking-wider opacity-80">
              <span>GLOBO</span>
              <span>•</span>
              <span>SBT</span>
              <span>•</span>
              <span>RECORD</span>
              <span>•</span>
              <span>BAND</span>
              <span>•</span>
              <span>VEJA</span>
              <span>•</span>
              <span>EXAME</span>
              <span>•</span>
              <span>CNN BRASIL</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ----------------------------------------------------------------
     3. WIZARD DE CADASTRO EM 4 ETAPAS (Imagem 2 - Passos 1 a 4)
     ---------------------------------------------------------------- */
  if (screenFlow === "register_steps") {
    const stepsList = [
      { id: 1, label: "Dados pessoais" },
      { id: 2, label: "Acesso" },
      { id: 3, label: "Documentos" },
      { id: 4, label: "Selfie" },
    ] as const;

    return (
      <div className="min-h-screen bg-[var(--bg-app)] flex items-center justify-center p-4">
        <div className="card-surface page-enter w-full max-w-2xl p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)] mb-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[var(--primary)] text-[var(--accent)] flex items-center justify-center">
                <i className="bi bi-check-lg text-sm" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-[var(--primary)]">ACRED<span className="text-[var(--accent)]">TA</span></span>
            </div>
            <span className="text-xs font-semibold text-[var(--text-secondary)]">
              Cadastro da conta
            </span>
          </div>

          {/* Stepper Bar (Exact match to Image 2) */}
          <div className="relative flex items-center justify-between mb-7 px-2">
            <div className="absolute left-8 right-8 top-3.5 h-0.5 bg-[var(--border-color)] -z-0" />
            {stepsList.map((s) => {
              const isDone = step > s.id;
              const isCurrent = step === s.id;
              return (
                <div key={s.id} className="flex flex-col items-center relative z-10 bg-[var(--bg-surface)] px-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      isDone || isCurrent
                        ? "bg-[var(--primary)] text-white"
                        : "bg-[var(--bg-subtle)] border border-[var(--border-color)] text-[var(--text-muted)]"
                    }`}
                  >
                    {isDone ? <i className="bi bi-check-lg" /> : s.id}
                  </div>
                  <span
                    className={`text-[11px] mt-1 ${
                      isCurrent
                        ? "font-bold text-[var(--text-main)]"
                        : "text-[var(--text-muted)]"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* STEP 1: DADOS PESSOAIS */}
          {step === 1 && (
            <div className="space-y-4 page-enter">
              <div>
                <h2 className="text-lg font-bold text-[var(--text-main)]">Dados pessoais</h2>
                <p className="text-xs text-[var(--text-secondary)]">
                  Preencha suas informações pessoais.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-[var(--text-main)] mb-1">
                    Nome completo *
                  </label>
                  <div className="relative">
                    <i className="bi bi-person text-[var(--text-muted)] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="input-field w-full h-10 pl-9 pr-3"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[var(--text-main)] mb-1">
                      Data de nascimento *
                    </label>
                    <div className="relative">
                      <i className="bi bi-calendar3 text-[var(--text-muted)] absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={form.birthDate}
                        onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
                        className="input-field w-full h-10 pl-9 pr-3 num-tabular"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold text-[var(--text-main)] mb-1">
                      CPF *
                    </label>
                    <div className="relative">
                      <i className="bi bi-person-vcard text-[var(--text-muted)] absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={form.cpf}
                        onChange={(e) => setForm({ ...form, cpf: e.target.value })}
                        className="input-field w-full h-10 pl-9 pr-3 num-tabular"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[var(--text-main)] mb-1">
                      Celular *
                    </label>
                    <div className="relative">
                      <i className="bi bi-telephone text-[var(--text-muted)] absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="input-field w-full h-10 pl-9 pr-3 num-tabular"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold text-[var(--text-main)] mb-1">
                      E-mail *
                    </label>
                    <div className="relative">
                      <i className="bi bi-envelope text-[var(--text-muted)] absolute left-3 top-2.5" />
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="input-field w-full h-10 pl-9 pr-3"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-[var(--text-main)] mb-1">
                      CEP *
                    </label>
                    <div className="relative">
                      <i className="bi bi-geo-alt text-[var(--text-muted)] absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={form.cep}
                        onChange={(e) => setForm({ ...form, cep: e.target.value })}
                        className="input-field w-full h-10 pl-9 pr-8 num-tabular"
                      />
                      <i className="bi bi-search text-[var(--primary)] absolute right-3 top-2.5" />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-[var(--text-main)] mb-1">
                      Endereço
                    </label>
                    <input
                      type="text"
                      value={form.street}
                      onChange={(e) => setForm({ ...form, street: e.target.value })}
                      className="input-field w-full h-10 px-3"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-[var(--text-main)] mb-1">
                      Número
                    </label>
                    <input
                      type="text"
                      value={form.number}
                      onChange={(e) => setForm({ ...form, number: e.target.value })}
                      className="input-field w-full h-10 px-3"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[var(--text-main)] mb-1">
                      Complemento
                    </label>
                    <input
                      type="text"
                      value={form.complement}
                      onChange={(e) => setForm({ ...form, complement: e.target.value })}
                      className="input-field w-full h-10 px-3"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[var(--text-main)] mb-1">
                      Bairro
                    </label>
                    <input
                      type="text"
                      value={form.neighborhood}
                      onChange={(e) => setForm({ ...form, neighborhood: e.target.value })}
                      className="input-field w-full h-10 px-3"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block font-semibold text-[var(--text-main)] mb-1">
                      Cidade
                    </label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="input-field w-full h-10 px-3"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[var(--text-main)] mb-1">UF</label>
                    <select
                      value={form.uf}
                      onChange={(e) => setForm({ ...form, uf: e.target.value })}
                      className="input-field w-full h-10 px-3"
                    >
                      <option value="PR">PR</option>
                      <option value="SP">SP</option>
                      <option value="SC">SC</option>
                      <option value="RJ">RJ</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="btn-primary w-full h-11 text-xs flex items-center justify-center gap-2 mt-2"
              >
                <span>Continuar</span>
                <i className="bi bi-arrow-right" />
              </button>
            </div>
          )}

          {/* STEP 2: DADOS DE ACESSO */}
          {step === 2 && (
            <div className="space-y-4 page-enter">
              <div>
                <h2 className="text-lg font-bold text-[var(--text-main)]">Dados de acesso</h2>
                <p className="text-xs text-[var(--text-secondary)]">
                  Crie sua senha e finalize as configurações da sua conta.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-[var(--text-main)] mb-1">
                    Senha *
                  </label>
                  <div className="relative">
                    <i className="bi bi-lock text-[var(--text-muted)] absolute left-3 top-2.5" />
                    <input
                      type={showPass ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="input-field w-full h-10 pl-9 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-2.5 text-[var(--text-muted)]"
                    >
                      <i className={`bi ${showPass ? "bi-eye-slash" : "bi-eye"}`} />
                    </button>
                  </div>
                  <span className="text-[11px] text-[var(--text-muted)] mt-1 block">
                    Mínimo de 6 caracteres, com letras e números.
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-[var(--text-main)] mb-1">
                    Confirmar senha *
                  </label>
                  <div className="relative">
                    <i className="bi bi-lock text-[var(--text-muted)] absolute left-3 top-2.5" />
                    <input
                      type={showPass ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                      className="input-field w-full h-10 pl-9 pr-10"
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.terms}
                      onChange={(e) => setForm({ ...form, terms: e.target.checked })}
                      className="w-4 h-4 accent-[var(--primary)] rounded"
                    />
                    <span className="text-[var(--text-secondary)]">
                      Li e concordo com os{" "}
                      <strong className="text-[var(--primary)] underline">Termos de Uso</strong> e{" "}
                      <strong className="text-[var(--primary)] underline">
                        Política de Privacidade
                      </strong>
                      .
                    </span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.whatsappOptIn}
                      onChange={(e) => setForm({ ...form, whatsappOptIn: e.target.checked })}
                      className="w-4 h-4 accent-[var(--primary)] rounded"
                    />
                    <span className="text-[var(--text-secondary)]">
                      Quero receber avisos sobre meu acordo por e-mail e WhatsApp.
                    </span>
                  </label>
                </div>
              </div>

              <button
                onClick={() => setStep(3)}
                className="btn-primary w-full h-11 text-xs flex items-center justify-center gap-2 mt-2"
              >
                <span>Continuar</span>
                <i className="bi bi-arrow-right" />
              </button>
            </div>
          )}

          {/* STEP 3: ENVIE SEUS DOCUMENTOS */}
          {step === 3 && (
            <div className="space-y-4 page-enter">
              <div>
                <h2 className="text-lg font-bold text-[var(--text-main)]">
                  Envie seus documentos
                </h2>
                <p className="text-xs text-[var(--text-secondary)]">
                  Tire fotos nítidas e legíveis do seu documento oficial com foto (RG, CNH ou CIN).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] flex flex-col items-center text-center">
                  <div className="w-14 h-10 rounded-lg bg-[var(--primary-soft)] border border-[var(--primary-border)] text-[var(--primary)] flex items-center justify-center mb-2.5">
                    <i className="bi bi-person-vcard text-xl" />
                  </div>
                  <p className="text-xs font-bold text-[var(--text-main)]">
                    Frente do documento *
                  </p>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 mb-3">
                    Envie uma foto da frente do seu RG, CNH ou CIN.
                  </p>
                  <button
                    type="button"
                    onClick={() => setFrontDocSent(true)}
                    className="btn-secondary px-3.5 py-2 text-xs flex items-center gap-1.5"
                  >
                    <i className="bi bi-camera text-[var(--primary)]" />
                    <span>{frontDocSent ? "Foto anexada" : "Tirar foto ou enviar"}</span>
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-color)] flex flex-col items-center text-center">
                  <div className="w-14 h-10 rounded-lg bg-[var(--primary-soft)] border border-[var(--primary-border)] text-[var(--primary)] flex items-center justify-center mb-2.5">
                    <i className="bi bi-card-text text-xl" />
                  </div>
                  <p className="text-xs font-bold text-[var(--text-main)]">
                    Verso do documento *
                  </p>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 mb-3">
                    Envie uma foto do verso do seu documento.
                  </p>
                  <button
                    type="button"
                    onClick={() => setBackDocSent(true)}
                    className="btn-secondary px-3.5 py-2 text-xs flex items-center gap-1.5"
                  >
                    <i className="bi bi-camera text-[var(--primary)]" />
                    <span>{backDocSent ? "Foto anexada" : "Tirar foto ou enviar"}</span>
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--primary-soft)] border border-[var(--primary-border)] text-xs space-y-1">
                <p className="font-bold text-[var(--text-main)] flex items-center gap-1.5">
                  <i className="bi bi-info-circle text-[var(--primary)]" />
                  <span>Dicas para uma boa foto:</span>
                </p>
                <ul className="pl-5 space-y-0.5 text-[11px] text-[var(--text-secondary)]">
                  <li className="flex items-center gap-1.5">
                    <i className="bi bi-check2 text-[var(--primary)]" />
                    Use um ambiente bem iluminado.
                  </li>
                  <li className="flex items-center gap-1.5">
                    <i className="bi bi-check2 text-[var(--primary)]" />
                    Deixe o documento inteiro na foto.
                  </li>
                  <li className="flex items-center gap-1.5">
                    <i className="bi bi-check2 text-[var(--primary)]" />
                    Evite reflexos e borrões.
                  </li>
                </ul>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={() => setStep(2)}
                  className="btn-secondary px-5 h-11 text-xs flex items-center gap-1.5"
                >
                  <i className="bi bi-arrow-left" />
                  <span>Voltar</span>
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="btn-primary flex-1 h-11 text-xs flex items-center justify-center gap-2"
                >
                  <span>Continuar</span>
                  <i className="bi bi-arrow-right" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: FAÇA UMA SELFIE */}
          {step === 4 && (
            <div className="space-y-4 page-enter">
              <div>
                <h2 className="text-lg font-bold text-[var(--text-main)]">Faça uma selfie</h2>
                <p className="text-xs text-[var(--text-secondary)]">
                  Tire uma foto do seu rosto para confirmar sua identidade.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                {/* Camera Box */}
                <div className="sm:col-span-6 h-52 rounded-2xl bg-[var(--bg-muted)] border border-[var(--border-color)] relative flex flex-col items-center justify-center overflow-hidden">
                  {flashActive && <div className="camera-flash-overlay" />}
                  {!selfieTaken && <div className="scanner-laser" />}

                  <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-[var(--primary)] rounded-tl" />
                  <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-[var(--primary)] rounded-tr" />
                  <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-[var(--primary)] rounded-bl" />
                  <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-[var(--primary)] rounded-br" />

                  {selfieTaken ? (
                    <div className="flex flex-col items-center text-center p-3 page-enter">
                      <div className="w-16 h-16 rounded-full bg-[var(--accent-soft)] border-2 border-[var(--accent)] text-[var(--accent)] flex items-center justify-center mb-1.5 pop-in">
                        <i className="bi bi-person-check-fill text-3xl text-[var(--success)]" />
                      </div>
                      <span className="text-xs font-bold text-[var(--success)]">
                        Selfie Capturada!
                      </span>
                      <span className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                        Biometria confirmada
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-full bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center mb-1">
                        <i className="bi bi-person-fill text-3xl" />
                      </div>
                      <span className="text-[11px] font-medium text-[var(--text-secondary)]">
                        Posicione seu rosto
                      </span>
                    </>
                  )}
                </div>

                {/* Tips List */}
                <div className="sm:col-span-6 space-y-2.5 text-xs text-[var(--text-secondary)]">
                  <div className="flex items-center gap-2.5">
                    <i className="bi bi-check-circle text-[var(--success)] text-sm" />
                    <span>Centralize seu rosto na tela.</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <i className="bi bi-brightness-high text-[var(--primary)] text-sm" />
                    <span>Esteja em um ambiente bem iluminado.</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <i className="bi bi-eyeglasses text-[var(--primary)] text-sm" />
                    <span>Não use óculos, boné ou acessórios.</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <i className="bi bi-emoji-smile text-[var(--primary)] text-sm" />
                    <span>Mantenha uma expressão natural.</span>
                  </div>
                </div>
              </div>

              {selfieTaken ? (
                <button
                  type="button"
                  onClick={() => setSelfieTaken(false)}
                  className="btn-secondary w-full h-10 text-xs flex items-center justify-center gap-1.5"
                >
                  <i className="bi bi-arrow-repeat" />
                  <span>Tirar outra selfie</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleTakeSelfie}
                  className="btn-primary w-full h-11 text-xs flex items-center justify-center gap-2"
                >
                  <i className="bi bi-camera" />
                  <span>Tirar selfie</span>
                </button>
              )}

              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={() => setStep(3)}
                  className="btn-secondary px-5 h-11 text-xs flex items-center gap-1.5"
                >
                  <i className="bi bi-arrow-left" />
                  <span>Voltar</span>
                </button>
                <button
                  onClick={() => {
                    updateUser({ name: form.name, cpf: form.cpf, email: form.email, phone: form.phone });
                    setScreenFlow("register_done");
                  }}
                  className="btn-primary flex-1 h-11 text-xs flex items-center justify-center gap-2"
                >
                  <span>Enviar cadastro</span>
                  <i className="bi bi-check-lg" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ----------------------------------------------------------------
     4. CADASTRO ENVIADO PARA ANÁLISE! (Imagem 2 - Base Direita)
     ---------------------------------------------------------------- */
  if (screenFlow === "register_done") {
    return (
      <div className="min-h-screen bg-[var(--bg-app)] flex items-center justify-center p-4">
        <div className="card-surface page-enter w-full max-w-md p-6 sm:p-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-full bg-[var(--primary)] text-[var(--accent)] flex items-center justify-center">
              <i className="bi bi-check-lg text-sm" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-[var(--primary)]">ACRED<span className="text-[var(--accent)]">TA</span></span>
          </div>

          <div className="w-14 h-14 rounded-full bg-[var(--accent)] text-[var(--primary)] flex items-center justify-center mx-auto mb-4 pop-in">
            <i className="bi bi-check-lg text-3xl leading-none" />
          </div>

          <h2 className="text-xl font-bold text-[var(--text-main)]">
            Cadastro enviado para análise!
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mt-1.5 mb-5 leading-relaxed">
            Estamos validando suas informações, documentos e selfie.
          </p>

          <div className="p-4 rounded-xl bg-[var(--primary-soft)] border border-[var(--primary-border)] flex items-center justify-center gap-3 mb-4">
            <i className="bi bi-clock text-lg text-[var(--primary)]" />
            <div className="text-left text-xs">
              <span className="text-[var(--text-secondary)] block">Prazo de análise</span>
              <strong className="font-bold text-[var(--text-main)]">Até 1 dia útil</strong>
            </div>
          </div>

          <p className="text-xs text-[var(--text-secondary)] mb-6 leading-relaxed">
            Você receberá uma notificação por e-mail e WhatsApp assim que sua conta for aprovada.
          </p>

          <button
            onClick={() => {
              // Conforme explicado no Áudio 1: "o cara vai se registrar e não vai encontrar nenhum acordo"
              setHasLinkedAgreements(false);
              setScreenFlow("portal");
            }}
            className="btn-primary w-full h-11 text-xs flex items-center justify-center gap-2"
          >
            <span>Ir para o login</span>
            <i className="bi bi-arrow-right" />
          </button>
        </div>
      </div>
    );
  }

  return null;
}




