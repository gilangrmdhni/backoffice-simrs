export interface agingSchedulePatientType {
    patientName: string;
    insuranceName: string;
    billingDate: Date;
    zeroToFortyFive: number;
    fortyFiveToSixty: number;
    sixtyToNinety: number;
    ninetyToOneTwenty: number;
    greaterThanOneTwenty : number;
    dueDate : Date;
    status: string;
}
