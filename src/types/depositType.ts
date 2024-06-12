export interface DebitEntry {
    coaCode?: string;
    desciption?: string;
    amount?: number;
    isPremier?: boolean;
}

export interface DepositType {
    transactionDate: string;
    coaCode: string;
    desciption?: string;
    transactionNo?: string;
    transactionType?: string | "Deposit";
    transactionName?: string;
    transactionRef?: string;
    contactId?: number;
    amount:number;
    details: DebitEntry[];
}

export interface DepositUpdateType extends DepositType {
    journalId: number;
}