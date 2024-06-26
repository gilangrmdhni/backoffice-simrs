export interface TransactionJournalType {
    coaId: number;
    coaName?: string;
    coaCode: string;
    accountTypeId: number;
    accountTypeName?: string;
    transactionNo: string;
    transactionId: string;
    transactionType: string;
    transactionDate: string;
    description:string;
    amount: number;
    coaLevel: number;
    parentId: number | 1;
    parentName?: string | null;
    parentCode: string;
    normalPosition: string;
    accountGroupId: number;
    accountGroupName?: string;
    isCashFlow?: boolean;
    isCashBank?: boolean;
    branchId: number;
    currencyId: number;
    currencyName: string;
    balance: number;
    status: string | 'Active';
    createdBy: number;
    updatedBy: number;
    createdDate: Date;
    updateDate: Date;
    details : TransactionDetail[]
}
export interface TransactionDetail {
    balance?: number | null;
    journalId?: number;              // Menambahkan journalId
    journalDesc?: string;            // Menambahkan journalDesc
    transactionId?: string;
    journalRef?: string | null;      // Menambahkan journalRef
    coaCode?: string;
    coaName?: string;
    coaParentCode?: string;
    coaParentName?: string;
    debitAmount?: number;            // Menambahkan debitAmount
    creditAmount?: number;           // Menambahkan creditAmount
    source?: string;                 // Menambahkan source
    branchId?: number;
    createdBy?: number;
    createdDate?: string;
    vourcherId?: string | null;      // Menambahkan vourcherId
    status?: string;
    isPremier?: boolean;             // Menambahkan isPremier
    updatedBy?: number | null;
    updatedDate?: string | null;
    reconciledDate?: string | null;  // Menambahkan reconciledDate
    reconciledBy?: any | null;    // Menambahkan reconciledBy
    transactionDetail?: {
        transactionNo: string;
        transactionType: string;
        contactDetail: any | null;   // Sesuaikan tipe data detail kontak sesuai kebutuhan
    } | null;                         // Menambahkan transactionDetail
}

