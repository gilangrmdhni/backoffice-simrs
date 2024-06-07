import { useDispatch, useSelector } from 'react-redux';
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
import { PaymentType, CreditEntry , PaymentUpdateType } from '@/types/paymentType';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes, faPlaceOfWorship,faTrash } from '@fortawesome/free-solid-svg-icons';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconPlus from '@/components/Icon/IconPlus';
import ModalCoaCustom from '@/components/ModalCoaCustom';
import { COAType } from '@/types';
const DaftarPengeluaranForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const isRtl = useSelector((state: any) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const { data: detailPayment, refetch: refetchDetailPayment } = id ? useGetPaymentDetailQuery(Number(id)) : { data: null, refetch: () => { } };
    const [createPayment, { isLoading: isCreating }] = useCreatePaymentMutation();
    const [updatePayment, { isLoading: isUpdating }] = useUpdatePaymentMutation();
    const dateNow = new Date
    const [isTanggal, setIsTanggal] = useState<any>(dateNow)
    const [isTime, setIsTime] = useState<any>(dateNow)
    const [isShowModalCoa, setIsShowModalCoa] = useState<boolean>(false)
    const [selectedRecords, setSelectedRecords] = useState<any>([]);
    const [showSelected, setShowSelected] = useState<any>([]);
    const [isSave, setIsSave] = useState<boolean>(false)


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
            credits: [{ coaCredit: '', journalDescCredit: '', amount: 0 }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'credits',
    });

    const deleteItem = (indexToDelete : any) => {
        const newItems = showSelected.filter((value : any, index : number) => index !== indexToDelete);
        setShowSelected(newItems);
        setSelectedRecords(newItems);
      };

    const { data: bankResponse } = useGetBanksQuery({});
    const bankList = bankResponse?.data ?? [];

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

    const onSubmit = async (data: PaymentType) => {
        console.log('Data yang dikirim:', data);

        const totalDebits = data.credits.reduce((sum, credit) => sum + (Number(credit.amount) || 0), 0);
        const formAmount = Number(data.amount);
        console.log('Total Debits:', totalDebits);
        console.log('Form Amount:', formAmount);

        // Validasi tambahan sebelum pengiriman
        if (totalDebits !== formAmount) {
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
                response = await updatePayment(updateData).unwrap();
            } else {
                const postData = data.credits.map(credit => ({
                    ...data,
                    coaCssredit: credit.coaCredit,
                    journalDescCreditt: credit.journalDescCredit,
                    amount: credit.amount,
                }));
                // Log payload untuk debugging
                console.log('Payload yang dikirim:', JSON.stringify(postData, null, 2));

                response = await createPayment(postData).unwrap();
            }
            responseCallback(response, () => {
                navigate('/daftarPengeluaran');
            }, null);
        } catch (err: any) {
            toastMessage(err.message, 'error');
        }
    };
    
    useEffect(() => {
        dispatch(setPageTitle('Daftar Pengeluaran'));
        dispatch(setTitle('Daftar Pengeluaran'));
        dispatch(setBreadcrumbTitle(['Dashboard', 'Bank', 'Daftar Pengeluaran', id ? 'Update' : 'Create']));
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
                const totalDebits = value.credits?.reduce((sum, credit) => {
                    const debitAmount = parseFloat(credit?.amount?.toString() || '0') || 0;
                    return sum + debitAmount;
                }, 0) || 0;
                setDifference(amount - totalDebits);
            }
        });
        return () => subscription.unsubscribe();
    }, [watch]);

    return (
        <div>
            <div className="mt-6">
                <form className="flex gap-6 flex-col" onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid md:grid-cols-1 gap-4 w-full panel ">
                        <h1 className="font-semibold text-2xl text-black mb-5">
                            Informasi Pengeluaran Kas & Bank
                        </h1>
                        <div className='flex justify-start w-full mb-5'>
                            <div className='label mr-10 w-64'>
                                <label htmlFor="coaCredit">AKUN TUJUAN</label>
                            </div>
                            <div className="relative text-white-dark w-full">
                                <select id="coaCredit" {...register('coaCredit')} className="form-select font-normal placeholder:text-white-dark mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                    <option value="">Pilih</option>
                                    {bankList.map((bank) => (
                                        <option key={bank.desc} value={bank.desc}>{bank.label}</option>
                                    ))}
                                </select>
                                <span className="text-danger text-xs">{(errors.coaCredit as FieldError)?.message}</span>
                            </div>
                        </div>
                        <div className='flex justify-start w-full mb-5'>
                            <div className='label mr-10 w-64'>
                                <label htmlFor="Akun">Transaksi</label>
                            </div>
                            <div className="text-white-dark w-full grid md:grid-cols-2 gap-4">
                                <div className=''>
                                    <label htmlFor="Akun">Tanggal</label>
                                    <Flatpickr
                                        value={isTanggal}
                                        options={{ dateFormat: 'Y-m-d', position: isRtl ? 'auto right' : 'auto left' }}
                                        className="form-input font-normal"
                                        onChange={(date: any) => setIsTanggal(date)}
                                    />

                                    <span className="text-danger text-xs">{(errors.createdDate as FieldError)?.message}</span>
                                </div>
                                <div className=''>
                                    <label htmlFor="Akun">Waktu</label>
                                    <Flatpickr
                                        options={{
                                            noCalendar: true,
                                            enableTime: true,
                                            dateFormat: 'H:i',
                                            position: isRtl ? 'auto right' : 'auto left',
                                        }}
                                        value={isTime}
                                        className="form-input font-normal"
                                        onChange={(date) => setIsTime(date)}
                                    />
                                    <span className="text-danger text-xs">{(errors.createdDate as FieldError)?.message}</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700">Say</label>
                            <p className="mt-1 text-gray-500">{amountText}</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-1 gap-4 w-full panel">
                        <h1 className="font-semibold text-2xl text-black mb-5">
                            Detail Pengeluaran
                        </h1>
                        <div className="mt-6 flex justify-between">
                            <label className="">Daftar Akun</label>
                            <Tippy content="Tambah Daftar Transfer">
                                <button
                                    onClick={() => setIsShowModalCoa(true)}
                                    type="button"
                                    className="flex justify-left w-auto h-10 p-2.5 bg-primary rounded-md ">
                                    <IconPlus className='text-white font-bold' />
                                    <span className='text-white font-bold'>Pilih Akun</span>
                                </button>
                            </Tippy>
                        </div>
                        <div className="mt-6">
                            <div className="mt-2 space-y-4">
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
                                        {/* {fields.map((field, index) => (
                                            <tr key={field.id} className="">
                                                <td>
                                                    <div className="relative text-white-dark">
                                                        <select
                                                            id={`debits.${index}.coaDebit`}
                                                            className="form-select placeholder:text-white-dark mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                            {...register(`debits.${index}.coaDebit` as const)}
                                                        >
                                                            <option value="">Select Account</option>
                                                            {bankList.map((bank) => (
                                                                <option key={bank.desc} value={bank.desc}>{bank.label}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <span className="text-danger text-xs">{(errors.debits?.[index]?.coaDebit as FieldError)?.message}</span>
                                                </td>
                                                <td>
                                                    <div className="relative text-white-dark">
                                                        <input
                                                            id={`debits.${index}.amount`}
                                                            type="number"
                                                            className="form-input placeholder:text-white-dark mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                            {...register(`debits.${index}.amount` as const)}
                                                            placeholder="Enter Amount"
                                                        />
                                                    </div>
                                                    <span className="text-danger text-xs">{(errors.debits?.[index]?.amount as FieldError)?.message}</span>
                                                </td>
                                                <td>
                                                    <div className="relative text-white-dark">
                                                        <input
                                                            id={`debits.${index}.journalDescDebit`}
                                                            type="text"
                                                            className="form-input placeholder:text-white-dark mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                            {...register(`debits.${index}.journalDescDebit` as const)}
                                                            placeholder="Enter Debit Description"
                                                        />
                                                    </div>
                                                    <span className="text-danger text-xs">{(errors.debits?.[index]?.journalDescDebit as FieldError)?.message}</span>
                                                </td>

                                                <td className='grid-cols-2 flex justify-center gap-2'>
                                                    <button
                                                        type="button"
                                                        className="border-none h-10 w-10"
                                                        onClick={() => remove(index)}
                                                    >
                                                        <div className="grid place-content-center w-10 h-10 rounded-md">
                                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                                                                <path d="M9 12C9 11.5341 9 11.3011 9.07612 11.1173C9.17761 10.8723 9.37229 10.6776 9.61732 10.5761C9.80109 10.5 10.0341 10.5 10.5 10.5H13.5C13.9659 10.5 14.1989 10.5 14.3827 10.5761C14.6277 10.6776 14.8224 10.8723 14.9239 11.1173C15 11.3011 15 11.5341 15 12C15 12.4659 15 12.6989 14.9239 12.8827C14.8224 13.1277 14.6277 13.3224 14.3827 13.4239C14.1989 13.5 13.9659 13.5 13.5 13.5H10.5C10.0341 13.5 9.80109 13.5 9.61732 13.4239C9.37229 13.3224 9.17761 13.1277 9.07612 12.8827C9 12.6989 9 12.4659 9 12Z" stroke="currentColor" stroke-width="1.5"></path>
                                                                <path opacity="0.5" d="M20.5 7V13C20.5 16.7712 20.5 18.6569 19.3284 19.8284C18.1569 21 16.2712 21 12.5 21H11.5C7.72876 21 5.84315 21 4.67157 19.8284C3.5 18.6569 3.5 16.7712 3.5 13V7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
                                                                <path d="M2 5C2 4.05719 2 3.58579 2.29289 3.29289C2.58579 3 3.05719 3 4 3H20C20.9428 3 21.4142 3 21.7071 3.29289C22 3.58579 22 4.05719 22 5C22 5.94281 22 6.41421 21.7071 6.70711C21.4142 7 20.9428 7 20 7H4C3.05719 7 2.58579 7 2.29289 6.70711C2 6.41421 2 5.94281 2 5Z" stroke="currentColor" stroke-width="1.5"></path>
                                                            </svg>
                                                        </div>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))} */}
                                        {isSave ? (
                                            showSelected.map((record : COAType, index:number) =>(
                                                <tr key={index}>
                                                    <td>
                                                        {record.coaName}
                                                        <input type="hidden" id={`credits.${index}.coaDebit`} 
                                                            {...register(`credits.${index}.coaCredit` as const)}
                                                        />
                                                    </td>
                                                    <td>
                                                        <div className="relative text-white-dark">
                                                            <input
                                                                id={`credits.${index}.journalDescCredit`}
                                                                type="text"
                                                                className="form-input placeholder:text-white-dark mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                                                {...register(`credits.${index}.journalDescCredit` as const)}
                                                                placeholder="Enter Debit Description"
                                                            />
                                                        </div>
                                                        <span className="text-danger text-xs">{(errors.credits?.[index]?.journalDescCredit as FieldError)?.message}</span>
                                                    </td>
                                                    <td>
                                                        
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
                                                    </td>
                                                    <td>
                                                        <button
                                                            type="button"
                                                            className="border-none h-10 w-10"
                                                            onClick={() => deleteItem(index)}
                                                        >
                                                           <FontAwesomeIcon icon={faTrash}  />
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
                                            // 'Data tidak tersedia'
                                        )}
                                    </tbody>
                                </table>

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

                    </div>
                    <div className="mt-6 flex justify-end space-x-4">
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-600 text-white rounded-md shadow-sm"
                            onClick={() => navigate('/daftartransfer')}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm"
                        >
                            {isCreating || isUpdating ? 'Loading' : id ? 'Update' : 'Create'}
                        </button>
                        
                    </div>
                    <ModalCoaCustom setIsSave={setIsSave} selectedRecords={selectedRecords} setShowSelected={setShowSelected} setSelectedRecords={setSelectedRecords} showModal={isShowModalCoa} setIsShowModal={setIsShowModalCoa} />
                </form>
            </div>
        </div>
    );
};

export default DaftarPengeluaranForm;
