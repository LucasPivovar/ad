"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";

export function ProfileView() {
  const { user, updateUser } = useApp();
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [phone, setPhone] = useState(user.phone);
  const [email, setEmail] = useState(user.email);
  const [street, setStreet] = useState(user.address.street);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      phone,
      email,
      address: { ...user.address, street },
    });
    setEditingSection(null);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-[var(--text-main)]">Meu Perfil</h2>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-0.5">
          Gerencie seus dados e mantenha suas informações atualizadas.
        </p>
      </div>

      {savedNotice && (
        <div className="p-3.5 rounded-xl bg-[var(--success-soft)] border border-[var(--success-border)] text-[var(--success)] text-xs font-semibold flex items-center gap-2">
          <i className="bi bi-check-circle-fill" />
          <span>Dados atualizados com sucesso.</span>
        </div>
      )}

      {/* User Header Card (Exact match to Image 3) */}
      <div className="card-surface p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full bg-[var(--primary)] text-white font-bold text-lg flex items-center justify-center shrink-0">
            {user.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[var(--text-main)]">
              Lucas Wallysson
            </h3>
            <p className="text-xs text-[var(--text-secondary)] num-tabular mt-0.5">
              CPF: {user.cpf}
            </p>
          </div>
        </div>

        <button
          onClick={() => setEditingSection(editingSection ? null : "contato")}
          className="btn-secondary px-3.5 h-9 text-xs flex items-center gap-1.5"
        >
          <i className="bi bi-pencil text-[var(--primary)]" />
          <span>{editingSection ? "Fechar" : "Editar dados"}</span>
        </button>
      </div>

      {editingSection && (
        <form onSubmit={handleSave} className="card-surface p-5 space-y-4 text-xs">
          <h4 className="font-bold text-sm text-[var(--text-main)]">Editar informações</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[var(--text-main)] mb-1">Celular</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-field w-full h-10 px-3"
              />
            </div>
            <div>
              <label className="block font-semibold text-[var(--text-main)] mb-1">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field w-full h-10 px-3"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-[var(--text-main)] mb-1">Endereço</label>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="input-field w-full h-10 px-3"
              />
            </div>
          </div>

          <button type="submit" className="btn-primary px-5 h-10 text-xs">
            Salvar alterações
          </button>
        </form>
      )}

      {/* 4 Profile Rows (Exact match to Image 3) */}
      <div className="space-y-2.5 stagger">
        <button
          onClick={() => setEditingSection(editingSection === "pessoais" ? null : "pessoais")}
          className="card-surface card-interactive w-full p-4 flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center shrink-0">
              <i className="bi bi-person text-base" />
            </div>
            <div>
              <p className="text-xs font-bold text-[var(--text-main)]">Dados pessoais</p>
              <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                Nome, CPF, data de nascimento
              </p>
            </div>
          </div>
          <i className="bi bi-chevron-right row-chevron inline-block text-xs text-[var(--text-muted)]" />
        </button>

        <button
          onClick={() => setEditingSection(editingSection === "endereco" ? null : "endereco")}
          className="card-surface card-interactive w-full p-4 flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center shrink-0">
              <i className="bi bi-geo-alt text-base" />
            </div>
            <div>
              <p className="text-xs font-bold text-[var(--text-main)]">Endereço</p>
              <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                {user.address.street}, {user.address.number} — {user.address.city}/{user.address.uf}
              </p>
            </div>
          </div>
          <i className="bi bi-chevron-right row-chevron inline-block text-xs text-[var(--text-muted)]" />
        </button>

        <button
          onClick={() => setEditingSection(editingSection === "contato" ? null : "contato")}
          className="card-surface card-interactive w-full p-4 flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center shrink-0">
              <i className="bi bi-telephone text-base" />
            </div>
            <div>
              <p className="text-xs font-bold text-[var(--text-main)]">Contato</p>
              <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                {user.phone} • {user.email}
              </p>
            </div>
          </div>
          <i className="bi bi-chevron-right row-chevron inline-block text-xs text-[var(--text-muted)]" />
        </button>

        <button
          onClick={() => setEditingSection(editingSection === "seguranca" ? null : "seguranca")}
          className="card-surface card-interactive w-full p-4 flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center shrink-0">
              <i className="bi bi-lock text-base" />
            </div>
            <div>
              <p className="text-xs font-bold text-[var(--text-main)]">Segurança</p>
              <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">Alterar senha</p>
            </div>
          </div>
          <i className="bi bi-chevron-right row-chevron inline-block text-xs text-[var(--text-muted)]" />
        </button>
      </div>
    </div>
  );
}

