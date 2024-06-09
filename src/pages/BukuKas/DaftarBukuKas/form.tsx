import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { setPageTitle, setBreadcrumbTitle, setTitle } from '../../../store/themeConfigSlice';
import { useGetEmployeeQuery } from '@/store/api/employee/employeeApiSlice';
import IconMail from '@/components/Icon/IconMail';
import * as yup from 'yup';
import { useForm, FieldError } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { usersType, COAType, OptionType, AccountType, AccountGroupType } from '@/types';
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


const Form = () => {
    // const user = useSelector((state: any) => state.auth.user);
    const accountTypeRef = useRef<HTMLSelectElement>(null);
    const accountGroupRef = useRef<HTMLSelectElement>(null);
    const parentRef = useRef<HTMLSelectElement>(null);
    const currencyRef = useRef<HTMLSelectElement>(null);
    const [parentId, setParentId] = useState<string>('');
    const [isCashFlow, setIsCashFlow] = useState<boolean>(false);
    const [isCashBank, setIsCashBank] = useState<boolean>(false);
    const [searchParent, setSearchParent] = useState<string>('');
    const [post, { isLoading: isLoadingPost, error: isErrorPost }] = usePostCOAMutation();
    const [update, { isLoading: isLoadingUpdate, error: isErrorUpdate }] = useUpdateCOAMutation();
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const pathSegments = location.pathname.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];
    const type = pathSegments[2];

    const { id } = useParams();
    const { data: detailCOA, refetch: detailCOARefetch } = id ? useGetDetailCOAQuery<any>(id) : { data: null, refetch: () => { } };
    const [accountTypeId, setAccountTypeId] = useState<number>(1);
    const { data: accountTypeList, refetch: accountTypeListRefetch } = useGetOptionAccountTypeOptionQuery<any>({
        orderBy: 'accountTypeId',
        orderType: 'asc',
        pageSize: 20,
        status,
    });
    const { data: accountGroupList, refetch: accountGroupListRefetch } = useGetOptionAccountGroupDetailQuery({
        orderBy: 'accountGroupId',
        orderType: 'asc',
        pageSize: 20,
    });
    const { data: CurrencyList, refetch: CurrencyListRefetch } = useGetOptionCurrencyQuery({
        orderBy: 'currencyName',
        orderType: 'asc',
        pageSize: 20,
    });
    const { data: ParentList, refetch: ParentListRefetch } = useGetOptionCOAQuery<any>({
        orderBy: 'coaCode',
        orderType: 'asc',
        pageSize: 20,
        status: 'Active',
        keyword: searchParent,
    });
    let ParentListOption = []
    ParentListOption.push({
        value: "",
        label: "None",
        level: "",
    })
    {
        ParentList?.data?.map((option: any) => {
            ParentListOption.push({
                value: option.value,
                label: option.label,
                level: option.level ? option.level : '',
            })
        })
    }

    useEffect(() => {
        ParentListRefetch();
        ParentListOption = []
        ParentListOption.push({
            value: "",
            label: "None",
            level: "",
        })
        {
            ParentList?.data?.map((option: any) => {
                ParentListOption.push({
                    value: option.value,
                    label: option.label,
                    level: option.level ? option.level : '',
                })
            })
        }
    }, [searchParent]);


    const schema = yup
        .object({
            coaCode: yup.string().required('Kode is Required'),
            coaName: yup.string().required('Name is Required'),
            accountTypeId: yup.number().required('Field is Required'),
            accountGroupId: yup.number().required('Field is Required'),
            currencyId: yup.number().required('Field is Required'),
            balance: yup.number().required('Field is Required'),
            status: yup.string().required('Field is Required'),
        })
        .required();

    const {
        register,
        formState: { errors },
        handleSubmit,
        setValue,
    } = useForm<COAType>({
        resolver: yupResolver(schema),
        mode: 'all',
        defaultValues: {
            status: 'Active',
        },
    });
    const submitForm = async (data: COAType) => {
        try {
            let response: any;
            if (accountTypeRef.current) {
                data.accountTypeName = accountTypeRef.current.options[data.accountTypeId].text;
            }
            if (accountGroupRef.current) {
                data.accountGroupName = accountGroupRef.current.options[data.accountGroupId].text;
            }
            if (accountGroupRef.current) {
                data.currencyName = accountGroupRef.current.options[data.currencyId].text;
            }
            if (parentId != "" && parentId != "None/") {
                console.log(parentId)
                let parent = parentId.split('/')
                data.parentId = Number(parent[1]);
                data.parentName = parent[0];
            }
            data.isCashFlow = isCashFlow;
            data.isCashBank = isCashBank;
            console.log(data)
            if (id) {
                response = await update(data);
            } else {
                response = await post(data);
            }
            responseCallback(response, (data: any) => {
                navigate('/coa')
            }, null);
        } catch (err: any) {
            toastMessage(err.message, 'error');
        }
    };

    useEffect(() => {
        dispatch(setPageTitle('COA'));
        dispatch(setTitle('COA'));
        if (type == 'create') {
            dispatch(setBreadcrumbTitle(['Dashboard', 'Buku Kas', 'Daftar Buku Kas', type]));

        } else {
            dispatch(setBreadcrumbTitle(['Dashboard', 'Buku Kas', 'Daftar Buku Kas', type, lastSegment]));
        }
        ParentListRefetch();
    }, [dispatch]);

    useEffect(() => {
        if (id) {
            detailCOARefetch();
        }
    }, [id]);

    useEffect(() => {
        if (detailCOA?.data) {
            Object.keys(detailCOA.data).forEach((key) => {
                setValue(key as keyof COAType, detailCOA.data[key]);
            });
        }
    }, [detailCOA, setValue]);

    return (
        <div>
            <div className="panel mt-6">
                <h1 className="font-semibold text-2xl text-black mb-10">
                    Transfer Uang
                </h1>
                <form className="flex gap-6 flex-col" onSubmit={handleSubmit(submitForm)}>

                    <div className='flex justify-start w-full mb-10'>
                        <div className='label mr-10 w-64'>
                            <label htmlFor="Akun">AKUN</label>
                        </div>
                        <div className="text-white-dark w-full grid md:grid-cols-2 gap-6">
                            <div className='w-full'>
                                <label className={`flex items-center justify-between border-2  px-4 py-2 rounded-lg ${accountTypeId === 1 ? 'border-purple-500' : 'border-gray-300'}`}>
                                    <input
                                        type="radio"
                                        value={1}
                                        {...register('accountTypeId', { required: true })}
                                        checked={accountTypeId === 1}
                                        onChange={(e) => setAccountTypeId(parseInt(e.target.value))}
                                        className="form-radio"
                                    />
                                    <span className="ml-2 text-black">Header</span>
                                </label>
                                <span className="text-danger text-xs">{(errors.coaCode as FieldError)?.message}</span>
                            </div>
                            <div className='w-full'>
                                <label className={`flex items-center justify-between border-2  px-4 py-2 rounded-lg ${accountTypeId === 2 ? 'border-purple-500' : 'border-gray-300'}`}>
                                    <input
                                        type="radio"
                                        value={2}
                                        {...register('accountTypeId', { required: true })}
                                        checked={accountTypeId === 2}
                                        onChange={(e) => setAccountTypeId(parseInt(e.target.value))}
                                        className="form-radio"
                                    />
                                    <span className="ml-2 text-black">Detail</span>
                                </label>
                                <span className="text-danger text-xs">{(errors.coaCode as FieldError)?.message}</span>
                            </div>
                        </div>
                    </div>
                    <div className="grid md:grid-cols-1 w-full ">
                        {/* <div className='flex justify-start w-full mb-10'>
                            <div className='label mr-10 w-64'>
                                <label htmlFor="accountTypeId">Tipe</label>
                            </div>
                            <div className="relative text-white-dark">
                                <div className="flex items-center space-x-4">
                                    <label className={`flex items-center justify-between border-2 w-1/2 px-4 py-2 rounded-lg ${accountTypeId === 1 ? 'border-purple-500' : 'border-gray-300'}`}>
                                        <input
                                            type="radio"
                                            value={1}
                                            {...register('accountTypeId', { required: true })}
                                            checked={accountTypeId === 1}
                                            onChange={(e) => setAccountTypeId(parseInt(e.target.value))}
                                            className="form-radio"
                                        />
                                        <span className="ml-2 text-black">Header</span>
                                    </label>
                                    <label className={`flex items-center justify-between border-2 w-1/2 px-4 py-2 rounded-lg ${accountTypeId === 2 ? 'border-purple-500' : 'border-gray-300'}`}>
                                        <input
                                            type="radio"
                                            value={2}
                                            {...register('accountTypeId', { required: true })}
                                            checked={accountTypeId === 2}
                                            onChange={(e) => setAccountTypeId(parseInt(e.target.value))}
                                            className="form-radio"
                                        />
                                        <span className="ml-2 text-black">Detail</span>
                                    </label>
                                </div>
                                <span className="text-sm text-gray-500">Tipe "Header" tidak dapat memunculkan transaksi</span>
                            </div>
                        </div> */}
                        <div className='flex justify-start w-full mb-10'>
                            <div className='label mr-10 w-64'>
                                <label htmlFor="Akun">Kategori</label>
                            </div>
                            <div className="text-white-dark w-full ">
                                <div className='w-full'>
                                    <SelectSearch
                                        placeholder="Pilih"
                                        options={ParentListOption}
                                        onInputChange={(e) => setSearchParent(e)}
                                        onChange={(e: any) => setParentId(`${e.label}/${e.value}`)}
                                        defaultValue={detailCOA?.data?.parentId != null ? detailCOA?.data?.parentId : ""}
                                        isDisabled={type == 'update'}
                                        className='w-full font-normal'

                                    />
                                    <span className="text-danger text-xs">{(errors.coaCode as FieldError)?.message}</span>
                                </div>

                            </div>
                        </div>
                        <div className='flex justify-start w-full mb-10'>
                            <div className='label mr-10 w-64'>
                                <label htmlFor="coaCode">Kode</label>
                            </div>
                            <div className="text-white-dark w-full">
                                <input id="coaCode" type="text" placeholder="Enter Contoh : 0001" {...register('coaCode')} className="form-input font-normal w-full placeholder:text-white-dark disabled:pointer-events-none disabled:bg-[#eee] dark:disabled:bg-[#1b2e4b] text-white-dark" disabled={type == 'update'} />
                                {/* <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                <IconMail fill={true} />
                            </span> */}
                                <span className="text-danger text-xs">{(errors.coaCode as FieldError)?.message}</span>
                            </div>
                        </div>
                        <div className='flex justify-start w-full mb-10'>
                            <div className='label mr-10 w-64'>
                                <label htmlFor="coaName">Nama Akun</label>
                            </div>
                            <div className="text-white-dark w-full">
                                <input id="coaName" type="text" placeholder="Enter Name" {...register('coaName')} className="form-input font-normal w-full placeholder:text-white-dark disabled:pointer-events-none disabled:bg-[#eee] dark:disabled:bg-[#1b2e4b] text-white-dark" disabled={type == 'update'} />
                                {/* <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                <IconMail fill={true} />
                            </span> */}
                                <span className="text-danger text-xs">{(errors.coaName as FieldError)?.message}</span>
                            </div>
                        </div>
                        <div className='flex justify-start w-full mb-10'>
                            <div className='label mr-10 w-64'>
                                <label htmlFor="Akun">Detail Dari</label>
                            </div>
                            <div className="text-white-dark w-full ">
                                <div className='w-full'>
                                    <SelectSearch
                                        placeholder="Pilih"
                                        options={ParentListOption}
                                        onInputChange={(e) => setSearchParent(e)}
                                        onChange={(e: any) => setParentId(`${e.label}/${e.value}`)}
                                        defaultValue={detailCOA?.data?.parentId != null ? detailCOA?.data?.parentId : ""}
                                        isDisabled={type == 'update'}
                                        className='w-full font-normal'

                                    />
                                    <span className="text-danger text-xs">{(errors.coaCode as FieldError)?.message}</span>
                                </div>

                            </div>
                        </div>
                        <div className='flex justify-start w-full mb-10'>
                            <div className='label mr-10 w-64'>
                                <label htmlFor="coaCode">Status</label>
                            </div>
                            <div className="flex space-x-4">
                                <label className="flex items-center">
                                    <input type="radio" value="Active" {...register('status')} className="form-radio" />
                                    <span className="ml-2 text-black">Active</span>
                                </label>
                                <label className="flex items-center">
                                    <input type="radio" value="InActive" {...register('status')} className="form-radio" />
                                    <span className="ml-2 text-black">In Active</span>
                                </label>
                            </div>
                            <span className="text-danger text-xs">{(errors.status as FieldError)?.message}</span>
                        </div>

                        <div className="flex w-full justify-end">
                            <button type="button" className=" btn bg-white  w-1/6 border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)] mr-5 hover:bg-purple-300" onClick={() => navigate('/daftartransfer')}>
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





{/* <div>
    <div className="panel mt-6">
        <form className="flex gap-6 flex-col" onSubmit={handleSubmit(submitForm)}>
            <div className="grid md:grid-cols-1gap-4 w-full ">
                <div className="grid md:grid-cols-1 gap-4 w-full ">
                    <div>
                        <div className='label mr-10 w-64'>
                            <label htmlFor="accountType">Tipe</label>
                        </div>
                        <div className="relative text-white-dark">
                            <div className="flex items-center space-x-4">
                                <label className={`flex items-center justify-between border-2 w-1/2 px-4 py-2 rounded-lg ${accountTypeId === 1 ? 'border-purple-500' : 'border-gray-300'}`}>
                                    <input
                                        type="radio"
                                        value={1}
                                        {...register('accountTypeId', { required: true })}
                                        checked={accountTypeId === 1}
                                        onChange={(e) => setAccountTypeId(parseInt(e.target.value))}
                                        className="form-radio"
                                    />
                                    <span className="ml-2 text-black">Header</span>
                                </label>
                                <label className={`flex items-center justify-between border-2 w-1/2 px-4 py-2 rounded-lg ${accountTypeId === 2 ? 'border-purple-500' : 'border-gray-300'}`}>
                                    <input
                                        type="radio"
                                        value={2}
                                        {...register('accountTypeId', { required: true })}
                                        checked={accountTypeId === 2}
                                        onChange={(e) => setAccountTypeId(parseInt(e.target.value))}
                                        className="form-radio"
                                    />
                                    <span className="ml-2 text-black">Detail</span>
                                </label>
                            </div>
                            <span className="text-sm text-gray-500">Tipe "Header" tidak dapat memunculkan transaksi</span>
                        </div>
                        <span className="text-danger text-xs">{(errors.accountTypeId as FieldError)?.message}</span>
                    </div>
                </div>
                <div>
                    <div className='label mr-10 w-64'>
                        <label htmlFor="coaCode">Kategori</label>
                    </div>
                    <div className="relative text-white-dark">
                        <SelectSearch
                            placeholder="Pilih"
                            options={ParentListOption}
                            onInputChange={(e) => setSearchParent(e)}
                            onChange={(e: any) => setParentId(`${e.label}/${e.value}`)}
                            defaultValue={detailCOA?.data?.parentId != null ? detailCOA?.data?.parentId : ""}
                            isDisabled={type == 'update'}

                        />
                    </div>
                    <span className="text-danger text-xs">{(errors.parentId as FieldError)?.message}</span>
                </div>
                <div>
                    <div className='label mr-10 w-64'>
                        <label htmlFor="coaCode">Kode</label>
                    </div>
                    <div className="relative text-white-dark">
                        <input id="coaCode" type="text" placeholder="Contoh: 0001" {...register('coaCode')} className="form-input placeholder:text-white-dark disabled:pointer-events-none disabled:bg-[#eee] dark:disabled:bg-[#1b2e4b] text-white-dark" disabled={type == 'update'} />

                    </div>
                    <span className="text-danger text-xs">{(errors.coaCode as FieldError)?.message}</span>
                </div>
                <div>
                    <div className='label mr-10 w-64'>
                        <label htmlFor="coaName">Nama Akun</label>
                    </div>
                    <div className="relative text-white-dark">
                        <input id="coaName" type="text" placeholder="Enter Name" {...register('coaName')} className="form-input placeholder:text-white-dark" />

                    </div>
                    <span className="text-danger text-xs">{(errors.coaName as FieldError)?.message}</span>
                </div>
                <div>
                    <div className='label mr-10 w-64'>
                        <label htmlFor="coaparentIdCode">Detail Dari</label>
                    </div>
                    <div className="relative text-white-dark">
                        <SelectSearch
                            placeholder="Pilih"
                            options={ParentListOption}
                            onInputChange={(e) => setSearchParent(e)}
                            onChange={(e: any) => setParentId(`${e.label}/${e.value}`)}
                            defaultValue={detailCOA?.data?.parentId != null ? detailCOA?.data?.parentId : ""}
                            isDisabled={type == 'update'}

                        />
                    </div>
                    <span className="text-danger text-xs">{(errors.parentId as FieldError)?.message}</span>
                </div>
                <div>
                    <label>Status</label>
                    <div className="flex space-x-4">
                        <label className="flex items-center">
                            <input type="radio" value="Active" {...register('status')} className="form-radio" />
                            <span className="ml-2 text-black">Active</span>
                        </label>
                        <label className="flex items-center">
                            <input type="radio" value="InActive" {...register('status')} className="form-radio" />
                            <span className="ml-2 text-black">In Active</span>
                        </label>
                    </div>
                    <span className="text-danger text-xs">{(errors.status as FieldError)?.message}</span>
                </div>
            </div>
            <div className="flex w-full justify-end">
                <button type="submit" className=" btn btn-primary  w-1/6 border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                    {isLoadingPost || isLoadingUpdate ? 'Loading' : id ? 'Update' : 'Save'}
                </button>
            </div>
        </form>
    </div>
</div> */}