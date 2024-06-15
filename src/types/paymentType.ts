export interface DetailEntry {
    coaCode: string;
    desciption: string;
    amount: number;
    isPremier: boolean;
}

export interface PaymentType {
    transactionDate: string;
    coaCode: string;
    desciption: string;
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
