
export interface journalType {
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