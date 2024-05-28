export interface BookBankType {
    journalId: number;
    journalDescDebit: string | null;
    journalDescCredit: string | null;
    journalRef: string;
    coaDebit: string;
    coaCredit: string;
    coaDebitName: string;
    coaDebitParent: string;
    coaCreditName: string;
    coaCreditParent: string;
    amount: number;
    source: string;
    branchId: number;
    createdBy: number;
    createdDate: string;
    vourcherId: string;
    status: string;
    updatedBy: number | null;
    updatedDate: string | null;
    reconciledDate: string | null;
    reconciledBy: number | null;
}
