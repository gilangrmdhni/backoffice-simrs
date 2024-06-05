export interface CreditEntry {
    coaCredit: string;
    journalDescCredit: string;
    amount: number;
}


export interface PaymentType {
    journalDescCredit: string | null;
    journalDescDebit: string | null;
    journalRef: string;
    coaDebit: string;
    coaCredit: string;
    amount: number;
    createdDate: string;
    status: string;
    credits: CreditEntry[];
}

export interface PaymentUpdateType extends PaymentType {
    journalId: number;
}
