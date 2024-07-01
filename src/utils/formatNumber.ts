export function FormatNumber(number : any) {
    if (number == null || number == null) {
        return '0';
    }else{
        const result = number.toLocaleString('id-ID',{
            // minimumFractionDigits: 2,
            // maximumFractionDigits: 2,
        });
        return  result
    }
}