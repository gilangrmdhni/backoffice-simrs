export interface ReconciliationType {
    coaCode: string;
    desc: string;
    newStatementBalance: number;
    totalClear: number;
    totalOutStanding: number;
    reconciledDate: string;
    createdDate: string;
    createdBy: number;
    clearIds: number[];
}

export interface ReconciliationUpdateType extends ReconciliationType {
    id: number;
}
