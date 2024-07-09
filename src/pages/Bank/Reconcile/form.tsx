import React, { useEffect, useState, Fragment } from 'react';
import { useForm, FieldError } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Dialog, Transition } from '@headlessui/react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { setPageTitle, setTitle, setBreadcrumbTitle } from '../../../store/themeConfigSlice';
import { useGetBanksQuery } from '@/store/api/bank/bankApiSlice';
import { useGetJournalQuery,useGetReconciliationDetailQuery,useGetReconciliationDetailCoaMutation,useCreateReconciliationMutation, useUpdateReconciliationMutation } from '@/store/api/bank/reconcile/reconcileApiSlice';
import { ReconciliationType, ReconciliationUpdateType } from '@/types/reconcileType';
import { BookBankType } from '@/types/bookBankType';
import { responseCallback } from '@/utils/responseCallback';
import { useGetBookBanksQuery } from '@/store/api/bank/bookBank/bookBankApiSlice';
import { BankType } from '@/types/bankType';
import { journalType } from '@/types';
import { toastMessage } from '@/utils/toastUtils';
import { FormatNumber } from '@/utils/formatNumber';
const ReconciliationForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>(); // Tentukan tipe untuk useParams
    const { data: detailReconciliation1, refetch: refetchDetailReconciliation1 } = id ? useGetReconciliationDetailQuery(Number(id)) : { data: null, refetch: () => { } };
    const [detailReconciliation,{ isLoading: isFetchingDetail }] = useGetReconciliationDetailCoaMutation();
    const [createReconciliation, { isLoading: isCreating }] = useCreateReconciliationMutation();
    const [updateReconciliation, { isLoading: isUpdating }] = useUpdateReconciliationMutation();
    const { data: bookBanks, refetch: refetchBookBanks } = useGetJournalQuery({ orderBy: 'createdDate', orderType: 'desc', page: -1, pageSize: 5 });
    const [coaBank,setCoaBank] = useState<any>('')
    const [newStatementBalance, setNewStatementBalance] = useState<any>('');
    const [reconciledDate, setReconciledDate] = useState<any>('');
    const schema = yup.object({
        coaCode: yup.string().required('Account is required'),
        desc: yup.string().required('Description is required'),
        newStatementBalance: yup.number().required('New Statement Balance is required').positive('Must be positive'),
        reconciledDate: yup.date().required('Reconcile Date is required'),
        clearIds: yup.array().of(yup.number().required()).min(1, 'At least one clear ID is required'),
        totalClear: yup.number().required('Total Clear is required'),
        totalOutStanding: yup.number().required('Total Outstanding is required'),
    }).required();

    const { register, formState: { errors }, handleSubmit, setValue, getValues, watch } = useForm<ReconciliationType>({
        resolver: yupResolver(schema),
    });

    const { data: bankList } = useGetBanksQuery({});

    const [totalClear, setTotalClear] = useState(0);
    const [totalOutstanding, setTotalOutstanding] = useState(0);
    const [balanceText, setBalanceText] = useState('');
    const [balance, setBalance] = useState(0);
    const [selectedBookBankIds, setSelectedBookBankIds] = useState<any>([]);
    const [showValidationPopup, setShowValidationPopup] = useState(false);

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

    const handleConfirmSave = async () => {
        setShowValidationPopup(false);
        try {
            const data = {
                ...getValues(),
                totalClear: Number(totalClear),
                totalOutStanding: Number(totalOutstanding),
                newStatementBalance: Number(getValues('newStatementBalance')),
                reconciledDate: new Date(getValues('reconciledDate')).toISOString(),
                createdBy: 1  // Assuming you are setting this to a default value
            }; 
            let response;
            if (id) {
                const updateData: ReconciliationUpdateType = { ...data, id: parseInt(id) };
                response = await updateReconciliation(updateData).unwrap();
            } else {
                response = await createReconciliation(data).unwrap();
            }
            responseCallback(response, () => {
                navigate('/reconcile');
                toastMessage('Reconcile Successfully Saved','success')
            }, null);
        } catch (err: any) {
            toast.error(err.message);
        }
    };

    const onSubmit = async (data: ReconciliationType) => {
        const balance = parseFloat(getValues('newStatementBalance')?.toString() || '0') || 0;
        if (balance !== totalClear) {
            setShowValidationPopup(true);
        } else {
            handleConfirmSave();
        }
    };

    const handleSelectBookBank = (journalId: number, isSelected: boolean) => {
        setSelectedBookBankIds((prev : any) => {
            if (isSelected) {
                return [...prev, journalId];
            } else {
                return prev.filter((id : any) => id !== journalId);
            }
        });
    };

    useEffect(() => {
        dispatch(setPageTitle('Reconciliation'));
        dispatch(setTitle('Reconciliation'));
        dispatch(setBreadcrumbTitle(['Dashboard', 'Bank', 'Reconciliation', id ? 'Update' : 'Create']));
    }, [dispatch]);

    // useEffect(() => {
    //     if (detailReconciliation && detailReconciliation.data) {
    //         Object.keys(detailReconciliation.data).forEach((key) => {
    //             if (key === 'createdDate' || key === 'reconciledDate') {
    //                 const isoString = detailReconciliation.data[key as keyof ReconciliationType] as string;
    //                 if (isoString) {
    //                     const date = new Date(isoString);
    //                     const formattedDate = date.toISOString().split('T')[0];
    //                     setValue(key as keyof ReconciliationType, formattedDate);
    //                 }
    //             } else {
    //                 setValue(key as keyof ReconciliationType, detailReconciliation.data[key as keyof ReconciliationType]?.toString() || '');
    //             }
    //         });
    //     }
    // }, [detailReconciliation, setValue]);

    useEffect(() => {
        const selectedBookBanks = bookBanks?.data?.data?.filter((entry: journalType) => selectedBookBankIds.includes(Number(entry.journalId)));
        const totalClearAmount = selectedBookBanks?.reduce((sum: number, entry: journalType) => {
                sum += entry?.debitAmount || 0;
                sum -= entry?.creditAmount || 0;
                return sum;
        }, 0) || 0;
        
        // setValue('newStatementBalance',balance);
        const subscription = watch((value:any, { name }) => {
            if (name === 'newStatementBalance') {
                const balance = parseFloat(value.newStatementBalance?.toString() || '0') || 0;
                setBalanceText(convertNumberToText(balance));
                setBalance(balance);
            }
            // setTotalClear(totalClearAmount);
            if(totalClearAmount === 0) {
                setTotalClear(0);
            }else{
                setTotalClear(-totalClearAmount);
            }
            const balance = parseFloat(value.newStatementBalance?.toString() || '0') || 0;
            setTotalOutstanding(balance + totalClearAmount);
        });
        if(totalClearAmount === 0) {
            setTotalClear(0);
        }else{
            setTotalClear(-totalClearAmount);
        }
        setTotalOutstanding(balance + totalClearAmount);
        return () => subscription.unsubscribe();
    }, [watch, selectedBookBankIds, bookBanks,balance]);

    useEffect(() => {
        const fetchData = async () => {
            if (coaBank) {
                try {
                    const data = await detailReconciliation(coaBank).unwrap();
                    if (data) {
                        // setValue('newStatementBalance', data?.data?.newStatementBalance);
                        setNewStatementBalance(data?.data?.balance);
                        setReconciledDate(data?.data?.reconciledDate);
                    }
                } catch (err: any) {
                    toast.error(err.message);
                }
            }else{
                // setValue('newStatementBalance', data?.data?.newStatementBalance);
                setNewStatementBalance('');
                setReconciledDate('');
            }
        };
        fetchData();
    },[coaBank])

    const formatDate = (dateString: any) => {
        const date = new Date(dateString);
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    
        return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
    };
    return (
        <div className="container mx-auto p-4">
            <div className="panel">
                <h2 className="text-2xl mb-4">Bank Reconciliation</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid md:grid-cols-2 gap-4 w-full">
                        <div>
                            <label htmlFor="coaCode" className="block text-sm font-medium text-gray-700">Bank Account</label>
                            <select id="coaCode" {...register('coaCode')} onChange={(e : any) => setCoaBank(e.target.value)} className="form-select mt-1 block w-full rounded-md border-gray-300 shadow-sm" >
                                <option value="">Select Account</option>
                                {bankList?.data.map((bank : BankType) => (
                                    <option key={bank.desc} value={bank.desc}>{bank.label}</option>
                                ))}
                            </select>
                            <span className="text-danger text-xs">{(errors.coaCode as FieldError)?.message}</span>
                        </div>

                        <div>
                            <label htmlFor="desc" className="block text-sm font-medium text-gray-700">ReconcileDate</label>
                            {/* <input id="desc" type="text" placeholder="Enter Description" {...register('desc')} className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm" /> */}
                            <span className="font-bold">{reconciledDate !== '' && reconciledDate !== null && reconciledDate !== undefined ? formatDate(reconciledDate) : '-'}</span>
                        </div>

                        <div>
                            <label htmlFor="newStatementBalance" className="block text-sm font-medium text-gray-700">New Statement Balance</label>
                            <input id="newStatementBalance" type="number" placeholder="Enter New Balance" {...register('newStatementBalance')} className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                            <span className="text-danger text-xs">{(errors.newStatementBalance as FieldError)?.message}</span>
                        </div>
                        <div>
                            <label htmlFor="reconciledDate" className="block text-sm font-medium text-gray-700">Reconcile Date</label>
                            <input id="reconciledDate" type="date" {...register('reconciledDate')} className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                            <span className="text-danger text-xs">{(errors.reconciledDate as FieldError)?.message}</span>
                        </div>
                        <div>
                            <label htmlFor="desc" className="block text-sm font-medium text-gray-700">Description</label>
                            <input id="desc" type="text" placeholder="Enter Description" {...register('desc')} className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                            <span className="text-danger text-xs">{(errors.desc as FieldError)?.message}</span>
                        </div>

                        {/* <div>
                            <label htmlFor="createdDate" className="block text-sm font-medium text-gray-700">Created Date</label>
                            <input id="createdDate" type="date" {...register('createdDate')} className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                            <span className="text-danger text-xs">{(errors.createdDate as FieldError)?.message}</span>
                        </div> */}
                        <div>
                            <input type="hidden" {...register('totalClear')} value={totalClear} />
                            <input type="hidden" {...register('totalOutStanding')} value={totalOutstanding} />
                        </div>
                    </div>
                    <div className="mt-6">
                        <label className="block text-md">Amount in Words</label>
                        <p className="mt-1 text-lg">{balanceText}</p>
                    </div>
                    <div className="mt-6 grid grid-cols-2 gap-4">
                        <div className="flex justify-end">
                            <p className='text-lg font-semibold'>Total Clear :</p>
                            <p className='text-lg font-semibold'>{totalClear.toLocaleString()}</p>
                        </div>
                        <div className="flex justify-end">
                            <p className='text-lg font-semibold'>Total Outstanding :</p>
                            <p className='text-lg font-semibold'>{totalOutstanding.toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="datatables mt-8">
                        <table className="min-w-full bg-white">
                            <thead>
                                <tr>
                                    <th className="py-2">Date</th>
                                    <th className="py-2">Account No</th>
                                    <th className="py-2">Account Name</th>
                                    <th className="py-2">Desc</th>
                                    <th className="py-2">Credit</th>
                                    <th className="py-2">Debit</th>
                                    <th className="py-2">Clear</th>
                                    <th className="py-2">Reconcile Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookBanks?.data?.data?.map((entry: journalType) => (
                                    <tr key={entry.journalId}>
                                        <td className="py-2">{entry.createdDate ? new Date(entry.createdDate).toLocaleDateString('id-ID', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: '2-digit',
                                        }):''}</td>
                                        <td>{entry.coaCode}</td>
                                        <td>{entry.coaName}</td>
                                        <td>{entry.journalDesc}</td>
                                        <td>{entry.creditAmount != null ? entry.creditAmount : 0}</td>
                                        <td>{entry.debitAmount != null ? entry.debitAmount : 0}</td>
                                        <td className="py-2">
                                            <input type="checkbox" 
                                                onChange={ (e: any) => handleSelectBookBank(Number(entry.journalId), e.target.checked)}
                                            />
                                        </td>
                                        <td className="py-2">{entry.reconciledDate ? new Date(entry.reconciledDate).toLocaleDateString('id-ID', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: '2-digit',
                                        }) : ''}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <Transition appear show={showValidationPopup} as={Fragment}>
                        <Dialog as="div" open={showValidationPopup} onClose={() => setShowValidationPopup(false)}>
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="fixed inset-0" />
                            </Transition.Child>
                            <div className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
                                <div className="flex items-start justify-center min-h-screen px-4">
                                    <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden w-full max-w-lg my-8 text-black dark:text-white-dark animate__animated animate__fadeIn">
                                        <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                            <h5 className="font-bold text-lg">Validation Warning</h5>
                                            <button onClick={() => setShowValidationPopup(false)} type="button" className="text-white-dark hover:text-dark">
                                                <span className="icon-x"></span>
                                            </button>
                                        </div>
                                        <div className="p-5">
                                            <p>Saldo pernyataan baru yang dimasukkan tidak sesuai dengan jumlah total clear. Apakah Anda ingin melanjutkan?</p>
                                            <div className="flex justify-end items-center mt-8">
                                                <button onClick={() => setShowValidationPopup(false)} type="button" className="btn btn-outline-dark">
                                                    Batal
                                                </button>
                                                <button onClick={handleConfirmSave} type="button" className="btn btn-outline-danger ml-4">
                                                    Lanjutkan
                                                </button>
                                            </div>
                                        </div>
                                    </Dialog.Panel>
                                </div>
                            </div>
                        </Dialog>
                    </Transition>
                    <div className="mt-6 flex justify-end space-x-4 my-4">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-purple-600 text-white rounded-md shadow-sm"
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-400 text-white rounded-md shadow-sm"
                            onClick={() => navigate('/')}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReconciliationForm;
