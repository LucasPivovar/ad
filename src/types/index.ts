export type KYCStatus = 'not_started' | 'documents_uploaded' | 'selfie_captured' | 'analyzing' | 'approved';

export type PaymentMethodType = 'pix_boleto' | 'talao_sanepar' | 'talao_copel';

export type AgreementStatus = 'em_dia' | 'pendente' | 'quitado';

export interface UserProfile {
  id: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  birthDate: string;
  address: {
    cep: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    uf: string;
  };
  kycStatus: KYCStatus;
  documentFrontUrl?: string;
  documentBackUrl?: string;
  selfieUrl?: string;
}

export interface Agreement {
  id: string; // e.g. "AC-4587962"
  creditor: string; // "Banco Itaú", "Santander", "Vivo"
  creditorType: 'itau' | 'santander' | 'vivo' | 'bradesco' | 'other';
  contractNumber: string;
  originalAmount: number;
  discountAmount: number;
  settlementAmount: number;
  installments: number;
  installmentValue: number;
  paidInstallments: number;
  status: AgreementStatus;
  nextDueDate: string;
  paymentMethod: PaymentMethodType;
  concessionaireAccount?: string; // e.g. "8492019-2"
  createdAt: string;
  signedContractUrl?: string;
}

export interface AvailableDebt {
  id: string;
  creditor: string;
  creditorType: 'itau' | 'santander' | 'vivo';
  contractMasked: string;
  originalAmount: number;
  offers: {
    installments: number;
    installmentValue: number;
    totalAmount: number;
    discountPercentage: number;
    description: string;
  }[];
}

export interface PaymentReceipt {
  id: string;
  agreementId: string;
  creditor: string;
  installment: number;
  totalInstallments: number;
  amount: number;
  paidAt: string;
  method: 'PIX' | 'BOLETO' | 'TALÃO SANEPAR' | 'TALÃO COPEL';
  authCode: string;
}

export interface KYCApplicant {
  id: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  birthDate: string;
  cityUf: string;
  addressFull: string;
  registeredAt: string;
  status: 'analyzing' | 'approved' | 'rejected';
  documentType: 'CNH' | 'RG' | 'CIN';
  rejectionReason?: string;
  selfieMatchScore: number;
}
