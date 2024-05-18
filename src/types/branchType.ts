export interface branchType {
  branchId: number;
  branchName: string;
  phone: string;
  email: string;
  address: string;
  financialClosingDate: string;
  currencyId: number;
  companyId: number;
  companyName: string;
  currencyName: string;
  status: string;
}

export interface BranchData {
  data: branchType[];
  totalData: number;
}
