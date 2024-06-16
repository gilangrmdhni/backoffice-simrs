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
import { PaymentType, PaymentUpdateType } from '@/types/paymentType';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';

const DaftarBiayaForm = () => {
    const isRtl = useSelector((state: any) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { data: detailPayment, refetch: refetchDetailPayment } = id ? useGetPaymentDetailQuery(Number(id)) : { data: null, refetch: () => { } };
    const [createPayment, { isLoading: isCreating }] = useCreatePaymentMutation();
    const [updatePayment, { isLoading: isUpdating }] = useUpdatePaymentMutation();
    const [paymentNow, setPaymentNow] = useState<boolean>(false)
    const dateNow = new Date
    const [isTanggal, setIsTanggal] = useState<any>(dateNow)
    const [isTime, setIsTime] = useState<any>(dateNow)

    const schema = yup.object({
        description: yup.string().required('Description is Required'),
        coaCode: yup.string().required('Account is Required'),
        amount: yup.number().required('Amount is Required').positive('Amount must be positive'),
        transactionDate: yup.date().required('Transaction Date is Required'),
        details: yup.array().of(
            yup.object().shape({
                coaCode: yup.string().required('Account is Required'),
                description: yup.string().required('Memo is Required'),
                amount: yup.number().required('Amount is Required').positive('Amount must be positive'),
                isPremier: yup.boolean().required('IsPremier is Required'),
            })
        ).required().min(1, 'At least one detail entry is required'),
    }).required();

    const { register, control, formState: { errors }, handleSubmit, setValue, watch } = useForm<PaymentType>({
        resolver: yupResolver(schema),
        defaultValues: {
            transactionDate: '',
            coaCode: '',
            description: '',
            transactionNo: '',
            amount: 0,
            transactionType: 'payment',
            transactionName: '',
            transactionRef: '',
            contactId: 0,
            details: [{ coaCode: '', description: '', amount: 0, isPremier: false }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'details',
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

        const totalDetails = data.details.reduce((sum, detail) => sum + (Number(detail.amount) || 0), 0);
        const formAmount = Number(data.amount);
        console.log('Total Details:', totalDetails);
        console.log('Form Amount:', formAmount);

        // Validasi tambahan sebelum pengiriman
        if (totalDetails !== formAmount) {
            toastMessage('Total amount of details must match the amount in the form.', 'error');
            return;
        }

        try {
            let response;
            if (id) {
                const updateData: PaymentUpdateType = {
                    ...data,
                    journalId: parseInt(id),
                };
                response = await updatePayment(updateData).unwrap();
            } else {
                const postData: PaymentType = {
                    ...data,
                    amount: formAmount,
                    transactionType: 'payment', // Hardcode transaction type to "payment"
                    details: data.details.map(detail => ({
                        ...detail,
                        isPremier: true // Assigning isPremier as true for each detail
                    }))
                };

                console.log('Payload yang dikirim:', JSON.stringify(postData, null, 2));

                response = await createPayment(postData).unwrap();
            }
            responseCallback(response, () => {
                toastMessage('Data berhasil disimpan.', 'success');
                navigate('/payment');
            }, null);
        } catch (err: any) {
            toastMessage(err.message, 'error');
        }
    };

    useEffect(() => {
        dispatch(setPageTitle('Buat Biaya'));
        dispatch(setTitle('Buat Biaya'));
        dispatch(setBreadcrumbTitle(['Dashboard', 'Pengeluaran', 'Daftar Biaya', id ? 'Update' : 'Create']));
        if (id) {
            refetchDetailPayment();
        }
    }, [dispatch, id, refetchDetailPayment]);

    useEffect(() => {
        if (detailPayment && detailPayment.data) {
            Object.keys(detailPayment.data).forEach((key) => {
                if (key === 'transactionDate') {
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
            const totalDetails = value.details?.reduce((sum, detail) => {
                const detailAmount = parseFloat(detail?.amount?.toString() || '0') || 0;
                return sum + detailAmount;
            }, 0) || 0;

            setAmountText(convertNumberToText(totalDetails));
            setTotal(totalDetails);
            // setDifference(totalDetails - value.amount);
        });
        return () => subscription.unsubscribe();
    }, [watch]);

    console.log(paymentNow)
    return (
        <div>
            <div className="panel mt-6">
                <form className="flex gap-6 flex-col" onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid md:grid-cols-1 gap-4 w-full">
                        <div className='flex justify-start w-full mb-5'>
                            <div className='label mr-10 w-64'>
                                <label htmlFor="">Bayar Sekarang?</label>
                            </div>
                            <div className="relative text-white-dark w-full">
                                <label className="w-12 h-6 relative">
                                    <input type="checkbox" checked={paymentNow} onClick={() => setPaymentNow(!paymentNow)} className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer" id="custom_switch_checkbox1" />
                                    <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                                </label>
                            </div>
                        </div>
                        <div className='flex justify-start w-full mb-5'>
                            <div className='label mr-10 w-64'>
                                <label htmlFor="Akun">Transaksi</label>
                            </div>
                            {paymentNow ? (
                                <div className="text-white-dark w-full grid md:grid-cols-2 gap-4">
                                    <div className=''>
                                        <label htmlFor="Akun">Bayar Dari</label>
                                        <select id="coaCode" {...register('coaCode')} className="form-select font-normal placeholder:text-white-dark mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                            <option value="">Pilih</option>
                                            {bankList.map((bank) => (
                                                <option key={bank.desc} value={bank.desc}>{bank.label}</option>
                                            ))}
                                        </select>

                                        <span className="text-danger text-xs">{(errors.coaCode as FieldError)?.message}</span>
                                    </div>
                                    <div className=''>
                                        <label htmlFor="transactionNo">No Transaksi</label>
                                        <input type="text" id="transactionNo" {...register('transactionNo')} className="form-input font-normal" placeholder='CONTOH : BTB-10001'
                                        />
                                        <span className="text-danger text-xs">{(errors.transactionNo as FieldError)?.message}</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-white-dark w-full grid md:grid-cols-1 gap-4">
                                    <div className=''>
                                        <label htmlFor="coaCode">Bayar Dari</label>
                                        <select disabled id="coaCode" {...register('coaCode')} className="form-select font-normal placeholder:text-white-dark mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                            <option value="" disabled>Pilih</option>
                                        </select>

                                        {/* <span className="text-danger text-xs">{(errors.coaCode as FieldError)?.message}</span> */}
                                    </div>
                                </div>
                            )
                            }
                        </div>

                        <div className='flex justify-start w-full mb-5'>
                            <div className='label mr-10 w-64'>
                                {/* <label htmlFor="Akun">Transaksi</label> */}
                            </div>
                            <div className="text-white-dark w-full grid md:grid-cols-2 gap-4">
                                <div className=''>
                                    <label htmlFor="transactionRef">No Refrensi</label>
                                    <input type="text" id="transactionRef" {...register('transactionRef')} className="form-input font-normal" placeholder='CONTOH : BTB-10001'
                                    />

                                    <span className="text-danger text-xs">{(errors.transactionRef as FieldError)?.message}</span>
                                </div>
                                <div className=''>
                                    <label htmlFor="transactionName">No Biaya</label>
                                    <input type="text" id="transactionName" {...register('transactionName')} className="form-input font-normal" placeholder='CONTOH : BTB-10001'
                                    />
                                    <span className="text-danger text-xs">{(errors.transactionName as FieldError)?.message}</span>
                                </div>
                            </div>
                        </div>

                        <hr />

                        <div className='flex justify-start w-full mb-5'>
                            <div className='label mr-10 w-64'>
                                <label htmlFor="Akun">Mitra</label>
                            </div>
                            <div className="text-white-dark w-full grid md:grid-cols-1 gap-4">
                                <div className=''>
                                    <label htmlFor="contactId">No Refrensi</label>
                                    <select id="contactId" {...register('contactId')} className="form-select font-normal placeholder:text-white-dark mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                        <option value="">Pilih</option>
                                        {bankList.map((bank) => (
                                            <option key={bank.desc} value={bank.desc}>{bank.label}</option>
                                        ))}
                                    </select>

                                    <span className="text-danger text-xs">{(errors.contactId as FieldError)?.message}</span>
                                </div>
                            </div>
                        </div>
                        <div className='flex justify-start w-full mb-5'>
                            <div className='label mr-10 w-64'>
                                {/* <label htmlFor="Akun">Transaksi</label> */}
                            </div>
                            <div className="text-white-dark w-full grid md:grid-cols-2 gap-4">
                                <div className=''>
                                    <label htmlFor="transactionDate">Tanggal Refrensi</label>
                                    <Flatpickr
                                        value={isTanggal}
                                        options={{ dateFormat: 'Y-m-d', position: isRtl ? 'auto right' : 'auto left' }}
                                        className="form-input font-normal"
                                        onChange={(date: any) => setIsTanggal(date)}
                                    />

                                    <span className="text-danger text-xs">{(errors.transactionDate as FieldError)?.message}</span>
                                </div>
                                <div className=''>
                                    <label htmlFor="transactionDate">Tanggal Jatuh Tempo</label>
                                    <Flatpickr
                                        value={isTanggal}
                                        options={{ dateFormat: 'Y-m-d', position: isRtl ? 'auto right' : 'auto left' }}
                                        className="form-input font-normal"
                                        onChange={(date: any) => setIsTanggal(date)}
                                    />
                                    <span className="text-danger text-xs">{(errors.transactionDate as FieldError)?.message}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6">
                        <div className="mt-2 space-y-4">
                            <label htmlFor="details">Nama Akun</label>

                            {fields.map((field, index) => (
                                <div key={field.id}>
                                    <div className='flex justify-start w-full mb-5'>
                                        <div className='label mr-10 w-64'>
                                        </div>
                                        <div className="text-white-dark w-full grid md:grid-cols-1 gap-4">
                                            <div className=''>
                                                <select id="details" {...register(`details.${index}.coaCode`)} className="form-select font-normal placeholder:text-white-dark mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                                                    <option value="">Pilih</option>
                                                    {bankList.map((bank) => (
                                                        <option key={bank.desc} value={bank.desc}>{bank.label}</option>
                                                    ))}
                                                </select>

                                                <span className="text-danger text-xs">{(errors.details?.[index]?.coaCode as FieldError)?.message}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex justify-start w-full mb-5'>
                                        <div className='label mr-10 w-64'>
                                            {/* <label htmlFor="Akun">Transaksi</label> */}
                                        </div>
                                        <div className="text-white-dark w-full grid md:grid-cols-2 gap-4">
                                            <div className=''>
                                                <label htmlFor="details">Deskripsi</label>
                                                <input type="text" id="details" {...register(`details.${index}.description`)} className="form-input font-normal" placeholder='Deskripsi'
                                                />

                                                <span className="text-danger text-xs">{(errors.details?.[index]?.description as FieldError)?.message}</span>
                                            </div>
                                            <div className=''>
                                                <label htmlFor="details">Jumlah</label>
                                                <input type="number" id="details" {...register(`details.${index}.amount`)} className="form-input font-normal" placeholder='Masukan Jumlah'
                                                />

                                                <span className="text-danger text-xs">{(errors.details?.[index]?.amount as FieldError)?.message}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex justify-end'>
                                        <button
                                            type="button"
                                            className="text-red-600"
                                            onClick={() => remove(index)}
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className='flex justify-center '>
                            <button
                                type="button"
                                className="  text-green-600 border border-green-600 rounded-lg px-4 py-2 hover:bg-green-600 hover:text-white transition-colors duration-300 ease-in-out"
                                onClick={() => append({ coaCode: '', description: '', amount: 0, isPremier: true })}
                            >
                                Tambah
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-start space-x-6">
                        <span className='text-md'>Total :</span>
                        <span className='text-md'> {total.toLocaleString()}</span>
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
                            onClick={() => navigate('/daftarbiayas')}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DaftarBiayaForm;
