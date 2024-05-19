export interface AccountType {
    accountTypeId?: number;
    accountTypeName: string;
    branchId: number;
}

export interface AccountTypeData {
    data: AccountType[];
    totalData: number;
}
