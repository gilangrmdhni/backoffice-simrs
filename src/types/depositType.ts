export interface DepositType {
    journalDescCredit: string | null;
    journalDescDebit: string | null;
    journalRef: string;
    coaDebit: string;
    coaCredit: string;
    amount: number;
    createdDate: string;
    status: string;
}

export interface DepositUpdateType extends DepositType {
    journalId: number;
}
