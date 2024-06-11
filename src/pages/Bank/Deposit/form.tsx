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
import { useGetDepositDetailQuery, useCreateDepositMutation, useUpdateDepositMutation } from '@/store/api/bank/deposit/depositApiSlice';
import { useGetBanksQuery, useGetOptionBankQuery } from '@/store/api/bank/bankApiSlice';
import { DepositType, DebitEntry, DepositUpdateType } from '@/types/depositType';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';

interface BankOption {
    desc: string;
    label: string;
}

const DepositForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { data: detailDeposit, refetch: refetchDetailDeposit } = id ? useGetDepositDetailQuery(Number(id)) : { data: null, refetch: () => { } };
    const [createDeposit, { isLoading: isCreating }] = useCreateDepositMutation();
    const [updateDeposit, { isLoading: isUpdating }] = useUpdateDepositMutation();

    const schema = yup.object({
        description: yup.string().required('Credit Description is Required'),
        coaCode: yup.string().required('Account is Required'),
        transactionDate: yup.date().required('Created Date is Required'),
        details: yup.array().of(
            yup.object().shape({
                coaCode: yup.string().required('Account is Required'),
                description: yup.string().required('Memo is Required'),
                amount: yup.number().required('Amount is Required').positive('Amount must be positive'),
            })
        ).required().min(1, 'At least one debit entry is required'),
    }).required();

    const { register, control, formState: { errors }, handleSubmit, setValue, watch } = useForm<DepositType>({
        resolver: yupResolver(schema),
        defaultValues: {
            details: [{ coaCode: '', description: '', amount: 0 }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'details',
    });

    const { data: bankResponse } = useGetOptionBankQuery({
        parent: 952,
    });
    const bankList: BankOption[] = bankResponse?.data ?? [];

    const [total, setTotal] = useState(0);
    const [difference, setDifference] = useState(0);
    const [amountText, setAmountText] = useState('');

    const convertNumberToText = (num: number) => {
        const units = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan'];
        const teens = ['Sepuluh', 'Sebelas', 'Dua Belas', 'Tiga Belas', 'Empat Belas', 'Lima Belas', 'Enam Belas', 'Tujuh Belas', 'Delapan Belas', 'Sembilan Belas'];
        const tens = ['', '', 'Dua Puluh', 'Tiga Puluh', 'Empat Puluh', 'Lima Puluh', 'Enam Puluh', 'Tujuh Puluh', 'Delapan Puluh', 'Sembilan Puluh'];
        const thousands = ['', 'ribu', 'Juta', 'Miliar', 'Triliun'];

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

    const onSubmit = async (data: DepositType) => {
        console.log(data);
        console.log('Data yang dikirim:', data);

        const totaldetails = data.details.reduce((sum, debit) => sum + (Number(debit.amount) || 0), 0);
        const formAmount = Number(data.amount);
        console.log('Total details:', totaldetails);
        console.log('Form Amount:', formAmount);

        // Validasi tambahan sebelum pengiriman
        if (totaldetails !== formAmount) {
            toastMessage('Total amount of debit entries must match the amount in the form.', 'error');
            return;
        }

        try {
            let response;
            if (id) {
                const updateData = {
                    ...data,
                    journalId: parseInt(id),
                };
                response = await updateDeposit(updateData).unwrap();
            } else {
                const detailsData = data.details.map(debit => ({
                    coaCode: debit.coaCode,
                    description: debit.description,
                    amount: debit.amount,
                    isPremier: false
                }));
                const postData = {
                    transactionDate: data.transactionDate,
                    coaCode: data.coaCode,
                    description: data.description,
                    amount: data.amount, // Pastikan amount ada di sini
                    transactionNo: "",
                    transactionType: "Deposit",
                    transactionName: "",
                    transactionRef: "",
                    contactId: 0,
                    details: detailsData,
                };

                console.log('Payload yang dikirim:', JSON.stringify(postData, null, 2));

                response = await createDeposit(postData).unwrap(); // Memastikan postData adalah objek DepositType
            }
            responseCallback(response, () => {
                toastMessage('Data berhasil disimpan.', 'success');
                navigate('/deposit');
            }, null);
        } catch (err: any) {
            toastMessage(err.message, 'error');
        }
    };



    useEffect(() => {
        dispatch(setPageTitle('Deposit'));
        dispatch(setTitle('Deposit'));
        dispatch(setBreadcrumbTitle(['Dashboard', 'Bank', 'Deposit', id ? 'Update' : 'Create']));

        if (id) {
            refetchDetailDeposit();
        }
    }, [dispatch, id, refetchDetailDeposit]);

    useEffect(() => {
        if (detailDeposit && detailDeposit.data) {
            Object.keys(detailDeposit.data).forEach((key) => {
                if (key === 'transactionDate') {
                    const isoString = detailDeposit.data[key as keyof DepositType] as string;
                    const date = new Date(isoString);
                    const formattedDate = date.toISOString().split('T')[0];
                    setValue(key as keyof DepositType, formattedDate);
                } else {
                    setValue(key as keyof DepositType, detailDeposit.data[key as keyof DepositType]);
                }
            });
        }
    }, [detailDeposit, setValue]);

    useEffect(() => {
        const subscription = watch((value, { name, type }) => {
            if (name === 'amount') {
                const amount = parseFloat(value.amount?.toString() || '0') || 0;
                setAmountText(convertNumberToText(amount));
                setTotal(amount);
                const totaldetails = value.details?.reduce((sum, debit) => {
                    const debitAmount = parseFloat(debit?.amount?.toString() || '0') || 0;
                    return sum + debitAmount;
                }, 0) || 0;
                setDifference(amount - totaldetails);
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
                            <label htmlFor="coaCode" className="block text-sm font-medium text-gray-700">Deposit To</label>
                            <div className="relative text-white-dark">
                                <select id="coaCode" {...register('coaCode')} className="form-select placeholder:text-white-dark mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                    <option value="">Select Account</option>
                                    {bankList.map((bank: any) => (
                                        <option key={bank.desc} value={bank.desc}>{bank.label}</option>
                                    ))}
                                </select>
                            </div>
                            <span className="text-danger text-xs">{(errors.coaCode as FieldError)?.message}</span>
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Memo</label>
                            <div className="relative text-white-dark">
                                <input id="description" type="text" placeholder="Enter Credit Description" {...register('description')} className="form-input placeholder:text-white-dark mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                            </div>
                            <span className="text-danger text-xs">{(errors.description as FieldError)?.message}</span>
                        </div>
                        <div>
                            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
                            <div className="relative text-white-dark">
                                <input id="amount" type="number" placeholder="Enter Amount" {...register('amount')} className="form-input placeholder:text-white-dark mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                            </div>
                            <span className="text-danger text-xs">{(errors.amount as FieldError)?.message}</span>
                        </div>

                        <div>
                            <label htmlFor="transactionDate" className="block text-sm font-medium text-gray-700">Created Date</label>
                            <div className="relative text-white-dark">
                                <input id="transactionDate" type="date" {...register('transactionDate')} className="form-input placeholder:text-white-dark mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                            </div>
                            <span className="text-danger text-xs">{(errors.transactionDate as FieldError)?.message}</span>
                        </div>

                    </div>

                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700">Amount in Words</label>
                        <p className="mt-1 text-gray-500">{amountText}</p>
                    </div>
                    <div className="mt-6">
                        <div className="mt-2 space-y-4">
                            {fields.map((field, index) => (
                                <div key={field.id} className="grid grid-cols-4 gap-4 items-center">
                                    <div>
                                        <label htmlFor={`details.${index}.coaCode`} className="block text-sm font-medium text-gray-700">Account</label>
                                        <div className="relative text-white-dark">
                                            <select
                                                id={`details.${index}.coaCode`}
                                                className="form-select placeholder:text-white-dark mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                {...register(`details.${index}.coaCode` as const)}
                                            >
                                                <option value="">Select Account</option>
                                                {bankList.map((bank: any) => (
                                                    <option key={bank.desc} value={bank.desc}>{bank.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <span className="text-danger text-xs">{(errors.details?.[index]?.coaCode as FieldError)?.message}</span>
                                    </div>
                                    <div>
                                        <label htmlFor={`details.${index}.amount`} className="block text-sm font-medium text-gray-700">Amount</label>
                                        <div className="relative text-white-dark">
                                            <input
                                                id={`details.${index}.amount`}
                                                type="number"
                                                className="form-input placeholder:text-white-dark mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                {...register(`details.${index}.amount` as const)}
                                                placeholder="Enter Amount"
                                            />
                                        </div>
                                        <span className="text-danger text-xs">{(errors.details?.[index]?.amount as FieldError)?.message}</span>
                                    </div>
                                    <div>
                                        <label htmlFor={`details.${index}.description`} className="block text-sm font-medium text-gray-700">Memo</label>
                                        <div className="relative text-white-dark">
                                            <input
                                                id={`details.${index}.description`}
                                                type="text"
                                                className="form-input placeholder:text-white-dark mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                {...register(`details.${index}.description` as const)}
                                                placeholder="Enter Debit Description"
                                            />
                                        </div>
                                        <span
                                            className="text-danger text-xs">{(errors.details?.[index]?.description as FieldError)?.message}</span>
                                    </div>

                                    <div className="flex justify-start ">
                                        <button
                                            type="button"
                                            className="text-green-600 flex items-center"
                                            onClick={() => append({ coaCode: '', description: '', amount: 0 })}
                                        >
                                            <FontAwesomeIcon icon={faPlus} className="mr-2" />
                                        </button>
                                        <button
                                            type="button"
                                            className="text-red-600 flex items-center"
                                            onClick={() => remove(index)}
                                        >
                                            <FontAwesomeIcon icon={faTimes} className="mr-2" />
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
                            onClick={() => navigate('/deposit')}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DepositForm;
