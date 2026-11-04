"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";

export function ProfileView() {
  const { user, updateUser } = useApp();
  const [editingSection, setEditingSection] = useState<"endereco" | "contato" | "todos" | null>(null);
  const [address, setAddress] = useState(user.address);
  const [savedNotice, setSavedNotice] = useState(false);
  const [formError, setFormError] = useState("");
  const editAddress = editingSection === "endereco" || editingSection === "todos";
  const editContact = editingSection === "contato" || editingSection === "todos";
  const addressFields = [
    { key: "cep", label: "CEP" },
    { key: "street", label: "Rua" },
    { key: "number", label: "Número" },
    { key: "complement", label: "Complemento (opcional)" },
    { key: "neighborhood", label: "Bairro" },
    { key: "city", label: "Cidade" },
    { key: "uf", label: "UF" },
  ] as const;
  const addressChanged = editAddress && addressFields.some(
    ({ key }) => (address[key] ?? "").trim() !== (user.address[key] ?? "").trim(),
  );

  const openEditor = (section: typeof editingSection) => {
    setAddress(user.address);
    setSavedNotice(false);
    setFormError("");
    setEditingSection(section);
  };

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (addressChanged) {
      const documents = [data.get("residenceProof"), data.get("utilityBill")];
      if (documents.some((file) => !(file instanceof File) || file.size === 0 || !/\.(pdf|jpe?g|png)$/i.test(file.name))) {
        setFormError("Anexe o comprovante e a conta atualizada em PDF, JPG ou PNG.");
        return;
      }
    }
    updateUser({
      ...(editContact && {
        phone: String(data.get("phone") ?? "").trim(),
        email: String(data.get("email") ?? "").trim(),
      }),
      ...(addressChanged && { address }),
    });
    setEditingSection(null);
    setSavedNotice(true);
  };

  return (
    <div className="space-y-5 w-full">
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
              {user.name}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] num-tabular mt-0.5">
              CPF: {user.cpf}
            </p>
          </div>
        </div>

        <button
          onClick={() => openEditor(editingSection ? null : "todos")}
          className="btn-secondary px-3.5 h-9 text-xs flex items-center gap-1.5"
        >
          <i className="bi bi-pencil text-[var(--primary)]" />
          <span>{editingSection ? "Fechar" : "Editar dados"}</span>
        </button>
      </div>

      {editingSection && (
        <form key={editingSection} onSubmit={handleSave} className="card-surface p-5 space-y-4 text-xs">
          {editContact && (
            <fieldset className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <legend className="mb-3 font-bold text-sm">Contato</legend>
              <label className="space-y-1 font-semibold">
                <span>Celular</span>
                <input name="phone" type="tel" autoComplete="tel" defaultValue={user.phone} required className="input-field w-full h-10 px-3" />
              </label>
              <label className="space-y-1 font-semibold">
                <span>E-mail</span>
                <input name="email" type="email" autoComplete="email" defaultValue={user.email} required className="input-field w-full h-10 px-3" />
              </label>
            </fieldset>
          )}
          {editAddress && (
            <fieldset className="space-y-3">
              <legend className="mb-3 font-bold text-sm">Endereço</legend>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {addressFields.map(({ key, label }) => (
                  <label key={key} className="space-y-1 font-semibold">
                    <span>{label}</span>
                    <input
                      value={address[key] ?? ""}
                      onChange={(event) => setAddress({ ...address, [key]: event.target.value })}
                      required={addressChanged && key !== "complement"}
                      className="input-field w-full h-10 px-3"
                    />
                  </label>
                ))}
              </div>
              <p className="text-[var(--text-secondary)]">
                Para mudar o endereço, anexe os dois documentos. Aceitamos PDF, JPG e PNG.
              </p>
              {addressChanged && (
                <div className="space-y-3">
                  <label className="block space-y-1 font-semibold">
                    <span>Comprovante do novo endereço</span>
                    <input name="residenceProof" type="file" accept=".pdf,.jpg,.jpeg,.png" required className="input-field block w-full p-2" />
                  </label>
                  <label className="block space-y-1 font-semibold">
                    <span>Conta atualizada de luz ou água</span>
                    <input name="utilityBill" type="file" accept=".pdf,.jpg,.jpeg,.png" required className="input-field block w-full p-2" />
                  </label>
                </div>
              )}
            </fieldset>
          )}
          {formError && <p role="alert" className="text-red-700">{formError}</p>}
          <button type="submit" className="btn-primary px-5 h-10 text-xs">
            Salvar alterações
          </button>
        </form>
      )}

      {/* Dados do perfil */}
      <div className="space-y-2.5 stagger">
        <div className="card-surface w-full p-4 text-left">
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-[var(--primary-soft)] text-[var(--primary)] flex items-center justify-center shrink-0">
              <i className="bi bi-person text-base" />
            </div>
            <div>
              <p className="text-xs font-bold text-[var(--text-main)]">Dados pessoais</p>
              <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                {user.name} · {user.cpf} · {user.birthDate}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => openEditor(editingSection === "endereco" ? null : "endereco")}
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
          onClick={() => openEditor(editingSection === "contato" ? null : "contato")}
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

      </div>
    </div>
  );
}

