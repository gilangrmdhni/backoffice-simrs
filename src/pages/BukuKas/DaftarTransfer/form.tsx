import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { setPageTitle, setBreadcrumbTitle, setTitle } from '../../../store/themeConfigSlice';
import { useGetEmployeeQuery } from '@/store/api/employee/employeeApiSlice';
import IconMail from '@/components/Icon/IconMail';
import * as yup from 'yup';
import { useForm, FieldError, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { usersType, COAType, OptionType, AccountType, AccountGroupType, journalType } from '@/types';
import { useCreateDepositMutation, useUpdateDepositMutation } from '@/store/api/bank/deposit/depositApiSlice';
import { DepositType } from '@/types/depositType';
import { useGetDetailCOAQuery, usePostCOAMutation, useUpdateCOAMutation, useGetOptionCOAQuery } from '@/store/api/coa/coaApiSlice';
import { useGetAccountTypesQuery, useGetOptionAccountTypeOptionQuery } from '@/store/api/accountType/accountTypeApiSlice';
import { useGetAccountGroupsQuery, useGetOptionAccountGroupDetailQuery } from '@/store/api/accountGroup/accountGroupApiSlice';
import { useGetOptionBranchQuery } from '@/store/api/branch/branchApiSlice';
import { useGetOptionCurrencyQuery } from '@/store/api/currency/currencyApiSlice';
import { useGetRolesQuery } from '@/store/api/roles/rolesApiSlice';
import { rolesType } from '@/types/rolesType';
import { ToastContainer, toast } from 'react-toastify';
import { responseCallback } from '@/utils/responseCallback';
import { toastMessage } from '@/utils/toastUtils';
import SelectSearch from 'react-select';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';
import { useGetDetailJournalQuery } from '@/store/api/journal/journalApiSlice';
import { TransactionJournalType, TransactionDetail } from '@/types/transactionJournalType';
import { BookBankType } from '@/types/bookBankType';
import IconX from '@/components/Icon/IconX';
import { useTranslation } from 'react-i18next';

const Form = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();
    const pathSegments = location.pathname.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];
    const type = pathSegments[2];
    const { t } = useTranslation();
    const isRtl = useSelector((state: any) => state.themeConfig.rtlClass) === 'rtl';
    const [account, setAccount] = useState<string>('');
    const [accountTo, setAccountTo] = useState<string>('');
    const [transactionDate, setTransactionDate] = useState<string>('');
    const [searchAccount, setSearchAccount] = useState<string>('');
    const [searchAccountTo, setSearchAccountTo] = useState<string>('');

    const [post, { isLoading: isLoadingPost }] = useCreateDepositMutation();
    const [update, { isLoading: isLoadingUpdate }] = useUpdateDepositMutation();

    const { data: detailDaftarTransfer, refetch: refetchDaftarTransfer } = id ? useGetDetailJournalQuery<any>(id) : { data: null, refetch: () => {} };
    const { data: AccountList, refetch: AccountListRefetch } = useGetOptionCOAQuery<any>({
        orderBy: 'coaCode',
        orderType: 'asc',
        pageSize: 20,
        status: 'Active',
        keyword: searchAccount,
    });
    const { data: AccountToList, refetch: AccountToListRefetch } = useGetOptionCOAQuery<any>({
        orderBy: 'coaCode',
        orderType: 'asc',
        pageSize: 20,
        status: 'Active',
        keyword: searchAccountTo,
    });

    const AccountListOption = AccountList?.data?.map((option: any) => ({
        value: option.desc,
        label: option.label,
        level: option.level || '',
        desc: option.desc || '',
    })) || [];

    const AccountToListOption = AccountToList?.data?.map((option: any) => ({
        value: option.desc,
        label: option.label,
        level: option.level || '',
        desc: option.desc || '',
    })) || [];

    const schema = yup.object({
        coaCode: yup.string().required('Account is Required'),
        transactionDate: yup.date().required('Transaction Date is Required'),
        description: yup.string().required('Description is Required'),
        amount: yup.number().required('Amount is Required').positive('Amount must be positive'),
        details: yup.array().of(
            yup.object().shape({
                coaCode: yup.string().required('Account is Required'),
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
            transactionType: 'Transfer',
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

    const submitForm = async (formData: DepositType) => {
        try {
            const data: DepositType = {
                ...formData,
                coaCode: account,
                details: [{ coaCode: accountTo, amount: formData.amount, description: formData.description, isPremier: false }]
            };
            const response = await post(data);
            responseCallback(response, (data: any) => {
                navigate('/daftar-transfer');
            }, null);
        } catch (err: any) {
            toastMessage(err.message, 'error');
        }
    };

    useEffect(() => {
        dispatch(setPageTitle('Daftar Transfer'));
        dispatch(setTitle('Daftar Transfer'));
        if(type == 'create'){
            dispatch(setBreadcrumbTitle(['Dashboard', 'Buku Kas', 'Daftar Transfer', type]));
        }else{
            dispatch(setBreadcrumbTitle(['Dashboard', 'Buku Kas', 'Daftar Transfer', type, lastSegment]));
        }
        AccountListRefetch();
    }, [dispatch]);

    useEffect(() => {
        if (id) {
            refetchDaftarTransfer();
        }
    }, [id, refetchDaftarTransfer]);

    useEffect(() => {
        if (detailDaftarTransfer?.data) {
            Object.keys(detailDaftarTransfer.data).forEach((key) => {
                setValue(key as keyof DepositType, detailDaftarTransfer.data[key]);
            });
        }
    }, [detailDaftarTransfer, setValue]);

    return (
        <div>
            <div className="panel mt-6">
                <form className="flex gap-6 flex-col" onSubmit={handleSubmit(submitForm)}>
                    <div className="grid md:grid-cols-1 w-full">
                        <div className='flex justify-start w-full mb-5'>
                            <div className='label mr-10 w-64'>
                                <label htmlFor="transactionNo">{t('NO TRANSAKSI')}</label>
                            </div>
                            <div className="text-black w-full">
                                <input id="transactionNo" type="text" placeholder="Enter Contoh : BTU-0001" {...register('transactionNo')} className="form-input font-normal w-full placeholder:text-white-dark disabled:pointer-events-none disabled:bg-[#eee] dark:disabled:bg-[#1b2e4b] text-black disabled:text-white-dark" disabled={type === 'update' || type === 'detail'} />
                                <span className="text-danger text-xs">{(errors.transactionNo as FieldError)?.message}</span>
                            </div>
                        </div>
                        <div className='flex justify-start w-full mb-5'>
                            <div className='label mr-10 w-64'>
                                <label htmlFor="coaCode">{t('AKUN')}<span className='font-bold text-red-700'>*</span></label>
                            </div>
                            <div className="text-black w-full grid md:grid-cols-2 gap-4">
                                <div className='w-full'>
                                    <label htmlFor="coaCode">{t('Akun Asal')} <span className='font-bold text-red-700'>*</span></label>
                                    <SelectSearch
                                        placeholder="Pilih"
                                        options={AccountListOption}
                                        onInputChange={(e) => setSearchAccount(e)}
                                        onChange={(e: any) => { setAccount(e.desc); setValue('coaCode', e.desc); }}
                                        isDisabled={type === 'update' || type === 'detail'}
                                        className='w-full font-normal text-black'
                                        defaultValue={AccountListOption.find((option: any) => option.value === detailDaftarTransfer?.data?.coaCode)}
                                        value={AccountListOption.find((option: any) => option.value === detailDaftarTransfer?.data?.coaCode)}
                                    />
                                    <span className="text-danger text-xs">{(errors.coaCode as FieldError) ? t('Akun Asal Wajib Diisi') : ''} </span>
                                </div>
                                <div className='w-full'>
                                    <label htmlFor="Akun">{t('Akun Tujuan')} <span className='font-bold text-red-700'>*</span> </label>
                                    <SelectSearch
                                        placeholder="Pilih"
                                        options={AccountToListOption}
                                        onInputChange={(e) => setSearchAccountTo(e)}
                                        onChange={(e: any) => { setAccountTo(e.desc); setValue('details.0.coaCode', e.desc); }}
                                        isDisabled={type === 'update' || type === 'detail'}
                                        className='w-full font-normal text-black'
                                        defaultValue={AccountToListOption.find((option: any) => option.value === detailDaftarTransfer?.data?.details[0].coaCode)}
                                        value={AccountToListOption.find((option: any) => option.value === detailDaftarTransfer?.data?.details[0].coaCode)}
                                    />
                                    <span className="text-danger text-xs"> {(errors.details && errors.details[0] && errors.details[0].coaCode as FieldError) ? t('Akun Tujuan Wajib Diisi') : ''}</span>
                                </div>
                            </div>
                        </div>
                        <div className='flex justify-start w-full mb-5'>
                            <div className='label mr-10 w-64'>
                                <label>{t('Tanggal Transaksi')}<span className='font-bold text-red-700'>*</span></label>
                            </div>
                            <div className="text-black w-full grid md:grid-cols-1 gap-4">
                                <Flatpickr
                                    options={{
                                        enableTime: true,
                                        dateFormat: 'Y-m-d H:i',
                                        position: isRtl ? 'auto right' : 'auto left',
                                    }}
                                    className="form-input font-normal disabled:pointer-events-none disabled:bg-[#eee] disabled:text-white-dark"
                                    onChange={(date: Date[]) => {
                                        setValue('transactionDate', date[0].toISOString());
                                    }}
                                    placeholder='Pilih Tanggal Transaksi'
                                    disabled={type === 'update' || type === 'detail'}
                                    value={detailDaftarTransfer?.data?.transactionDate}
                                ><IconX className='text-black'></IconX></Flatpickr>
                                <span className="text-danger text-xs">{(errors.transactionDate as FieldError) ? t("Tanggal Transaksi Wajib Diisi") : ''}</span>
                            </div>
                        </div>
                        <div className='flex justify-start w-full mb-5'>
                            <div className='label mr-10 w-64'>
                                <label htmlFor="amount">{t('Jumlah')} (RP) <span className='font-bold text-red-700'>*</span></label>
                            </div>
                            <div className="text-black w-full">
                                <input id="amount" type="text" placeholder="Enter Contoh : 20000" {...register('amount')} className="form-input w-full placeholder:text-white-dark disabled:pointer-events-none disabled:bg-[#eee] dark:disabled:bg-[#1b2e4b] text-black disabled:text-white-dark font-normal" disabled={type === 'update' || type === 'detail'} />
                                <span className="text-danger text-xs">{(errors.amount as FieldError) ?t("Jumlah Wajib Diisi") : ''}</span>
                            </div>
                        </div>
                        <div className='flex justify-start w-full mb-5'>
                            <div className='label mr-10 w-64'>
                                <label htmlFor="description">{t('Keterangan')} <span className='font-bold text-red-700'>*</span></label>
                            </div>
                            <div className="text-black w-full">
                                <textarea id="ctnTextarea" rows={3} className="form-textarea font-normal disabled:pointer-events-none disabled:bg-[#eee] text-black disabled:text-white-dark" {...register('description')} placeholder="Keterangan..." disabled={type === 'update' || type === 'detail'} onChange={(e) => setValue('description', e.target.value)}></textarea>
                                <span className="text-danger text-xs">{(errors.description as FieldError) ? t('Keterangan wajib Diisi') : ''}</span>
                            </div>
                        </div>
                        <div className="flex w-full justify-end">
                            <button type="button" className="btn btn-outline-dark w-1/6 uppercase mr-5" onClick={() => navigate('/daftar-transfer')}>
                                {type === 'detail' ? 'Kembali' : 'Batal'}
                            </button>
                            {type !== 'detail' && (
                                <button type="submit" className="btn btn-primary w-1/6 border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                                    {isLoadingPost || isLoadingUpdate ? 'Loading' : id ? 'Update' : 'Save'}
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Form;
