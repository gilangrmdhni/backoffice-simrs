import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { setPageTitle, setBreadcrumbTitle, setTitle } from '../../../store/themeConfigSlice';
import { useGetEmployeeQuery } from '@/store/api/employee/employeeApiSlice';
import IconMail from '@/components/Icon/IconMail';
import * as yup from 'yup';
import { useForm, FieldError } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { usersType,COAType,OptionType, AccountType, AccountGroupType } from '@/types';
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


const Form = () => {
    // const user = useSelector((state: any) => state.auth.user);
    const accountTypeRef = useRef<HTMLSelectElement>(null);
    const accountGroupRef = useRef<HTMLSelectElement>(null);
    const parentRef = useRef<HTMLSelectElement>(null);
    const currencyRef = useRef<HTMLSelectElement>(null);
    const [parentId,setParentId] = useState<string>('');
    const [isCashFlow,setIsCashFlow] = useState<boolean>(false);
    const [isCashBank,setIsCashBank] = useState<boolean>(false);
    const [searchParent,setSearchParent] = useState<string>('');
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
    const { data: accountTypeList, refetch: accountTypeListRefetch } = useGetOptionAccountTypeOptionQuery<any>({
        orderBy: 'accountTypeId',
        orderType: 'asc',
        pageSize:20,
        status,
    });
    const { data: accountGroupList, refetch: accountGroupListRefetch } = useGetOptionAccountGroupDetailQuery({
        orderBy: 'accountGroupId',
        orderType: 'asc',
        pageSize:20,
    });
    const { data: CurrencyList, refetch: CurrencyListRefetch } = useGetOptionCurrencyQuery({
        orderBy: 'currencyName',
        orderType: 'asc',
        pageSize:20,
    });
    const { data: ParentList, refetch: ParentListRefetch } = useGetOptionCOAQuery<any>({
        orderBy: 'coaCode',
        orderType: 'asc',
        pageSize:20,
        status : 'Active',
        keyword: searchParent,
    });
    let ParentListOption = []
        ParentListOption.push({
            value: "",
            label: "None",
            level: "",
        })
        {
            ParentList?.data?.map((option: any) =>{
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
            ParentList?.data?.map((option: any) =>{
                ParentListOption.push({
                    value: option.value,
                    label: option.label,
                    level: option.level ? option.level : '',
                })
            })
        }
    },[searchParent]);


    const schema = yup
        .object({
            coaCode: yup.string().required('coaCode is Required'),
            coaName: yup.string().required('coaName is Required'),
            accountTypeId: yup.number().required('accountType is Required'),
            accountGroupId: yup.number().required('accountGroup is Required'),
            currencyId: yup.number().required('currency is Required'),
            balance: yup.number().required('Balance is Required'),
            status: yup.string().required('Status is Required'),
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
            if(parentId != "" && parentId != "None/"){
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
        if(type == 'create'){
            dispatch(setBreadcrumbTitle(['Dashboard', 'Buku Kas', 'Daftar Buku Kas',type]));

        }else{
            dispatch(setBreadcrumbTitle(['Dashboard', 'Buku Kas', 'Daftar Buku Kas',type,lastSegment]));
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
                <form className="flex gap-6 flex-col" onSubmit={handleSubmit(submitForm)}>
                    <div className="grid md:grid-cols-2 gap-4 w-full ">
                        <div>
                            <label htmlFor="coaCode">COA Code</label>
                            <div className="relative text-white-dark">
                                <input id="coaCode" type="text" placeholder="Enter coaCode" {...register('coaCode')} className="form-input placeholder:text-white-dark disabled:pointer-events-none disabled:bg-[#eee] dark:disabled:bg-[#1b2e4b] text-white-dark" disabled={type == 'update'} />
                                {/* <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                    <IconMail fill={true} />
                                </span> */}
                            </div>
                            <span className="text-danger text-xs">{(errors.coaCode as FieldError)?.message}</span>
                        </div>
                        <div>
                            <label htmlFor="coaName">COA Name</label>
                            <div className="relative text-white-dark">
                                <input id="coaName" type="text" placeholder="Enter Name" {...register('coaName')} className="form-input placeholder:text-white-dark" />
                                {/* <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                    <IconMail fill={true} />
                                </span> */}
                            </div>
                            <span className="text-danger text-xs">{(errors.coaName as FieldError)?.message}</span>
                        </div>
                        <div>
                            <label htmlFor="accountTypeId">Account Type</label>
                            <div className="relative text-white-dark">
                                <select id="accountTypeId" {...register('accountTypeId')} className="form-select disabled:pointer-events-none disabled:bg-[#eee] dark:disabled:bg-[#1b2e4b] text-white-dark" disabled={type == 'update'}>
                                    <option value="">Enter Account Type</option>
                                    {accountTypeList?.data?.map((d: OptionType, i: number) => {
                                        return (
                                            <option key={i} value={d?.value} selected={detailCOA?.data?.accountTypeId === d?.value }>
                                                {d?.label}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                            <span className="text-danger text-xs">{(errors.accountTypeId as FieldError)?.message}</span>
                        </div>
                        <div>
                            <label htmlFor="accountGroupId">Account Group</label>
                            <div className="relative text-white-dark">
                                <select id="accountGroupId" {...register('accountGroupId')} className="form-select disabled:pointer-events-none disabled:bg-[#eee] dark:disabled:bg-[#1b2e4b] text-white-dark" disabled={type == 'update'}>
                                    <option value="">Enter Account Type</option>
                                    {accountGroupList?.data?.map((d: OptionType, i: number) => {
                                        return (
                                            <option value={d?.value} selected={detailCOA?.data?.accountGroupId === d.value }>
                                                {d?.label}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                            <span className="text-danger text-xs">{(errors.accountGroupId as FieldError)?.message}</span>
                        </div>
                        <div>
                            <label htmlFor="parentId">Parent</label>
                            <div className="relative text-white-dark">
                                <SelectSearch 
                                    placeholder="Enter Parent"
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
                            <label htmlFor="normalPosition">Normal Position</label>
                            <div className="relative text-white-dark">
                                <select id="normalPosition" {...register('normalPosition')} className="form-select disabled:pointer-events-none disabled:bg-[#eee] dark:disabled:bg-[#1b2e4b] text-white-dark" disabled={type == 'update'}>
                                    <option value="">Enter Normal Position</option>
                                    <option value="C">Credit</option>
                                    <option value="D">Debit</option>
                                </select>
                            </div>
                            <span className="text-danger text-xs">{(errors.normalPosition as FieldError)?.message}</span>
                        </div>
                        <div>
                            <label htmlFor="currencyId">Currency</label>
                            <div className="relative text-white-dark">
                                <select id="accountGroupId" {...register('currencyId')} className="form-select disabled:pointer-events-none disabled:bg-[#eee] dark:disabled:bg-[#1b2e4b] text-white-dark" disabled={type == 'update'}>
                                    <option value="">Enter Currency</option>
                                    {CurrencyList?.data?.map((d: OptionType, i: number) => {
                                        return (
                                            <option  key={i} value={d?.value} selected={detailCOA?.data?.currencyId === d.value }>
                                                {d?.label}
                                            </option>
                                        )
                                    })}
                                </select>
                                <span className="text-danger text-xs">{(errors.currencyId as FieldError)?.message}</span>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="balance">Balance</label>
                            <div className="relative text-white-dark">
                                <input id="balance" type="text" placeholder="Enter balance" {...register('balance')} className="form-input placeholder:text-white-dark" />
                                {/* <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                    <IconMail fill={true} />
                                </span> */}
                            </div>
                            <span className="text-danger text-xs">{(errors.balance as FieldError)?.message}</span>
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
                        <div>
                            <div className="flex space-x-4">
                                <label className="flex">
                                    <input type="checkbox" onClick={(e)=>{setIsCashFlow(!isCashFlow)}} {...register('isCashBank')} className="form-checkbox"  disabled={type === 'update'}/>
                                    <span>Is Cash Flow</span>
                                </label>
                            </div>
                            <div className="flex space-x-4">
                                <label className="flex">
                                    <input type="checkbox" onClick={(e)=>{setIsCashBank(!isCashBank)}} {...register('isCashBank')} className="form-checkbox"  disabled={type === 'update'}/>
                                    <span>Is Cash Bank</span>
                                </label>
                            </div>
                            <span className="text-danger text-xs">{(errors.isCashBank as FieldError)?.message}</span>
                        </div>            
                    </div>
                    <div className="flex w-full justify-end">
                        <button type="submit" className=" btn btn-primary  w-1/6 border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                            {isLoadingPost || isLoadingUpdate ? 'Loading' : id ? 'Update' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Form;
