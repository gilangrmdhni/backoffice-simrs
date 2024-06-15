export interface COAType {
    coaId?: number;
    coaName: string;
    coaCode: string;
    accountTypeId: number;
    accountTypeName?: string;
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
    journals : Journal[]
}
// export interface Journal {
//     transactionId?: string;
//     transactionDate?: string;
//     coaCode?: string;
//     coaName?: string;
//     coaParentCode?: string;
//     coaParentName?: string;
//     description?: string;
//     transactionNo?: string;
//     transactionType?: string;
//     transactionName?: string | null;
//     transactionRef?: string | null;
//     amount?: number;
//     branchId?: number;
//     contactId?: string | null;
//     createdBy?: number;
//     createdDate?: string;
//     status?: string;
//     updatedBy?: number | null;
//     updatedDate?: string | null;
//     isAutoId?: boolean;
//     details?: any | null; // Adjust the type as per actual details structure
//     paymentNo?: string | null;
//     paymentStatus?: string | null;
//     paymentDate?: string | null;
// }

export interface Journal {
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

