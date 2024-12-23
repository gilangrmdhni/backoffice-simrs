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
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css';


const Form = () => {
    // const user = useSelector((state: any) => state.auth.user);
    const isRtl = useSelector((state: any) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const accountTypeRef = useRef<HTMLSelectElement>(null);
    const accountGroupRef = useRef<HTMLSelectElement>(null);
    const parentRef = useRef<HTMLSelectElement>(null);
    const currencyRef = useRef<HTMLSelectElement>(null);
    const [parentId,setParentId] = useState<string>('');
    const [isCashFlow,setIsCashFlow] = useState<boolean>(false);
    const [isCashBank,setIsCashBank] = useState<boolean>(false);
    const [isBatasAkhir,setIsBatasAkhir] = useState<boolean>(false);
    const dateNow = new Date
    const [isTanggal,setIsTanggal] = useState<any>(dateNow)
    const [isTime,setIsTime] = useState<any>(dateNow)
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
                navigate('/daftar-biayarutin')
            }, null);
        } catch (err: any) {
            toastMessage(err.message, 'error');
        }
    };

    useEffect(() => {
        dispatch(setPageTitle('Buat Tagihan Rutin'));
        dispatch(setTitle('Buat Tagihan Rutin'));
        if(type == 'create'){
            dispatch(setBreadcrumbTitle(['Dashboard', 'Pengeluaran', 'Biaya Rutin',type]));

        }else{
            dispatch(setBreadcrumbTitle(['Dashboard', 'Pengeluaran', 'Biaya Rutin',type,lastSegment]));
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
                    <div className="grid md:grid-cols-1 w-full ">

                        <div className='flex justify-start w-full mb-10'>
                            <div className='label mr-10 w-64'>
                                <label htmlFor="coaCode">NAMA TAGIHAN</label>
                            </div>
                            <div className="text-white-dark w-full">
                                <input id="coaName" type="text" placeholder="Contoh : Tagihan Air" {...register('coaName')} className="form-input font-normal w-full placeholder:text-white-dark disabled:pointer-events-none disabled:bg-[#eee] dark:disabled:bg-[#1b2e4b] text-white-dark" disabled={type == 'update'} />
                                {/* <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                    <IconMail fill={true} />
                                </span> */}
                                <span className="text-danger text-xs">{(errors.coaName as FieldError)?.message}</span>
                            </div>
                        </div>
                        
                        <hr />

                       <div className='flex justify-start w-full my-10 mt-'>
                            <div className='label mr-10 w-64'>
                                <label htmlFor="Akun">Cari No Biaya</label>
                            </div>
                            <div className="text-white-dark w-full grid md:grid-cols-1 gap-4">
                                <div className='w-full'>
                                    <label htmlFor="Akun">Akun Asal</label>
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
                                {/* <label htmlFor="Akun">Transaksi</label> */}
                            </div>
                            <div className="text-white-dark w-full grid md:grid-cols-2 gap-4">
                                <div className=''>
                                    <label htmlFor="Akun" >Dibuat Tiap</label>
                                    <div className='flex justify-start  '>
                                        <input type="number" name="" id="" className='form-input w-16 font-normal mr-5'  />
                                        <select name="" id="" className='form-select font-normal w-full'>
                                            <option value="">Hari</option>
                                            <option value="">Minggu</option>
                                            <option value="">Bulan</option>
                                        </select>
                                    </div>

                                    <span className="text-danger text-xs">{(errors.coaCode as FieldError)?.message}</span>
                                </div>
                                <div className=''>
                                    <label htmlFor="Akun">Mulai Tanggal</label>
                                    <Flatpickr 
                                        value={isTanggal} 
                                        options={{ dateFormat: 'Y-m-d', position: isRtl ? 'auto right' : 'auto left' }} 
                                        className="form-input font-normal" 
                                        onChange={(date:any) => setIsTanggal(date)}
                                    />
                                    <span className="text-danger text-xs">{(errors.coaCode as FieldError)?.message}</span>
                                </div>
                            </div>
                        </div>    
                        <div className='flex justify-start w-full'>
                            <div className='label mr-10 w-64'>
                                <label htmlFor="">Batas Akhir</label>
                            </div>
                            <div className="relative text-white-dark w-full">
                                <label className="w-12 h-6 relative">
                                    <input type="checkbox" checked={isBatasAkhir} onClick={() => setIsBatasAkhir(!isBatasAkhir)} className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer" id="custom_switch_checkbox1" />
                                    <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                                </label>
                            </div>
                        </div>    
                        <div className='flex justify-start w-full mb-10'>
                                <div className='label mr-10 w-64'>
                                    <label htmlFor="coaDesc"></label>
                                </div>
                                {isBatasAkhir ? 
                                    <>
                                        <div className="text-white-dark w-full">
                                            <label htmlFor="">Berakhir</label>
                                            <Flatpickr 
                                                value={isTanggal} 
                                                options={{ dateFormat: 'Y-m-d', position: isRtl ? 'auto right' : 'auto left' }} 
                                                className="form-input font-normal" 
                                                onChange={(date:any) => setIsTanggal(date)}
                                            />
                                            <span className="text-danger text-xs">{(errors.coaName as FieldError)?.message}</span>
                                        </div>
                                    </> : <></> 
                                }
                                
                        </div>
                        <div className='flex justify-start w-full'>
                            <div className='label mr-10 w-64'>
                                <label htmlFor="">Status</label>
                            </div>
                            <div className="relative text-white-dark w-full">
                                <label className="w-12 h-6 relative">
                                    <input type="checkbox" className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer" id="custom_switch_checkbox1" />
                                    <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                                </label>
                            </div>
                        </div>    
                        <div className="flex w-full justify-end">
                            <button type="button" className=" btn bg-white  w-1/6 border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)] mr-5 hover:bg-purple-300" onClick={()=>navigate('/daftar-transfer')}>
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
