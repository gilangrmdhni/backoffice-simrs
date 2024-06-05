export interface DebitEntry {
    coaDebit: string;
    journalDescDebit: string;
    amount: number;
}

export interface DepositType {
    journalDescCredit: string | null;
    journalRef: string;
    coaCredit: string;
    amount: number;
    createdDate: string;
    status: string;
    debits: DebitEntry[];
}

export interface DepositUpdateType extends DepositType {
    journalId: number;
}
