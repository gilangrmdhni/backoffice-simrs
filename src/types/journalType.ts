
export interface journalType {
    journalId: Number,
    journalDescDebit: String,
    journalDescCredit: String,
    journalRef: String,
    coaDebit: String,
    coaCredit: String,
    coaDebitName: String,
    coaDebitParent: String,
    coaCreditName: String,
    coaCreditParent: String,
    amount: Number,
    source: String,
    branchId: Number,
    createdBy: Number,
    createdDate: Date,
    vourcherId: String,
    status: String,
    updatedBy: Number,
    updatedDate?: Date,
    reconciledDate?: Date,
    reconciledBy: Number
}