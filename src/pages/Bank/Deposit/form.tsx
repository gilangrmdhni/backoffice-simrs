import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Fragment, useEffect, useState } from 'react';
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
import { faPlus, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import IconPlus from '@/components/Icon/IconPlus';
import ModalCoaCustom from '@/components/ModalCoaCustom';
import { COAType } from '@/types';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { Dialog, Transition } from '@headlessui/react';
import IconX from '@/components/Icon/IconX';


interface BankOption {
    desc: string;
    label: string;
}

const DepositForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const isRtl = useSelector((state: any) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const { data: detailDeposit, refetch: refetchDetailDeposit } = id ? useGetDepositDetailQuery(Number(id)) : { data: null, refetch: () => { } };
    const [createDeposit, { isLoading: isCreating }] = useCreateDepositMutation();
    const [updateDeposit, { isLoading: isUpdating }] = useUpdateDepositMutation();
    const [isShowModalCoa, setIsShowModalCoa] = useState<boolean>(false);
    const [selectedRecords, setSelectedRecords] = useState<any>([]);
    const [showSelected, setShowSelected] = useState<any>([]);
    const [excludeId, setExcludeId] = useState<any>('');
    const [isSave, setIsSave] = useState<boolean>(false);
    const [isShowModalAccount, setIsShowModalAccount] = useState<boolean>(false);
    const [selectedAccount, setSelectedAccount] = useState<BankOption | null>(null);

    const schema = yup.object({
        transactionNo: yup.string().optional(), 
        description: yup.string().required('Credit Description is Required'),
        coaCode: yup.string().required('Account is Required'),
        transactionDate: yup.date().required('Deposit Date is Required'),
        details: yup.array().of(
            yup.object().shape({
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

    const handleAccountSelect = (account: BankOption) => {
        setSelectedAccount(account);
        setValue('coaCode', account.desc);
        setIsShowModalAccount(false);
    };


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

    const deleteItem = (indexToDelete: any) => {
        const newItems = showSelected.filter((value: any, index: number) => index !== indexToDelete);
        setShowSelected(newItems);
        setSelectedRecords(newItems);
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
                const postData: DepositType = {
                    ...data,
                    transactionType: 'Deposit',
                    details: data.details.map((detail, index: number) => ({
                        ...detail,
                        coaCode: showSelected[index].coaCode,
                        isPremier: false
                    }))
                };

                console.log('Payload yang dikirim:', JSON.stringify(postData, null, 2));

                response = await createDeposit(postData).unwrap(); // Memastikan postData adalah objek DepositType
            }
            responseCallback(response, () => {
                toastMessage('Data berhasil disimpan.', 'success');
                navigate('/bookbank');
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
            // console.log(name)
            if (name === 'amount' || name?.includes("amount")) {
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

    const { t } = useTranslation();

    return (
        <div>
            <div className="mt-6">
                <form className="flex gap-6 flex-col" onSubmit={handleSubmit(onSubmit)}>
                    <div className='panel'>
                        <div className="grid md:grid-cols-2 gap-4 w-full">
                            <div>
                                <label htmlFor="transactionNo" className="block text-sm font-medium text-gray-700">Transaction No</label>
                                <div className="relative text-white-dark">
                                    <input id="transactionNo" type="text" placeholder="Enter Transaction No" {...register('transactionNo')} className="form-input placeholder:text-white-dark mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="coaCode" className="block text-sm font-medium text-gray-700">Deposit To</label>
                                <div className="relative text-white-dark">
                                    <button
                                        type="button"
                                        onClick={() => setIsShowModalAccount(true)}
                                        className="form-input placeholder:text-gray-500 mt-1 block w-full rounded-md border-gray-300 shadow-sm text-left text-gray-500"
                                    >
                                        {selectedAccount ? selectedAccount.label : "Select Account"}
                                    </button>
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
                                <label htmlFor="transactionDate" className="block text-sm font-medium text-gray-700">Deposit Date</label>
                                <div className="relative text-white-dark">
                                    <input id="transactionDate" type="date" {...register('transactionDate')} className="form-input placeholder:text-white-dark mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                                </div>
                                <span className="text-danger text-xs">{(errors.transactionDate as FieldError)?.message}</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="block text-md">Amount in Words</label>
                            <p className="mt-1 text-lg">{t(amountText)}</p>
                        </div>
                    </div>
                    <div className="grid md:grid-cols-1 gap-4 w-full panel">
                        <h1 className="font-semibold text-2xl text-black">
                            Detail Deposit
                        </h1>
                        <div className=" flex justify-end">
                            <Tippy content="Tambah Daftar Transfer">
                                <button
                                    onClick={() => setIsShowModalCoa(true)}
                                    type="button"
                                    className="flex justify-left w-auto h-10 p-2.5 btn btn-outline-primary rounded-md ">
                                    <IconPlus className='font-bold' />
                                    <span className='font-bold'>Pilih Akun</span>
                                </button>
                            </Tippy>
                        </div>
                        <div className="space-y-4">
                            <table className="datatables">
                                <thead>
                                    <tr>
                                        <th>
                                            Nama Akun
                                        </th>
                                        <th>
                                            Deskripsi
                                        </th>
                                        <th colSpan={2}>
                                            Jumlah
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isSave ? (
                                        showSelected.map((record: COAType, index: number) => (
                                            <tr key={index}>
                                                <td>
                                                    {record.coaName}
                                                </td>
                                                <td>
                                                    <div className="relative text-white-dark">
                                                        <input
                                                            id={`details.${index}.description`}
                                                            type="text"
                                                            className="form-input placeholder:text-white-dark mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                            {...register(`details.${index}.description` as const)}
                                                            placeholder={t('Masukan Deskripsi')}
                                                        />
                                                    </div>
                                                    <span className="text-danger text-xs">{(errors.details?.[index]?.description as FieldError)?.message ? t('Deskripsi Wajib Diisi') : ''}</span>
                                                </td>
                                                <td>
                                                    <div className="relative text-white-dark">
                                                        <input
                                                            id={`details.${index}.amount`}
                                                            type="number"
                                                            className="form-input placeholder:text-white-dark mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                            {...register(`details.${index}.amount` as const)}
                                                            placeholder={t('Masukan Jumlah')}
                                                        />
                                                    </div>
                                                    <span className="text-danger text-xs">{(errors.details?.[index]?.amount as FieldError)?.message ? t('Jumlah Wajib Diisi') : ''}</span>
                                                </td>
                                                <td>
                                                    <input type="hidden" id={`details.${index}.isPremier`} {...register(`details.${index}.isPremier` as const)} value="true" />
                                                    <button
                                                        type="button"
                                                        className="border-none h-10 w-10"
                                                        onClick={() => deleteItem(index)}
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4}>
                                                Data Tidak Tersedia
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {/* Modal for Account Selection */}
                        <Transition appear show={isShowModalAccount} as={Fragment}>
                            <Dialog as="div" open={isShowModalAccount} onClose={() => setIsShowModalAccount(false)}>
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
                                                <h5 className="font-bold text-lg">Select Account</h5>
                                                <button onClick={() => setIsShowModalAccount(false)} type="button" className="text-white-dark hover:text-dark">
                                                    <IconX />
                                                </button>
                                            </div>
                                            <div className="p-5">
                                                <div className="grid grid-cols-1 gap-4">
                                                    {bankList.map((account) => (
                                                        <button
                                                            key={account.desc}
                                                            type="button"
                                                            className="block w-full text-left p-2 hover:bg-gray-200 dark:hover:bg-dark/60"
                                                            onClick={() => handleAccountSelect(account)}
                                                        >
                                                            {account.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </Dialog.Panel>
                                    </div>
                                </div>
                            </Dialog>
                        </Transition>
                        <div className="mt-6 grid grid-cols-2 gap-4">
                            <div className="flex justify-end">
                                <p className='font-bold text-xl'>Total :</p>
                                <p className='font-bold text-xl'>{total.toLocaleString()}</p>
                            </div>
                            <div className="flex justify-end">
                                <p className='font-bold text-xl'>Difference :</p>
                                <p className='font-bold text-xl'>{difference.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-4">

                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-400 text-white rounded-md shadow-sm"
                            onClick={() => navigate('/Deposit]')}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 bg-primary text-white rounded-md shadow-sm"
                        >
                            {isCreating || isUpdating ? 'Loading' : id ? 'Update' : 'Create'}
                        </button>
                    </div>
                    <ModalCoaCustom setIsSave={setIsSave} selectedRecords={selectedRecords} setShowSelected={setShowSelected} setSelectedRecords={setSelectedRecords} showModal={isShowModalCoa} setIsShowModal={setIsShowModalCoa} excludeId={excludeId} />
                </form>
            </div>
        </div>
    );
};

export default DepositForm;
