import { useDispatch } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { setPageTitle, setTitle, setBreadcrumbTitle } from '../../../store/themeConfigSlice';
import { useForm, FieldError, useFieldArray } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { ToastContainer } from 'react-toastify';
import { responseCallback } from '@/utils/responseCallback';
import { toastMessage } from '@/utils/toastUtils';
import { useGetPaymentDetailQuery, useCreatePaymentMutation, useUpdatePaymentMutation } from '@/store/api/bank/payment/paymentApiSlice';
import { useGetBanksQuery } from '@/store/api/bank/bankApiSlice';
import { PaymentType, PaymentUpdateType } from '@/types/paymentType';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';

const PaymentForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { data: detailPayment, refetch: refetchDetailPayment } = id ? useGetPaymentDetailQuery(Number(id)) : { data: null, refetch: () => { } };
    const [createPayment, { isLoading: isCreating }] = useCreatePaymentMutation();
    const [updatePayment, { isLoading: isUpdating }] = useUpdatePaymentMutation();

    const schema = yup.object({
        journalDescDebit: yup.string().required('Debit Description is Required'),
        coaDebit: yup.string().required('Account is Required'),
        amount: yup.number().required('Amount is Required').positive('Amount must be positive'),
        createdDate: yup.date().required('Pay Date is Required'),
        credits: yup.array().of(
            yup.object().shape({
                coaCredit: yup.string().required('Account is Required'),
                journalDescCredit: yup.string().required('Memo is Required'),
                amount: yup.number().required('Amount is Required').positive('Amount must be positive'),
            })
        ).required().min(1, 'At least one credit entry is required'),
    }).required();

    const { register, control, formState: { errors }, handleSubmit, setValue, watch } = useForm<PaymentType>({
        resolver: yupResolver(schema),
        defaultValues: {
            journalDescCredit: null,
            journalDescDebit: null,
            journalRef: '',
            coaDebit: '',
            coaCredit: '',
            amount: 0,
            createdDate: '',
            status: '',
            credits: [{ coaCredit: '', journalDescCredit: '', amount: 0 }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'credits',
    });

    const { data: bankResponse } = useGetBanksQuery({});
    const bankList = bankResponse?.data ?? [];

    const [total, setTotal] = useState(0);
    const [difference, setDifference] = useState(0);
    const [amountText, setAmountText] = useState('');

    const convertNumberToText = (num: number) => {
        const units = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan'];
        const teens = ['Sepuluh', 'Sebelas', 'Dua Belas', 'Tiga Belas', 'Empat Belas', 'Lima Belas', 'Enam Belas', 'Tujuh Belas', 'Delapan Belas', 'Sembilan Belas'];
        const tens = ['', '', 'Dua Puluh', 'Tiga Puluh', 'Empat Puluh', 'Lima Puluh', 'Enam Puluh', 'Tujuh Puluh', 'Delapan Puluh', 'Sembilan Puluh'];
        const thousands = ['', 'Ribu', 'Juta', 'Miliar', 'Triliun'];

        if (num === 0) return 'Nol';

        let numStr = num.toString();
        let word = '';
        let scale = 0;

        while (numStr.length > 0) {
            let chunk;
            if (numStr.length > 3) {
                chunk = parseInt(numStr.slice(-3), 10);
                numStr = numStr.slice(0, -3);
            } else {
                chunk = parseInt(numStr, 10);
                numStr = '';
            }

            if (chunk) {
                let chunkStr = '';
                if (chunk > 99) {
                    if (Math.floor(chunk / 100) === 1) {
                        chunkStr += 'Seratus ';
                    } else {
                        chunkStr += units[Math.floor(chunk / 100)] + ' Ratus ';
                    }
                    chunk %= 100;
                }
                if (chunk > 19) {
                    chunkStr += tens[Math.floor(chunk / 10)] + ' ';
                    chunk %= 10;
                }
                if (chunk > 9) {
                    chunkStr += teens[chunk - 10] + ' ';
                } else {
                    if (chunk === 1 && scale === 1) {
                        chunkStr += 'Se';
                    } else {
                        chunkStr += units[chunk] + ' ';
                    }
                }
                word = chunkStr + thousands[scale] + ' ' + word;
            }
            scale++;
        }

        return word.trim() + ' Rupiah';
    };

    const onSubmit = async (data: PaymentType) => {
        console.log('Data yang dikirim:', data);

        const totalDebits = data.credits.reduce((sum, credit) => sum + (Number(credit.amount) || 0), 0);
        const formAmount = Number(data.amount);
        console.log('Total Debits:', totalDebits);
        console.log('Form Amount:', formAmount);

        // Validasi tambahan sebelum pengiriman
        if (totalDebits !== formAmount) {
            toastMessage('Total amount of credit entries must match the amount in the form.', 'error');
            return;
        }

        try {
            let response;
            if (id) {
                const updateData = {
                    ...data,
                    journalId: parseInt(id),
                };
                response = await updatePayment(updateData).unwrap();
            } else {
                const postData = data.credits.map(credit => ({
                    ...data,
                    coaCredit: credit.coaCredit,
                    journalDescCredit: credit.journalDescCredit,
                    amount: credit.amount,
                }));
                // Log payload untuk debugging
                console.log('Payload yang dikirim:', JSON.stringify(postData, null, 2));

                response = await createPayment(postData).unwrap();
            }
            responseCallback(response, () => {
                navigate('/payment');
            }, null);
        } catch (err: any) {
            toastMessage(err.message, 'error');
        }
    };

    useEffect(() => {
        dispatch(setPageTitle('Payment'));
        dispatch(setTitle('Payment'));
        dispatch(setBreadcrumbTitle(['Dashboard', 'Bank', 'Payment', id ? 'Update' : 'Create']));
        if (id) {
            refetchDetailPayment();
        }
    }, [dispatch, id, refetchDetailPayment]);

    useEffect(() => {
        if (detailPayment && detailPayment.data) {
            Object.keys(detailPayment.data).forEach((key) => {
                if (key === 'createdDate') {
                    const isoString = detailPayment.data[key as keyof PaymentType] as string;
                    const date = new Date(isoString);
                    const formattedDate = date.toISOString().split('T')[0];
                    setValue(key as keyof PaymentType, formattedDate);
                } else {
                    setValue(key as keyof PaymentType, detailPayment.data[key as keyof PaymentType]);
                }
            });
        }
    }, [detailPayment, setValue]);

    useEffect(() => {
        const subscription = watch((value, { name, type }) => {
            if (name === 'amount') {
                const amount = parseFloat(value.amount?.toString() || '0') || 0;
                setAmountText(convertNumberToText(amount));
                setTotal(amount);
                const totalCredits = value.credits?.reduce((sum, credit) => {
                    const creditAmount = parseFloat(credit?.amount?.toString() || '0') || 0;
                    return sum + creditAmount;
                }, 0) || 0;
                setDifference(amount - totalCredits);
            }
        });
        return () => subscription.unsubscribe();
    }, [watch]);

    return (
        <div>
            <div className="panel mt-6">
                <form className="flex gap-6 flex-col" onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid md:grid-cols-1 gap-4 w-full">
                        <div>
                            <label htmlFor="coaDebit" className="block text-sm font-medium text-gray-700">Pay To</label>
                            <div className="relative text-white-dark">
                                <select id="coaDebit" {...register('coaDebit')} className="form-select placeholder:text-white-dark mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                    <option value="">Select Account</option>
                                    {bankList.map((bank) => (
                                        <option key={bank.desc} value={bank.desc}>{bank.label}</option>
                                    ))}
                                </select>
                            </div>
                            <span className="text-danger text-xs">{(errors.coaDebit as FieldError)?.message}</span>
                        </div>
                        <div>
                            <label htmlFor="journalDescDebit" className="block text-sm font-medium text-gray-700">Memo</label>
                            <div className="relative text-white-dark">
                                <textarea id="journalDescDebit" placeholder="Enter Debit Description" {...register('journalDescDebit')} className="form-input placeholder:text-white-dark mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                            </div>
                            <span className="text-danger text-xs">{(errors.journalDescDebit as FieldError)?.message}</span>
                        </div>

                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
                            <div className="relative text-white-dark">
                                <input id="amount" type="number" placeholder="Enter Amount" {...register('amount')} className="form-input placeholder:text-white-dark mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                            </div>
                            <span className="text-danger text-xs">{(errors.amount as FieldError)?.message}</span>
                        </div>
                        <div>
                            <label htmlFor="createdDate" className="block text-sm font-medium text-gray-700">Pay Date</label>
                            <div className="relative text-white-dark">
                                <input id="createdDate" type="date" {...register('createdDate')} className="form-input placeholder:text-white-dark mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                            </div>
                            <span className="text-danger text-xs">{(errors.createdDate as FieldError)?.message}</span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700">Say</label>
                        <p className="mt-1 text-gray-500">{amountText}</p>
                    </div>
                    <div className="mt-6">
                        <div className="mt-2 space-y-4">
                            {fields.map((field, index) => (
                                <div key={field.id} className="grid grid-cols-5 gap-4 items-center">
                                    <div>
                                        <label htmlFor={`credits.${index}.coaCredit`} className="block text-sm font-medium text-gray-700">Account</label>
                                        <div className="relative text-white-dark">
                                            <select
                                                id={`credits.${index}.coaCredit`}
                                                className="form-select placeholder:text-white-dark mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                {...register(`credits.${index}.coaCredit` as const)}
                                            >
                                                <option value="">Select Account</option>
                                                {bankList.map((bank) => (
                                                    <option key={bank.desc} value={bank.desc}>{bank.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <span className="text-danger text-xs">{(errors.credits?.[index]?.coaCredit as FieldError)?.message}</span>
                                    </div>
                                    <div>
                                        <label htmlFor={`credits.${index}.amount`} className="block text-sm font-medium text-gray-700">Amount</label>
                                        <div className="relative text-white-dark">
                                            <input
                                                id={`credits.${index}.amount`}
                                                type="number"
                                                className="form-input placeholder:text-white-dark mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                {...register(`credits.${index}.amount` as const)}
                                                placeholder="Enter Amount"
                                            />
                                        </div>
                                        <span className="text-danger text-xs">{(errors.credits?.[index]?.amount as FieldError)?.message}</span>
                                    </div>
                                    <div>
                                        <label htmlFor={`credits.${index}.journalDescCredit`} className="block text-sm font-medium text-gray-700">Memo</label>
                                        <div className="relative text-white-dark">
                                            <input
                                                id={`credits.${index}.journalDescCredit`}
                                                type="text"
                                                className="form-input placeholder:text-white-dark mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                {...register(`credits.${index}.journalDescCredit` as const)}
                                                placeholder="Enter Credit Description"
                                            />
                                        </div>
                                        <span className="text-danger text-xs">{(errors.credits?.[index]?.journalDescCredit as FieldError)?.message}</span>
                                    </div>

                                    <div className='grid-cols-2 flex justify-center gap-2'>
                                        <button
                                            type="button"
                                            className="text-green-600 flex items-center"
                                            onClick={() => append({ coaCredit: '', journalDescCredit: '', amount: 0 })}
                                        >
                                            <FontAwesomeIcon icon={faPlus} className="mr-2" />
                                        </button>
                                        <button
                                            type="button"
                                            className="text-red-600"
                                            onClick={() => remove(index)}
                                        >
                                            <FontAwesomeIcon icon={faTimes} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4">
                        <div className="flex justify-end">
                            <p>Total :</p>
                            <p>{total.toLocaleString()}</p>
                        </div>
                        <div className="flex justify-end">
                            <p>Difference :</p>
                            <p>{difference.toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-4">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm"
                        >
                            {isCreating || isUpdating ? 'Loading' : id ? 'Update' : 'Create'}
                        </button>
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-600 text-white rounded-md shadow-sm"
                            onClick={() => navigate('/payment')}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PaymentForm;
