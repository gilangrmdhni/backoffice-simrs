import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { setPageTitle, setBreadcrumbTitle, setTitle } from '../../../store/themeConfigSlice';
import { useGetEmployeeQuery } from '@/store/api/employee/employeeApiSlice';
import IconMail from '@/components/Icon/IconMail';
import * as yup from 'yup';
import { useForm, FieldError } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { usersType,COAType,OptionType } from '@/types';
import { useGetDetailCOAQuery, usePostCOAMutation, useUpdateCOAMutation } from '@/store/api/coa/coaApiSlice';
import { useGetRolesQuery } from '@/store/api/roles/rolesApiSlice';
import { useGetOptionCOAQuery } from '@/store/api/coa/coaApiSlice';
import { rolesType } from '@/types/rolesType';
import { ToastContainer, toast } from 'react-toastify';
import { responseCallback } from '@/utils/responseCallback';
import { toastMessage } from '@/utils/toastUtils';
import SelectSearch from 'react-select';


const Form = () => {
    const user = useSelector((state: any) => state.auth.user);
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
    const { data: detailCOA, refetch: detailCOARefetch } = id ? useGetDetailCOAQuery(id) : { data: null, refetch: () => { } };
    const { data: accountTypeList, refetch: accountTypeListRefetch } = useGetOptionCOAQuery({
        orderBy: 'coaCode',
        orderType: 'asc',
        pageSize:20,
        status : 'Active',
    });
    const { data: ParentList, refetch: ParentListRefetch } = useGetOptionCOAQuery({
        orderBy: 'coaCode',
        orderType: 'asc',
        pageSize:20,
        status : 'Active',
        keyword: searchParent,
    });

    useEffect(() => {
        ParentListRefetch();
    },[searchParent]);


    const schema = yup
        .object({
            coaCode: yup.string().required('coaCode is Required'),
            coaName: yup.string().required('coaName is Required'),
            accountTypeId: yup.string().required('accountType is Required'),
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
            dispatch(setBreadcrumbTitle(['Dashboard', 'Master', 'COA',type]));

        }else{
            dispatch(setBreadcrumbTitle(['Dashboard', 'Master', 'COA',type,lastSegment]));
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
                                <input id="coaCode" type="text" placeholder="Enter coaCode" {...register('coaCode')} className="form-input placeholder:text-white-dark" />
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
                                <select id="accountTypeId" {...register('accountTypeId')} className="form-select">
                                    <option value="">Enter Account Type</option>
                                    {accountTypeList?.data?.map((d: rolesType, i: number) => {
                                        return (
                                            <option value={d.roleID} selected={detailCOA?.data?.accounttype === d.roleID }>
                                                {d.roleName}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                            <span className="text-danger text-xs">{(errors.accountTypeId as FieldError)?.message}</span>
                        </div>
                        <div>
                            <label htmlFor="parentId">Parent</label>
                            <div className="relative text-white-dark">
                                <SelectSearch 
                                    placeholder="Enter Parent" 
                                    options={ParentList} 
                                    onInputChange={(e) => setSearchParent(e)} 
                                />
                            </div>
                            <span className="text-danger text-xs">{(errors.parentId as FieldError)?.message}</span>
                        </div>
                        <div>
                            <label htmlFor="accountTypeId">Normal Position</label>
                            <div className="relative text-white-dark">
                                <select id="accountTypeId" {...register('accountTypeId')} className="form-select">
                                    <option value="">Enter Normal Position</option>
                                    <option value="Credit">Credit</option>
                                    <option value="Debit">Debit</option>
                                </select>
                            </div>
                            <span className="text-danger text-xs">{(errors.accountTypeId as FieldError)?.message}</span>
                        </div>
                        <div>
                            <label>Status</label>
                            <div className="flex space-x-4">
                                <label className="flex items-center">
                                    <input type="radio" value="Active" {...register('status')} className="form-radio" />
                                    <span className="ml-2 text-white-dark">Active</span>
                                </label>
                                <label className="flex items-center">
                                    <input type="radio" value="InActive" {...register('status')} className="form-radio" />
                                    <span className="ml-2 text-white-dark">Inactive</span>
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
        </div>
    );
};

export default Form;
