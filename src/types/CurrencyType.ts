export interface CurrencyType {
    currencyId?: number;
    currencyName: string;
    currencyCode: string;
    symbol: string;
    country: string;
    exchangeRate: number | 1;
    branchId: number | 0 ;
}