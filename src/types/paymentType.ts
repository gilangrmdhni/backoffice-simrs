export interface DetailEntry {
    coaCode: string;
    description: string;
    amount: number;
    isPremier: boolean;
}

export interface PaymentType {
    transactionDate: string;
    coaCode: string;
    description: string;
    transactionNo: string;
    amount: number;
    transactionType: string;
    transactionName: string;
    transactionRef: string;
    contactId: number;
    details: DetailEntry[];
}

export interface PaymentUpdateType extends PaymentType {
    journalId: number;
}
