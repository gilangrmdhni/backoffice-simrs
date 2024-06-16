import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { setPageTitle, setBreadcrumbTitle, setTitle } from '../../../store/themeConfigSlice';
import { useGetEmployeeQuery } from '@/store/api/employee/employeeApiSlice';
import IconMail from '@/components/Icon/IconMail';
import * as yup from 'yup';
import { useForm, FieldError,useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { usersType,COAType,OptionType, AccountType, AccountGroupType } from '@/types';
import { useCreateDepositMutation,useUpdateDepositMutation } from '@/store/api/bank/deposit/depositApiSlice';
import { DepositType } from '@/types/depositType';
import { useGetDetailCOAQuery, usePostCOAMutation, useUpdateCOAMutation,useGetOptionCOAQuery } from '@/store/api/coa/coaApiSlice';
import { useGetAccountTypesQuery,useGetOptionAccountTypeOptionQuery } from '@/store/api/accountType/accountTypeApiSlice';
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


const Form = () => {
    // const user = useSelector((state: any) => state.auth.user);
    const isRtl = useSelector((state: any) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const accountTypeRef = useRef<HTMLSelectElement>(null);
    const accountGroupRef = useRef<HTMLSelectElement>(null);
    const parentRef = useRef<HTMLSelectElement>(null);
    const currencyRef = useRef<HTMLSelectElement>(null);
    const [account,setAccount] = useState<string>('');
    const [accountTo,setAccountTo] = useState<string>('');
    const [desc,setDesc] = useState<string>('');
    const [transactionDate,setTransactionDate] = useState<string>('');
    const dateNow = new Date
    const [isTanggal,setIsTanggal] = useState<any>(dateNow)
    const [isTime,setIsTime] = useState<any>(dateNow)
    const [searchAccount,setSearchAccount] = useState<string>('');
    const [searchAccountTo,setSearchAccountTo] = useState<string>('');
    const [post, { isLoading: isLoadingPost, error: isErrorPost }] = useCreateDepositMutation();
    const [update, { isLoading: isLoadingUpdate, error: isErrorUpdate }] = useUpdateDepositMutation();
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const pathSegments = location.pathname.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];
    const type = pathSegments[2];

    const { id } = useParams();
    
    const { data: AccountList, refetch: AccountListRefetch } = useGetOptionCOAQuery<any>({
        orderBy: 'coaCode',
        orderType: 'asc',
        pageSize:20,
        status : 'Active',
        keyword: searchAccount,
    });
    let AccountListOption: any[] = []
        {
            AccountList?.data?.map((option: any) =>{
                AccountListOption.push({
                    value: option.value,
                    label: option.label,
                    level: option.level ? option.level : '',
                    desc: option.desc ? option.desc : '',
                })
            })
        }
    
    const { data: AccountToList, refetch: AccountToListRefetch } = useGetOptionCOAQuery<any>({
        orderBy: 'coaCode',
        orderType: 'asc',
        pageSize:20,
        status : 'Active',
        keyword: searchAccountTo,
    });

    let AccountToListOption: any[]= []
        {
            AccountToList?.data?.map((option: any) =>{
                AccountToListOption.push({
                    value: option.value,
                    label: option.label,
                    level: option.level ? option.level : '',
                    desc: option.desc ? option.desc : '',
                })
            })
        }

    useEffect(() => {
        AccountListRefetch();
        AccountListOption = []
        AccountList?.data?.map((option: any) =>{
            AccountListOption.push({
                value: option.value,
                label: option.label,
                level: option.level ? option.level : '',
                desc: option.desc ? option.desc : '',
            })
        })
    },[searchAccount]);

    useEffect(() => {
        AccountToListRefetch();
        AccountToListOption = []
        AccountToList?.data?.map((option: any) =>{
            AccountToListOption.push({
                value: option.value,
                label: option.label,
                level: option.level ? option.level : '',
                desc: option.desc ? option.desc : '',
            })
        })
        
    },[searchAccountTo]);


    const schema = yup.object({
        // transactionNo: yup.string().required('Transaction No is Required'),
        // coaCode: yup.string().required('Account is Required'),
        // transactionDate: yup.date().required('Transaction Date is Required'),
        // details: yup.array().of(
        //     yup.object().shape({
        //         description: yup.string().required('Memo is Required'),
        //         amount: yup.number().required('Amount is Required').positive('Amount must be positive'),
        //     })
        // ).required().min(1, 'At least one detail entry is required'),
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
        console.log(formData)
        try {
            let response: any;
            const data: DepositType = {
                ...formData,
                coaCode : account,
                details:[{ coaCode: accountTo,amount: formData.amount,description: formData.description}]
            }
            console.log(data)
            // if (id) {
            //     response = await update(data);
            // } else {
                response = await post(data);
            // }
            responseCallback(response, (data: any) => {
                navigate('/daftartransfer')
            }, null);
        } catch (err: any) {
            toastMessage(err.message, 'error');
        }
    };

    useEffect(() => {
        dispatch(setPageTitle('Daftar Transfer'));
        dispatch(setTitle('Daftar Transfer'));
        if(type == 'create'){
            dispatch(setBreadcrumbTitle(['Dashboard', 'Buku Kas', 'Daftar Transfer',type]));

        }else{
            dispatch(setBreadcrumbTitle(['Dashboard', 'Buku Kas', 'Daftar Transfer',type,lastSegment]));
        }
        AccountListRefetch();
    }, [dispatch]);
    
    return (
        <div>
            <div className="panel mt-6">
                <h1 className="font-semibold text-2xl text-black mb-10">
                    Transfer Uang
                </h1>
                <form className="flex gap-6 flex-col" onSubmit={handleSubmit(submitForm)}>
                    <div className="grid md:grid-cols-1 w-full ">
                        <div className='flex justify-start w-full mb-10'>
                            <div className='label mr-10 w-64'>
                                <label htmlFor="transactionNo">NO TRANSAKSI</label>
                            </div>
                            <div className="text-white-dark w-full">
                                <input id="transactionNo" type="text" placeholder="Enter Contoh : BTU-0001" {...register('transactionNo')} className="form-input font-normal w-full placeholder:text-white-dark disabled:pointer-events-none disabled:bg-[#eee] dark:disabled:bg-[#1b2e4b] text-white-dark" disabled={type == 'update'} />
                                {/* <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                    <IconMail fill={true} />
                                </span> */}
                                <span className="text-danger text-xs">{(errors.transactionNo as FieldError)?.message}</span>
                            </div>
                        </div>
                        
                       <div className='flex justify-start w-full mb-10'>
                            <div className='label mr-10 w-64'>
                                <label htmlFor="coaCOde">AKUN</label>
                            </div>
                            <div className="text-white-dark w-full grid md:grid-cols-2 gap-4">
                                <div className='w-full'>
                                    <label htmlFor="coaCode">Akun Asal</label>
                                    <SelectSearch 
                                        placeholder="Pilih"
                                        options={AccountListOption} 
                                        onInputChange={(e) => setSearchAccount(e)} 
                                        onChange={(e: any) => setAccount(`${e.desc}`)}
                                        isDisabled={type == 'update'}
                                        className='w-full font-normal'
                                        
                                    />
                                    <span className="text-danger text-xs">{(errors.coaCode as FieldError)?.message}</span>
                                </div>
                                <div className='w-full'>
                                    <label htmlFor="Akun">Akun Tujuan</label>
                                    <SelectSearch 
                                        placeholder="Pilih"
                                        options={AccountListOption} 
                                        onInputChange={(e) => setSearchAccountTo(e)} 
                                        onChange={(e: any) => setAccountTo(`${e.desc}`)}
                                        isDisabled={type == 'update'}
                                        className='w-full font-normal'

                                    />
                                    <span className="text-danger text-xs">{(errors.coaCode as FieldError)?.message}</span>
                                </div>
                            </div>
                        </div>
                        <div className='flex justify-start w-full mb-10'>
                            <div className='label mr-10 w-64'>
                                <label htmlFor="Akun">Transaksi</label>
                            </div>
                            <div className="text-white-dark w-full grid md:grid-cols-1 gap-4">
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
                                    placeholder='Pilih Tanggal Transaksi'
                                />
                            </div>
                        </div>        
                        <div className='flex justify-start w-full mb-10'>
                                <div className='label mr-10 w-64'>
                                    <label htmlFor="amount">Jumlah (RP)</label>
                                </div>
                                <div className="text-white-dark w-full">
                                    <input id="amount" type="text" placeholder="Enter Contoh : 20000" {...register('amount')} className="form-input w-full placeholder:text-white-dark disabled:pointer-events-none disabled:bg-[#eee] dark:disabled:bg-[#1b2e4b] text-white-dark font-normal" disabled={type == 'update'} />
                                    {/* <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                        <IconMail fill={true} />
                                    </span> */}
                                    <span className="text-danger text-xs">{(errors.amount as FieldError)?.message}</span>
                                </div>
                        </div>
                        <div className='flex justify-start w-full mb-10'>
                                <div className='label mr-10 w-64'>
                                    <label htmlFor="description">Keterangan</label>
                                </div>
                                <div className="text-white-dark w-full">
                                    {/* <input id="coaName" type="text" placeholder="Enter Contoh : 20000" {...register('coaName')} className="form-input w-full placeholder:text-white-dark disabled:pointer-events-none disabled:bg-[#eee] dark:disabled:bg-[#1b2e4b] text-white-dark" disabled={type == 'update'} /> */}
                                    <textarea id="ctnTextarea" rows={3} className="form-textarea font-normal" placeholder="Keterangan..." disabled={type == 'update'}></textarea>
                                    {/* <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                        <IconMail fill={true} />
                                    </span> */}
                                    <span className="text-danger text-xs">{(errors.description as FieldError)?.message}</span>
                                </div>
                        </div>
                        <div className="flex w-full justify-end">
                            <button type="button" className=" btn bg-white  w-1/6 border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)] mr-5 hover:bg-purple-300" onClick={()=>navigate('/daftartransfer')}>
                                batal
                            </button>
                            <button type="submit" className=" btn btn-primary  w-1/6 border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                                {isLoadingPost || isLoadingUpdate ? 'Loading' : id ? 'Update' : 'Save'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Form;
