export type AccountGroupType = {
    accountGroupId: number;
    accountGroupName: string;
    branchId: number;
};

export type AccountGroupResponseType = {
    data: AccountGroupType[];
    totalData: number;
};
