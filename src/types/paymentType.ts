export interface PaymentType {
    journalDescCredit: string | null;
    journalDescDebit: string | null;
    journalRef: string;
    coaDebit: string;
    coaCredit: string;
    amount: number;
    createdDate: string;
    status: string;
}

export interface PaymentUpdateType extends PaymentType {
    journalId: number;
}
