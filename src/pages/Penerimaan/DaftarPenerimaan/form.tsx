import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { setPageTitle, setTitle, setBreadcrumbTitle } from '../../../store/themeConfigSlice';
import { useForm, FieldError, useFieldArray } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { responseCallback } from '@/utils/responseCallback';
import { toastMessage } from '@/utils/toastUtils';
import { useGetDepositDetailQuery, useCreateDepositMutation, useUpdateDepositMutation } from '@/store/api/bank/deposit/depositApiSlice';
import { useGetOptionBankQuery } from '@/store/api/bank/bankApiSlice';
import { DepositType, DepositUpdateType } from '@/types/depositType';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import IconPlus from '@/components/Icon/IconPlus';
import ModalCoaCustom from '@/components/ModalCoaCustom';
import { COAType } from '@/types';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';

interface BankOption {
    desc: string;
    label: string;
}

const DaftarPenerimaanForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const isRtl = useSelector((state: any) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const { data: detailDeposit, refetch: refetchDetailDeposit } = id ? useGetDepositDetailQuery(Number(id)) : { data: null, refetch: () => { } };
    const [createDeposit, { isLoading: isCreating }] = useCreateDepositMutation();
    const [updateDeposit, { isLoading: isUpdating }] = useUpdateDepositMutation();
    const dateNow = new Date();
    const [isShowModalCoa, setIsShowModalCoa] = useState<boolean>(false);
    const [selectedRecords, setSelectedRecords] = useState<any>([]);
    const [showSelected, setShowSelected] = useState<any>([]);
    const [excludeId, setExcludeId] = useState<any>('');
    const [isSave, setIsSave] = useState<boolean>(false);

    const schema = yup.object({
        coaCode: yup.string().required('Account is Required'),
        transactionDate: yup.date().required('Transaction Date is Required'),
        details: yup.array().of(
            yup.object().shape({
                description: yup.string().required('Memo is Required'),
                amount: yup.number().required('Amount is Required').positive('Amount must be positive'),
            })
        ).required().min(1, 'At least one detail entry is required'),
    }).required();

    const { register, control, formState: { errors }, handleSubmit, setValue, watch } = useForm<DepositType>({
        resolver: yupResolver(schema),
        defaultValues: {
            transactionDate: '',
            coaCode: '',
            description: '',
            transactionNo: '',
            transactionType: 'Deposit',
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

    const { data: bankResponse } = useGetOptionBankQuery({
        parent: 952,
    });
    const bankList: BankOption[] = bankResponse?.data ?? [];

    const handleDeleteDetail = (key: any) => {
        const index = selectedRecords.indexOf(key);
        if (index > -1) {
            selectedRecords.splice(key, 1);
            setShowSelected(selectedRecords);
            setSelectedRecords(selectedRecords);
        }
    };

    const deleteItem = (indexToDelete: any) => {
        const newItems = showSelected.filter((value: any, index: number) => index !== indexToDelete);
        setShowSelected(newItems);
        setSelectedRecords(newItems);
    };

    const { data: coaResponse, isLoading: isCoaLoading, error: coaError } = useGetOptionBankQuery({});
    const coaList = coaResponse?.data ?? [];

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
        console.log('Data yang dikirim:', data.details);

        const totalDetails = data.details.reduce((sum, detail) => sum + (Number(detail.amount) || 0), 0);
        const formAmount = totalDetails;
        console.log('Total details:', totalDetails);
        console.log('Form Amount:', formAmount);

        console.log('Tanggal yang dipilih:', data.transactionDate);

        try {
            let response;
            if (id) {
                const updateData: DepositUpdateType = {
                    ...data,
                    journalId: parseInt(id),
                };
                response = await updateDeposit(updateData).unwrap();
            } else {
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

                response = await createDeposit(postData).unwrap();
            }
            responseCallback(response, () => {
                toastMessage('Data berhasil disimpan.', 'success');
                navigate('/daftarpenerimaan');
            }, null);
        } catch (err: any) {
            toastMessage(err.message, 'error');
        }
    };

    useEffect(() => {
        dispatch(setPageTitle('Daftar Penerimaan'));
        dispatch(setTitle('Daftar Penerimaan'));
        dispatch(setBreadcrumbTitle(['Dashboard', 'Bank', 'Daftar Penerimaan', id ? 'Update' : 'Create']));
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
                    setValue(key as keyof DepositType, isoString);
                } else {
                    setValue(key as keyof DepositType, detailDeposit.data[key as keyof DepositType]);
                }
            });
        }
    }, [detailDeposit, setValue]);

    useEffect(() => {
        const subscription = watch((value, { name, type }) => {
            const totalDetails = value.details?.reduce((sum, detail) => {
                const detailAmount = parseFloat(detail?.amount?.toString() || '0') || 0;
                return sum + detailAmount;
            }, 0) || 0;

            setAmountText(convertNumberToText(totalDetails));
            setTotal(totalDetails);
            setDifference(totalDetails - (parseFloat(value.amount?.toString() || '0') || 0));
        });
        return () => subscription.unsubscribe();
    }, [watch]);

    const { t } = useTranslation();
    return (
        <div>
            <div className="mt-6">
                <form className="flex gap-6 flex-col" onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid md:grid-cols-1 gap-4 w-full panel ">
                        <h1 className="font-semibold text-2xl text-black mb-5">
                            {t('Informasi Penerimaan Kas & Bank')}
                        </h1>
                        <div className='flex justify-start w-full mb-10'>
                            <div className='label mr-10 w-64'>
                                <label htmlFor="coaCode">{t('NO TRANSAKSI')}</label>
                            </div>
                            <div className="text-white-dark w-full">
                                <input id="transactionNo" type="text" placeholder="Enter Contoh : 0001" className="form-input font-normal w-full placeholder:text-white-dark disabled:pointer-events-none disabled:bg-[#eee] dark:disabled:bg-[#1b2e4b]" {...register('transactionNo')} />
                                <span className="text-danger text-xs">{(errors.transactionNo as FieldError)?.message}</span>
                            </div>
                        </div>
                        <div className='flex justify-start w-full mb-5'>
                            <div className='label mr-10 w-64'>
                                <label htmlFor="coaCode">AKUN TUJUAN</label>
                            </div>
                            <div className="relative text-white-dark w-full">
                                <select id="coaCode" {...register('coaCode')} className="form-select font-normal placeholder:text-white-dark mt-1 block w-full rounded-md border-gray-300 shadow-sm" onChange={(record) => setExcludeId(record.target.value)}>
                                    <option value="">Pilih</option>
                                    {bankList.map((bank: any) => (
                                        <option key={bank.desc} value={bank.desc}>{bank.label}</option>
                                    ))}
                                </select>
                                <span className="text-danger text-xs">{(errors.coaCode as FieldError)?.message}</span>
                            </div>
                        </div>

                        <div className='flex justify-start w-full mb-5'>
                            <div className='label mr-10 w-64'>
                                <label htmlFor="transactionDate">TANGGAL TRANSAKSI</label>
                            </div>
                            <div className="text-white-dark w-full">
                                <Flatpickr
                                    options={{
                                        enableTime: true,
                                        dateFormat: 'Y-m-d H:i',
                                        position: isRtl ? 'auto right' : 'auto left'
                                    }}
                                    className="form-input font-normal"
                                    onChange={(date: Date[]) => {
                                        setValue('transactionDate', date[0].toISOString());
                                    }}
                                    placeholder='Pilih Tanggal Penerimaan'
                                />
                                <span className="text-danger text-xs">{(errors.transactionDate as FieldError)?.message ? t('Tanggal Transaksi Wajib Diisi') : ''}</span>
                            </div>
                        </div>

                        <div className='flex justify-start w-full mb-10'>
                            <div className='label mr-10 w-64'>
                                <label htmlFor="description">KETERANGAN</label>
                            </div>
                            <div className="text-white-dark w-full">
                                {/* <input id="transactionNo" type="text" placeholder="Enter Contoh : 0001" className="form-input font-normal w-full placeholder:text-white-dark disabled:pointer-events-none disabled:bg-[#eee] dark:disabled:bg-[#1b2e4b]" {...register('transactionNo')} /> */}
                                {/* <textarea name="" id="description"></textarea> */}
                                <textarea id="description" rows={3} className="form-textarea font-normal" placeholder="Keterangan..." {...register('description')}></textarea>
                                <span className="text-danger text-xs">{(errors.description as FieldError)?.message}</span>
                            </div>
                        </div>
                        {/* <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700">Say</label>
                            <p className="mt-1 text-gray-500">{amountText}</p>
                        </div> */}
                    </div>

                    <div className="grid md:grid-cols-1 gap-4 w-full panel">
                        <h1 className="font-semibold text-2xl text-black">
                            Detail Penerimaan
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
                        <div className="">
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
                        </div>
                        <span className="text-danger text-xs">{(errors.details as FieldError) ? t('Minimal Harus Mengirimkan 1 Transaksi') : ''}</span>

                        <div className="mt-6 grid grid-cols-1 gap-4">
                            <div className="flex justify-end">
                                <label className='font-bold text-xl'>Total : </label>
                                <label className='font-bold text-xl'>{total.toLocaleString()}</label>
                            </div>

                        </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-4">
                        <button
                            type="button"
                            className="px-4 py-2 text-primary"
                            onClick={() => navigate('/daftarpenerimaan')}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-primary text-white rounded-md shadow-sm"
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

export default DaftarPenerimaanForm;
