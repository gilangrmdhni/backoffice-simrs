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
}